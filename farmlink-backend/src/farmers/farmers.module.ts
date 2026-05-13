import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmersController } from './farmers.controller';
import { FarmersService } from './farmers.service';
import { FarmerProfile } from './farmer.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FarmerProfile, User])],
  controllers: [FarmersController],
  providers: [FarmersService],
  exports: [FarmersService],
})
export class FarmersModule {}
