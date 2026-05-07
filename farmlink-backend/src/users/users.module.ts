import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { FavoriteFarm } from './favorite-farm.entity';
import { FavoriteProduct } from './favorite-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, FavoriteFarm, FavoriteProduct])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
