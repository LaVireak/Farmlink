import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Entities
import { User } from '../users/user.entity';
import { FavoriteFarm } from '../users/favorite-farm.entity';
import { FavoriteProduct } from '../users/favorite-product.entity';
import { FarmerProfile } from '../farmers/farmer.entity';
import { Category } from '../products/category.entity';
import { Product } from '../products/product.entity';
import { ProductImage } from '../products/product-image.entity';
import { Cart } from '../orders/cart.entity';
import { CartItem } from '../orders/cart-item.entity';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';
import { Review } from '../reviews/review.entity';
import { Message } from '../messages/message.entity';
import { Notification } from '../notifications/notification.entity';
import { Reward } from '../rewards/reward.entity';
import { RewardTransaction } from '../rewards/reward-transaction.entity';
import { SeasonalCalendar } from '../support/seasonal-calendar.entity';
import { MarketPrice } from '../support/market-price.entity';
import { CropHealthTip } from '../support/crop-health-tip.entity';
import { KnowledgeArticle } from '../support/knowledge-article.entity';
import { RefreshToken } from '../auth/refresh-token.entity';
import { EmailOtp } from '../auth/email-otp.entity';

export const ALL_ENTITIES = [
  User,
  FavoriteFarm,
  FavoriteProduct,
  FarmerProfile,
  Category,
  Product,
  ProductImage,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Review,
  Message,
  Notification,
  Reward,
  RewardTransaction,
  SeasonalCalendar,
  MarketPrice,
  CropHealthTip,
  KnowledgeArticle,
  RefreshToken,
  EmailOtp,
];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME') || config.get<string>('DB_USER'),
        password: String(config.get('DB_PASSWORD') || config.get('DB_PASS') || ''),
        database: config.get<string>('DB_NAME'),
        entities: ALL_ENTITIES,
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
