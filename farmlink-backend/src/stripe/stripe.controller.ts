import { Controller, Post, Body, SetMetadata } from '@nestjs/common';
import { StripeService } from './stripe.service';

@SetMetadata('isPublic', true)
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @SetMetadata('isPublic', true)
  @Post('charge')
  async chargeCard(@Body() body: { amount: number, paymentMethodId: string }) {
    return this.stripeService.chargeCard(body.amount, body.paymentMethodId);
  }
}
