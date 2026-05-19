import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: any;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      // @ts-ignore - Bypass strict literal typing for the stripe apiVersion
      apiVersion: '2024-04-10',
    });
  }

  async chargeCard(amount: number, paymentMethodId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects cents, so $57.50 becomes 5750
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true, // Immediately attempt to charge the card
        return_url: 'http://localhost:3000/user/checkout/Success',
      });
      
      return paymentIntent;
    } catch (error: any) {
      console.error('Stripe Error:', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
