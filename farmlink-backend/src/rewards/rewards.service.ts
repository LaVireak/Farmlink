import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reward } from './reward.entity';
import { RewardTransaction } from './reward-transaction.entity';
import { RewardEvent } from '../common/enums/reward-event.enum';

@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(Reward)
    private readonly rewardRepository: Repository<Reward>,
    @InjectRepository(RewardTransaction)
    private readonly transactionRepository: Repository<RewardTransaction>,
  ) {}

  async getOrCreateReward(consumerId: string): Promise<Reward> {
    let reward = await this.rewardRepository.findOne({
      where: { consumerId },
      relations: ['transactions'],
    });

    if (!reward) {
      reward = this.rewardRepository.create({
        consumerId,
        pointsBalance: 0,
        totalEarned: 0,
        totalRedeemed: 0,
        tier: 'bronze',
      });
      reward = await this.rewardRepository.save(reward);
      reward.transactions = [];
    }

    if (reward && reward.transactions) {
      reward.transactions.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
    }

    return reward;
  }

  async addPoints(
    consumerId: string,
    amount: number,
    orderId?: string,
    description?: string,
  ): Promise<Reward> {
    const points = Math.floor(amount / 5);
    if (points <= 0) {
      return this.getOrCreateReward(consumerId);
    }

    const reward = await this.getOrCreateReward(consumerId);

    reward.pointsBalance += points;
    reward.totalEarned += points;

    // Update tier based on totalEarned points
    if (reward.totalEarned >= 1000) {
      reward.tier = 'gold';
    } else if (reward.totalEarned >= 500) {
      reward.tier = 'silver';
    } else {
      reward.tier = 'bronze';
    }

    const savedReward = await this.rewardRepository.save(reward);

    const tx = this.transactionRepository.create({
      rewardId: savedReward.id,
      consumerId,
      event: RewardEvent.EARNED_PURCHASE,
      points,
      orderId,
      description:
        description || `Points earned from purchase: $${amount.toFixed(2)}`,
    });
    await this.transactionRepository.save(tx);

    // Refresh relations
    return this.getOrCreateReward(consumerId);
  }
}
