import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { User } from '../users/user.entity';

@Injectable()
export class StripeService {
  private stripe: InstanceType<typeof Stripe>;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      // @ts-ignore - Bypass strict literal typing for the stripe apiVersion
      apiVersion: '2024-04-10',
    });
  }

  // ── Charge (existing) ───────────────────────────────────────────────────────

  async chargeCard(amount: number, paymentMethodId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
        return_url: 'http://localhost:3000/user/checkout/Success',
      });
      return paymentIntent;
    } catch (error: any) {
      console.error('Stripe Error:', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  // ── Customer helpers ────────────────────────────────────────────────────────

  /**
   * Finds or creates a Stripe Customer for the given user and caches the
   * stripeCustomerId on the users table.
   */
  async getOrCreateCustomer(userId: string, email: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    if (user.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    const customer = await this.stripe.customers.create({
      email,
      metadata: { farmlink_user_id: userId },
    });

    user.stripeCustomerId = customer.id;
    await this.userRepository.save(user);
    return customer.id;
  }

  // ── Payment Methods ─────────────────────────────────────────────────────────

  /**
   * Attaches a PaymentMethod to a Stripe Customer. Optionally sets it as the
   * customer's default payment method.
   */
  async attachPaymentMethod(
    stripeCustomerId: string,
    paymentMethodId: string,
    setDefault = false,
  ): Promise<any> {
    try {
      const pm = await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: stripeCustomerId,
      });

      if (setDefault) {
        await this.stripe.customers.update(stripeCustomerId, {
          invoice_settings: { default_payment_method: paymentMethodId },
        });
      }

      return pm;
    } catch (error: any) {
      console.error('Stripe attach error:', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Lists all card-type payment methods for a Stripe Customer, including
   * which one is the default.
   */
  async listPaymentMethods(stripeCustomerId: string): Promise<{
    paymentMethods: any[];
    defaultPaymentMethodId: string | null;
  }> {
    try {
      const [list, customer] = await Promise.all([
        this.stripe.paymentMethods.list({
          customer: stripeCustomerId,
          type: 'card',
        }),
        this.stripe.customers.retrieve(stripeCustomerId),
      ]);

      const cust = customer as any;
      const defaultId: string | null =
        typeof cust.invoice_settings?.default_payment_method === 'string'
          ? cust.invoice_settings.default_payment_method
          : null;

      return { paymentMethods: list.data, defaultPaymentMethodId: defaultId };
    } catch (error: any) {
      console.error('Stripe list error:', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Detaches a PaymentMethod from the customer (removes it from the wallet).
   */
  async detachPaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      await this.stripe.paymentMethods.detach(paymentMethodId);
    } catch (error: any) {
      console.error('Stripe detach error:', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Sets a payment method as the customer's default.
   */
  async setDefaultPaymentMethod(
    stripeCustomerId: string,
    paymentMethodId: string,
  ): Promise<void> {
    try {
      await this.stripe.customers.update(stripeCustomerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });
    } catch (error: any) {
      console.error('Stripe set-default error:', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Updates the billing name on a PaymentMethod (the only editable field).
   */
  async updatePaymentMethodName(
    paymentMethodId: string,
    name: string,
  ): Promise<any> {
    try {
      return await this.stripe.paymentMethods.update(paymentMethodId, {
        billing_details: { name },
      });
    } catch (error: any) {
      console.error('Stripe update error:', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
