import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {Public} from '../auth/decorators/public.decorator';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  // ── Existing charge endpoint (kept public) ──────────────────────────────────
  @Public()
  @Post('charge')
  async chargeCard(
    @Body() body: { amount: number; paymentMethodId: string },
  ) {
    return this.stripeService.chargeCard(body.amount, body.paymentMethodId);
  }

  // ── Payment Methods (authenticated) ────────────────────────────────────────

  /**
   * GET /stripe/payment-methods
   * Returns the current user's saved Stripe payment methods.
   */
  @Get('payment-methods')
  async listPaymentMethods(@CurrentUser() user: any) {
    if (!user?.id || !user?.email) {
      throw new UnauthorizedException('User not authenticated');
    }
    const stripeCustomerId = await this.stripeService.getOrCreateCustomer(
      user.id,
      user.email,
    );
    return this.stripeService.listPaymentMethods(stripeCustomerId);
  }

  /**
   * POST /stripe/payment-methods
   * Attaches a Stripe PaymentMethod to the current user's customer.
   * Body: { paymentMethodId: string; setDefault?: boolean }
   */
  @Post('payment-methods')
  async attachPaymentMethod(
    @CurrentUser() user: any,
    @Body() body: { paymentMethodId: string; setDefault?: boolean },
  ) {
    if (!user?.id || !user?.email) {
      throw new UnauthorizedException('User not authenticated');
    }
    const stripeCustomerId = await this.stripeService.getOrCreateCustomer(
      user.id,
      user.email,
    );
    return this.stripeService.attachPaymentMethod(
      stripeCustomerId,
      body.paymentMethodId,
      body.setDefault ?? false,
    );
  }

  /**
   * PATCH /stripe/payment-methods/:paymentMethodId/default
   * Sets a payment method as the customer's default.
   */
  @Patch('payment-methods/:paymentMethodId/default')
  async setDefaultPaymentMethod(
    @CurrentUser() user: any,
    @Param('paymentMethodId') paymentMethodId: string,
  ) {
    if (!user?.id || !user?.email) {
      throw new UnauthorizedException('User not authenticated');
    }
    const stripeCustomerId = await this.stripeService.getOrCreateCustomer(
      user.id,
      user.email,
    );
    await this.stripeService.setDefaultPaymentMethod(
      stripeCustomerId,
      paymentMethodId,
    );
    return { success: true };
  }

  /**
   * PATCH /stripe/payment-methods/:paymentMethodId
   * Updates the billing name on a payment method.
   * Body: { name: string }
   */
  @Patch('payment-methods/:paymentMethodId')
  async updatePaymentMethod(
    @CurrentUser() _user: any,
    @Param('paymentMethodId') paymentMethodId: string,
    @Body() body: { name: string },
  ) {
    return this.stripeService.updatePaymentMethodName(paymentMethodId, body.name);
  }

  /**
   * DELETE /stripe/payment-methods/:paymentMethodId
   * Detaches (removes) a payment method from the customer.
   */
  @Delete('payment-methods/:paymentMethodId')
  async detachPaymentMethod(
    @CurrentUser() _user: any,
    @Param('paymentMethodId') paymentMethodId: string,
  ) {
    await this.stripeService.detachPaymentMethod(paymentMethodId);
    return { success: true };
  }
}
