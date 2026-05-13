import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { FarmerProfile } from './farmer.entity';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Review } from '../reviews/review.entity';
import { Order } from '../orders/order.entity';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class FarmersService {
  constructor(
    @InjectRepository(FarmerProfile)
    private farmerRepository: Repository<FarmerProfile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async getAllFarmers({
    page,
    limit,
    search,
    province,
    sortBy,
  }: {
    page: number;
    limit: number;
    search?: string;
    province?: string;
    sortBy: 'name' | 'rating' | 'sales';
  }) {
    const skip = (page - 1) * limit;
    const query = this.farmerRepository.createQueryBuilder('farmer');

    query.leftJoinAndSelect('farmer.user', 'user');

    if (search) {
      query.andWhere(
        '(farmer.farmName ILIKE :search OR farmer.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (province) {
      query.andWhere('farmer.province = :province', { province });
    }

    switch (sortBy) {
      case 'rating':
        query.orderBy('farmer.avgRating', 'DESC');
        break;
      case 'sales':
        query.orderBy('farmer.totalSales', 'DESC');
        break;
      default:
        query.orderBy('farmer.farmName', 'ASC');
    }

    const [farmers, total] = await query
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: farmers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getFarmerById(farmerId: string) {
    const farmer = await this.farmerRepository.findOne({
      where: { id: farmerId },
      relations: ['user', 'verifiedByUser'],
    });

    if (!farmer) {
      throw new NotFoundException('Farmer profile not found');
    }

    return farmer;
  }

  async getFarmerProducts(
    farmerId: string,
    { page, limit, category }: { page: number; limit: number; category?: string },
  ) {
    const farmer = await this.getFarmerById(farmerId);
    const skip = (page - 1) * limit;

    const query = this.productRepository.createQueryBuilder('product');
    query.where('product.farmerId = :farmerId', { farmerId: farmer.id });

    if (category) {
      query.andWhere('product.category = :category', { category });
    }

    query.orderBy('product.createdAt', 'DESC');

    const [products, total] = await query
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      farmer: {
        id: farmer.id,
        farmName: farmer.farmName,
        avgRating: farmer.avgRating,
        totalSales: farmer.totalSales,
      },
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getFarmerReviews(
    farmerId: string,
    { page, limit }: { page: number; limit: number },
  ) {
    const farmer = await this.getFarmerById(farmerId);
    const skip = (page - 1) * limit;

    const query = this.reviewRepository.createQueryBuilder('review');
    query
      .innerJoin('review.product', 'product')
      .where('product.farmerId = :farmerId', { farmerId: farmer.id })
      .leftJoinAndSelect('review.user', 'user')
      .orderBy('review.createdAt', 'DESC');

    const [reviews, total] = await query
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      farmer: {
        id: farmer.id,
        farmName: farmer.farmName,
        avgRating: farmer.avgRating,
      },
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getFarmerStats(farmerId: string) {
    const farmer = await this.getFarmerById(farmerId);

    const productCount = await this.productRepository.count({
      where: { farmerId: farmer.id },
    });

    const reviewStats = await this.reviewRepository
      .createQueryBuilder('review')
      .innerJoin('review.product', 'product')
      .where('product.farmerId = :farmerId', { farmerId: farmer.id })
      .select('COUNT(review.id)', 'count')
      .addSelect('AVG(review.rating)', 'avgRating')
      .getRawOne();

    const orderStats = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.items', 'item')
      .innerJoin('item.product', 'product')
      .where('product.farmerId = :farmerId', { farmerId: farmer.id })
      .select('COUNT(DISTINCT order.id)', 'totalOrders')
      .addSelect('SUM(item.quantity)', 'totalQuantitySold')
      .addSelect('SUM(item.price * item.quantity)', 'totalRevenue')
      .getRawOne();

    return {
      farmerId: farmer.id,
      farmName: farmer.farmName,
      isVerified: farmer.isVerified,
      verifiedAt: farmer.verifiedAt,
      stats: {
        productCount: parseInt(productCount) || 0,
        avgRating: parseFloat(reviewStats?.avgRating) || 0,
        totalReviews: parseInt(reviewStats?.count) || 0,
        totalOrders: parseInt(orderStats?.totalOrders) || 0,
        totalQuantitySold: parseInt(orderStats?.totalQuantitySold) || 0,
        totalRevenue: parseFloat(orderStats?.totalRevenue) || 0,
        totalSales: farmer.totalSales,
      },
      location: {
        province: farmer.province,
        district: farmer.district,
        address: farmer.addressDetail,
        coordinates: {
          latitude: farmer.latitude,
          longitude: farmer.longitude,
        },
      },
    };
  }

  async createFarmerProfile(userId: string, createFarmerDto: UpdateFarmerDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingFarmer = await this.farmerRepository.findOne({
      where: { userId },
    });

    if (existingFarmer) {
      throw new BadRequestException('Farmer profile already exists for this user');
    }

    const farmer = this.farmerRepository.create({
      user,
      userId,
      ...createFarmerDto,
    });

    return this.farmerRepository.save(farmer);
  }

  async updateFarmerProfile(
    farmerId: string,
    updateFarmerDto: UpdateFarmerDto,
    userId: string,
    userRole: Role,
  ) {
    const farmer = await this.getFarmerById(farmerId);

    if (userRole !== Role.ADMIN && farmer.userId !== userId) {
      throw new ForbiddenException('You can only update your own farmer profile');
    }

    Object.assign(farmer, updateFarmerDto);
    return this.farmerRepository.save(farmer);
  }

  async updateCoverImage(farmerId: string, imageUrl: string, userId: string) {
    const farmer = await this.getFarmerById(farmerId);

    if (farmer.userId !== userId) {
      throw new ForbiddenException('You can only update your own profile');
    }

    farmer.coverImageUrl = imageUrl;
    return this.farmerRepository.save(farmer);
  }

  async verifyFarmer(farmerId: string, adminId: string) {
    const farmer = await this.getFarmerById(farmerId);

    farmer.isVerified = true;
    farmer.verifiedAt = new Date();
    farmer.verifiedBy = adminId;

    return this.farmerRepository.save(farmer);
  }

  async rejectFarmerVerification(farmerId: string, reason: string) {
    const farmer = await this.getFarmerById(farmerId);

    farmer.isVerified = false;
    farmer.verifiedAt = null;
    farmer.verifiedBy = null;

    return this.farmerRepository.save(farmer);
  }

  async getFarmerOrders(
    farmerId: string,
    userId: string,
    userRole: Role,
    { page, limit, status }: { page: number; limit: number; status?: string },
  ) {
    const farmer = await this.getFarmerById(farmerId);

    if (userRole !== Role.ADMIN && farmer.userId !== userId) {
      throw new ForbiddenException('You can only view your own orders');
    }

    const skip = (page - 1) * limit;
    const query = this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.items', 'item')
      .innerJoin('item.product', 'product')
      .where('product.farmerId = :farmerId', { farmerId: farmer.id })
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'items_product');

    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    query.orderBy('order.createdAt', 'DESC');

    const [orders, total] = await query
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTopFarmers(limit: number = 6) {
    const topFarmers = await this.farmerRepository
      .createQueryBuilder('farmer')
      .where('farmer.isVerified = :isVerified', { isVerified: true })
      .orderBy('farmer.avgRating', 'DESC')
      .addOrderBy('farmer.totalSales', 'DESC')
      .take(limit)
      .getMany();

    return {
      data: topFarmers,
      count: topFarmers.length,
    };
  }
}
