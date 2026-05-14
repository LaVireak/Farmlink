import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * Get cart for a consumer
   * GET /api/cart/:consumerId
   */
  @Get(':consumerId')
  async getCart(@Param('consumerId') consumerId: string) {
    return this.cartService.getCart(consumerId);
  }

  /**
   * Add item to cart
   * POST /api/cart/:consumerId/items
   */
  @Post(':consumerId/items')
  async addItem(
    @Param('consumerId') consumerId: string,
    @Body() body: { productId: string; quantity?: number },
  ) {
    return this.cartService.addItem(consumerId, body.productId, body.quantity);
  }

  /**
   * Update cart item quantity
   * PATCH /api/cart/:consumerId/items/:itemId
   */
  @Patch(':consumerId/items/:itemId')
  async updateItemQuantity(
    @Param('consumerId') consumerId: string,
    @Param('itemId') itemId: string,
    @Body() body: { quantity: number },
  ) {
    return this.cartService.updateItemQuantity(consumerId, itemId, body.quantity);
  }

  /**
   * Remove item from cart
   * DELETE /api/cart/:consumerId/items/:itemId
   */
  @Delete(':consumerId/items/:itemId')
  async removeItem(
    @Param('consumerId') consumerId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.removeItem(consumerId, itemId);
  }

  /**
   * Clear all items from cart
   * DELETE /api/cart/:consumerId
   */
  @Delete(':consumerId')
  async clearCart(@Param('consumerId') consumerId: string) {
    return this.cartService.clearCart(consumerId);
  }

  /**
   * Checkout: convert cart to order
   * POST /api/cart/:consumerId/checkout
   */
  @Post(':consumerId/checkout')
  async checkout(
    @Param('consumerId') consumerId: string,
    @Body() body: { paymentMethod?: any; deliveryAddress?: string; deliveryLat?: number; deliveryLng?: number; note?: string },
  ) {
    return this.cartService.checkout(consumerId, body);
  }
}