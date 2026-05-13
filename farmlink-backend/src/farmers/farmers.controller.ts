import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FarmersService } from './farmers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { UpdateFarmerDto } from './dto/update-farmer.dto';

@Controller('farmers')
export class FarmersController {
  constructor(private readonly farmersService: FarmersService) {}

  @Get()
  async getAllFarmers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('province') province?: string,
    @Query('sortBy') sortBy: 'name' | 'rating' | 'sales' = 'name',
  ) {
    return this.farmersService.getAllFarmers({
      page,
      limit,
      search,
      province,
      sortBy,
    });
  }

  @Get(':id')
  async getFarmerProfile(@Param('id') farmerId: string) {
    return this.farmersService.getFarmerById(farmerId);
  }

  @Get(':id/products')
  async getFarmerProducts(
    @Param('id') farmerId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 12,
    @Query('category') category?: string,
  ) {
    return this.farmersService.getFarmerProducts(farmerId, {
      page,
      limit,
      category,
    });
  }

  @Get(':id/reviews')
  async getFarmerReviews(
    @Param('id') farmerId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.farmersService.getFarmerReviews(farmerId, { page, limit });
  }

  @Get(':id/stats')
  async getFarmerStats(@Param('id') farmerId: string) {
    return this.farmersService.getFarmerStats(farmerId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createFarmerProfile(
    @CurrentUser() user: any,
    @Body() createFarmerDto: UpdateFarmerDto,
  ) {
    return this.farmersService.createFarmerProfile(user.id, createFarmerDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.FARMER, Role.ADMIN)
  async updateFarmerProfile(
    @Param('id') farmerId: string,
    @Body() updateFarmerDto: UpdateFarmerDto,
    @CurrentUser() user: any,
  ) {
    return this.farmersService.updateFarmerProfile(
      farmerId,
      updateFarmerDto,
      user.id,
      user.role,
    );
  }

  @Post(':id/cover-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.FARMER, Role.ADMIN)
  async uploadCoverImage(
    @Param('id') farmerId: string,
    @Body('imageUrl') imageUrl: string,
    @CurrentUser() user: any,
  ) {
    return this.farmersService.updateCoverImage(farmerId, imageUrl, user.id);
  }

  @Post(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async verifyFarmer(
    @Param('id') farmerId: string,
    @CurrentUser() admin: any,
  ) {
    return this.farmersService.verifyFarmer(farmerId, admin.id);
  }

  @Delete(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async rejectFarmerVerification(
    @Param('id') farmerId: string,
    @Body('reason') reason: string,
  ) {
    return this.farmersService.rejectFarmerVerification(farmerId, reason);
  }

  @Get(':id/orders')
  @UseGuards(JwtAuthGuard)
  async getFarmerOrders(
    @Param('id') farmerId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @CurrentUser() user: any,
  ) {
    return this.farmersService.getFarmerOrders(farmerId, user.id, user.role, {
      page,
      limit,
      status,
    });
  }

  @Get('featured/top')
  async getTopFarmers(@Query('limit') limit: number = 6) {
    return this.farmersService.getTopFarmers(limit);
  }
}
