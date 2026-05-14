import { 
  Controller, 
  Get, 
  Patch, 
  Post, 
  Param, 
  Body, 
  UseGuards,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';
import { OrderStatus } from '../common/enums/order-status.enum';
import { UpdateAdminDto, SuspendUserDto, UpdateUserRoleDto, UpdateOrderStatusDto, RejectProductDto, MatchFarmerDto } from './dto/update-admin.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ====== DASHBOARD ======
  @Get('dashboard/stats')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // ====== FARMER MANAGEMENT ======
  @Get('farmers/stats')
  getFarmerStats() {
    return this.adminService.getFarmerStats();
  }

  @Get('farmers')
  getAllFarmers() {
    return this.adminService.getAllFarmers();
  }

  @Patch('farmers/:id/approve')
  approveFarmer(@Param('id') id: string) {
    return this.adminService.approveFarmer(id);
  }

  @Patch('farmers/:id/suspend')
  suspendFarmer(
    @Param('id') id: string,
    @Body() dto: SuspendUserDto,
  ) {
    return this.adminService.suspendFarmer(id);
  }

  @Post('farmers/:id/match')
  matchFarmer(
    @Param('id') id: string,
    @Body() dto: MatchFarmerDto,
  ) {
    return this.adminService.matchFarmer(id, dto.buyerId);
  }

  @Get('buyers')
  getBuyers() {
    return this.adminService.getBuyers();
  }

  // ====== USER MANAGEMENT ======
  @Get('users')
  getAllUsers(
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.adminService.getAllUsers({ role, status, search, skip: skip ? parseInt(skip.toString()) : 0, take: take ? parseInt(take.toString()) : 10 });
  }

  @Patch('users/:id/suspend')
  suspendUser(
    @Param('id') id: string,
    @Body() dto: SuspendUserDto,
  ) {
    return this.adminService.suspendUser(id);
  }

  @Patch('users/:id/reactivate')
  reactivateUser(@Param('id') id: string) {
    return this.adminService.reactivateUser(id);
  }

  @Patch('users/:id/role')
  updateUserRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.adminService.updateUserRole(id, dto.role);
  }

  // ====== ORDER MANAGEMENT ======
  @Get('orders')
  getAllOrders(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.adminService.getAllOrders({ status, search, skip: skip ? parseInt(skip.toString()) : 0, take: take ? parseInt(take.toString()) : 10 });
  }

  @Get('orders/stats')
  getOrderStats() {
    return this.adminService.getOrderStats();
  }

  @Patch('orders/:id/status')
  updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.adminService.updateOrderStatus(id, dto.status as OrderStatus);
  }

  // ====== PRODUCT MANAGEMENT ======
  @Get('products')
  getAllProducts(
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.adminService.getAllProducts({ status, category, search, skip: skip ? parseInt(skip.toString()) : 0, take: take ? parseInt(take.toString()) : 10 });
  }

  @Get('products/stats')
  getProductStats() {
    return this.adminService.getProductStats();
  }

  @Patch('products/:id/approve')
  approveProduct(@Param('id') id: string) {
    return this.adminService.approveProduct(id);
  }

  @Patch('products/:id/reject')
  rejectProduct(
    @Param('id') id: string,
    @Body() dto: RejectProductDto,
  ) {
    return this.adminService.rejectProduct(id);
  }
}
