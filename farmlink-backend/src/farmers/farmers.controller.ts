import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { CreateFarmerOnboardingDto } from './dto/create-farmer.dto'
import { FarmersService } from './farmers.service'
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard'

@UseGuards(SupabaseAuthGuard)
@Controller('farmer')
export class FarmersController {
  constructor(private readonly farmersService: FarmersService) {}

  // ─── Onboarding ───────────────────────────────────────────────────────────

  @Post('onboarding')
  submitOnboarding(@Body() dto: CreateFarmerOnboardingDto) {
    return this.farmersService.submitOnboarding(dto)
  }

  // ─── Metrics ──────────────────────────────────────────────────────────────

  @Get('metrics/summary')
  getMetricsSummary(@Request() req) {
    return this.farmersService.getMetricsSummary(req.user.id)
  }

  // ─── Transactions ─────────────────────────────────────────────────────────

  @Get('transactions/recent')
  getRecentTransactions(@Request() req) {
    return this.farmersService.getRecentTransactions(req.user.id)
  }

  // ─── Broadcasts ───────────────────────────────────────────────────────────

  @Get('broadcasts/active')
  getActiveBroadcasts(@Request() req) {
    return this.farmersService.getActiveBroadcasts(req.user.id)
  }

  @Delete('broadcasts/clear-all')
  clearAllBroadcasts(@Request() req) {
    return this.farmersService.clearAllBroadcasts(req.user.id)
  }

  // ─── Orders ───────────────────────────────────────────────────────────────

  @Get('orders/inbound')
  getInboundOrders(@Request() req) {
    return this.farmersService.getInboundOrders(req.user.id)
  }

  @Post('orders/:id/transition')
  transitionOrder(
    @Param('id') orderId: string,
    @Body() body: { action: 'accept' | 'reject' },
    @Request() req,
  ) {
    return this.farmersService.transitionOrder(orderId, body.action, req.user.id)
  }

  // ─── Yields ───────────────────────────────────────────────────────────────

  @Get('yields/matrix')
  getYieldsMatrix(@Request() req) {
    return this.farmersService.getYieldsMatrix(req.user.id)
  }

  // ─── Inventory ────────────────────────────────────────────────────────────

  @Post('inventory/restock-trigger')
  triggerRestock(@Request() req) {
    return this.farmersService.triggerRestockManifest(req.user.id)
  }
}