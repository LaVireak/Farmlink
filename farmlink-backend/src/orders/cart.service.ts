import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { Product } from '../products/product.entity';
import { OrdersService } from './orders.service'; // exported by OrdersModule

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private readonly ordersService: OrdersService,
  ) {}

  async getOrCreateCart(consumerId: string): Promise<Cart> {
    let cart = await this.cartRepo.findOne({
      where: { consumerId },
      relations: ['items', 'items.product'],
    });
    if (!cart) {
      cart = this.cartRepo.create({ consumerId });
      cart = await this.cartRepo.save(cart);
    }
    return cart;
  }

  async getCart(consumerId: string): Promise<Cart> {
    const cart = await this.cartRepo.findOne({
      where: { consumerId },
      relations: ['items', 'items.product'],
    });
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  async addItem(consumerId: string, productId: string, quantity = 1) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    const cart = await this.getOrCreateCart(consumerId);

    let item = await this.cartItemRepo.findOne({
      where: { cartId: cart.id, productId },
    });
    if (item) {
      item.quantity += quantity;
      item = await this.cartItemRepo.save(item);
      return item;
    }

    item = this.cartItemRepo.create({ cartId: cart.id, productId, quantity });
    return this.cartItemRepo.save(item);
  }

  async updateItemQuantity(
    consumerId: string,
    itemId: string,
    quantity: number,
  ) {
    const cart = await this.getOrCreateCart(consumerId);
    const item = await this.cartItemRepo.findOne({
      where: { id: itemId, cartId: cart.id },
    });
    if (!item) throw new NotFoundException('Cart item not found');
    if (quantity <= 0) return this.removeItem(consumerId, itemId);
    item.quantity = quantity;
    return this.cartItemRepo.save(item);
  }

  async removeItem(consumerId: string, itemId: string) {
    const cart = await this.getOrCreateCart(consumerId);
    const item = await this.cartItemRepo.findOne({
      where: { id: itemId, cartId: cart.id },
    });
    if (!item) throw new NotFoundException('Cart item not found');
    await this.cartItemRepo.remove(item);
    return { success: true };
  }

  async clearCart(consumerId: string) {
    const cart = await this.getOrCreateCart(consumerId);
    await this.cartItemRepo.delete({ cartId: cart.id });
    return { success: true };
  }

  // Checkout: convert cart items into order via OrdersService
  async checkout(
    consumerId: string,
    checkoutPayload: {
      paymentMethod?: any;
      deliveryAddress?: string;
      deliveryLat?: number;
      deliveryLng?: number;
      note?: string;
    },
  ) {
    const cart = await this.getCart(consumerId);
    if (!cart.items || cart.items.length === 0)
      throw new BadRequestException('Cart is empty');

    const items = await Promise.all(
      cart.items.map(async (ci) => {
        const product = await this.productRepo.findOne({
          where: { id: ci.productId },
        });
        if (!product)
          throw new NotFoundException(`Product ${ci.productId} not found`);
        return {
          productId: ci.productId,
          farmerId: product.farmerId,
          quantity: ci.quantity,
          unitPrice: parseFloat(product.pricePerUnit.toString()),
        };
      }),
    );

    // Create order DTO interface must match OrdersService.createOrder
    const createOrderDto: any = {
      consumerId,
      items,
      paymentMethod: checkoutPayload.paymentMethod || null,
      deliveryAddress: checkoutPayload.deliveryAddress || null,
      deliveryLat: checkoutPayload.deliveryLat || null,
      deliveryLng: checkoutPayload.deliveryLng || null,
      note: checkoutPayload.note || null,
    };

    const order = await this.ordersService.createOrder(createOrderDto);

    // clear cart after successful order
    await this.clearCart(consumerId);

    return order;
  }
}
