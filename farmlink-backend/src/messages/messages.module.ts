import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesSeedService } from './messages.seed.service';
import { Message } from './message.entity';
import { User } from '../users/user.entity';
import { FarmerProfile } from '../farmers/farmer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User, FarmerProfile])],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesSeedService],
  exports: [MessagesService],
})
export class MessagesModule {}
