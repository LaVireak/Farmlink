import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { randomUUID } from 'crypto'
import * as fs from 'fs/promises'
import * as path from 'path'
import { Repository, LessThanOrEqual } from 'typeorm'
import { UserRole } from '../common/enums/role.enum'
import { UserStatus } from '../common/enums/user-status.enum'
import { OrderStatus } from '../common/enums/order-status.enum'
import { ProductStatus } from '../common/enums/product.enum'
import { NotificationType } from '../common/enums/notification-type.enum'
import { User } from '../users/user.entity'
import { CreateFarmerOnboardingDto, UploadedImageDto } from './dto/create-farmer.dto'
import { FarmerProfile } from './farmer.entity'
import { Order } from '../orders/order.entity'
import { Notification } from '../notifications/notification.entity'
import { Product } from '../products/product.entity'

@Injectable()
export class FarmersService {
  constructor(
    @InjectRepository(FarmerProfile)
    private readonly farmerProfiles: Repository<FarmerProfile>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
    @InjectRepository(Notification)
    private readonly notifications: Repository<Notification>,
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  // ─── Public ───────────────────────────────────────────────────────────────
  async findAll() {
    return this.farmerProfiles.find({
      relations: ['user'],
      select: {
        id: true,
        farmName: true,
        province: true,
        district: true,
        isVerified: true,
        coverImageUrl: true,
        user: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true
        }
      },
      order: { createdAt: 'DESC' }
    });
  }

  async findOnePublic(id: string) {
    const profile = await this.farmerProfiles.findOne({
      where: { id },
      relations: ['user', 'products', 'products.images'],
    });

    if (!profile) {
      throw new NotFoundException('Farmer profile not found');
    }

    return profile;
  }

  // ─── Onboarding ───────────────────────────────────────────────────────────

  async submitOnboarding(dto: CreateFarmerOnboardingDto) {
    const user = await this.users.findOne({ where: { email: dto.email } })
    if (!user) throw new NotFoundException('Farmer account not found')
    if (user.role !== UserRole.FARMER)
      throw new BadRequestException('User is not a farmer')
    if (user.status !== UserStatus.ACTIVE)
      throw new BadRequestException('Farmer account is not verified')

    if (dto.phone) user.phoneNumber = dto.phone

    let profile = await this.farmerProfiles.findOne({ where: { userId: user.id } })
    if (!profile) {
      profile = this.farmerProfiles.create({
        userId: user.id,
        farmName:
          dto.farmName?.trim() ||
          `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() ||
          'Farm',
      })
    }

    if (dto.address) profile.addressDetail = dto.address
    if (dto.tags?.length) profile.productTags = JSON.stringify(dto.tags)
    if (dto.idPhoto) profile.idDocumentUrl = await this.saveImage(dto.idPhoto, 'farmers')
    if (dto.farmDeed) profile.farmDeedUrl = await this.saveImage(dto.farmDeed, 'farmers')
    if (dto.profilePhoto) {
      const avatarUrl = await this.saveImage(dto.profilePhoto, 'avatars')
      user.avatarUrl = avatarUrl
      profile.coverImageUrl = avatarUrl
    }

    await this.users.save(user)
    const savedProfile = await this.farmerProfiles.save(profile)

    return { message: 'Farmer onboarding saved', profile: savedProfile }
  }

  // ─── Metrics Summary ──────────────────────────────────────────────────────

  async getMetricsSummary(farmerId: string) {
    const profile = await this.farmerProfiles.findOne({ where: { userId: farmerId } })

    const activeListings = await this.products.count({
      where: { farmerId, status: ProductStatus.ACTIVE },
    })

    const in3Days = new Date()
    in3Days.setDate(in3Days.getDate() + 3)

    const endingSoonCount = await this.products.count({
      where: {
        farmerId,
        status: ProductStatus.ACTIVE,
        seasonEnd: LessThanOrEqual(in3Days),
      },
    })

    const now = new Date()
    const startOfThisWeek = new Date(now)
    startOfThisWeek.setDate(now.getDate() - now.getDay())
    startOfThisWeek.setHours(0, 0, 0, 0)

    const startOfLastWeek = new Date(startOfThisWeek)
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7)

    const thisWeekOrders = await this.orders
      .createQueryBuilder('order')
      .innerJoin('order.items', 'item')
      .innerJoin('item.product', 'product')
      .where('product.farmerId = :farmerId', { farmerId })
      .andWhere('order.createdAt >= :start', { start: startOfThisWeek })
      .getCount()

    const lastWeekOrders = await this.orders
      .createQueryBuilder('order')
      .innerJoin('order.items', 'item')
      .innerJoin('item.product', 'product')
      .where('product.farmerId = :farmerId', { farmerId })
      .andWhere('order.createdAt >= :start', { start: startOfLastWeek })
      .andWhere('order.createdAt < :end', { end: startOfThisWeek })
      .getCount()

    const weeklyGrowth =
      lastWeekOrders > 0
        ? Math.round(((thisWeekOrders - lastWeekOrders) / lastWeekOrders) * 100)
        : thisWeekOrders > 0 ? 100 : 0

    return {
      data: {
        metrics: {
          totalSales: profile?.totalSales ?? 0,
          weeklyGrowth,
          activeListings,
          endingSoonCount,
          performanceDelta: weeklyGrowth > 0 ? `${weeklyGrowth}%` : '0%',
        },
        registry: {
          profile: profile?.isVerified ? 'VERIFIED' : 'PENDING',
          inventory: profile?.matchStatus?.toUpperCase() ?? 'UNDER REVIEW',
        },
      },
    }
  }

  // ─── Recent Transactions ──────────────────────────────────────────────────

  async getRecentTransactions(farmerId: string) {
    // Step 1: get distinct order IDs for this farmer using standard SelectQueryBuilder selection
    const orderIdRows = await this.orders
      .createQueryBuilder('order')
      .select('order.id')
      .innerJoin('order.items', 'item')
      .innerJoin('item.product', 'product')
      .where('product.farmerId = :farmerId', { farmerId })
      .groupBy('order.id')
      .orderBy('order.createdAt', 'DESC')
      .limit(10)
      .getRawMany()

    const orderIds = orderIdRows.map((r) => r.order_id)
    if (orderIds.length === 0) return { data: [] }

    // Step 2: fetch full order data for those IDs
    const recentOrders = await this.orders
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.items', 'item')
      .innerJoinAndSelect('item.product', 'product')
      .innerJoinAndSelect('order.consumer', 'consumer')
      .where('order.id IN (:...orderIds)', { orderIds })
      .orderBy('order.createdAt', 'DESC')
      .getMany()

    const data = recentOrders.map((order) => {
      const farmerItems = order.items?.filter(
        (item) => item.product?.farmerId === farmerId,
      )
      const farmerTotal = farmerItems?.reduce(
        (sum, item) => sum + item.quantity * Number(item.unitPrice),
        0,
      ) ?? 0

      return {
        id: `#${order.orderNumber ?? order.id.slice(0, 6).toUpperCase()}`,
        customer: order.consumer
          ? `${order.consumer.firstName ?? ''} ${order.consumer.lastName ?? ''}`.trim()
          : 'Unknown',
        product: farmerItems?.[0]?.product?.nameEn ?? '—',
        amount: farmerTotal,
        status: order.status === OrderStatus.COMPLETED ? 'Fulfilled' : 'Pending',
      }
    })

    return { data }
  }

  // ─── Active Broadcasts ────────────────────────────────────────────────────

  async getActiveBroadcasts(farmerId: string) {
    const rawAlerts = await this.notifications.find({
      where: { userId: farmerId, isRead: false },
      order: { createdAt: 'DESC' },
      take: 20,
    })

    const typeMap: Partial<Record<NotificationType, 'success' | 'warning' | 'info'>> = {
      [NotificationType.ORDER_PLACED]:     'info',
      [NotificationType.ORDER_CONFIRMED]:  'success',
      [NotificationType.ORDER_DELIVERED]:  'success',
      [NotificationType.ORDER_CANCELLED]:  'warning',
      [NotificationType.LOW_STOCK]:        'warning',
      [NotificationType.PRODUCT_APPROVED]: 'success',
      [NotificationType.ACCOUNT_VERIFIED]: 'success',
      [NotificationType.NEW_MESSAGE]:      'info',
      [NotificationType.NEW_REVIEW]:       'info',
      [NotificationType.REWARD_EARNED]:    'success',
      [NotificationType.SYSTEM]:           'info',
    }

    const data = rawAlerts.map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body ?? '',
      type: typeMap[n.type] ?? 'info',
      metaKey: n.refType ?? null,
      time: new Date(n.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }))

    return { data }
  }

  // ─── Inbound Orders ───────────────────────────────────────────────────────

  async getInboundOrders(farmerId: string) {
    // Step 1: get distinct pending order IDs for this farmer using standard SelectQueryBuilder selection
    const orderIdRows = await this.orders
      .createQueryBuilder('order')
      .select('order.id')
      .innerJoin('order.items', 'item')
      .innerJoin('item.product', 'product')
      .where('product.farmerId = :farmerId', { farmerId })
      .andWhere('order.status = :status', { status: OrderStatus.PENDING })
      .groupBy('order.id')
      .orderBy('order.createdAt', 'DESC')
      .getRawMany()

    const orderIds = orderIdRows.map((r) => r.order_id)
    if (orderIds.length === 0) return { data: [] }

    // Step 2: fetch full order data for those IDs
    const pendingOrders = await this.orders
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.items', 'item')
      .innerJoinAndSelect('item.product', 'product')
      .innerJoinAndSelect('order.consumer', 'consumer')
      .where('order.id IN (:...orderIds)', { orderIds })
      .orderBy('order.createdAt', 'DESC')
      .getMany()

    const data = pendingOrders.map((order) => {
      const farmerItems = order.items?.filter(
        (item) => item.product?.farmerId === farmerId,
      )
      return {
        id: order.id,
        product: farmerItems?.[0]?.product?.nameEn ?? 'Unknown Product',
        buyer: order.consumer
          ? `${order.consumer.firstName ?? ''} ${order.consumer.lastName ?? ''}`.trim()
          : 'Unknown Buyer',
      }
    })

    return { data }
  }

  // ─── Yields Matrix ────────────────────────────────────────────────────────

  async getYieldsMatrix(farmerId: string) {
    const farmerOrders = await this.orders
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.items', 'item')
      .innerJoinAndSelect('item.product', 'product')
      .where('product.farmerId = :farmerId', { farmerId })
      .andWhere('order.status = :status', { status: OrderStatus.COMPLETED })
      .getMany()

    const yieldMap: Record<string, number> = {}
    farmerOrders.forEach((order) => {
      order.items?.forEach((item) => {
        if (item.product?.farmerId !== farmerId) return
        const name = item.product?.nameEn ?? 'Unknown'
        yieldMap[name] = (yieldMap[name] ?? 0) + item.quantity * Number(item.unitPrice)
      })
    })

    const sorted = Object.entries(yieldMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    const max = sorted[0]?.[1] ?? 1

    const data = sorted.map(([name, value]) => ({
      name,
      value,
      pct: Math.round((value / max) * 100),
    }))

    return { data }
  }

  // ─── Transition Order ─────────────────────────────────────────────────────

  async transitionOrder(orderId: string, action: 'accept' | 'reject', farmerId: string) {
    const order = await this.orders
      .createQueryBuilder('order')
      .innerJoin('order.items', 'item')
      .innerJoin('item.product', 'product')
      .where('order.id = :orderId', { orderId })
      .andWhere('product.farmerId = :farmerId', { farmerId })
      .andWhere('order.status = :status', { status: OrderStatus.PENDING })
      .getOne()

    if (!order) throw new NotFoundException('Order not found or already processed')

    order.status = action === 'accept' ? OrderStatus.CONFIRMED : OrderStatus.CANCELLED

    if (action === 'accept') {
      order.confirmedAt = new Date()
    } else {
      order.cancelledAt = new Date()
    }

    await this.orders.save(order)

    return { success: true, status: order.status }
  }

  // ─── Clear Broadcasts ─────────────────────────────────────────────────────

  async clearAllBroadcasts(farmerId: string) {
    await this.notifications.update(
      { userId: farmerId, isRead: false },
      { isRead: true },
    )
    return { success: true }
  }

  // ─── Restock Manifest ─────────────────────────────────────────────────────

  async triggerRestockManifest(farmerId: string) {
    const activeProducts = await this.products.find({
      where: { farmerId, status: ProductStatus.ACTIVE },
    })

    const lowStock = activeProducts.filter((p) => p.stockQuantity < 10)

    if (lowStock.length === 0) {
      return { success: true, message: 'No low stock items found.' }
    }

    const newNotifications = lowStock.map((product) =>
      this.notifications.create({
        userId: farmerId,
        title: 'Restock Requested',
        body: `Restock manifest triggered for ${product.nameEn} (current stock: ${product.stockQuantity})`,
        type: NotificationType.LOW_STOCK,
        refType: 'low_stock_critical',
        isRead: false,
      }),
    )

    await this.notifications.save(newNotifications)

    return { success: true, message: 'Restock manifest sent to supplier node.' }
  }

  // ─── Image Helpers ────────────────────────────────────────────────────────

  private async saveImage(file: UploadedImageDto, folder: string): Promise<string> {
    const { buffer, ext } = this.parseDataUrl(file)
    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'uploads'
    const fileName = `${Date.now()}-${randomUUID()}.${ext}`
    const targetDir = path.join(process.cwd(), 'uploads', safeFolder)

    await fs.mkdir(targetDir, { recursive: true })
    await fs.writeFile(path.join(targetDir, fileName), buffer)

    return path.join('uploads', safeFolder, fileName).replace(/\\/g, '/')
  }

  private parseDataUrl(file: UploadedImageDto): { buffer: Buffer; ext: string } {
    const match = /^data:([^;]+);base64,(.*)$/.exec(file.dataUrl)
    if (!match) throw new BadRequestException('Invalid image payload')

    const mimeType = match[1]
    const base64Data = match[2]
    const buffer = Buffer.from(base64Data, 'base64')
    const ext = this.resolveExtension(mimeType, file.name)

    return { buffer, ext }
  }

  private resolveExtension(mimeType: string, name: string): string {
    const map: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
    }

    if (map[mimeType]) return map[mimeType]
    const fallback = name.split('.').pop()
    return fallback ? fallback.toLowerCase() : 'jpg'
  }
}