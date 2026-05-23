import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRewardDto } from './dto/create-reward.dto';
import { RewardDto } from './dto/reward.dto';

@Injectable()
export class RewardsService {
	private rewards: RewardDto[] = [];
	private nextId = 1;

	findAll(): RewardDto[] {
		return this.rewards;
	}

	findOne(id: number): RewardDto {
		const r = this.rewards.find((x) => x.id === id);
		if (!r) throw new NotFoundException(`Reward ${id} not found`);
		return r;
	}

	create(dto: CreateRewardDto): RewardDto {
		const reward: RewardDto = { id: this.nextId++, name: dto.name, points: dto.points };
		this.rewards.push(reward);
		return reward;
	}

	remove(id: number): { deleted: boolean } {
		const idx = this.rewards.findIndex((x) => x.id === id);
		if (idx === -1) throw new NotFoundException(`Reward ${id} not found`);
		this.rewards.splice(idx, 1);
		return { deleted: true };
	}
}
