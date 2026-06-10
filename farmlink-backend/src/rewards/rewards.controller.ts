import {
  Controller,
  Get,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get('balance')
  async getBalance(@CurrentUser() user: any) {
    if (!user || !user.id) {
      throw new UnauthorizedException('User ID not found in request');
    }
    return this.rewardsService.getOrCreateReward(user.id);
  }

  @Post('add-points')
  async addPoints(
    @CurrentUser() user: any,
    @Body() body: { amount: number; orderId?: string; description?: string },
  ) {
    if (!user || !user.id) {
      throw new UnauthorizedException('User ID not found in request');
    }
    if (typeof body.amount !== 'number' || body.amount < 0) {
      throw new BadRequestException('Amount must be a non-negative number');
    }
    return this.rewardsService.addPoints(
      user.id,
      body.amount,
      body.orderId,
      body.description,
    );
  }
}
