import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { Public } from '../auth/decorators/public.decorator'; //public endpoint, no auth required for testing
import { RewardDto } from './dto/reward.dto';

@Public()
@Controller('rewards')
export class RewardsController {
	constructor(private readonly rewardsService: RewardsService) {}

	@Get()
	findAll(): RewardDto[] {
		return this.rewardsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number): RewardDto {
		return this.rewardsService.findOne(id);
	}

	@Post()
	create(@Body() dto: CreateRewardDto): RewardDto {
		return this.rewardsService.create(dto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number): { deleted: boolean } {
		return this.rewardsService.remove(id);
	}
}