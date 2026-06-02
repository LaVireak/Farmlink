import { Controller, Get, Patch, Param, UseGuards, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Get()
    async getUserNotifications(
        @GetUser('id') userId: string,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
        @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    ) {
        return this.notificationsService.getUserNotifications(userId, limit, offset);
    }

    @Patch('read-all')
    async markAllAsRead(@GetUser('id') userId: string) {
        await this.notificationsService.markAllAsRead(userId);
        return { success: true };
    }

    @Patch(':id/read')
    async markAsRead(
        @Param('id') id: string,
        @GetUser('id') userId: string
    ) {
        return this.notificationsService.markAsRead(id, userId);
    }
}
