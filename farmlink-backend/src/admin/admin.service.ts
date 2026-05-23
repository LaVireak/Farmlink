import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { FarmerProfile } from '../farmers/farmer.entity';
import { Order } from '../orders/order.entity';
import { Product } from '../products/product.entity';
import { UserRole } from '../common/enums/role.enum';
import { UserStatus } from '../common/enums/user-status.enum';
import { OrderStatus } from '../common/enums/order-status.enum';
import { ProductStatus } from '../common/enums/product.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(FarmerProfile)
    private readonly farmerRepository: Repository<FarmerProfile>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async getDashboardStats() {
    const totalUsers = await this.userRepository.count();
    const totalOrders = await this.orderRepository.count();

    const { totalRevenue } = (await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total_amount)', 'totalRevenue')
      .getRawOne()) as Record<string, any>;

    const activeFarmers = await this.farmerRepository.count({
      where: { isVerified: true },
    });

    return {
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue ? parseFloat(totalRevenue as string) : 0,
      activeFarmers,
    };
  }

  async getFarmerStats() {
    const totalFarmers = await this.farmerRepository.count();

    const seekingMatch = await this.farmerRepository.count({
      where: { matchStatus: 'Seeking' },
    });

    const successfulMatches = await this.farmerRepository.count({
      where: { matchStatus: 'Matched' },
    });

    const { avgTrustScore } = (await this.farmerRepository
      .createQueryBuilder('farmer')
      .select('AVG(farmer.avg_rating)', 'avgTrustScore')
      .getRawOne()) as Record<string, any>;

    return {
      totalFarmers,
      seekingMatch,
      successfulMatches,
      avgTrustScore: avgTrustScore
        ? Math.round(parseFloat(avgTrustScore as string) * 20)
        : 0,
    };
  }

  async getAllFarmers() {
    return this.farmerRepository.find({
      relations: ['user'],
    });
  }

  async approveFarmer(farmerId: string) {
    const farmer = await this.farmerRepository.findOne({
      where: { id: farmerId },
      relations: ['user'],
    });

    if (!farmer) {
      throw new NotFoundException('Farmer profile not found');
    }

    farmer.isVerified = true;
    farmer.verifiedAt = new Date();
    await this.farmerRepository.save(farmer);

    if (farmer.user) {
      farmer.user.role = UserRole.FARMER;
      farmer.user.status = UserStatus.ACTIVE;
      await this.userRepository.save(farmer.user);
    }

    return farmer;
  }

  async suspendFarmer(farmerId: string) {
    const farmer = await this.farmerRepository.findOne({
      where: { id: farmerId },
      relations: ['user'],
    });

    if (!farmer) {
      throw new NotFoundException('Farmer profile not found');
    }

    farmer.isVerified = false;
    await this.farmerRepository.save(farmer);

    if (farmer.user) {
      farmer.user.status = UserStatus.SUSPENDED;
      await this.userRepository.save(farmer.user);
    }

    return farmer;
  }

  async getBuyers() {
    return this.userRepository.find({
      where: { role: UserRole.BUYER },
      select: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
    });
  }

  async matchFarmer(farmerId: string, buyerId: string) {
    const farmer = await this.farmerRepository.findOne({
      where: { id: farmerId },
    });
    if (!farmer) {
      throw new NotFoundException('Farmer profile not found');
    }

    const buyer = await this.userRepository.findOne({ where: { id: buyerId } });
    if (!buyer) {
      throw new NotFoundException('Buyer not found');
    }

    farmer.matchStatus = 'Matched';
    farmer.matchedBuyerId = buyer.id;
    await this.farmerRepository.save(farmer);

    return farmer;
  }

  // ====== USER MANAGEMENT ======
  async getAllUsers(filters?: {
    role?: string;
    status?: string;
    search?: string;
    skip?: number;
    take?: number;
  }) {
    const skip = filters?.skip || 0;
    const take = filters?.take || 10;

    const query = this.userRepository.createQueryBuilder('user');

    if (filters?.role) {
      query.andWhere('user.role = :role', { role: filters.role });
    }
    if (filters?.status) {
      query.andWhere('user.status = :status', { status: filters.status });
    }
    if (filters?.search) {
      query.andWhere(
        '(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    const [data, total] = await query
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.phoneNumber',
        'user.role',
        'user.status',
        'user.createdAt',
      ])
      .orderBy('user.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return { data, total, skip, take };
  }

  async suspendUser(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.status = UserStatus.SUSPENDED;
    return this.userRepository.save(user);
  }

  async reactivateUser(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.status = UserStatus.ACTIVE;
    return this.userRepository.save(user);
  }

  async updateUserRole(userId: string, newRole: UserRole) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.role = newRole;
    return this.userRepository.save(user);
  }

  // ====== ORDER MANAGEMENT ======
  async getAllOrders(filters?: {
    status?: string;
    search?: string;
    skip?: number;
    take?: number;
  }) {
    const skip = filters?.skip || 0;
    const take = filters?.take || 10;

    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.items', 'items');

    if (filters?.status) {
      query.andWhere('order.status = :status', { status: filters.status });
    }
    if (filters?.search) {
      query.andWhere(
        '(order.id LIKE :search OR user.firstName LIKE :search OR user.lastName LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    const [data, total] = await query
      .orderBy('order.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return { data, total, skip, take };
  }

  async getOrderStats() {
    const total = await this.orderRepository.count();
    const completed = await this.orderRepository.count({
      where: { status: OrderStatus.COMPLETED },
    });
    const pending = await this.orderRepository.count({
      where: { status: OrderStatus.PENDING },
    });
    const cancelled = await this.orderRepository.count({
      where: { status: OrderStatus.CANCELLED },
    });

    const { totalRevenue } = (await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total_amount)', 'totalRevenue')
      .where('order.status = :status', { status: OrderStatus.COMPLETED })
      .getRawOne()) as Record<string, any>;

    return {
      total,
      completed,
      pending,
      cancelled,
      revenue: totalRevenue ? parseFloat(totalRevenue as string) : 0,
    };
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = status;
    return this.orderRepository.save(order);
  }

  // ====== PRODUCT MANAGEMENT ======
  async getAllProducts(filters?: {
    status?: string;
    category?: string;
    search?: string;
    skip?: number;
    take?: number;
  }) {
    const skip = filters?.skip || 0;
    const take = filters?.take || 10;

    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.farmer', 'farmer')
      .leftJoinAndSelect('farmer.user', 'user');

    if (filters?.status) {
      query.andWhere('product.status = :status', { status: filters.status });
    }
    if (filters?.category) {
      query.andWhere('product.category = :category', {
        category: filters.category,
      });
    }
    if (filters?.search) {
      query.andWhere(
        '(product.name LIKE :search OR user.firstName LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    const [data, total] = await query
      .orderBy('product.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return { data, total, skip, take };
  }

  async getProductStats() {
    const total = await this.productRepository.count();
    const active = await this.productRepository.count({
      where: { status: ProductStatus.ACTIVE },
    });
    const pendingReview = await this.productRepository.count({
      where: { status: ProductStatus.PENDING_REVIEW },
    });
    const inactive = await this.productRepository.count({
      where: { status: ProductStatus.INACTIVE },
    });

    return { total, active, pendingReview, inactive };
  }

  async approveProduct(productId: string) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    product.status = ProductStatus.ACTIVE;
    return this.productRepository.save(product);
  }

  async rejectProduct(productId: string) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    product.status = ProductStatus.INACTIVE;
    return this.productRepository.save(product);
  }
}
