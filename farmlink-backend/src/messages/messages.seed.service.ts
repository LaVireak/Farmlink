import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { FarmerProfile } from '../farmers/farmer.entity';
import { Message } from './message.entity';
import { UserRole } from '../common/enums/role.enum';
import { UserStatus } from '../common/enums/user-status.enum';

@Injectable()
export class MessagesSeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(FarmerProfile)
    private readonly farmerProfileRepository: Repository<FarmerProfile>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async seedTestData(farmerId?: string, consumerId?: string) {
    // You need to create accounts normally first via signup
    // This seed just creates messages between any two existing users
    // For testing, get real user IDs from your database

    let farmer, consumer;

    if (farmerId && consumerId) {
      // Use specific IDs if provided
      farmer = await this.userRepository.findOne({ where: { id: farmerId } });
      consumer = await this.userRepository.findOne({
        where: { id: consumerId },
      });

      if (!farmer || !consumer) {
        return {
          success: false,
          message: 'Farmer or Consumer not found with provided IDs',
          farmerId,
          consumerId,
        };
      }
    } else {
      // Auto-find first farmer and consumer
      const farmers = await this.userRepository.find({
        where: { role: UserRole.FARMER },
        take: 1,
      });

      const consumers = await this.userRepository.find({
        where: { role: UserRole.CONSUMER },
        take: 1,
      });

      if (!farmers.length || !consumers.length) {
        return {
          success: false,
          message:
            'Please create at least one farmer and one consumer account first via signup',
          instructions:
            'Sign up as a farmer and a consumer, then run this seed again',
        };
      }

      farmer = farmers[0];
      consumer = consumers[0];
    }

    // Clear existing messages between these users
    await this.messageRepository.delete({
      senderId: farmer.id,
      receiverId: consumer.id,
    });
    await this.messageRepository.delete({
      senderId: consumer.id,
      receiverId: farmer.id,
    });

    // Create test messages
    const now = new Date();
    const messages = [
      {
        sender: farmer,
        receiver: consumer,
        content: 'Hello! Do you have any fresh tomatoes available?',
        isRead: true,
        createdAt: new Date(now.getTime() - 3600000 * 2),
      },
      {
        sender: consumer,
        receiver: farmer,
        content:
          'Yes! We just harvested premium heirloom tomatoes this morning.',
        isRead: true,
        createdAt: new Date(now.getTime() - 3600000 * 1.8),
      },
      {
        sender: farmer,
        receiver: consumer,
        content: 'How much do you need? We can deliver within 24 hours.',
        isRead: true,
        createdAt: new Date(now.getTime() - 3600000 * 1.5),
      },
      {
        sender: consumer,
        receiver: farmer,
        content: "Can I get 5kg? And what's the price?",
        isRead: true,
        createdAt: new Date(now.getTime() - 3600000 * 1),
      },
      {
        sender: farmer,
        receiver: consumer,
        content:
          '5kg is perfect! That would be $35. Standard delivery fee is $5.',
        isRead: true,
        createdAt: new Date(now.getTime() - 3600000 * 0.8),
      },
      {
        sender: consumer,
        receiver: farmer,
        content: 'Great! When can you deliver?',
        isRead: true,
        createdAt: new Date(now.getTime() - 3600000 * 0.5),
      },
      {
        sender: farmer,
        receiver: consumer,
        content: 'Tomorrow morning around 9am. Does that work?',
        isRead: false,
        createdAt: new Date(now.getTime() - 600000),
      },
      {
        sender: consumer,
        receiver: farmer,
        content: "Perfect! I'll be ready. See you tomorrow!",
        isRead: false,
        createdAt: new Date(now.getTime() - 300000),
      },
    ];

    for (const msgData of messages) {
      const message = this.messageRepository.create(msgData);
      await this.messageRepository.save(message);
    }

    return {
      success: true,
      message: 'Test messages created successfully',
      farmerName: `${farmer.firstName} ${farmer.lastName}`,
      farmerEmail: farmer.email,
      farmerId: farmer.id,
      consumerName: `${consumer.firstName} ${consumer.lastName}`,
      consumerEmail: consumer.email,
      consumerId: consumer.id,
      messageCount: messages.length,
    };
  }
}
