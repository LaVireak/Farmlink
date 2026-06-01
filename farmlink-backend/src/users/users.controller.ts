import { Controller, Get, Patch, Post, Body, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    if (!user || !user.id) {
      throw new UnauthorizedException('User ID not found in request');
    }
    return this.usersService.findById(user.id);
  }

  @Patch('profile')
  updateProfile(
    @CurrentUser() user: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (!user || !user.id) {
      throw new UnauthorizedException('User ID not found in request');
    }
    return this.usersService.updateProfile(user.id, updateUserDto);
  }

  // --- Temporary endpoints for testing without Auth ---
  @Patch(':id')
  updateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(id, updateUserDto);
  }

  @Get(':id/favorites/farms')
  getFavoriteFarms(@Param('id') id: string) {
    return this.usersService.getFavoriteFarms(id);
  }

  @Post(':id/favorites/farms/:farmerId')
  addFavoriteFarm(@Param('id') id: string, @Param('farmerId') farmerId: string) {
    return this.usersService.addFavoriteFarm(id, farmerId);
  }

  @Delete(':id/favorites/farms/:farmerId')
  removeFavoriteFarm(@Param('id') id: string, @Param('farmerId') farmerId: string) {
    return this.usersService.removeFavoriteFarm(id, farmerId);
  }

  @Get(':id/favorites/products')
  getFavoriteProducts(@Param('id') id: string) {
    return this.usersService.getFavoriteProducts(id);
  }

  @Post(':id/favorites/products/:productId')
  addFavoriteProduct(@Param('id') id: string, @Param('productId') productId: string) {
    return this.usersService.addFavoriteProduct(id, productId);
  }

  @Delete(':id/favorites/products/:productId')
  removeFavoriteProduct(@Param('id') id: string, @Param('productId') productId: string) {
    return this.usersService.removeFavoriteProduct(id, productId);
  }

  // --- Admin / General routes ---
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
