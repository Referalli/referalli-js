import type { GenericBillingEvent } from './outbox.js';

/** The part of a Stripe event the mapper reads. A `Stripe.Event` fits. */
export interface StripeEventLike {
  id: string;
  type: string;
  created: number;
  data: { object: object };
}

export interface StripeEventMapOptions {
  /** Your user id for a Stripe customer id, or null when you have none. */
  customerRef: (stripeCustomerId: string) => string | null | undefined | Promise<string | null | undefined>;
}

const idOf = (ref: unknown): string | undefined => (typeof ref === 'string' ? ref : (ref as { id?: string } | null | undefined)?.id) || undefined;
const unique = (ids: unknown[]) => [...new Set(ids.filter((id): id is string => typeof id === 'string' && id !== ''))];

// The address check the API applies: it refuses the whole event on an address it doesn't accept.
const API_EMAIL = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/;

/** What each mapped Stripe type becomes, besides the fields they all share. */
function fieldsOf(type: string, obj: any): Partial<GenericBillingEvent> | null {
  const items: any[] = [...(obj.lines?.data ?? []), ...(obj.items?.data ?? [])];
  const prices: any[] = items.map((l) => l?.price ?? l?.pricing?.price_details ?? l?.plan);
  const catalog = {
    productRef: idOf(prices[0]?.product),
    // So a connection's product filter can match.
    productIds: unique(prices.map((p) => idOf(p?.product))),
    priceIds: unique(prices.map((p) => (typeof p === 'string' ? p : (p?.id ?? p?.price)))),
  };
  switch (type) {
    case 'invoice.paid': {
      // basil moved subscription_details under parent; read both (and the first line's subscription metadata).
      const subscription = obj.parent?.subscription_details ?? obj.subscription_details;
      // The charge behind the invoice, so a later refund or dispute that names only the charge finds it.
      const chargeRef = idOf(obj.charge) ?? idOf(obj.payments?.data?.[0]?.payment?.charge);
      return {
        type: 'invoice_paid',
        subscriptionRef: idOf(obj.subscription) ?? idOf(subscription?.subscription),
        invoiceRef: obj.id,
        amountGross: obj.amount_paid ?? 0,
        tax: obj.tax ?? 0,
        ...catalog,
        ...(API_EMAIL.test(obj.customer_email ?? '') ? { customerEmail: obj.customer_email } : {}),
        metadata: {
          ...obj.lines?.data?.[0]?.metadata,
          ...obj.parent?.subscription_details?.metadata,
          ...obj.subscription_details?.metadata,
          ...obj.metadata,
          expansion: obj.metadata?.expansion === 'true',
          ...(chargeRef ? { chargeRef } : {}),
        },
      };
    }
    case 'charge.refunded':
      return {
        type: 'refund',
        invoiceRef: idOf(obj.invoice),
        // amount_refunded is the charge's running total. The flag makes Referalli reverse only what earlier refunds haven't.
        amountGross: obj.amount_refunded ?? 0,
        metadata: { ...obj.metadata, chargeRef: obj.id, refundCumulative: true },
      };
    case 'charge.dispute.created': {
      const chargeRef = idOf(obj.charge);
      return { type: 'dispute', invoiceRef: idOf(obj.invoice), amountGross: obj.amount ?? 0, metadata: { ...obj.metadata, ...(chargeRef ? { chargeRef } : {}) } };
    }
    case 'customer.subscription.created':
      return {
        type: 'sub_created',
        subscriptionRef: obj.id,
        mrrDelta: items[0]?.price?.unit_amount ?? 0,
        ...catalog,
        // trial is what records a trial conversion and pays a trial bounty.
        metadata: { ...obj.metadata, trial: obj.status === 'trialing' },
      };
    case 'customer.subscription.deleted':
      return { type: 'sub_canceled', subscriptionRef: obj.id, mrrDelta: -(items[0]?.price?.unit_amount ?? 0), ...catalog, metadata: { ...obj.metadata } };
    default:
      return null;
  }
}

/**
 * Turn a Stripe event you already received (and verified) into events for a
 * `generic` billing connection. Queue each with `createOutbox`. Other Stripe
 * types return `[]`.
 *
 * A customer `customerRef` has no id for is still sent, under the Stripe id and
 * with `metadata.stripeCustomerUnmapped: true`: the payment is on record and
 * replays once the id is linked, where throwing would lose it after Stripe's
 * retries end.
 */
export async function stripeEventToBillingEvents(event: StripeEventLike, options: StripeEventMapOptions): Promise<GenericBillingEvent[]> {
  const obj = event.data.object as any;
  const fields = fieldsOf(event.type, obj);
  if (!fields) return [];
  const stripeCustomer = idOf(obj.customer);
  // A dispute names no customer: Referalli finds it by the charge.
  const mapped = stripeCustomer ? await options.customerRef(stripeCustomer) : undefined;
  return [
    {
      ...(fields as Pick<GenericBillingEvent, 'type'>),
      providerEventId: `stripe:${event.id}`,
      customerRef: mapped || stripeCustomer,
      currency: obj.currency?.toLowerCase(),
      occurredAt: new Date(event.created * 1000).toISOString(),
      metadata: { ...fields.metadata, ...(stripeCustomer && !mapped ? { stripeCustomerUnmapped: true } : {}) },
    },
  ];
}
