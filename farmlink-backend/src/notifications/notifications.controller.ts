import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  Sse,
  MessageEvent,
  Inject,
} from '@nestjs/common';
import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { EVENT_PUBLISHER } from '../core/token';
import { NotificationsService } from './notifications.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { Request } from '@nestjs/common';

@UseGuards(SupabaseAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    @Inject(EVENT_PUBLISHER) private readonly publisher: any,
  ) {}

  @Sse('stream')
  stream(@Request() req): Observable<MessageEvent> {
    return fromEvent(this.publisher, `notification:${req.user.id}`).pipe(
      map((payload) => ({ data: payload as object }) as MessageEvent),
    );
  }

  @Get()
  async getUserNotifications(
    @Request() req,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    return this.notificationsService.getUserNotifications(
      req.user.id,
      limit,
      offset,
    );
  }

  @Patch('read-all')
  async markAllAsRead(@Request() req) {
    await this.notificationsService.markAllAsRead(req.user.id);
    return { success: true };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }
}
