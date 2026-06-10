import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  Patch,
  Query,
} from '@nestjs/common';
import { CreateFarmerOnboardingDto } from './dto/create-farmer.dto';
import { UpdateFarmerProfileDto } from './dto/update-farmer.dto';
import { FarmersService } from './farmers.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@UseGuards(SupabaseAuthGuard)
@Controller('farmer')
export class FarmersController {
  constructor(private readonly farmersService: FarmersService) {}

  // ─── Public list (no :id wildcard risk) ──────────────────────────────────

  @Public()
  @Get('list')
  findAll() {
    return this.farmersService.findAll();
  }

  // ─── Onboarding ───────────────────────────────────────────────────────────

  @Post('onboarding')
  submitOnboarding(@Body() dto: CreateFarmerOnboardingDto) {
    return this.farmersService.submitOnboarding(dto);
  }

  // ─── Profile (authenticated) ──────────────────────────────────────────────

  @Patch('profile')
  updateProfile(@Request() req, @Body() dto: UpdateFarmerProfileDto) {
    return this.farmersService.updateProfile(req.user.id, dto);
  }

  // ─── Metrics ──────────────────────────────────────────────────────────────

  @Get('metrics/summary')
  getMetricsSummary(@Request() req) {
    return this.farmersService.getMetricsSummary(req.user.id);
  }

  // ─── Transactions ─────────────────────────────────────────────────────────

  @Get('transactions/recent')
  getRecentTransactions(@Request() req) {
    return this.farmersService.getRecentTransactions(req.user.id);
  }

  // ─── Broadcasts ───────────────────────────────────────────────────────────

  @Get('broadcasts/active')
  getActiveBroadcasts(@Request() req) {
    return this.farmersService.getActiveBroadcasts(req.user.id);
  }

  @Delete('broadcasts/clear-all')
  clearAllBroadcasts(@Request() req) {
    return this.farmersService.clearAllBroadcasts(req.user.id);
  }

  // ─── Orders ───────────────────────────────────────────────────────────────

  @Get('orders')
  getFarmerOrders(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
  ) {
    return this.farmersService.getFarmerOrders(
      req.user.id,
      page,
      limit,
      status,
    );
  }

  @Get('orders/stats')
  getFarmerOrdersStats(@Request() req) {
    return this.farmersService.getFarmerOrdersStats(req.user.id);
  }

  @Patch('orders/:id/status')
  updateFarmerOrderStatus(
    @Param('id') orderId: string,
    @Body() body: { status: string },
    @Request() req,
  ) {
    return this.farmersService.updateFarmerOrderStatus(
      orderId,
      body.status,
      req.user.id,
    );
  }

  @Get('orders/inbound')
  getInboundOrders(@Request() req) {
    return this.farmersService.getInboundOrders(req.user.id);
  }

  @Post('orders/:id/transition')
  transitionOrder(
    @Param('id') orderId: string,
    @Body() body: { action: 'accept' | 'reject' },
    @Request() req,
  ) {
    return this.farmersService.transitionOrder(
      orderId,
      body.action,
      req.user.id,
    );
  }

  // ─── Yields ───────────────────────────────────────────────────────────────

  @Get('yields/matrix')
  getYieldsMatrix(@Request() req) {
    return this.farmersService.getYieldsMatrix(req.user.id);
  }

  // ─── Inventory ────────────────────────────────────────────────────────────

  @Post('inventory/restock-trigger')
  triggerRestock(@Request() req) {
    return this.farmersService.triggerRestockManifest(req.user.id);
  }

  // ─── Public single farmer — MUST be last (wildcard :id catches everything) ─

  @Public()
  @Get(':id')
  findOnePublic(@Param('id') id: string) {
    return this.farmersService.findOnePublic(id);
  }
}
