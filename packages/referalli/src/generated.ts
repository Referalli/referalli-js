// Generated from the Referalli OpenAPI document. Do not edit by hand:
// run `pnpm --filter referalli gen` after changing the API.

export type Ok = {
  ok: true;
};

export type OkStatus = {
  ok: true;
  status: string;
};

export type Amounts = Array<{
  currency: string;
  /** Integer minor units (cents). */
  amountMinor: number;
}>;

export type Balance = {
  currency: string;
  /** Integer minor units (cents). */
  pending: number;
  /** Integer minor units (cents). */
  approved: number;
  /** Integer minor units (cents). */
  paid: number;
  /** Integer minor units (cents). */
  reversed: number;
};

export type ProgramSettings = {
  probabilisticPolicy: string;
  selfReferralPolicy: "review" | "reject";
  splitCommissions: boolean;
  utmTemplate: Record<string, string>;
  allowPaidSearch: boolean;
  challengeLinks: boolean;
  settlement: "payout" | "merchant_credit";
  riskPolicy: {
    holdBotScore: number;
    holdDisposableEmail: boolean;
    holdVelocity: number;
    holdUnverifiedEmail: boolean;
    holdSelfReferral: boolean;
    holdRiskScore: number;
    holdHighRiskLevel: boolean;
  };
  widget: {
    autoEnroll: boolean;
    destinationUrl: string | null;
  };
  refereeReward?: GetOpenapiJsonResponse | null;
  /** The mobile apps that open this program's links (universal links / App Links), or null. */
  mobileApp: ({
    ios?: {
      teamId: string;
      bundleId: string;
    } | null;
    android?: {
      packageName: string;
      sha256CertFingerprints: Array<string>;
    } | null;
  }) | null;
};

export type Program = {
  id: string;
  name: string;
  slug: string;
  attributionModel: "last_click" | "first_click" | "position_based" | "time_decay";
  cookieWindowDays: number;
  signupToConversionDays: number;
  termsMd: string;
  status: "draft" | "active" | "paused" | "archived";
  publicHandle: string | null;
  settings: ProgramSettings;
  publicPage: {
    pitch: string;
    autoApprove: boolean;
  };
  createdAt: string;
};

export type Partner = {
  id: string;
  email: string;
  displayName: string;
  externalRef: string | null;
  status: "active" | "suspended" | "banned" | "archived";
  tags: Array<string>;
  notes: string | null;
  createdAt: string;
};

export type NetworkWarning = {
  flagged: boolean;
  reason: ("platform_flagged" | "banned_by_other_merchants") | null;
  /** Other merchants that banned this account; 0 below the threshold (2). Never says which. */
  bannedByOtherMerchants: number;
};

export type Enrollment = {
  id: string;
  programId: string;
  partnerId: string;
  status: "applied" | "approved" | "rejected" | "removed";
};

export type Link = {
  id: string;
  programId: string;
  partnerId: string;
  /** Lowercase; matched case-insensitively. */
  code: string;
  destinationUrl: string;
  /** Absolute link, on the org's verified link domain when it has one. */
  shortUrl: string;
  clicks: number;
  createdAt: string;
};

export type CreatedLink = {
  id: string;
  programId: string;
  partnerId: string;
  code: string;
  destinationUrl: string;
  shortUrl?: string;
};

export type Coupon = {
  id: string;
  programId: string;
  partnerId: string;
  code: string;
  createdAt: string;
};

export type ReasonNote = {
  code: "outside_window" | "fraud_excluded" | "coupon_priority" | "email_hash_lead" | "fingerprint_fallback" | "self_referral_review";
  values?: Record<string, number>;
};

export type PayoutSchedule = {
  kind: "monthly";
  dayOfMonth: number;
} | {
  kind: "weekly";
  /** 0 = Sunday … 6 = Saturday */
  dayOfWeek: number;
} | {
  kind: "twice_monthly";
  days: Array<number>;
} | {
  kind: "custom";
  dates: Array<string>;
};

export type AttributionReasoning = {
  model?: string;
  consideredTouchpoints?: number;
  windowDays?: number;
  notes?: Array<string>;
  noteCodes?: Array<ReasonNote>;
  [key: string]: unknown;
};

export type Referral = {
  id: string;
  programId: string;
  partnerId: string;
  customerRef: string;
  source: string;
  matchedVia: string;
  confidence: number;
  clickId: string | null;
  linkId: string | null;
  status: "active" | "pending_review" | "paused" | "void";
  ts: string;
  windowExpiresAt: string;
  touchCredits: Array<{
    partnerId: string;
    weight: number;
    clickId: string | null;
  }>;
  reasoning: AttributionReasoning;
};

export type SignupReasonCode = "consent_missing" | "unknown_code" | "customer_is_partner" | "self_referral" | "banned_partner" | "archived_partner" | "flagged_partner" | "fingerprint_ignored" | "risk_hold" | "no_email_for_enroll" | "enroll_email_taken" | "enroll_code_unavailable";

export type AssociateResponse = {
  /** null when no partner matched (not an error). */
  referral: ({
    id: string;
    programId: string;
    partnerId: string;
    customerRef: string;
    source: string;
    matchedVia: string;
    confidence: number;
    clickId: string | null;
    linkId: string | null;
    status: "active" | "pending_review" | "paused" | "void";
    ts: string;
    windowExpiresAt: string;
    touchCredits: Array<{
      partnerId: string;
      weight: number;
      clickId: string | null;
    }>;
    reasoning: AttributionReasoning;
    orgId: string;
  }) | null;
  reasoning?: {
    notes: Array<string>;
  };
};

export type CommissionEvent = {
  id: string;
  programId: string;
  partnerId: string;
  referralId: string | null;
  type: "earned" | "approved" | "paid" | "reversed" | "adjusted";
  /** Integer minor units (cents). */
  amountMinor: number;
  currency: string;
  relatedCommissionId: string | null;
  holdUntil: string | null;
  level: number | null;
  memo: string | null;
  /** Set on paid events the merchant settled itself (store_credit). */
  settlementMethod?: string | null;
  settlementReference?: string | null;
  ts: string;
};

/** An earned line also carries its net, state and the events recorded against it. */
export type CommissionLine = {
  id: string;
  programId: string;
  partnerId: string;
  referralId: string | null;
  type: "earned" | "approved" | "paid" | "reversed" | "adjusted";
  /** Integer minor units (cents). */
  amountMinor: number;
  currency: string;
  relatedCommissionId: string | null;
  holdUntil: string | null;
  level: number | null;
  memo: string | null;
  /** Set on paid events the merchant settled itself (store_credit). */
  settlementMethod?: string | null;
  settlementReference?: string | null;
  ts: string;
  billingEventId?: string | null;
  /** Integer minor units (cents). */
  netMinor?: number;
  state?: "pending" | "approved" | "paid";
  events?: Array<CommissionEvent>;
};

export type Settlement = {
  commissionId: string;
  paidEventId: string;
  partnerId: string;
  programId: string;
  /** Integer minor units (cents). */
  amountMinor: number;
  currency: string;
  method: "store_credit" | "merchant_credit";
  reference: string;
  status: "paid";
};

export type CommissionRule = {
  id: string;
  programId: string;
  version: number;
  config: GetOpenapiJsonResponse;
  createdAt: string;
};

export type ValueMapping = {
  cash?: string;
  creditApplied?: string;
  discount?: string;
  cost?: string;
  productRef?: string;
  unit: "minor" | "major";
  /** Bumped on every save (the built-in extractor is 1). */
  version: number;
};

export type ValueMappingPreview = {
  mappingVersion: number;
  /** Single-event payloads. */
  currency?: string;
  value?: {
    /** Integer minor units (cents). */
    cashMinor: number;
    /** Integer minor units (cents). */
    creditAppliedMinor: number;
    /** Integer minor units (cents). */
    discountMinor: number;
    /** Integer minor units (cents). */
    costMinor?: number;
    productRef?: string;
    fields: Record<string, number>;
    /** Mapped paths holding an unreadable value; read as 0. */
    warnings?: Array<string>;
    source?: "mapping";
    mappingVersion?: number;
  };
  wouldRecord?: Array<{
    kind: string;
    currency: string;
    confidence: string;
    source: string;
    extractionVersion: number;
    /** Integer minor units (cents). */
    cashMinor?: number;
    /** Integer minor units (cents). */
    creditAppliedMinor?: number;
    /** Integer minor units (cents). */
    discountMinor?: number;
    /** Integer minor units (cents). */
    costMinor?: number;
    productRef?: string;
  }>;
  /** A generic-connector body with an events array: one result per element. */
  events?: Array<{
    currency: string;
    value: {
      /** Integer minor units (cents). */
      cashMinor: number;
      /** Integer minor units (cents). */
      creditAppliedMinor: number;
      /** Integer minor units (cents). */
      discountMinor: number;
      /** Integer minor units (cents). */
      costMinor?: number;
      productRef?: string;
      fields: Record<string, number>;
      /** Mapped paths holding an unreadable value; read as 0. */
      warnings?: Array<string>;
      source?: "mapping";
      mappingVersion?: number;
    };
    wouldRecord: Array<{
      kind: string;
      currency: string;
      confidence: string;
      source: string;
      extractionVersion: number;
      /** Integer minor units (cents). */
      cashMinor?: number;
      /** Integer minor units (cents). */
      creditAppliedMinor?: number;
      /** Integer minor units (cents). */
      discountMinor?: number;
      /** Integer minor units (cents). */
      costMinor?: number;
      productRef?: string;
    }>;
    index: number;
  }>;
};

export type BillingConnection = {
  id: string;
  provider: string;
  name: string;
  /** paused: its webhook URL refuses events until resumed. */
  status: "active" | "paused";
  createdAt: string;
  webhookUrl: string;
  /** The provider sends thin webhooks: set API credentials (Recurly, BigCommerce). */
  needsCredentials: boolean;
  hasCredentials: boolean;
  /** Where cash / credit / discount / cost live in this connection's payload; null uses the built-in extractor. */
  valueMapping: ValueMapping | null;
  rotation: {
    inProgress: boolean;
    previousSecretExpiresAt?: string;
  };
};

export type CreatedBillingConnection = {
  id: string;
  provider: string;
  /** Returned only here. */
  webhookSecret: string;
  /** Path to register with the provider. */
  webhookUrl: string;
};

export type BillingEvent = {
  id: string;
  provider: string;
  type: string;
  customerRef: string;
  invoiceRef: string | null;
  /** Integer minor units (cents). */
  amountGross: number;
  /** Integer minor units (cents). */
  tax: number;
  /** Integer minor units (cents). */
  fees: number;
  currency: string;
  occurredAt: string;
};

export type WebhookEndpoint = {
  id: string;
  url: string;
  topics: Array<string>;
  /** null: every program. Otherwise only events about these programs (org-wide events such as payouts are not sent). */
  programIds: Array<string> | null;
  status: "active" | "paused" | "disabled";
  /** Also send the deprecated body-only legacy signature header. */
  legacySignature: boolean;
  rotation: {
    inProgress: boolean;
    previousSecretExpiresAt?: string;
  };
  /** When the current run of failed deliveries began. */
  failingSince: string | null;
  disabledAt: string | null;
  disabledReason: string | null;
  createdAt: string;
};

export type WebhookDelivery = {
  id: string;
  endpointId: string;
  topic: string;
  status: string;
  attempts: number;
  lastStatusCode: number | null;
  lastAttemptAt: string | null;
  /** When a pending delivery is next tried; null once settled. */
  nextAt: string | null;
  createdAt: string;
};

export type PayoutProfile = {
  partnerId: string;
  method: string;
  payoutCurrency: string;
  /** Integer minor units (cents). */
  minThresholdMinor: number;
  taxFormType: string | null;
  taxFormSubmittedAt: string | null;
};

export type TaxProfile = {
  legalName: string | null;
  address: string | null;
  country: string | null;
  vatId: string | null;
  ein: string | null;
  domesticVatBps: number | null;
  viesCheck: boolean;
  filingProvider: string;
  filingConnected: boolean;
};

export type TaxFiling = {
  id: string;
  taxYear: number;
  kind: "original" | "correction";
  provider: string;
  providerFilingId: string | null;
  status: "submitting" | "submitted" | "accepted" | "rejected";
  recipientCount: number;
  /** Integer minor units (cents). */
  totalMinor: number;
  error: string | null;
  documents: Array<{
    id: string;
    partnerId: string;
    /** Integer minor units (cents). */
    amountMinor: number;
    status: string;
    [key: string]: unknown;
  }>;
};

export type NecPreview = {
  taxYear: number;
  payerReady: boolean;
  payerIssues: Array<"missing_legal_name" | "missing_ein" | "missing_address">;
  recipients: Array<{
    partnerId: string;
    name: string | null;
    email: string | null;
    /** Integer minor units (cents). */
    amountMinor: number;
    issues: Array<"missing_tin" | "missing_address" | "fx_missing" | "already_filed">;
  }>;
};

export type Invoice = {
  /** Sequential per merchant per year: SBI-2026-1, -2, … */
  number: string;
  issuedAt: string;
  lines: Array<unknown>;
  vatNote: string;
  /** The partner. Absent on invoices issued before 2026-10. */
  supplier?: {
    name: string | null;
    address: string | null;
    country: string | null;
    vatId: string | null;
  };
  /** The merchant, issuing the invoice on the partner’s behalf. */
  customer?: {
    name: string | null;
    address: string | null;
    country: string | null;
    vatId: string | null;
  };
  currency?: string;
  /** Integer minor units (cents). */
  netMinor?: number;
  vatTreatment?: "reverse_charge" | "domestic" | "outside_scope";
  vatRateBps?: number | null;
  /** Integer minor units (cents). */
  vatMinor?: number;
  /** Integer minor units (cents). */
  grossMinor?: number;
  selfBilling?: {
    agreementVersion: string | null;
    acceptedAt: string | null;
  };
  [key: string]: unknown;
};

export type PayoutRunCreated = {
  runId: string;
  payouts: Array<{
    payoutId: string;
    partnerId: string;
    /** Integer minor units (cents). */
    amountMinor: number;
    currency: string;
    rail: string;
    fxApplied: Array<{
      from: string;
      to: string;
      rate: number;
      ts: string;
    }>;
    invoice: Invoice;
  }>;
  skipped: Array<{
    partnerId: string;
    reason: "missing_tax_form" | "below_threshold" | "no_profile" | "kyc_unverified" | "sanctions_hold" | "partner_inactive" | "missing_fx_rate" | "self_billing_agreement_missing";
  }>;
};

export type PayoutRun = {
  id: string;
  status: string;
  summary: GetOpenapiJsonResponse | null;
  createdAt: string;
  executedAt: string | null;
};

export type Payout = {
  id: string;
  runId: string;
  partnerId: string;
  /** Integer minor units (cents). */
  amountMinor: number;
  currency: string;
  status: string;
  rail: string;
  railRef: string | null;
  failureReason: string | null;
  sentAt: string | null;
};

export type FxRate = {
  base: string;
  quote: string;
  /** Decimal string, never a float. */
  rate: string;
  effectiveAt: string;
  /** 'manual' (your own), 'ecb' (the daily feed), or 'fixture' (platform sample). */
  source: string;
  scope: "org" | "platform";
  /** When a manual override was cleared, handing the pair back to the feed. */
  retiredAt: string | null;
};

export type Org = {
  id: string;
  name: string;
  plan: string;
  settings: GetOpenapiJsonResponse;
  trackingToken: string;
  payoutKycRequired: boolean;
  /** False for the org's test org (test mode). */
  livemode: boolean;
  /** On a test org: the live org it belongs to. */
  liveOrgId?: string;
};

export type Member = {
  userId: string;
  role: "owner" | "admin" | "finance" | "analyst" | "support";
  email: string;
  name: string | null;
};

export type IssuedApiKey = {
  id: string;
  /** The full key, shown once. */
  key: string;
  scopes: Array<string>;
  publishable: boolean;
  allowedOrigins: Array<string>;
  apiVersion: string;
  /** False for a test-mode key (rk_test_…). */
  livemode: boolean;
  owner: string | null;
  expiresAt: string | null;
  pairId: string | null;
};

export type ApiKey = {
  id: string;
  name: string;
  prefix: string;
  scopes: Array<string>;
  /** The API version this key is pinned to (what it gets without a Referalli-Version header). */
  apiVersion: string;
  publishable: boolean;
  allowedOrigins: Array<string>;
  livemode: boolean;
  /** The developer or service the key belongs to. */
  owner: string | null;
  /** Shared by a live/test pair minted together. */
  pairId: string | null;
  createdBy: ({
    type: "api_key" | "user";
    id: string;
  }) | null;
  expiresAt: string | null;
  expired: boolean;
  /** Updated at most once a minute. */
  lastUsedAt: string | null;
  createdAt: string;
  revokedAt: string | null;
};

export type AuthConnection = {
  id: string;
  provider: "clerk" | "supabase" | "workos" | "generic" | "atlas" | "custom";
  programId: string;
  name: string;
  status: string;
  createdAt: string;
  rotation: {
    inProgress: boolean;
    previousSecretExpiresAt?: string;
  };
  /** Signed-protocol connections: the Atlas instance, or a custom label. */
  instanceId?: string | null;
  autoEnrollUsers?: boolean;
  destinationUrl?: string | null;
  signatureVersion?: "v1+v2" | "v2";
  /** True once signatureVersion is v2 or the connection has seen a v2 call. */
  requiresV2?: boolean;
};

export type CreatedAuthConnection = {
  id: string;
  provider: string;
  /** Returned only here. */
  secret: string;
  /** Webhook connectors: Clerk, Supabase, WorkOS, generic. */
  webhookUrl?: string;
  metadataKeys?: Record<string, string>;
  /** Signed-protocol connections (atlas, custom). */
  programId?: string;
  instanceId?: string;
  autoEnrollUsers?: boolean;
  destinationUrl?: string | null;
  signupsUrl?: string;
  eraseUrl?: string;
  exportUrl?: string;
};

export type FraudCase = {
  id: string;
  partnerId: string | null;
  referralId: string | null;
  kind: string;
  status: string;
  evidence: GetOpenapiJsonResponse | null;
  action: string | null;
  createdAt: string;
  resolvedAt: string | null;
};

export type CustomerExport = {
  customerRef: string;
  referrals: Array<GetOpenapiJsonResponse>;
  associations: Array<GetOpenapiJsonResponse>;
  identityLinks: Array<GetOpenapiJsonResponse>;
  billingEvents: Array<GetOpenapiJsonResponse>;
  conversionEvents: Array<GetOpenapiJsonResponse>;
};

export type PartnerExport = {
  partner: GetOpenapiJsonResponse;
  enrollments: Array<GetOpenapiJsonResponse>;
  links: Array<GetOpenapiJsonResponse>;
  coupons: Array<GetOpenapiJsonResponse>;
  payoutProfile: GetOpenapiJsonResponse | null;
  commissionEvents: Array<GetOpenapiJsonResponse>;
  payouts: Array<GetOpenapiJsonResponse>;
};

export type PrivacyRequest = {
  id: string;
  type: "access" | "erasure";
  subject: GetOpenapiJsonResponse;
  status: "pending" | "completed" | "failed";
  error: string | null;
  createdAt: string;
  completedAt: string | null;
  resultUrl?: string;
  /** Erasure receipts, on the single-request read. */
  result?: GetOpenapiJsonResponse;
};

export type GraphReferral = {
  referralId: string;
  customerRef: string;
  status: string;
  matchedVia: string;
  ts: string;
  revenue: Amounts;
  commission: Amounts;
  partner: GraphPartner | null;
};

export type GraphPartner = {
  partnerId: string;
  displayName: string;
  email: string;
  externalRef: string | null;
  status: string;
  commission: Amounts;
  referrals: Array<GraphReferral>;
};

export type CreatorProfile = {
  accountId: string;
  name: string | null;
  /** Only on your own profile. */
  email?: string;
  published: boolean;
  headline: string;
  bio: string;
  categories: Array<string>;
  languages: Array<string>;
  country: string;
  channels: Array<GetOpenapiJsonResponse>;
  website: string;
  minAudience: number;
  acceptsInvites: boolean;
  audience: GetOpenapiJsonResponse;
  engagementBps: number;
  stats: {
    programs: number;
    clicks: number;
    referrals: number;
    repeatPayerRate: number | null;
  };
  invited?: boolean;
};

export type EmailSettings = {
  provider: ("resend" | "brevo" | "postmark") | null;
  /** The key itself is write-only and never returned. */
  hasApiKey: boolean;
  fromAddress: string | null;
  fromName: string | null;
  replyTo: string | null;
  defaultLocale: string;
  logoUrl: string | null;
  primaryColor: string | null;
  domainStatus: "unknown" | "pending" | "verified" | "failed";
  domainCheckedAt: string | null;
};

export type EmailRendered = {
  locale: string;
  subject: string;
  text: string;
  html: string;
  source: "override" | "default";
};

export type Notification = {
  id: string;
  topic: string;
  message: string;
  data: GetOpenapiJsonResponse | null;
  readAt: string | null;
  createdAt: string;
};

export type Passport = {
  claims: GetOpenapiJsonResponse;
  signature: string;
  algorithm: "ed25519";
  publicKey: string;
};

export type Incident = {
  id: string;
  title: string;
  state: "investigating" | "identified" | "monitoring" | "resolved";
  severity: "notice" | "minor" | "major" | "critical" | "maintenance";
  body: string;
  components: Array<string>;
  startedAt: string;
  resolvedAt: string | null;
  updatedAt: string;
  updates: Array<{
    id: string;
    body: string;
    state: "investigating" | "identified" | "monitoring" | "resolved";
    createdAt: string;
  }>;
};

export type Retention = {
  policy: {
    clicks: number | null;
    visits: number | null;
    billingPayloads: number | null;
    webhookDeliveries: number | null;
    notifications: number | null;
    auditLog: number | null;
  };
  limits: Record<string, {
    minDays: number;
    defaultDays: number | null;
  }>;
  lastRun: {
    at: string;
    result: GetOpenapiJsonResponse;
  } | null;
};

export type PartnerGroup = {
  id: string;
  programId: string;
  name: string;
  base: ({
    kind: "percent";
    bps: number;
  } | {
    kind: "fixed";
    /** Integer minor units (cents). */
    amountMinor: number;
    currency: string;
  }) | null;
  holdDays: number | null;
  minThresholdMinor: number | null;
  payoutCurrency: string | null;
  onboardingMessage: string | null;
  onboardingChecklist: Array<string>;
  members?: number;
  archivedAt: string | null;
  createdAt: string;
};

export type Promotion = {
  id: string;
  programId: string;
  name: string;
  groupId: string | null;
  effect: ({
    kind: "replace";
    base: {
      kind: "percent";
      bps: number;
    } | {
      kind: "fixed";
      /** Integer minor units (cents). */
      amountMinor: number;
      currency: string;
    };
  }) | {
    kind: "boost";
    bps: number;
  };
  startsAt: string;
  endsAt: string;
  endedAt: string | null;
  status: "scheduled" | "active" | "ended";
  createdAt: string;
};

export type IntegrationConnection = {
  id: string;
  kind: "hubspot" | "segment";
  status: "active" | "paused" | "error";
  config: GetOpenapiJsonResponse;
  hasCredential: boolean;
  lastError: string | null;
  lastSuccessAt: string | null;
  pausedUntil: string | null;
  createdAt: string;
  updatedAt: string;
};

export type IntegrationDelivery = {
  id: string;
  kind: "zapier" | "hubspot" | "segment";
  targetId: string;
  eventId: string;
  topic: string;
  status: "pending" | "sent" | "failed" | "skipped";
  attempts: number;
  nextAt: string;
  lastError: string | null;
  sentAt: string | null;
  createdAt: string;
};

export type ZapierHook = {
  id: string;
  event: string;
  target_url: string;
  createdAt: string;
};

/** Present with model=incremental. */
export type RoiIncremental = {
  currency: string;
  windowDays: number;
  holdoutBps: number;
  /** Recorded treatment referrals that got referee credit. */
  treatment: {
    n: number;
    /** Integer minor units (cents). */
    cashAfterPerReferralMinor: number;
    profitAfterPerReferralMinor: number | null;
  };
  /** Recorded control (holdout) referrals: no credit. */
  control: {
    n: number;
    /** Integer minor units (cents). */
    cashAfterPerReferralMinor: number;
    profitAfterPerReferralMinor: number | null;
  };
  /** Treatment minus control cash after the first qualifying payment, per referral. */
  liftMinorPerReferral: number;
  liftProfitMinorPerReferral: number | null;
  /** Referee credit cost per treatment referral. Only credit: control referrals also earn no commission, and that withheld commission is not counted here. */
  creditCostPerReferralMinor: number;
  /** Lift profit ÷ credit cost per referral; null when not eligible, no margin or no cost. The denominator is referee credit only: the commission withheld from control referrals is not in it, so the lift also reflects that commission difference. */
  incrementalRoi: number | null;
  eligible: boolean;
  reason?: "no_holdout" | "too_few" | "no_recorded_groups";
  /** Referrals from before groups were recorded: naive ROI only. */
  unrecordedReferrals: number;
  /** Referrals in range left out of both groups, by reason. */
  excludedReferrals: {
    unrecorded: number;
    treatmentWithoutCredit: number;
    controlWithCredit: number;
  };
  excluded: Array<{
    eventId: string;
    currency: string;
    reason: "no_fx_rate";
  }>;
};

/** Present with includeProjection=true. */
export type RoiProjection = {
  /** Always "projection": expected figures, never actuals. */
  label: "projection";
  eligible: boolean;
  reason?: "not_enough_history";
  closedGrants: number;
  openGrants: number;
  /** Open grants in cohorts with at least 50 closed grants. */
  projectedGrants: number;
  /** Share of projected open grants expected to pay back (already paid back included). */
  expectedPaidBackShareBps: number | null;
  medianExpectedPaybackDays: number | null;
  cohorts: Array<{
    programId: string | null;
    role: "referee" | "referrer";
    eligible: boolean;
    reason?: "not_enough_history";
    closedGrants: number;
    openGrants: number;
    /** First day the cohort's median profit/cost ratio reaches 1.0; null when it doesn't within the window. */
    medianCrossingDay?: number | null;
    /** Last day with at least 50 closed grants observed that far: the curve stops there. */
    curveThroughDay?: number;
    noCrossingReason?: "cohort_not_paid_back" | "insufficient_horizon";
    /** Open grants past the crossing day without paying back. */
    behindCohort?: number;
  }>;
};

export type RoiSummary = {
  currency: string;
  /** Integer minor units (cents). */
  creditCostMinor: number;
  /** Integer minor units (cents). */
  cashAfterMinor: number;
  profitAfterMinor: number | null;
  netMinor: number | null;
  /** Profit after ÷ cost, 4 decimals; null with no cost or unknown profit. */
  roi: number | null;
  /** Basis points (10000 = 100%); null when there is nothing to divide by. */
  paidBackShareBps: number | null;
  medianPaybackDays: number | null;
  grants: number;
  profitSources: Record<string, number>;
  coverage: {
    /** Basis points (10000 = 100%); null when there is nothing to divide by. */
    creditAppliedReportedBps: number | null;
    /** Basis points (10000 = 100%); null when there is nothing to divide by. */
    marginCoveredBps: number | null;
    /** Basis points (10000 = 100%); null when there is nothing to divide by. */
    inferredShareBps: number | null;
  };
  /** Face not yet used, expired or revoked, in the reporting currency. */
  outstandingCreditMinor: number;
  /** Outstanding credit priced by each grant's cost model; null when a model needs a margin and none is known. */
  outstandingCostIfUsedMinor: number | null;
  /** Native currencies of the grants in scope (ignoring the currency filter), most grants first. */
  currencies: Array<string>;
  incremental?: RoiIncremental;
  projection?: RoiProjection;
  /** With programId: status against the program's targetRoiBps (unknown when ROI is null); null when it sets no target. */
  target?: ({
    targetRoiBps: number;
    status: "on_track" | "below" | "unknown";
  }) | null;
};

export type RoiGrantMetrics = {
  grantId: string;
  role: "referee" | "referrer";
  currency: string;
  /** Integer minor units (cents). */
  faceMinor: number;
  /** Integer minor units (cents). */
  usedMinor: number;
  /** Integer minor units (cents). */
  costMinor: number;
  /** Integer minor units (cents). */
  cashAfterMinor: number;
  profitAfterMinor: number | null;
  netMinor: number | null;
  /** Profit after ÷ cost, 4 decimals; null with no cost or unknown profit. */
  roi: number | null;
  paidBack: boolean | null;
  paybackDays: number | null;
  profitSource: "event" | "cost_events" | "catalog" | "program" | "org" | "none" | "mixed";
  inferredShareBps: number;
  windowDays: number;
  excluded: Array<{
    eventId: string;
    currency: string;
    reason: "no_fx_rate";
  }>;
};

export type RoiGrant = {
  id: string;
  source: "referee_reward" | "commission_credit" | "external" | "manual";
  role: "referee" | "referrer";
  status: "open" | "used" | "expired" | "revoked";
  customerRef: string | null;
  partnerId: string | null;
  referralId: string | null;
  programId: string | null;
  grantCurrency: string;
  grantedAt: string;
  expiresAt: string | null;
  currency: string;
  /** Integer minor units (cents). */
  faceMinor: number;
  /** Integer minor units (cents). */
  usedMinor: number;
  /** Integer minor units (cents). */
  costMinor: number;
  /** Integer minor units (cents). */
  cashAfterMinor: number;
  profitAfterMinor: number | null;
  netMinor: number | null;
  /** Profit after ÷ cost, 4 decimals; null with no cost or unknown profit. */
  roi: number | null;
  paidBack: boolean | null;
  paybackDays: number | null;
  profitSource: "event" | "cost_events" | "catalog" | "program" | "org" | "none" | "mixed";
  inferredShareBps: number;
  windowDays: number;
};

export type RoiPatternEntry = {
  subject: {
    customerRef?: string;
    partnerId?: string;
  };
  programId: string | null;
  /** The key numbers behind the match; the keys depend on the pattern. */
  detail: Record<string, unknown>;
};

export type RoiTrace = {
  subject: {
    type: "customer" | "partner";
    id: string;
    customerRefs: Array<string>;
    partnerId: string | null;
  };
  events: Array<{
    id: string;
    kind: string;
    occurredAt: string;
    /** currency plus the minor-unit amounts this kind carries. */
    amounts: Record<string, string | number | null>;
    confidence: "reported" | "extracted" | "inferred";
    source: string;
    superseded: boolean;
    links: Record<string, string | null>;
  }>;
  grants: Array<RoiGrantMetrics>;
  /** One point per event: cumulative credit net (profit after − credit cost) in the reporting currency. Commissions are not in it. */
  runningNet: Array<{
    at: string;
    netMinor: number | null;
  }>;
  /** Rows left out of runningNet: no fx rate into the reporting currency on their date. */
  excluded: Array<{
    eventId: string;
    currency: string;
    reason: "no_fx_rate";
  }>;
};

export type AuditLogEntry = {
  id: string;
  actorType: string;
  actorId: string;
  action: string;
  subjectType: string;
  subjectId: string;
  data: GetOpenapiJsonResponse;
  createdAt: string;
};

export type EmailTemplateEvent = {
  event: string;
  audience: "partner" | "merchant";
  placeholders: Array<string>;
  locales: Array<{
    locale: string;
    default: {
      subject: string;
      body: string;
      cta: string;
    };
    override: ({
      subject: string;
      text: string;
      html: string | null;
      updatedAt: string;
    }) | null;
  }>;
};

export type Error = {
  error: {
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
    /** The docs entry for this error code: what it means and how to fix it. */
    docs_url: string;
  };
};

/** `data` of a `click.recorded` event: Fires for every click (tracked link redirects, `?via=` landings, server-side clicks). High volume: subscribe only if you need click-level data. */
export type ClickRecordedEventData = {
  clickId: string;
  programId: string;
  partnerId: string;
  linkId: string | null;
};

/** A tracked click was recorded: the `click.recorded` delivery body. */
export type ClickRecordedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "click.recorded";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: ClickRecordedEventData;
};

/** `data` of a `referral.created` event: A new referral: from `POST /v1/referrals/associate`, an auth-platform sign-up, a mobile install, a won deal or an agent attribution. */
export type ReferralCreatedEventData = {
  referralId: string;
  programId: string;
  partnerId: string;
  /** The partner's id in your own system (its externalRef), or null. */
  partnerExternalRef: string | null;
  /** Your id for the referred customer. */
  customerRef: string;
  status: "active" | "pending_review" | "paused" | "void";
  matchedVia: string;
};

/** A customer was attributed to a partner: the `referral.created` delivery body. */
export type ReferralCreatedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "referral.created";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: ReferralCreatedEventData;
};

/** `data` of a `referral.held` event: A risk or self-referral check put the referral in `pending_review`; `reasons` says why and `caseId` is the fraud case opened for it. */
export type ReferralHeldEventData = {
  referralId: string;
  programId: string;
  partnerId: string;
  /** The partner's id in your own system (its externalRef), or null. */
  partnerExternalRef: string | null;
  /** Your id for the referred customer. */
  customerRef: string;
  status: "active" | "pending_review" | "paused" | "void";
  reasons: Array<string>;
  caseId: string;
};

/** A referral was held for review: the `referral.held` delivery body. */
export type ReferralHeldEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "referral.held";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: ReferralHeldEventData;
};

/** `data` of a `referral.approved` event: Back to `active`: approved by the merchant, a fraud case dismissed (`reason: "fraud_case_dismissed"`, with `caseId`), or a hold released by email verification (`reason: "email_verified"`). */
export type ReferralApprovedEventData = {
  referralId: string;
  programId: string;
  partnerId: string;
  /** The partner's id in your own system (its externalRef), or null. */
  partnerExternalRef: string | null;
  /** Your id for the referred customer. */
  customerRef: string;
  status: "active" | "pending_review" | "paused" | "void";
  reason?: string;
  caseId?: string;
};

/** A held referral was approved: the `referral.approved` delivery body. */
export type ReferralApprovedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "referral.approved";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: ReferralApprovedEventData;
};

/** `data` of a `referral.voided` event: It earns nothing more: voided by the merchant, a fraud case (`reason` `fraud_case_voided` or `partner_banned`, with `caseId`) or an identity provider (`fraud_confirmed`). */
export type ReferralVoidedEventData = {
  referralId: string;
  programId: string;
  partnerId: string;
  /** The partner's id in your own system (its externalRef), or null. */
  partnerExternalRef: string | null;
  /** Your id for the referred customer. */
  customerRef: string;
  status: "active" | "pending_review" | "paused" | "void";
  reason?: string;
  caseId?: string;
};

/** A referral was voided: the `referral.voided` delivery body. */
export type ReferralVoidedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "referral.voided";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: ReferralVoidedEventData;
};

/** `data` of a `referral.paused` event: The merchant paused the referral: it earns no new commissions until resumed. */
export type ReferralPausedEventData = {
  referralId: string;
  programId: string;
  partnerId: string;
  /** The partner's id in your own system (its externalRef), or null. */
  partnerExternalRef: string | null;
  /** Your id for the referred customer. */
  customerRef: string;
  status: "active" | "pending_review" | "paused" | "void";
};

/** A referral was paused: the `referral.paused` delivery body. */
export type ReferralPausedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "referral.paused";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: ReferralPausedEventData;
};

/** `data` of a `referral.resumed` event: The referral is `active` again. */
export type ReferralResumedEventData = {
  referralId: string;
  programId: string;
  partnerId: string;
  /** The partner's id in your own system (its externalRef), or null. */
  partnerExternalRef: string | null;
  /** Your id for the referred customer. */
  customerRef: string;
  status: "active" | "pending_review" | "paused" | "void";
};

/** A paused referral was resumed: the `referral.resumed` delivery body. */
export type ReferralResumedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "referral.resumed";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: ReferralResumedEventData;
};

/** `data` of a `referral.reassigned` event: The merchant reassigned the referral; the payload names the new partner, with the previous one in `previousPartnerId` and `previousPartnerExternalRef`. */
export type ReferralReassignedEventData = {
  referralId: string;
  programId: string;
  partnerId: string;
  /** The partner's id in your own system (its externalRef), or null. */
  partnerExternalRef: string | null;
  /** Your id for the referred customer. */
  customerRef: string;
  status: "active" | "pending_review" | "paused" | "void";
  previousPartnerId: string;
  previousPartnerExternalRef: string | null;
};

/** A referral moved to another partner: the `referral.reassigned` delivery body. */
export type ReferralReassignedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "referral.reassigned";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: ReferralReassignedEventData;
};

/** `data` of a `referral.rejected` event: A self-referral the program's `selfReferralPolicy: "reject"` refused, so no referral exists. A `fraud.case_opened` follows. */
export type ReferralRejectedEventData = {
  programId: string;
  partnerId: string;
  customerRef: string;
  reason: "self_referral";
};

/** A self-referral was refused: the `referral.rejected` delivery body. */
export type ReferralRejectedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "referral.rejected";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: ReferralRejectedEventData;
};

/** `data` of a `customer.aliased` event: The app changed a user's id after their sign-up was filed (through an auth connection); their referrals now use `toCustomerRef`. */
export type CustomerAliasedEventData = {
  fromCustomerRef: string;
  toCustomerRef: string;
  referralIds: Array<string>;
  partnerId: string | null;
};

/** A customer's id changed: the `customer.aliased` delivery body. */
export type CustomerAliasedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "customer.aliased";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: CustomerAliasedEventData;
};

/** `data` of a `commission.earned` event: A payment (or a signup, trial or product-event bounty) earned a partner a commission line. Payment fields are null for bounties. */
export type CommissionEarnedEventData = {
  commissionId: string;
  partnerId: string;
  programId: string;
  /** Integer minor units (cents). */
  amountMinor: number;
  /** Lowercase ISO 4217 code. */
  currency: string;
  referralId: string | null;
  customerRef: string | null;
  billingEventId: string | null;
  /** The billing provider's own event id. */
  providerEventId: string | null;
  invoiceRef: string | null;
  /** Your own id for the customer when known (an auth-connection user id), or null. */
  customerExternalRef: string | null;
  partnerExternalRef: string | null;
  /** 0 for the direct partner, 1 to 5 for sub-affiliate levels. */
  level: number;
  memo: string;
  basisMinor: number | null;
};

/** A commission line was earned: the `commission.earned` delivery body. */
export type CommissionEarnedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "commission.earned";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: CommissionEarnedEventData;
};

/** `data` of a `commission.reversed` event: A refund or dispute clawed back an earned line. `commissionId` and `relatedCommissionId` are the original line, `reversalId` the new `reversed` event; `amountMinor` is negative. */
export type CommissionReversedEventData = {
  commissionId: string;
  relatedCommissionId: string;
  reversalId: string;
  partnerId: string;
  programId: string;
  /** Negative: the amount taken back. */
  amountMinor: number;
  /** Lowercase ISO 4217 code. */
  currency: string;
  referralId: string | null;
  customerRef: string | null;
  billingEventId: string | null;
  /** The billing provider's own event id. */
  providerEventId: string | null;
  invoiceRef: string | null;
  /** Your own id for the customer when known (an auth-connection user id), or null. */
  customerExternalRef: string | null;
  partnerExternalRef: string | null;
  /** 0 for the direct partner, 1 to 5 for sub-affiliate levels. */
  level: number;
  memo: string;
};

/** A commission line was reversed: the `commission.reversed` delivery body. */
export type CommissionReversedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "commission.reversed";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: CommissionReversedEventData;
};

/** `data` of a `commission.settled` event: The merchant paid the line itself (`store_credit`, or `merchant_credit` for programs that settle as they earn), outside payout runs. */
export type CommissionSettledEventData = {
  commissionId: string;
  partnerId: string;
  programId: string;
  referralId: string | null;
  /** Integer minor units (cents). */
  amountMinor: number;
  /** Lowercase ISO 4217 code. */
  currency: string;
  method: "store_credit" | "merchant_credit";
  reference: string;
};

/** A commission line was settled by the merchant: the `commission.settled` delivery body. */
export type CommissionSettledEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "commission.settled";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: CommissionSettledEventData;
};

/** `data` of a `partner.applied` event: An application waiting for approval. `enrollmentId` is absent for applications from the public program page. */
export type PartnerAppliedEventData = {
  programId: string;
  partnerId: string;
  enrollmentId?: string;
};

/** A partner applied to a program: the `partner.applied` delivery body. */
export type PartnerAppliedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "partner.applied";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: PartnerAppliedEventData;
};

/** `data` of a `partner.enrolled` event: The merchant (or an import) enrolled the partner in a program, approved at once. */
export type PartnerEnrolledEventData = {
  programId: string;
  partnerId: string;
  enrollmentId: string;
};

/** A partner was enrolled: the `partner.enrolled` delivery body. */
export type PartnerEnrolledEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "partner.enrolled";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: PartnerEnrolledEventData;
};

/** `data` of a `partner.approved` event: An application was approved, or a partner joined a program that approves at once. `enrollmentId` is present when approved from an application. */
export type PartnerApprovedEventData = {
  programId: string;
  partnerId: string;
  enrollmentId?: string;
};

/** A partner was approved: the `partner.approved` delivery body. */
export type PartnerApprovedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "partner.approved";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: PartnerApprovedEventData;
};

/** `data` of a `partner.level_up` event: Partner leveling promoted the partner; `referrals` is the count that qualified them. */
export type PartnerLevelUpEventData = {
  programId: string;
  partnerId: string;
  level: string;
  referrals: number;
};

/** A partner reached a new level: the `partner.level_up` delivery body. */
export type PartnerLevelUpEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "partner.level_up";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: PartnerLevelUpEventData;
};

/** `data` of a `payout.scheduled` event: A payout run included the partner; nothing has been paid yet. */
export type PayoutScheduledEventData = {
  payoutId: string;
  partnerId: string;
  /** Integer minor units (cents). */
  amountMinor: number;
  /** Lowercase ISO 4217 code. */
  currency: string;
};

/** A payout was created in a run: the `payout.scheduled` delivery body. */
export type PayoutScheduledEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "payout.scheduled";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: PayoutScheduledEventData;
};

/** `data` of a `payout.submitted` event: The payout provider accepted the payout and settles it asynchronously; `payout.sent` or `payout.failed` follows. */
export type PayoutSubmittedEventData = {
  payoutId: string;
  partnerId: string;
  /** Integer minor units (cents). */
  amountMinor: number;
  /** Lowercase ISO 4217 code. */
  currency: string;
};

/** A payout was submitted to the provider: the `payout.submitted` delivery body. */
export type PayoutSubmittedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "payout.submitted";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: PayoutSubmittedEventData;
};

/** `data` of a `payout.sent` event: The money left: the provider confirmed the payout (at once, or later through its settlement webhook). */
export type PayoutSentEventData = {
  payoutId: string;
  partnerId: string;
  /** Integer minor units (cents). */
  amountMinor: number;
  /** Lowercase ISO 4217 code. */
  currency: string;
};

/** A payout was paid: the `payout.sent` delivery body. */
export type PayoutSentEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "payout.sent";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: PayoutSentEventData;
};

/** `data` of a `payout.failed` event: The provider refused or failed the payout; `reason` is its message. The lines go back to the partner's approved balance. */
export type PayoutFailedEventData = {
  payoutId: string;
  partnerId: string;
  reason: string;
};

/** A payout failed: the `payout.failed` delivery body. */
export type PayoutFailedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "payout.failed";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: PayoutFailedEventData;
};

/** `data` of a `payout.cancelled` event: One per payout when an unexecuted payout run is cancelled. */
export type PayoutCancelledEventData = {
  payoutId: string;
  partnerId: string;
};

/** A payout was cancelled: the `payout.cancelled` delivery body. */
export type PayoutCancelledEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "payout.cancelled";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: PayoutCancelledEventData;
};

/** `data` of a `tax.form_delivered` event: A filed 1099-NEC was accepted and delivered; `emailed` says whether the filing provider also emailed it. */
export type TaxFormDeliveredEventData = {
  documentId: string;
  partnerId: string;
  taxYear: number;
  form: "1099-nec";
  corrected: boolean;
  emailed: boolean;
};

/** A tax form was delivered to a partner: the `tax.form_delivered` delivery body. */
export type TaxFormDeliveredEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "tax.form_delivered";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: TaxFormDeliveredEventData;
};

/** `data` of a `referee_reward.earned` event: The friend's side of a double-sided program: the referred customer's reward was issued. */
export type RefereeRewardEarnedEventData = {
  rewardId: string;
  referralId: string;
  programId: string;
  customerRef: string;
  customerExternalRef: string | null;
  kind: "store_credit" | "coupon" | "gift_card";
  /** Integer minor units (cents). */
  amountMinor: number;
  /** Lowercase ISO 4217 code. */
  currency: string;
  code: string | null;
  billingEventId: string | null;
  commissionId: string | null;
};

/** A referred customer earned their reward: the `referee_reward.earned` delivery body. */
export type RefereeRewardEarnedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "referee_reward.earned";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: RefereeRewardEarnedEventData;
};

/** `data` of a `credit.redeemed` event: From `POST /v1/rewards/{id}/redeem` or `POST /v1/rewards/redeem-by-code`. `amountMinor` is what this redemption used (capped at the balance); a repeated `externalId` does not fire again. */
export type CreditRedeemedEventData = {
  grantId: string;
  rewardId: string;
  /** Integer minor units (cents). */
  amountMinor: number;
  /** What is left on the grant afterwards. */
  remainingMinor: number;
};

/** A referee reward was redeemed: the `credit.redeemed` delivery body. */
export type CreditRedeemedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "credit.redeemed";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: CreditRedeemedEventData;
};

/** `data` of a `billing_event.recorded` event: Fires once per newly recorded billing event from any connection, never for duplicates. */
export type BillingEventRecordedEventData = {
  billingEventId: string;
  type: string;
  customerRef: string;
  /** Lowercase ISO 4217 code. */
  currency: string;
  /** Integer minor units (cents). */
  amountMinor: number;
};

/** A billing event was recorded: the `billing_event.recorded` delivery body. */
export type BillingEventRecordedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "billing_event.recorded";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: BillingEventRecordedEventData;
};

/** `data` of a `roi.payback_reached` event: Once per credit grant, the first time its recipient's profit after it covered its cost. A later refund that un-pays it doesn't fire it again. */
export type RoiPaybackReachedEventData = {
  grantId: string;
  /** Whole days from the grant until it paid back. */
  paybackDays: number;
  /** Profit after minus cost, when it paid back. */
  netMinor: number;
  /** Lowercase ISO 4217 code. */
  currency: string;
};

/** A credit grant paid back: the `roi.payback_reached` delivery body. */
export type RoiPaybackReachedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "roi.payback_reached";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: RoiPaybackReachedEventData;
};

/** `data` of a `roi.pattern_detected` event: A daily summary, at most once per pattern per day, only when the set of matching subjects changed and `count` is above zero. Read the full list from `GET /v1/roi/patterns/{pattern}`. */
export type RoiPatternDetectedEventData = {
  pattern: "credit_only" | "churn_at_exhaustion" | "bonus_collector" | "negative_partner";
  /** Subjects matching today. */
  count: number;
  /** Of those, how many were not in the pattern's last report. */
  newCount: number;
  /** Up to 10 ids: credit grant ids for the first two patterns, partner ids for the others. */
  sample: Array<string>;
};

/** A value pattern changed: the `roi.pattern_detected` delivery body. */
export type RoiPatternDetectedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "roi.pattern_detected";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: RoiPatternDetectedEventData;
};

/** `data` of a `fraud.case_opened` event: A case is waiting in the queue. `kind` is `self_referral`, `quality`, `ring`, `identity_risk` or `value_pattern`; the other fields depend on it (`partnerId`, `referralId`, ring `members`, identity-risk `reasons`, value `pattern`). A self-referral rejected by policy has `referralId: null` and `rejected: true`. */
export type FraudCaseOpenedEventData = {
  caseId: string;
  kind: "self_referral" | "quality" | "ring" | "identity_risk" | "value_pattern";
  partnerId?: string | null;
  referralId?: string | null;
  members?: Array<string>;
  reasons?: Array<string>;
  pattern?: string;
  rejected?: boolean;
};

/** A fraud case was opened: the `fraud.case_opened` delivery body. */
export type FraudCaseOpenedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "fraud.case_opened";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: FraudCaseOpenedEventData;
};

/** `data` of a `deal.submitted` event: A B2B deal waiting for the merchant to approve. */
export type DealSubmittedEventData = {
  dealId: string;
  partnerId: string;
  company: string;
};

/** A partner registered a deal: the `deal.submitted` delivery body. */
export type DealSubmittedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "deal.submitted";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: DealSubmittedEventData;
};

/** `data` of a `dispute.resolved` event: The merchant resolved a partner's dispute with the `resolution` note. */
export type DisputeResolvedEventData = {
  disputeId: string;
  resolution: string;
};

/** A partner dispute was resolved: the `dispute.resolved` delivery body. */
export type DisputeResolvedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "dispute.resolved";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: DisputeResolvedEventData;
};

/** `data` of a `privacy.request_completed` event: An access or erasure request opened with `POST /v1/privacy/requests` completed or failed; `found` is present when completed. */
export type PrivacyRequestCompletedEventData = {
  requestId: string;
  type: "access" | "erasure";
  status: "completed" | "failed";
  found?: boolean;
};

/** A data-subject request finished: the `privacy.request_completed` delivery body. */
export type PrivacyRequestCompletedEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "privacy.request_completed";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: PrivacyRequestCompletedEventData;
};

/** `data` of a `webhook_endpoint.disabled` event: Sent to your other active endpoints when one is disabled after every delivery failed for 5 days. */
export type WebhookEndpointDisabledEventData = {
  endpointId: string;
  url: string;
  reason: string;
  lastStatusCode: number | null;
  days: number;
};

/** A failing webhook endpoint was disabled: the `webhook_endpoint.disabled` delivery body. */
export type WebhookEndpointDisabledEvent = {
  /** The event id (`evt_…`); the same event delivered to several endpoints has the same id. */
  id: string;
  topic: "webhook_endpoint.disabled";
  orgId: string;
  /** false for events from test mode. */
  livemode: boolean;
  createdAt: string;
  data: WebhookEndpointDisabledEventData;
};

export type PostTOrgTokenVisitResponse = {
  ok: true;
  clickId: string | null;
};

export type GetTOrgTokenCodesCodeResponse = {
  valid: true;
  /** First name only. */
  partnerDisplayName: string;
  refereeReward: {
    kind: string;
    bps?: number;
    /** Integer minor units (cents). */
    amountMinor?: number;
    /** Integer minor units (cents). */
    capMinor?: number;
    currency: string;
    on: string;
  } | null;
};

export type GetTOrgTokenWidgetMeResponse = {
  program: {
    id: string;
    name: string;
  };
  partner: {
    displayName: string;
  };
  code: string | null;
  coupon: string | null;
  link: string | null;
  share: {
    x: string;
    facebook: string;
    linkedin: string;
    whatsapp: string;
    email: string;
  } | null;
  progress: {
    clicks: number;
    signups: number;
    payingCustomers: number;
  };
  earnings: Array<{
    currency: string;
    /** Integer minor units (cents). */
    pending: number;
    /** Integer minor units (cents). */
    approved: number;
    /** Integer minor units (cents). */
    paid: number;
  }>;
  refereeReward: {
    kind: string;
    bps?: number;
    /** Integer minor units (cents). */
    amountMinor?: number;
    /** Integer minor units (cents). */
    capMinor?: number;
    currency: string;
    on: string;
  } | null;
};

export type GetTOrgTokenMobileResolveResponse = {
  matched: boolean;
  clickId?: string;
  code?: string;
  destination?: string;
  programId?: string;
  /** How the click was matched, strongest first: the exact user agent, the device hint on the same network, or the exact IP alone. */
  matchType?: "user_agent" | "device" | "ip";
};

export type PostTOrgTokenMobileInstallResponse = {
  attributed: boolean;
  referralId: string | null;
  partnerId: string | null;
  programId: string;
};

export type GetWellKnownAppleAppSiteAssociationResponse = {
  applinks: {
    details: Array<{
      appIDs: Array<string>;
      components: Array<{
        "/": string;
      }>;
    }>;
  };
};

export type GetWellKnownAssetlinksJsonResponse = Array<{
  relation: Array<string>;
  target: {
    namespace: "android_app";
    package_name: string;
    sha256_cert_fingerprints: Array<string>;
  };
}>;

export type PostAgentsRegisterResponse = {
  agentId: string;
  wallet: string;
  instantPayout: boolean;
};

export type PostTOrgTokenAgentAttributeResponse = {
  attributed: true;
  referralId: string;
  agentWallet: string;
};

export type PostTOrgTokenAgentNegotiateResponse = {
  decision: "accept" | "counter" | "reject";
  rateBps?: number;
  counterBps?: number | null;
  partnerId?: string;
  reason: string;
};

export type PostTOrgTokenConsentResponse = {
  ok: true;
  customerRef: string;
  granted: boolean;
};

export type GetVersionsResponse = {
  latest: string;
  versions: Array<{
    version: string;
    released: string;
    changes: Array<string>;
  }>;
  deprecationPolicy: string;
};

export type GetAuthProvidersResponse = {
  providers: Array<"instance" | "atlasid">;
  details: Array<{
    id: "instance" | "atlasid";
    /** The provider, for the sign-in button. */
    name: string;
    /** Atlas, which has its own branded one-click button. */
    atlas: boolean;
  }>;
};

export type PostAuthLogoutResponse = {
  ok: true;
  logoutUrl: string | null;
};

export type PostOrgsResponse = {
  orgId: string;
};

export type GetMeResponse = {
  user: ({
    id: string;
    email: string;
    name: string | null;
    emailVerified: boolean;
  }) | null;
  memberships: Array<{
    orgId: string;
    role: string;
    roiDigest?: boolean;
  }>;
  /** Set when called with an API key (user is then null). */
  apiKey?: {
    id: string;
    name: string;
    prefix: string;
    scopes: Array<string>;
    /** The API version this key is pinned to (what it gets without a Referalli-Version header). */
    apiVersion: string | null;
    livemode: boolean;
    publishable: boolean;
    owner: string | null;
    expiresAt: string | null;
  };
  org?: {
    id: string;
    name: string;
  };
};

export type GetHostsCurrentResponse = {
  /** A merchant's verified partner-portal domain. */
  kind: "portal";
  orgId: string;
  orgName: string;
  branding: {
    logoUrl: string;
    theme: Record<string, string>;
  };
  /** The org's active programs with a public signup page (/join/:handle). */
  programs: Array<{
    handle: string;
    name: string;
  }>;
} | {
  /** A merchant's verified link domain. */
  kind: "link";
} | {
  /** Referalli's own app. */
  kind: "app";
};

export type PostMobilePurchasesResponse = {
  conversions: number;
  linesCreated: number;
  reversals: number;
};

export type PatchOrgResponse = {
  id: string;
  name: string;
  plan: string;
  settings: GetOpenapiJsonResponse;
  payout_kyc_required: boolean;
};

export type GetOrgMembersResponse = {
  object: "list";
  data: Array<Member>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PostOrgMembersResponse = {
  userId: string;
  role: string;
};

export type PatchOrgMembersUserIdResponse = {
  userId: string;
  role: string;
};

export type PutOrgPayoutScheduleResponse = {
  dayOfMonth?: number | null;
  schedule?: PayoutSchedule | null;
  nextRunDate?: string | null;
};

export type GetOrgPayoutScheduleResponse = {
  schedule: PayoutSchedule | null;
  nextRunDate: string | null;
  programs: Array<{
    programId: string;
    name: string;
    override: (PayoutSchedule | {
      kind: "off";
    }) | null;
    nextRunDate: string | null;
  }>;
};

export type PutProgramsIdPayoutScheduleResponse = {
  programId: string;
  schedule: (PayoutSchedule | {
    kind: "off";
  }) | null;
  nextRunDate: string | null;
};

export type PutPartnersIdVatResponse = {
  vatId: string | null;
  vatCountry: string | null;
  vatVerifiedAt: string | null;
  selfBillingAcceptedAt: string | null;
  selfBillingVersion: string | null;
};

export type GetPartnerOrgsOrgIdSelfBillingResponse = {
  vatId: string | null;
  vatCountry: string | null;
  vatVerifiedAt: string | null;
  selfBillingAcceptedAt: string | null;
  selfBillingVersion: string | null;
  currentVersion: string;
};

export type PostPartnerOrgsOrgIdSelfBillingResponse = {
  vatId: string | null;
  vatCountry: string | null;
  vatVerifiedAt: string | null;
  selfBillingAcceptedAt: string | null;
  selfBillingVersion: string | null;
  currentVersion: string;
};

export type PutOrgTaxFilingResponse = {
  provider: "test" | "tax1099";
  connected: boolean;
};

export type GetTax1099FilingsResponse = {
  object: "list";
  data: Array<{
    id: string;
    taxYear: number;
    kind: "original" | "correction";
    provider: string;
    providerFilingId: string | null;
    status: "submitting" | "submitted" | "accepted" | "rejected";
    recipientCount: number;
    /** Integer minor units (cents). */
    totalMinor: number;
    error: string | null;
    documents: Array<{
      id: string;
      partnerId: string;
      /** Integer minor units (cents). */
      amountMinor: number;
      status: string;
      [key: string]: unknown;
    }>;
    createdAt: string;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PostTax1099FilingsIdRefreshResponse = {
  id: string;
  status: "submitting" | "submitted" | "accepted" | "rejected";
};

export type GetPartnerTaxDocumentsResponse = {
  object: "list";
  data: Array<{
    id: string;
    partnerId: string;
    taxYear: number;
    form: string;
    /** Integer minor units (cents). */
    amountMinor: number;
    status: "pending" | "filed" | "accepted" | "rejected" | "delivered";
    correctionOf: string | null;
    deliveredAt: string | null;
    createdAt: string;
    orgId: string;
    orgName: string;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetStatusResponse = {
  state: "operational" | "degraded" | "major_outage";
  components: Array<{
    id: string;
    state: "operational" | "degraded" | "major_outage";
    detail: Record<string, unknown>;
  }>;
  openIncidents: Array<Incident>;
  checkedAt: string;
};

export type GetStatusIncidentsResponse = {
  object: "list";
  data: Array<Incident>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetOrgReferralParamsResponse = {
  /** Always read: via, ref, aff. */
  builtIn: Array<string>;
  params: Array<string>;
};

export type GetProgramsResponse = {
  object: "list";
  data: Array<Program>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetProgramsIdEnrollmentsResponse = {
  object: "list";
  data: Array<{
    id: string;
    partnerId: string;
    partnerEmail: string;
    partnerName: string;
    status: string;
    createdAt: string;
    networkWarning: NetworkWarning;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PostProgramsIdEnrollmentsEnrollmentIdApproveResponse = {
  id: string;
  status: "approved";
};

export type PostProgramsIdEnrollmentsEnrollmentIdRejectResponse = {
  id: string;
  status: "rejected";
};

export type GetPartnersResponse = {
  object: "list";
  data: Array<Partner>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetPartnersIdResponse = Partner & {
  networkWarning: NetworkWarning;
};

export type GetPartnersIdEnrollmentsResponse = {
  object: "list";
  data: Array<{
    id: string;
    programId: string;
    programName: string;
    status: string;
    groupId: string | null;
    createdAt: string;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetProgramsIdGraphResponse = GraphPartner & {
  depth: number;
  truncated: boolean;
};

export type PostApiKeysResponse = IssuedApiKey | {
  pairId: string;
  live: IssuedApiKey;
  test: IssuedApiKey;
};

export type GetApiKeysResponse = {
  object: "list";
  data: Array<ApiKey>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PatchApiKeysIdResponse = {
  id: string;
  apiVersion: string;
  owner: string | null;
  expiresAt: string | null;
};

export type DeleteApiKeysIdResponse = {
  ok: true;
  revoked: Array<string>;
};

export type GetAuditLogsResponse = {
  object: "list";
  data: Array<AuditLogEntry>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetTestClockResponse = {
  now: string;
  /** How far the test clock is ahead of real time. */
  offsetSeconds: number;
};

export type PostTestClockAdvanceResponse = {
  now: string;
  offsetSeconds: number;
  /** Held commission lines approved because their hold ended. */
  approved: number;
  /** Scheduled payout runs that fell due and ran. */
  payoutRuns: number;
};

export type GetTestEmailsResponse = {
  object: "list";
  data: Array<{
    id: string;
    event: string;
    to: string;
    subject: string;
    text: string;
    html: string;
    createdAt: string;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PostCliDeviceCodesResponse = {
  /** Secret: the CLI polls with it. */
  deviceCode: string;
  userCode: string;
  verificationUri: string;
  verificationUriComplete: string;
  expiresIn: number;
  interval: number;
};

export type PostCliDeviceCodesTokenResponse = {
  status: "pending" | "approved" | "denied" | "expired" | "consumed";
  /** The issued API key, returned once when approved. */
  key?: string;
  orgId?: string;
  orgName?: string;
  scopes?: Array<string>;
};

export type GetCliDeviceCodesUserCodeResponse = {
  userCode: string;
  clientName: string | null;
  createdAt: string;
  expiresAt: string;
};

export type PostCliDeviceCodesUserCodeApproveResponse = {
  ok: true;
  keyId: string;
  scopes: Array<string>;
};

export type PostCliListenersResponse = {
  id: string;
  /** Signs forwarded events (Standard Webhooks); shown once. */
  secret: string;
  topics: Array<string>;
  idleTimeoutSec: number;
};

export type GetCliListenersIdEventsResponse = {
  events: Array<{
    id: string;
    eventId: string;
    topic: string;
    /** The exact bytes to forward. */
    body: string;
    headers: Record<string, string>;
  }>;
};

export type PostCliTriggerResponse = {
  eventId: string;
  topic: string;
  payload: GetOpenapiJsonResponse;
  deliveredTo: {
    listeners: number;
    endpoints: number;
  };
};

export type GetCliTopicsResponse = {
  topics: Array<string>;
};

export type GetCliLogsResponse = {
  entries: Array<{
    seq: number;
    requestId: string;
    method: string;
    path: string;
    status: number;
    latencyMs: number;
    actorType: string;
    actorId: string | null;
    ts: string;
  }>;
  cursor: number;
};

export type GetLinksResponse = {
  object: "list";
  data: Array<Link>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PostCouponsResponse = {
  id: string;
  code: string;
};

export type GetCouponsResponse = {
  object: "list";
  data: Array<Coupon>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PostWidgetTokensResponse = {
  token: string;
  partnerId: string;
  expiresAt: string;
};

export type GetReferralsResponse = {
  object: "list";
  data: Array<Referral>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetReferralsIdJourneyResponse = {
  id: string;
  programId: string;
  partnerId: string;
  customerRef: string;
  source: string;
  matchedVia: string;
  confidence: number;
  clickId: string | null;
  linkId: string | null;
  status: "active" | "pending_review" | "paused" | "void";
  ts: string;
  windowExpiresAt: string;
  touchCredits: Array<{
    partnerId: string;
    weight: number;
    clickId: string | null;
  }>;
  reasoning: AttributionReasoning;
  touchpoints: Array<{
    clickId: string;
    ts: string;
    url: string | null;
    linkId: string | null;
    fraudScore: number;
    eligible: boolean;
    weight: number;
    winner: boolean;
  }>;
};

export type PostAttributionReplayResponse = {
  recomputed: number;
  changed: number;
};

export type PostTrackEventsResponse = {
  clickId?: string;
  eventId?: string;
  event?: string;
  recorded?: boolean;
  referralId?: string | null;
  duplicate?: boolean;
  commissionId?: string | null;
  /** Integer minor units (cents). */
  amountMinor?: number;
  currency?: string | null;
};

export type PostCommissionRulesResponse = {
  id: string;
  programId: string;
  version: number;
  config: GetOpenapiJsonResponse;
};

export type GetCommissionRulesResponse = {
  object: "list";
  data: Array<CommissionRule>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetCommissionsResponse = {
  object: "list";
  data: Array<CommissionEvent>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetPartnersIdBalancesResponse = {
  object: "list";
  data: Array<Balance>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PostCommissionsApproveDueResponse = {
  approved: number;
};

export type PostCommissionsIdAdjustResponse = {
  id: string;
};

export type PutBillingConnectionsIdSecretResponse = {
  id: string;
  provider: string;
  ok: true;
};

export type PutBillingConnectionsIdCredentialsResponse = {
  id: string;
  provider: string;
  ok: true;
};

export type GetBillingConnectionsResponse = {
  object: "list";
  data: Array<BillingConnection>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PutBillingConnectionsIdValueMappingResponse = {
  id: string;
  valueMapping: ValueMapping;
};

export type PostBillingConnectionsIdRotateSecretResponse = {
  id: string;
  provider: string;
  /** Returned only here. The previous secret keeps verifying until previousSecretExpiresAt. */
  webhookSecret: string;
  previousSecretExpiresAt: string;
};

export type GetBillingEventsResponse = {
  object: "list";
  data: Array<BillingEvent>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PutPartnersIdPayoutProfileResponse = {
  id: string;
};

export type PatchPartnersIdPayoutProfileResponse = {
  partnerId: string;
  method: string;
  payoutCurrency: string;
  /** Integer minor units (cents). */
  minThresholdMinor: number;
};

export type PostPayoutRunsIdExecuteResponse = {
  sent: number;
  submitted: number;
  failed: number;
};

export type PostPayoutRunsIdCancelResponse = {
  cancelled: number;
};

export type GetPayoutRunsResponse = {
  object: "list";
  data: Array<PayoutRun>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetPayoutsResponse = {
  object: "list";
  data: Array<Payout>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetTax1099Response = {
  object: "list";
  data: Array<{
    partnerId: string;
    taxFormType: string;
    /** Integer minor units (cents). */
    totalPaidUsdMinor: number;
    requiresForm: boolean;
    fxMissingCurrencies: Array<string>;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetFxRatesResponse = {
  object: "list";
  data: Array<FxRate>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetOrgFxFeedResponse = {
  enabled: boolean;
  source: "ecb";
  lastRateDate: string | null;
};

export type PutOrgFxFeedResponse = {
  enabled: boolean;
  source: "ecb";
  synced: number;
};

export type PostFxRatesSyncResponse = {
  orgId: string;
  date: string | null;
  inserted: number;
};

export type PostFxRatesClearOverrideResponse = {
  base: string;
  quote: string;
  cleared: number;
};

export type GetPayoutConnectionsResponse = {
  object: "list";
  data: Array<{
    provider: string;
    env: string;
    status: string;
    connectedAt: string;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PutPayoutConnectionsProviderResponse = {
  provider: string;
  env: string;
  status: "active";
};

export type DeletePayoutConnectionsProviderResponse = {
  provider: string;
  removed: true;
};

export type PostFraudInvalidTrafficScanResponse = {
  window: string;
  partners: Array<{
    partnerId: string;
    clicks: number;
    probability: number;
    label: "clean" | "suspicious" | "invalid";
    contributions: Record<string, number>;
  }>;
  flagged: number;
};

export type GetFraudCasesResponse = {
  object: "list";
  data: Array<FraudCase>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetPartnersIdQualityResponse = {
  partnerId: string;
  live: {
    score: number;
    metrics: {
      customers: number;
      repeatPayerRate: number;
      refundRate: number;
      disputeRate: number;
      trialToPaidRate: number;
      identityRiskRate?: number;
      valuePatternPenalty?: number;
    };
  };
  lastSnapshot: {
    score: number;
    metrics: GetOpenapiJsonResponse;
    computedAt: string;
  } | null;
};

export type PostQualityRecomputeResponse = {
  partners: number;
  casesOpened: number;
  suspended: number;
};

export type PostFraudDetectRingsResponse = {
  ringsFound: number;
};

export type GetReportsFilteredClicksResponse = {
  object: "list";
  data: Array<{
    day: string;
    filtered: number;
    total: number;
    avgScore: number;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetAnalyticsOverviewResponse = {
  clicks: number;
  filteredClicks: number;
  visitors: number;
  signups: number;
  payments: number;
  /** Integer minor units (cents). */
  revenueMinor: number;
  /** Integer minor units (cents). */
  commissionEarnedMinor: number;
  /** Integer minor units (cents). */
  commissionReversedMinor: number;
  activePartners: number;
  funnel: {
    clickToSignup: number;
    signupToPaid: number;
  };
};

export type GetAnalyticsTimeseriesResponse = {
  object: "list";
  data: Array<{
    day: string;
    value: number;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetAnalyticsCohortLtvResponse = {
  object: "list";
  data: Array<{
    cohort: string;
    customers: number;
    /** Integer minor units (cents). */
    revenueMinor: number;
    /** Integer minor units (cents). */
    ltvMinor: number;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetAnalyticsByGeoResponse = {
  object: "list";
  data: Array<{
    geo: string;
    referrals: number;
    /** Integer minor units (cents). */
    revenueMinor: number;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetAnalyticsByChannelResponse = {
  object: "list";
  data: Array<{
    channel: string;
    referrals: number;
    /** Integer minor units (cents). */
    revenueMinor: number;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetAnalyticsCouponPerformanceResponse = {
  object: "list";
  data: Array<{
    code: string;
    partnerId: string;
    referrals: number;
    /** Integer minor units (cents). */
    revenueMinor: number;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetReportsPartnerPerformanceResponse = Array<{
  partnerId: string;
  displayName: string;
  email: string;
  status: string;
  clicks: number;
  referrals: number;
  payments: number;
  /** Integer minor units (cents). */
  revenueMinor: number;
  /** Integer minor units (cents). */
  earnedMinor: number;
  /** Integer minor units (cents). */
  reversedMinor: number;
}>;

export type GetProfitabilitySettingsResponse = {
  reportingCurrency: string;
  defaultMarginBps: number | null;
  creditCostModel: "face" | "margin" | "fixed_ratio";
  creditCostRatioBps?: number;
  inference: "fifo_next_payments" | "report_only" | "on_grant";
  creditDraw: "grants_first" | "pro_rata";
  windowDays: 30 | 90 | 180 | 365 | 0;
  churnWindowDays: number;
  countReferrerSpend: boolean;
  costToServeMinorPerMonth?: number;
  taxFeesReduceProfit: boolean;
  valuePatternWeight: number;
  /** Target ROI as a multiple in bps (20000 = 2.0x); unset or null = no target. */
  targetRoiBps?: number | null;
};

export type GetProfitabilityProductsResponse = {
  data: Array<GetProfitabilityProductsProductRefResponse>;
};

export type GetProfitabilityProductsProductRefResponse = {
  productRef: string;
  marginBps: number | null;
  unitCostMinor: number | null;
  currency: string;
  updatedAt: string;
};

export type PostProfitabilityRebuildResponse = {
  jobId: string;
};

export type GetProfitabilityRebuildJobIdResponse = {
  status: "queued" | "running" | "done" | "failed";
  processed: number;
  total: number;
  error?: string;
};

export type GetRoiBreakdownResponse = {
  object: "list";
  data: Array<{
    currency: string;
    /** Integer minor units (cents). */
    creditCostMinor: number;
    /** Integer minor units (cents). */
    cashAfterMinor: number;
    profitAfterMinor: number | null;
    netMinor: number | null;
    /** Profit after ÷ cost, 4 decimals; null with no cost or unknown profit. */
    roi: number | null;
    /** Basis points (10000 = 100%); null when there is nothing to divide by. */
    paidBackShareBps: number | null;
    medianPaybackDays: number | null;
    grants: number;
    profitSources: Record<string, number>;
    coverage: {
      /** Basis points (10000 = 100%); null when there is nothing to divide by. */
      creditAppliedReportedBps: number | null;
      /** Basis points (10000 = 100%); null when there is nothing to divide by. */
      marginCoveredBps: number | null;
      /** Basis points (10000 = 100%); null when there is nothing to divide by. */
      inferredShareBps: number | null;
    };
    /** Face not yet used, expired or revoked, in the reporting currency. */
    outstandingCreditMinor: number;
    /** Outstanding credit priced by each grant's cost model; null when a model needs a margin and none is known. */
    outstandingCostIfUsedMinor: number | null;
    key: string;
    label: string;
    /** Partner and program rows: their referrals, both sides, commissions included. */
    referrals?: {
      count: number;
      /** Integer minor units (cents). */
      costMinor: number;
      /** Integer minor units (cents). */
      cashCommissionMinor: number;
      netMinor: number | null;
      /** Profit after ÷ cost, 4 decimals; null with no cost or unknown profit. */
      roi: number | null;
    };
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetRoiGrantsResponse = {
  object: "list";
  data: Array<RoiGrant>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetRoiPatternsResponse = {
  patterns: {
    credit_only: Array<RoiPatternEntry>;
    churn_at_exhaustion: Array<RoiPatternEntry>;
    bonus_collector: Array<RoiPatternEntry>;
    negative_partner: Array<RoiPatternEntry>;
  };
};

export type GetRoiPatternsPatternResponse = {
  object: "list";
  data: Array<RoiPatternEntry>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetRoiDataQualityResponse = {
  paymentsTotal: number;
  paymentsWithCreditInfo: number;
  productsWithMargin: number;
  productsSeen: number;
  partnersLinked: number;
  partnersTotal: number;
  excludedForFx: number;
  gaps: Array<{
    code: "margin_missing" | "credit_applied_unreported" | "partners_unlinked" | "fx_rate_missing";
    count: number;
    fix: {
      text: string;
      href: string;
    };
  }>;
};

export type PostValueEventsResponse = {
  results: Array<{
    index: number;
    id: string;
    created: boolean;
    superseded: Array<string>;
  }>;
  errors: Array<{
    index: number;
    message: string;
  }>;
};

export type PostValueImportResponse = {
  rows: Array<Record<string, unknown>>;
  errors: Array<{
    row: number;
    error: string;
  }>;
  total: number;
} | {
  recorded: number;
  duplicates: number;
  errors: Array<{
    row: number;
    error: string;
  }>;
} | {
  /** Status 202: the file is recorded in the background; poll GET /v1/value/import/{jobId}. */
  jobId: string;
};

export type GetValueImportJobIdResponse = {
  status: "queued" | "running" | "done" | "failed";
  /** Parsed rows handed to recording so far. */
  processed: number;
  /** Parsed rows to record (rows that failed to parse are only in errors). */
  total: number;
  recorded: number;
  duplicates: number;
  /** Parse and record errors so far, by spreadsheet row (header is row 1). */
  errors: Array<{
    row: number;
    error: string;
  }>;
  /** Why the job failed ('stale': its process stopped). */
  error?: string;
};

export type GetPartnerKycStatusResponse = {
  kycStatus: string;
  sanctionsStatus: string;
  verifiedAt: string | null;
};

export type PostPartnerKycSubmitResponse = {
  kycStatus: "verified" | "pending" | "rejected";
  sanctionsStatus: "clear" | "flagged";
};

export type GetPartnerMeResponse = {
  account?: {
    id: string;
    email: string;
    name: string | null;
  };
  memberships: Array<{
    orgId: string;
    orgName: string;
    partnerId: string;
    programs: Array<{
      programId: string;
      name: string;
      slug: string;
      enrollmentId: string;
      enrollmentStatus: string;
    }>;
  }>;
};

export type GetPartnerStatsResponse = {
  object: "list";
  data: Array<{
    orgId: string;
    partnerId: string;
    clicks: number;
    referrals: number;
    payments: number;
    balances: Array<Balance>;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetPartnerLinksResponse = {
  object: "list";
  data: Array<{
    id: string;
    orgId: string;
    programId: string;
    code: string;
    destinationUrl: string;
    shortPath: string;
    /** Absolute link, on the merchant's verified link domain when it has one. */
    shortUrl: string;
    directParam: string;
    clicks: number;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetPartnerAssetsResponse = {
  object: "list";
  data: Array<{
    id: string;
    orgId: string;
    orgName: string;
    programId: string;
    programName: string;
    kind: string;
    title: string;
    content: string;
    dimensions: string;
    createdAt: string;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetPartnerDisputesResponse = {
  object: "list";
  data: Array<{
    id: string;
    orgId: string;
    orgName: string;
    referralId: string | null;
    kind: string;
    status: string;
    detail: string;
    resolution: string | null;
    createdAt: string;
    resolvedAt: string | null;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetPartnerReferralsResponse = {
  object: "list";
  data: Array<{
    id: string;
    orgId: string;
    programId: string;
    /** Redacted to the last 4 characters. */
    customer: string;
    status: string;
    matchedVia: string;
    ts: string;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetPartnerReferralsIdTransparencyResponse = {
  referralId: string;
  status: string;
  matchedVia: string;
  confidence: number;
  model: string | null;
  windowDays: number | null;
  consideredTouchpoints: number;
  yourCreditWeight: number;
  notes: Array<string>;
  noteCodes: Array<ReasonNote>;
};

export type GetPartnerPayoutsResponse = {
  object: "list";
  data: Array<{
    id: string;
    orgId: string;
    /** Integer minor units (cents). */
    amountMinor: number;
    currency: string;
    status: string;
    rail: string;
    sentAt: string | null;
    createdAt: string;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PutPartnerOrgsOrgIdPayoutProfileResponse = {
  id: string;
};

export type GetPartnerProgramsProgramIdLeaderboardResponse = {
  contest: ({
    startsAt: string;
    endsAt: string;
    prize: string | null;
  }) | null;
  rows: Array<{
    rank: number;
    name: string;
    /** Integer minor units (cents). */
    approvedMinor: number;
    you: boolean;
  }>;
};

export type PostPartnerProgramsProgramIdApplyResponse = {
  enrollmentId: string;
  status: "applied";
};

export type PostWebhookEndpointsResponse = {
  id: string;
  url: string;
  topics: Array<string>;
  programIds: Array<string> | null;
  legacySignature: boolean;
  /** Returned only here. whsec_ + base64 key (Standard Webhooks). */
  secret: string;
};

export type GetWebhookEndpointsResponse = {
  object: "list";
  data: Array<WebhookEndpoint>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PostWebhookEndpointsIdRotateSecretResponse = {
  id: string;
  /** The new secret, shown once. The old one keeps signing until previousSecretExpiresAt. */
  secret: string;
  previousSecretExpiresAt: string;
};

export type GetWebhookDeliveriesResponse = {
  object: "list";
  data: Array<WebhookDelivery>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetWebhookEndpointsIdDeliveriesResponse = {
  object: "list";
  data: Array<WebhookDelivery>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetWebhookDeliveriesIdResponse = WebhookDelivery & ({
  eventId: string;
  /** Exactly what was sent (the delivery body). */
  payload: GetOpenapiJsonResponse;
  /** The start of the endpoint's last response (up to 2,000 characters). */
  lastResponseBody: string | null;
  /** The network error of the last attempt, when there was no response. */
  lastError: string | null;
});

export type PostSandboxSimulateResponse = {
  customerRef: string;
  events: number;
  conversions: number;
  linesCreated: number;
  reversals: number;
};

export type PostImportProviderResponse = {
  partnersCreated: number;
  partnersSkipped: number;
  linksCreated: number;
  couponsCreated: number;
  /** Codes another partner in this org already uses. */
  codesSkipped: Array<string>;
  /** The old tool's link parameter, now read by aff.js. */
  referralParams: Array<string>;
  /** Integer minor units (cents). */
  unpaidImportedMinor: number;
  /** Integer minor units (cents). */
  paidImportedMinor: number;
};

export type GetOpenapiJsonResponse = Record<string, unknown>;

export type GetBrandingResponse = {
  logoUrl: string | null;
  theme: GetOpenapiJsonResponse | null;
  portalDomain: string | null;
  portalDomainVerified: boolean;
  /** none; pending (waiting for DNS); provisioning (routed here, certificate being issued); active (links/portal served on it). */
  portalDomainStatus: "none" | "pending" | "provisioning" | "active";
  linkDomain: string | null;
  linkDomainVerified: boolean;
  /** none; pending (waiting for DNS); provisioning (routed here, certificate being issued); active (links/portal served on it). */
  linkDomainStatus: "none" | "pending" | "provisioning" | "active";
  emailFrom: string | null;
};

export type PostBrandingLinkDomainResponse = {
  domain: string;
  cnameTarget: string;
  txtRecord: string;
  txtName: string;
  verified: false;
};

export type PostBrandingLinkDomainVerifyResponse = {
  domain: string;
  verified: boolean;
  status: "provisioning" | "active";
  message?: string;
};

export type PostBrandingDomainResponse = {
  domain: string;
  cnameTarget: string;
  txtRecord: string;
  txtName: string;
  verified: false;
  instructions: string;
};

export type PostEmbedTokensResponse = {
  token: string;
  expiresAt: string;
};

export type GetEmbedSummaryResponse = {
  partner: {
    name: string;
    email: string;
  };
  clicks: number;
  referrals: number;
  balances: Array<{
    currency: string;
    /** Integer minor units (cents). */
    pending: number;
    /** Integer minor units (cents). */
    approved: number;
    /** Integer minor units (cents). */
    paid: number;
  }>;
  links: Array<{
    code: string;
    destinationUrl: string;
  }>;
};

export type PostDiscoverySearchResponse = {
  found: number;
  added: number;
};

export type PostDiscoveryCorpusResponse = {
  received: number;
  added: number;
};

export type GetProspectsResponse = {
  object: "list";
  data: Array<{
    id: string;
    name: string;
    url: string;
    channel: string;
    audienceSize: number;
    evidence: GetOpenapiJsonResponse | null;
    fitScore: number;
    contactEmail: string | null;
    status: string;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PostOutreachDraftResponse = {
  messageIds: Array<string>;
};

export type GetOutreachResponse = {
  object: "list";
  data: Array<{
    id: string;
    prospectId: string;
    step: number;
    subject: string;
    status: string;
    createdAt: string;
    sentAt: string | null;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PostOutreachSendDueResponse = {
  sent: number;
  suppressed: number;
  capped: boolean;
  failed: number;
};

export type PostUnsubscribeTokenResponse = {
  ok: boolean;
};

export type GetAssistantSuggestionsResponse = {
  object: "list";
  data: Array<{
    kind: string;
    message: string;
    suggestedAction: string;
    data: Record<string, string | number>;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetMarketplaceListingResponse = {
  object: "list";
  data: Array<{
    programId: string;
    visibility: string;
    category: string;
    headline: string;
    stats: {
      clicks: number;
      referrals: number;
      /** Integer minor units (cents). */
      epcMinor: number;
      conversionRate: number;
      payoutReliability: number | null;
      approvalLatencyHours: number | null;
    };
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetPartnerMarketplaceResponse = {
  object: "list";
  data: Array<{
    programId: string;
    programName: string;
    merchant: string;
    category: string;
    headline: string;
    sponsored: boolean;
    cookieWindowDays: number;
    commissionSummary: GetOpenapiJsonResponse | null;
    stats: {
      clicks: number;
      referrals: number;
      /** Integer minor units (cents). */
      epcMinor: number;
      conversionRate: number;
      payoutReliability: number | null;
      approvalLatencyHours: number | null;
    };
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetPartnerProfileVerifiedResponse = {
  programs: number;
  clicks: number;
  referrals: number;
  repeatPayerRate: number | null;
  verified: true;
};

export type PostPartnerDisputesResponse = {
  id: string;
  status: "open";
};

export type GetDisputesResponse = {
  object: "list";
  data: Array<{
    id: string;
    partnerId: string;
    partnerEmail: string;
    referralId: string | null;
    kind: string;
    status: string;
    detail: string;
    resolution: string | null;
    createdAt: string;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetCreatorsResponse = {
  object: "list";
  data: Array<CreatorProfile>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PostCreatorsAccountIdInviteResponse = {
  id: string;
  program: string;
};

export type GetInvitationsResponse = {
  object: "list";
  data: Array<{
    id: string;
    creatorName: string | null;
    accountId: string;
    programId: string;
    programName: string;
    status: string;
    message: string;
    createdAt: string;
    respondedAt: string | null;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetPartnerInvitationsResponse = {
  object: "list";
  data: Array<{
    id: string;
    merchant: string;
    orgId: string;
    programId: string;
    programName: string;
    status: string;
    message: string;
    createdAt: string;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetBillingPlanResponse = {
  plan: string;
  planStatus: string;
  periodEnd: string | null;
  limits: GetOpenapiJsonResponse;
  usage: {
    programs: number;
    partners: number;
  };
  catalog: Record<string, GetOpenapiJsonResponse>;
  subscribed: boolean;
  canActivate: boolean;
};

export type PostBillingCheckoutResponse = {
  url?: string;
  sessionId?: string;
};

export type PostBillingPortalResponse = {
  url: string;
};

export type PostBillingActivateResponse = {
  plan: string;
  planStatus: string;
};

export type GetProgramsIdRefereeRewardResponse = {
  refereeReward: GetOpenapiJsonResponse | null;
};

export type PutProgramsIdRefereeRewardResponse = {
  ok: true;
  refereeReward: GetOpenapiJsonResponse | null;
};

export type GetRewardsResponse = {
  object: "list";
  data: Array<{
    id: string;
    programId: string;
    referralId: string;
    customerRef: string;
    kind: string;
    /** Integer minor units (cents). */
    amountMinor: number;
    currency: string;
    code: string | null;
    status: "issued" | "redeemed" | "void";
    createdAt: string;
    redeemedAt: string | null;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetRewardsLookupCodeResponse = {
  valid: boolean;
  rewardId?: string;
  kind?: string;
  /** Integer minor units (cents). */
  amountMinor?: number;
  currency?: string;
  status?: string;
};

export type PostRewardsRedeemByCodeResponse = {
  ok: true;
  rewardId: string;
  grantId: string;
  status: "issued" | "redeemed";
  currency: string;
  /** Integer minor units (cents). */
  requestedMinor: number;
  /** Amount recorded, capped at the remaining balance. */
  redeemedMinor: number;
  /** Integer minor units (cents). */
  remainingMinor: number;
  /** True when the request exceeded the remaining balance. */
  capped: boolean;
};

export type GetProgramsIdGroupsResponse = {
  object: "list";
  data: Array<PartnerGroup>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PutProgramsIdPartnersPartnerIdGroupResponse = {
  partnerId: string;
  programId: string;
  groupId: string | null;
};

export type GetProgramsIdPromotionsResponse = {
  object: "list";
  data: Array<Promotion>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetPartnerGroupsResponse = {
  object: "list";
  data: Array<{
    groupId: string;
    groupName: string;
    orgName: string;
    programId: string;
    programName: string;
    onboardingMessage: string | null;
    onboardingChecklist: Array<string>;
    holdDays: number | null;
    minThresholdMinor: number | null;
    payoutCurrency: string | null;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PostContractsResponse = {
  id: string;
  status: "draft" | "sent";
};

export type GetContractsResponse = {
  object: "list";
  data: Array<{
    id: string;
    programId: string;
    partnerId: string;
    title: string;
    compensation: GetOpenapiJsonResponse;
    status: string;
    createdAt: string;
    respondedAt: string | null;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetPartnerContractsResponse = {
  object: "list";
  data: Array<{
    id: string;
    merchant: string;
    program: string;
    title: string;
    termsMd: string;
    compensation: GetOpenapiJsonResponse;
    status: string;
    createdAt: string;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PutProgramsIdIncrementalityResponse = {
  ok: true;
  holdoutBps: number;
};

export type GetIncrementalityResponse = {
  programId: string;
  holdoutBps: number;
  treatment: {
    referrals: number;
    converted: number;
    rate: number;
  };
  control: {
    referrals: number;
    converted: number;
    rate: number;
  };
  lift: number;
  byPartner: Array<{
    partnerId: string;
    treatmentReferrals: number;
    controlReferrals: number;
    lift: number;
  }>;
};

export type PutProgramsIdAutopricingResponse = {
  ok: true;
  autopricing: GetOpenapiJsonResponse | null;
};

export type GetProgramsIdAutopricingResponse = {
  /** Null when self-pricing is off. Configs stored before objectives existed read as roas / targetRoi 2. */
  autopricing: ({
    enabled: boolean;
    targetRoas: number;
    minBps: number;
    maxBps: number;
    objective: "roas" | "roi";
    targetRoi: number;
  }) | null;
};

export type PostProgramsIdAutopriceRunResponse = {
  objective: "roas" | "roi";
  targetRoas: number;
  /** Objective roi only. */
  targetRoi?: number;
  changes: Array<{
    partnerId: string;
    fromBps: number;
    toBps: number;
    /** Revenue ÷ commission; null under objective roi. */
    realizedRoas: number | null;
    /** Objective roi only: referral ROI over matured referrals, both sides: profit after ÷ (referee credit cost + cash commissions + referrer credit cost). */
    realizedRoi?: number | null;
  }>;
  /** Objective roi only: partners whose rate was kept, and why. */
  held?: Array<{
    partnerId: string;
    reason: "roi_unknown" | "too_few_matured";
    /** The partner's matured referrals in the program (the name predates referral-based ROI). */
    maturedGrants: number;
  }>;
};

export type GetPassportPublicKeyResponse = {
  algorithm: "ed25519";
  publicKey: string;
};

export type PostPassportVerifyResponse = {
  valid: boolean;
  claims?: GetOpenapiJsonResponse;
  reason?: string;
};

export type GetPartnerAdvanceOfferResponse = {
  currency: string;
  /** Integer minor units (cents). */
  monthlyRunRateMinor: number;
  /** Integer minor units (cents). */
  projectedMinor: number;
  /** Integer minor units (cents). */
  maxAdvanceMinor: number;
  feeBps: number;
  qualityScore: number;
};

export type PostPartnerAdvanceAcceptResponse = {
  id: string;
  /** Integer minor units (cents). */
  principalMinor: number;
  /** Integer minor units (cents). */
  feeMinor: number;
  /** Integer minor units (cents). */
  outstandingMinor: number;
  status: string;
};

export type GetPartnerAdvanceResponse = {
  object: "list";
  data: Array<{
    id: string;
    currency: string;
    /** Integer minor units (cents). */
    principalMinor: number;
    /** Integer minor units (cents). */
    feeMinor: number;
    /** Integer minor units (cents). */
    outstandingMinor: number;
    status: string;
    createdAt: string;
    repaidAt: string | null;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PutNetworkSettingsResponse = {
  enabled: boolean;
};

export type GetNetworkSettingsResponse = {
  enabled: boolean;
};

export type GetNetworkJourneyResponse = {
  emailHash: string;
  model: string;
  touchpoints: Array<{
    partnerAccountId: string;
    ts: string;
    credit: number;
  }>;
  partners: number;
};

export type PutProgramsIdNegotiationPolicyResponse = {
  ok: true;
  negotiationPolicy: GetOpenapiJsonResponse | null;
};

export type GetProgramsIdNegotiationPolicyResponse = {
  negotiationPolicy: GetOpenapiJsonResponse | null;
};

export type GetNegotiationsResponse = {
  object: "list";
  data: Array<{
    id: string;
    programId: string;
    agentAccountId: string;
    proposedBps: number;
    decision: string;
    rateBps: number | null;
    round: number;
    createdAt: string;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetCleanroomConsentResponse = {
  customerRef: string;
  consent: ({
    granted: boolean;
    purposes: Array<string>;
    declared: GetOpenapiJsonResponse;
    emailHash: string | null;
    updatedAt: string;
  }) | null;
};

export type GetCleanroomQueryResponse = {
  dimension: string;
  k: number;
  cohorts: Array<{
    key: string;
    count: number;
    [key: string]: string | number;
  }>;
  suppressedCohorts: number;
  suppressedRows: number;
};

export type GetAgentsResponse = {
  object: "list";
  data: Array<{
    partnerId: string;
    accountId: string;
    name: string;
    wallet: string | null;
    metadata: GetOpenapiJsonResponse | null;
    instantPayout: boolean;
    status: string;
    recommendations: number;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetAgentsRecommendationsResponse = {
  object: "list";
  data: Array<{
    id: string;
    programId: string;
    customerRef: string;
    agent: string;
    wallet: string | null;
    createdAt: string;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetAdminMetricsResponse = {
  orgs: number;
  suspendedOrgs: number;
  partnerAccounts: number;
  bannedPartners: number;
  programs: number;
  /** Integer minor units (cents). */
  commissionEarnedMinor: number;
  payoutsSent: number;
  openFraudCases: number;
};

export type GetAdminOrgsResponse = {
  object: "list";
  data: Array<{
    id: string;
    name: string;
    plan: string;
    planStatus: string | null;
    suspended: boolean;
    createdAt: string;
    programs: number;
    partners: number;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PostAdminOrgsIdSuspendResponse = {
  ok: true;
  suspended: true;
};

export type PostAdminOrgsIdPlanResponse = {
  plan: string;
  planStatus: string;
};

export type PostAdminOrgsIdUnsuspendResponse = {
  ok: true;
  suspended: false;
};

export type GetAdminPartnerAccountsResponse = {
  object: "list";
  data: Array<{
    id: string;
    email: string;
    name: string | null;
    banned: boolean;
    kycStatus: string | null;
    sanctionsStatus: string | null;
    createdAt: string;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PostAdminPartnerAccountsIdBanResponse = {
  ok: true;
  banned: true;
};

export type PostAdminPartnerAccountsIdUnbanResponse = {
  ok: true;
  banned: false;
};

export type GetNotificationsResponse = {
  object: "list";
  data: Array<Notification>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetPartnerNotificationsResponse = {
  object: "list";
  data: Array<Notification>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PostAssetsResponse = {
  id: string;
  programId: string;
  kind: string;
  title: string;
  content: string;
  dimensions: string;
  groupId?: string | null;
};

export type GetAssetsResponse = {
  object: "list";
  data: Array<{
    id: string;
    programId: string;
    kind: string;
    title: string;
    content: string;
    dimensions: string;
    groupId: string | null;
    clicks: number;
    referrals: number;
    createdAt: string;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PostPartnerDealsResponse = {
  id: string;
  status: "submitted";
};

export type GetPartnerDealsResponse = {
  object: "list";
  data: Array<{
    id: string;
    orgId: string;
    company: string;
    /** Integer minor units (cents). */
    valueMinor: number;
    currency: string;
    status: string;
    protectionExpiresAt: string | null;
    createdAt: string;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetDealsResponse = {
  object: "list";
  data: Array<{
    id: string;
    programId: string;
    partnerId: string;
    partnerEmail: string;
    company: string;
    contactEmail: string;
    /** Integer minor units (cents). */
    valueMinor: number;
    currency: string;
    status: string;
    protectionExpiresAt: string | null;
    referralId: string | null;
    notes: string;
    createdAt: string;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PostDealsIdApproveResponse = {
  id: string;
  status: "approved";
  protectionExpiresAt: string;
};

export type PostDealsIdRejectResponse = {
  id: string;
  status: "rejected";
};

export type PostDealsIdWonResponse = {
  id: string;
  status: "won";
  referralId: string;
};

export type PostProgramsIdApplyLevelingResponse = {
  evaluated: number;
  promoted: number;
};

export type PostPayoutRunsRunScheduledResponse = Array<{
  orgId: string;
  runId: string;
  payouts: number;
  sent: number;
  failed: number;
}>;

export type PutPartnerOrgsOrgIdPostbackResponse = {
  url: string;
  secret: string;
  macros: Array<string>;
};

export type GetPartnerPostbackLogsResponse = {
  object: "list";
  data: Array<{
    topic: string;
    url: string;
    statusCode: number | null;
    ts: string;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetPartnerRecruitResponse = {
  code: string;
  url: string;
};

export type GetPartnerAchievementsResponse = {
  object: "list";
  data: Array<{
    id: string;
    title: string;
    unlocked: boolean;
    progress: number;
    target: number;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetPartnerTermsResponse = {
  object: "list";
  data: Array<{
    versionId: string;
    programId: string;
    programName: string;
    version: number;
    termsMd: string;
    accepted: boolean;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetProgramsIdTermsAcceptancesResponse = {
  object: "list";
  data: Array<{
    version: number;
    partnerEmail: string;
    acceptedAt: string;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetSetupStatusResponse = {
  checks: Record<string, boolean>;
  hints: Array<string>;
  /** Stable keys for each hint, in the same order, for localized clients. */
  hintKeys: Array<string>;
  progress: string;
};

export type PostAnomaliesScanResponse = Array<{
  orgId: string;
  metric: "clicks" | "referrals" | "refunds";
  kind: "spike" | "drop";
  last24h: number;
  daily7dAvg: number;
}>;

export type PostPrivacyForgetResponse = {
  ok: true;
  /** Erasure by customerRef. */
  pseudonym?: string;
  partners?: Array<{
    partnerId: string;
    alreadyForgotten: boolean;
  }>;
  customers?: Array<{
    customerRef: string;
    pseudonym: string;
  }>;
};

export type PostPrivacyLookupResponse = {
  found: boolean;
  customerRefs: Array<string>;
  partnerId: string | null;
};

export type PostPrivacyRequestsResponse = {
  id: string;
  status: "completed" | "failed";
};

export type GetPrivacyRequestsResponse = {
  object: "list";
  data: Array<PrivacyRequest>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetPrivacyRequestsIdResultResponse = {
  found: boolean;
  customers: Array<CustomerExport | {
    customerRef: string;
    pseudonym: string;
  }>;
  partner?: PartnerExport | null;
  partners?: Array<{
    partnerId: string;
    alreadyForgotten: boolean;
  }>;
};

export type PostEmailSettingsVerifyDomainResponse = EmailSettings & {
  domain: string;
};

export type GetEmailTemplatesResponse = {
  object: "list";
  data: Array<EmailTemplateEvent>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PutEmailTemplatesEventLocaleResponse = {
  event: string;
  locale: string;
  subject: string;
  text: string;
  html: string | null;
  updatedAt: string;
};

export type DeleteEmailTemplatesEventLocaleResponse = {
  ok: true;
  reset: boolean;
};

export type PostEmailTestResponse = {
  sent: true;
  id: string;
  provider: string;
};

export type PutMeLocaleResponse = {
  locale: string;
};

export type PutMeRoiDigestResponse = {
  enabled: boolean;
};

export type PutPartnerLocaleResponse = {
  locale: string;
};

export type GetIntegrationsResponse = {
  zapier: {
    hooks: number;
    events: Array<string>;
  };
  hubspot: IntegrationConnection | null;
  segment: IntegrationConnection | null;
};

export type PostIntegrationsHubspotTestResponse = {
  ok: boolean;
  portalId: number | null;
  createdProperties: Array<string>;
  error: string | null;
};

export type PostIntegrationsSegmentTestResponse = {
  ok: boolean;
  error: string | null;
};

export type GetIntegrationsDeliveriesResponse = {
  object: "list";
  data: Array<IntegrationDelivery>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetZapierEventsResponse = Array<{
  key: string;
}>;

export type GetZapierHooksResponse = {
  object: "list";
  data: Array<ZapierHook>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetZapierTriggersEventResponse = Array<{
  id: string;
  event: string;
  createdAt: string;
  [key: string]: unknown;
}>;

export type PostZapierConversionsResponse = {
  connectionId: string;
  [key: string]: unknown;
};

export type PostPartnerSecurityTotpSetupResponse = {
  secret: string;
  otpauthUrl: string;
};

export type PostPartnerSecurityTotpEnableResponse = {
  enabled: true;
};

export type PostPartnerSecurityTotpDisableResponse = {
  enabled: false;
};

export type GetPartnerSecurityResponse = {
  totpEnabled: boolean;
};

export type GetAuthConnectionsResponse = {
  object: "list";
  data: Array<AuthConnection>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type PostAuthConnectionsIdRotateSecretResponse = {
  id: string;
  provider: string;
  /** The new secret, shown once. The previous one keeps working until previousSecretExpiresAt. */
  secret: string;
  previousSecretExpiresAt: string;
};

export type PatchAuthConnectionsIdResponse = {
  id: string;
  provider: string;
  name: string;
  status: "active" | "paused";
  autoEnrollUsers?: boolean;
  destinationUrl?: string | null;
  signatureVersion?: "v1+v2" | "v2";
  requiresV2?: boolean;
};

export type PostAuthConnectionsIdRevokePreviousSecretResponse = {
  ok: true;
  revoked: boolean;
};

export type PostAuthConnectionsIdSignupsResponse = {
  /** Present on a test signup ("test": true or atlas-test: 1): answered as a real call, nothing stored. */
  test?: true;
  referral: ({
    id: string;
    partnerId: string;
    partnerExternalRef: string | null;
    matchedVia: string;
    status: string;
    /** Test signups only: true when this referral already existed; false when it exists only in this answer. */
    persisted?: boolean;
  }) | null;
  reasoning?: {
    /** English, for people; wording may change. */
    notes: Array<string>;
    /** One stable code per distinct reason behind notes, in order. */
    codes: Array<SignupReasonCode>;
  };
  partner?: {
    id: string;
    code: string;
    /** The partner's absolute tracked link (/go/{trackingToken}/{code}), on the org's verified link domain when it has one; null when they have only a coupon. */
    link: string | null;
    /** Test signups only: true when this partner already existed; false when it exists only in this answer. */
    persisted?: boolean;
  };
};

export type PostAuthConnectionsIdEraseResponse = {
  ok: true;
  /** False when nothing was filed under the customer (a retry settles cleanly). */
  erased: boolean;
  customer: {
    customerRef: string;
    pseudonym: string;
  } | null;
  partner: {
    partnerId: string;
    alreadyForgotten: boolean;
  } | null;
};

export type GetAuthConnectionsIdExportResponse = {
  customer: CustomerExport;
  partner: PartnerExport | null;
};

export type PostAuthConnectionsIdPingResponse = {
  ok: true;
  connectionId: string;
  programId: string;
  orgName: string;
  autoEnrollUsers: boolean;
  serverTime: string;
};

export type PostAuthConnectionsIdAliasesResponse = {
  ok: true;
  customerRef: string;
  referralIds: Array<string>;
  partnerId: string | null;
  alreadyAliased: boolean;
  reprocessedPayments: number;
};

export type PostAuthConnectionsIdUsersResponse = {
  ok: true;
  deleted?: true;
  erased?: boolean;
  customer?: {
    customerRef: string;
    pseudonym: string;
  } | null;
  partner: ({
    partnerId: string;
    alreadyForgotten: boolean;
  } | {
    id: string;
    status: string;
  }) | null;
  updated?: Array<string>;
  notes?: Array<string>;
};

export type PostAuthConnectionsIdSignalsResponse = {
  ok: true;
  signal: "email_verified" | "banned" | "unbanned" | "fraud_confirmed" | "self_referral";
  referrals: Array<{
    id: string;
    status: string;
  }>;
  reversed: Array<{
    lineId: string;
    /** Integer minor units (cents). */
    amountMinor: number;
    currency: string;
  }>;
  partner: {
    id: string;
    status: string;
  } | null;
  notes?: Array<string>;
};

export type GetOrgSsoResponse = {
  configured: boolean;
  /** The deployment's SSO provider; null when SSO isn't configured. */
  provider: {
    name: string;
    label: string;
  } | null;
  /** The provider's role keys → Referalli roles, before the org's own mapping. */
  defaultRoleMapping: Record<string, string>;
  linked: boolean;
  /** The org's directory tenant at the provider. */
  tenantId: string | null;
  /** Deprecated: tenantId, when the provider is Atlas. */
  atlasOrgId: string | null;
  connections: Array<{
    id: string;
    type: string;
    status: string;
    allowedDomains: Array<string>;
  }>;
  domains: Array<string>;
  requireSso: boolean;
  roleMapping: Record<string, string>;
  tickets: Array<{
    id: string;
    status: string;
    expiresAt: string;
    createdAt: string;
  }>;
  /** Why the provider couldn't be read just now, if it couldn't. */
  providerError: string | null;
  /** Deprecated: providerError. */
  atlasError: string | null;
};

export type PostOrgSsoLinkResponse = {
  linked: true;
  provider: string;
  tenantId: string;
  atlasOrgId: string | null;
};

export type PostOrgSsoTicketsResponse = {
  id: string;
  /** The SSO provider's hosted setup page for the IT admin. Shown once; not stored. */
  url: string;
  expiresAt: string;
};

export type PostOrgSsoTicketsIdRevokeResponse = {
  id: string;
  status: "revoked";
};

export type GetOrgSsoConnectionsIdSamlMetadataResponse = {
  spEntityId: string;
  acsUrl: string;
  metadataXml: string;
};

export type PatchOrgSsoResponse = {
  requireSso: boolean;
  roleMapping: Record<string, string>;
};

export type PostPartnerAuthWalletNonceResponse = {
  nonce: string;
  message: string;
};

export type PostPartnerAuthWalletVerifyResponse = {
  accountId: string;
  wallet: string;
};

export type PostOnchainConnectionsResponse = {
  id: string;
  secret: string;
  webhookUrl: string;
};

export type GetOnchainConnectionsResponse = {
  object: "list";
  data: Array<{
    id: string;
    programId: string;
    name: string;
    status: string;
    createdAt: string;
  }>;
  /** Whether another page follows; pass next_cursor as starting_after to get it. */
  has_more: boolean;
  next_cursor: string | null;
};

export type GetPublicProgramsHandleResponse = {
  handle: string;
  programId: string;
  programName: string;
  merchant: string;
  trackingToken: string;
  cookieWindowDays: number;
  termsMd: string;
  pitch: string;
  autoApprove: boolean;
  commission: GetOpenapiJsonResponse | null;
  branding: {
    logoUrl: string | null;
    theme: GetOpenapiJsonResponse | null;
  };
};

export type PostPublicProgramsHandleJoinResponse = {
  accountId: string;
  status: "approved" | "applied";
  link: string | null;
  linkUrl: string | null;
  code: string | null;
  portalUrl: string;
};

export type PostWebhooksBillingConnectionIdResponse = {
  received: number;
  results: Array<{
    duplicate: boolean;
    billingEventId: string | null;
    conversions: number;
    linesCreated: number;
    reversals: number;
  }>;
};

export type PostWebhooksAuthConnectionIdResponse = {
  received: number;
  results: Array<{
    customerRef: string;
    attributed: boolean;
    reason?: string;
    partnerId?: string | null;
    matchedVia?: string | null;
  }>;
};

export type PostWebhooksSsoProviderResponse = {
  received: true;
  duplicate: boolean;
  handled?: boolean;
  effects?: Array<string>;
};

export type PostWebhooksOnchainConnectionIdResponse = {
  received: number;
  results: Array<{
    txHash: string;
    wallet: string;
    /** Integer minor units (cents). */
    amountMinor: number;
    attributed: boolean;
    linesCreated: number;
    duplicate: boolean;
  }>;
};

export type PostWebhooksPayoutsProviderResponse = {
  ignored?: boolean;
  reason?: string;
  finalized?: boolean;
  status?: string;
};

export type PostWebhooksStripeBillingResponse = {
  received: true;
  duplicate?: boolean;
  ignored?: boolean;
  reason?: string;
  orgId?: string;
  plan?: string;
  planStatus?: string;
};

export type GetGraphqlResponse = {
  data?: GetOpenapiJsonResponse | null;
  errors?: Array<GetOpenapiJsonResponse>;
};

export type PostGraphqlResponse = {
  data?: GetOpenapiJsonResponse | null;
  errors?: Array<GetOpenapiJsonResponse>;
};

/** GET /t/{orgToken}/aff.js: Get the tracking script */
export type GetTOrgTokenAffJsResponse = string;

/** GET /go/{orgToken}/{code}: Follow a tracked link */
export type GetGoOrgTokenCodeQuery = {
  cx?: string;
};
export type GetGoOrgTokenCodeResponse = void;

/** POST /t/{orgToken}/visit: Record a page visit */
export type PostTOrgTokenVisitBody = {
  anonId: string;
  clickId?: string;
  code?: string;
  url?: string;
  referer?: string;
};

/** GET /t/{orgToken}/codes/{code}: Look up a referral code */

/** POST /t/{orgToken}/identify: Identify a visitor */
export type PostTOrgTokenIdentifyBody = {
  anonId: string;
  customerRef?: string;
  emailHash?: string;
};
export type PostTOrgTokenIdentifyResponse = Ok;

/** GET /t/{orgToken}/widget.js: Get the referral widget script */
export type GetTOrgTokenWidgetJsResponse = string;

/** GET /t/{orgToken}/widget/me: Read the widget customer's referral data */

/** GET /t/{orgToken}/mobile/resolve: Resolve a deferred deep link */
export type GetTOrgTokenMobileResolveQuery = {
  platform?: "ios" | "android";
  osVersion?: string;
};

/** POST /t/{orgToken}/mobile/install: Attribute an app install */
export type PostTOrgTokenMobileInstallBody = {
  programId?: string;
  customerRef: string;
  clickId?: string;
  referrer?: string;
  deviceId?: string;
  idempotencyKey?: string;
};

/** POST /t/{orgToken}/mobile/event: Report an in-app purchase (retired) */
export type PostTOrgTokenMobileEventResponse = void;

/** GET /.well-known/apple-app-site-association: Get the iOS universal links file */

/** GET /.well-known/assetlinks.json: Get the Android App Links file */

/** POST /v1/agents/register: Register an AI agent */
export type PostAgentsRegisterBody = {
  walletAddress: string;
  nonce: string;
  signature: string;
  name?: string;
  model?: string;
  operator?: string;
  instantPayout?: boolean;
};

/** POST /t/{orgToken}/agent/attribute: Attribute a customer to an agent */
export type PostTOrgTokenAgentAttributeBody = {
  walletAddress: string;
  programId: string;
  customerRef: string;
  nonce: string;
  signature: string;
};

/** POST /t/{orgToken}/agent/negotiate: Negotiate a commission rate */
export type PostTOrgTokenAgentNegotiateBody = {
  walletAddress: string;
  programId: string;
  proposedBps: number;
  nonce: string;
  signature: string;
};

/** POST /t/{orgToken}/consent: Record a customer's consent */
export type PostTOrgTokenConsentBody = {
  customerRef: string;
  emailHash?: string;
  purposes?: Array<string>;
  declared?: Record<string, string | number | boolean>;
  granted?: boolean;
};

/** GET /v1/health: Check API health */
export type GetHealthResponse = Ok;

/** GET /v1/versions: List API versions */

/** GET /v1/auth/oidc/start: Start browser sign-in */
export type GetAuthOidcStartQuery = {
  provider?: "instance" | "atlasid";
  as?: "merchant" | "partner";
  next?: string;
  recruiter?: string;
  login_hint?: string;
  return_host?: string;
};
export type GetAuthOidcStartResponse = void;

/** GET /v1/auth/atlas/start: Start browser sign-in (original path) */
export type GetAuthAtlasStartQuery = {
  provider?: "instance" | "atlasid";
  as?: "merchant" | "partner";
  next?: string;
  recruiter?: string;
  login_hint?: string;
  return_host?: string;
};
export type GetAuthAtlasStartResponse = void;

/** GET /v1/auth/oidc/callback: Complete browser sign-in */
export type GetAuthOidcCallbackQuery = {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
};
export type GetAuthOidcCallbackResponse = void;

/** GET /v1/auth/atlas/callback: Complete browser sign-in (original path) */
export type GetAuthAtlasCallbackQuery = {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
};
export type GetAuthAtlasCallbackResponse = void;

/** GET /v1/auth/handoff: Redeem a portal sign-in handoff */
export type GetAuthHandoffQuery = {
  code: string;
};
export type GetAuthHandoffResponse = void;

/** GET /v1/auth/providers: List sign-in providers */

/** POST /v1/auth/logout: Sign out */

/** POST /v1/orgs: Create an organization */
export type PostOrgsBody = {
  name: string;
};

/** GET /v1/me: Get the current caller */

/** GET /v1/hosts/current: Describe the current host */

/** GET /v1/hosts/current/theme.css: Get the current host's theme stylesheet */
export type GetHostsCurrentThemeCssResponse = string;

/** GET /v1/auth/forumulate: Sign in to the docs and community */
export type GetAuthForumulateQuery = {
  returnTo?: string;
  return_to?: string;
  space?: "docs" | "guides" | "blog" | "community" | "status" | "legal";
  spaceId?: string;
};
export type GetAuthForumulateResponse = void;

/** POST /v1/mobile/purchases: Report an in-app purchase */
export type PostMobilePurchasesBody = {
  eventId: string;
  customerRef: string;
  type?: "purchase" | "refund";
  amountMinor: number;
  currency?: string;
  productRef?: string;
};

/** GET /v1/org: Get the organization */
export type GetOrgResponse = Org;

/** PATCH /v1/org: Update the organization */
export type PatchOrgBody = {
  name?: string;
  settings?: Record<string, unknown>;
  payoutKycRequired?: boolean;
};

/** GET /v1/org/members: List team members */
export type GetOrgMembersQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/org/members: Add a team member */
export type PostOrgMembersBody = {
  email: string;
  role: "owner" | "admin" | "finance" | "analyst" | "support";
};

/** PATCH /v1/org/members/{userId}: Change a member's role */
export type PatchOrgMembersUserIdBody = {
  role: "owner" | "admin" | "finance" | "analyst" | "support";
};

/** DELETE /v1/org/members/{userId}: Remove a team member */
export type DeleteOrgMembersUserIdResponse = Ok;

/** PUT /v1/org/payout-schedule: Set the org payout schedule */
export type PutOrgPayoutScheduleBody = {
  dayOfMonth?: number | null;
  schedule?: ({
    kind: "monthly";
    dayOfMonth: number;
  } | {
    kind: "weekly";
    dayOfWeek: number;
  } | {
    kind: "twice_monthly";
    days: Array<number>;
  } | {
    kind: "custom";
    dates: Array<string>;
  }) | null;
};

/** GET /v1/org/payout-schedule: Get payout schedules */

/** PUT /v1/programs/{id}/payout-schedule: Set a program's payout schedule */
export type PutProgramsIdPayoutScheduleBody = {
  schedule: (({
    kind: "monthly";
    dayOfMonth: number;
  } | {
    kind: "weekly";
    dayOfWeek: number;
  } | {
    kind: "twice_monthly";
    days: Array<number>;
  } | {
    kind: "custom";
    dates: Array<string>;
  }) | {
    kind: "off";
  }) | null;
};

/** GET /v1/org/tax-profile: Get the tax profile */
export type GetOrgTaxProfileResponse = TaxProfile;

/** PUT /v1/org/tax-profile: Update the tax profile */
export type PutOrgTaxProfileBody = {
  legalName?: string | null;
  address?: string | null;
  country?: string | null;
  vatId?: string | null;
  ein?: string | null;
  domesticVatBps?: number | null;
  viesCheck?: boolean;
};
export type PutOrgTaxProfileResponse = TaxProfile;

/** PUT /v1/partners/{id}/vat: Set a partner's VAT number */
export type PutPartnersIdVatBody = {
  vatId: string | null;
};

/** GET /v1/partner/orgs/{orgId}/self-billing: Get self-billing status */

/** POST /v1/partner/orgs/{orgId}/self-billing: Accept self-billing */
export type PostPartnerOrgsOrgIdSelfBillingBody = {
  accept: true;
};

/** PUT /v1/partner/orgs/{orgId}/vat: Set my VAT number */
export type PutPartnerOrgsOrgIdVatBody = {
  vatId: string | null;
};
export type PutPartnerOrgsOrgIdVatResponse = PutPartnersIdVatResponse;

/** GET /v1/payouts/{id}/invoice: Get a payout's invoice */
export type GetPayoutsIdInvoiceQuery = {
  format?: "json" | "html";
};
export type GetPayoutsIdInvoiceResponse = Invoice;

/** GET /v1/partner/payouts/{id}/invoice: Get my payout invoice */
export type GetPartnerPayoutsIdInvoiceQuery = {
  format?: "json" | "html";
};
export type GetPartnerPayoutsIdInvoiceResponse = Invoice;

/** PUT /v1/org/tax-filing: Connect a 1099 filing provider */
export type PutOrgTaxFilingBody = {
  provider: "test" | "tax1099";
  credentials?: {
    apiKey: string;
    baseUrl?: string;
  };
};

/** GET /v1/tax/1099/preview: Preview 1099-NEC filings */
export type GetTax1099PreviewQuery = {
  year: number;
};
export type GetTax1099PreviewResponse = NecPreview;

/** POST /v1/tax/1099/filings: File 1099-NEC forms */
export type PostTax1099FilingsBody = {
  year: number;
};
export type PostTax1099FilingsResponse = TaxFiling;

/** GET /v1/tax/1099/filings: List 1099 filings */
export type GetTax1099FilingsQuery = {
  year: number;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/tax/1099/filings/{id}/refresh: Refresh a filing status */

/** POST /v1/tax/1099/documents/{id}/correct: File a corrected 1099 */
export type PostTax1099DocumentsIdCorrectResponse = TaxFiling;

/** GET /v1/partner/tax-documents: List my tax documents */
export type GetPartnerTaxDocumentsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/partner/tax-documents/{id}: Get my tax document */
export type GetPartnerTaxDocumentsIdResponse = string;

/** GET /v1/status: Get platform status */

/** GET /v1/status/incidents: List status incidents */
export type GetStatusIncidentsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/status/incidents.atom: Get the incidents feed */
export type GetStatusIncidentsAtomResponse = string;

/** GET /v1/status/incidents/{id}: Get a status incident */
export type GetStatusIncidentsIdResponse = Incident;

/** POST /v1/admin/status/incidents: Open a status incident */
export type PostAdminStatusIncidentsBody = {
  title: string;
  severity?: "notice" | "minor" | "major" | "critical" | "maintenance";
  state?: "investigating" | "identified" | "monitoring" | "resolved";
  body?: string;
  components?: Array<"api" | "database" | "webhooks" | "background_jobs" | "tracking" | "payouts" | "dashboard">;
  startedAt?: string;
};
export type PostAdminStatusIncidentsResponse = Incident;

/** PATCH /v1/admin/status/incidents/{id}: Edit a status incident */
export type PatchAdminStatusIncidentsIdBody = {
  title?: string;
  severity?: "notice" | "minor" | "major" | "critical" | "maintenance";
  state?: "investigating" | "identified" | "monitoring" | "resolved";
  body?: string;
  components?: Array<"api" | "database" | "webhooks" | "background_jobs" | "tracking" | "payouts" | "dashboard">;
};
export type PatchAdminStatusIncidentsIdResponse = Incident;

/** POST /v1/admin/status/incidents/{id}/updates: Post an incident update */
export type PostAdminStatusIncidentsIdUpdatesBody = {
  body: string;
  state: "investigating" | "identified" | "monitoring" | "resolved";
};
export type PostAdminStatusIncidentsIdUpdatesResponse = Incident;

/** GET /v1/org/retention: Get the data retention policy */
export type GetOrgRetentionResponse = Retention;

/** PUT /v1/org/retention: Set the data retention policy */
export type PutOrgRetentionBody = {
  clicks?: number | null;
  visits?: number | null;
  billingPayloads?: number | null;
  webhookDeliveries?: number | null;
  notifications?: number | null;
  auditLog?: number | null;
};
export type PutOrgRetentionResponse = Retention;

/** GET /v1/org/referral-params: Get referral query parameters */

/** PUT /v1/org/referral-params: Set referral query parameters */
export type PutOrgReferralParamsBody = {
  params: Array<string>;
};
export type PutOrgReferralParamsResponse = GetOrgReferralParamsResponse;

/** POST /v1/programs: Create a program */
export type PostProgramsBody = {
  name: string;
  slug: string;
  attributionModel?: "last_click" | "first_click" | "position_based" | "time_decay";
  cookieWindowDays?: number;
  signupToConversionDays?: number;
  termsMd?: string;
  status?: "draft" | "active" | "paused" | "archived";
  publicHandle?: string | null;
  publicPage?: {
    pitch?: string;
    autoApprove?: boolean;
  };
  probabilisticPolicy?: "auto" | "review" | "off";
  selfReferralPolicy?: "review" | "reject";
  splitCommissions?: boolean;
  utmTemplate?: Record<string, string>;
  allowPaidSearch?: boolean;
  challengeLinks?: boolean;
  settlement?: "payout" | "merchant_credit";
  riskPolicy?: {
    holdBotScore?: number;
    holdRiskScore?: number;
    holdHighRiskLevel?: boolean;
    holdDisposableEmail?: boolean;
    holdVelocity?: number;
    holdUnverifiedEmail?: boolean;
    holdSelfReferral?: boolean;
  };
  widget?: {
    autoEnroll?: boolean;
    destinationUrl?: string | null;
  };
  mobileApp?: ({
    ios?: {
      teamId: string;
      bundleId: string;
    } | null;
    android?: {
      packageName: string;
      sha256CertFingerprints: Array<string>;
    } | null;
  }) | null;
};
export type PostProgramsResponse = Program;

/** GET /v1/programs: List programs */
export type GetProgramsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/programs/{id}: Get a program */
export type GetProgramsIdResponse = Program;

/** PATCH /v1/programs/{id}: Update a program */
export type PatchProgramsIdBody = {
  name?: string;
  slug?: string;
  attributionModel?: "last_click" | "first_click" | "position_based" | "time_decay";
  cookieWindowDays?: number;
  signupToConversionDays?: number;
  termsMd?: string;
  status?: "draft" | "active" | "paused" | "archived";
  publicHandle?: string | null;
  publicPage?: {
    pitch?: string;
    autoApprove?: boolean;
  };
  probabilisticPolicy?: "auto" | "review" | "off";
  selfReferralPolicy?: "review" | "reject";
  splitCommissions?: boolean;
  utmTemplate?: Record<string, string>;
  allowPaidSearch?: boolean;
  challengeLinks?: boolean;
  settlement?: "payout" | "merchant_credit";
  riskPolicy?: {
    holdBotScore?: number;
    holdRiskScore?: number;
    holdHighRiskLevel?: boolean;
    holdDisposableEmail?: boolean;
    holdVelocity?: number;
    holdUnverifiedEmail?: boolean;
    holdSelfReferral?: boolean;
  };
  widget?: {
    autoEnroll?: boolean;
    destinationUrl?: string | null;
  };
  mobileApp?: ({
    ios?: {
      teamId: string;
      bundleId: string;
    } | null;
    android?: {
      packageName: string;
      sha256CertFingerprints: Array<string>;
    } | null;
  }) | null;
};
export type PatchProgramsIdResponse = Program;

/** POST /v1/programs/{id}/enrollments: Enroll a partner */
export type PostProgramsIdEnrollmentsBody = {
  partnerId: string;
};
export type PostProgramsIdEnrollmentsResponse = Enrollment;

/** GET /v1/programs/{id}/enrollments: List program enrollments */
export type GetProgramsIdEnrollmentsQuery = {
  status?: "applied" | "approved" | "rejected" | "removed";
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/programs/{id}/enrollments/{enrollmentId}/approve: Approve an application */

/** POST /v1/programs/{id}/enrollments/{enrollmentId}/reject: Reject an application */

/** POST /v1/partners: Create a partner */
export type PostPartnersBody = {
  email: string;
  displayName?: string;
  tags?: Array<string>;
  notes?: string;
  externalRef?: string;
  upsert?: boolean;
};
export type PostPartnersResponse = Partner;

/** GET /v1/partners: List partners */
export type GetPartnersQuery = {
  email?: string;
  externalRef?: string;
  status?: "active" | "suspended" | "banned" | "archived";
  includeArchived?: "true" | "false";
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/partners/{id}: Get a partner */

/** PATCH /v1/partners/{id}: Update a partner */
export type PatchPartnersIdBody = {
  displayName?: string;
  status?: "active" | "suspended" | "banned" | "archived";
  tags?: Array<string>;
  notes?: string;
  externalRef?: string | null;
};
export type PatchPartnersIdResponse = Partner;

/** DELETE /v1/partners/{id}: Delete a partner */
export type DeletePartnersIdResponse = Ok;

/** GET /v1/partners/{id}/enrollments: List a partner's enrollments */
export type GetPartnersIdEnrollmentsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/programs/{id}/graph: Get the referral tree */
export type GetProgramsIdGraphQuery = {
  root: string;
  depth?: number;
};

/** POST /v1/api-keys: Create an API key */
export type PostApiKeysBody = {
  name: string;
  scopes?: Array<"admin" | "full" | "read" | "programs:read" | "programs:write" | "partners:read" | "partners:write" | "links:read" | "links:write" | "events:read" | "events:write" | "referrals:read" | "referrals:write" | "commissions:read" | "commissions:write" | "payouts:read" | "payouts:write" | "billing:read" | "billing:write" | "webhooks:read" | "webhooks:write" | "analytics:read" | "analytics:write" | "fraud:read" | "fraud:write" | "privacy:read" | "privacy:write" | "team:read" | "team:write" | "org:read" | "org:write" | "integrations:read" | "integrations:write" | "growth:read" | "growth:write" | "audit:read" | "audit:write">;
  publishable?: boolean;
  allowedOrigins?: Array<string>;
  apiVersion?: string;
  mode?: "live" | "test" | "both";
  owner?: string;
  expiresInDays?: number;
};

/** GET /v1/api-keys: List API keys */
export type GetApiKeysQuery = {
  mode?: "live" | "test";
  owner?: string;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/api-keys/{id}: Get an API key */
export type GetApiKeysIdResponse = ApiKey;

/** PATCH /v1/api-keys/{id}: Update an API key */
export type PatchApiKeysIdBody = {
  apiVersion?: string;
  owner?: string | null;
  expiresInDays?: number | null;
};

/** DELETE /v1/api-keys/{id}: Revoke an API key */
export type DeleteApiKeysIdQuery = {
  cascade?: "true" | "false";
  pair?: "true" | "false";
};

/** GET /v1/audit-logs: List audit log entries */
export type GetAuditLogsQuery = {
  actor?: string;
  actorType?: string;
  action?: string;
  subjectType?: string;
  subjectId?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
};

/** GET /v1/test_clock: Get the test clock */

/** POST /v1/test_clock/advance: Advance the test clock */
export type PostTestClockAdvanceBody = {
  seconds: number;
};

/** GET /v1/test/emails: List captured test emails */
export type GetTestEmailsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/cli/device-codes: Start a CLI sign-in */
export type PostCliDeviceCodesBody = {
  clientName?: string;
};

/** POST /v1/cli/device-codes/token: Poll a CLI sign-in */
export type PostCliDeviceCodesTokenBody = {
  deviceCode: string;
};

/** GET /v1/cli/device-codes/{userCode}: Get a pending CLI sign-in */

/** POST /v1/cli/device-codes/{userCode}/approve: Approve a CLI sign-in */
export type PostCliDeviceCodesUserCodeApproveBody = {
  access?: "full" | "read" | "cli";
  name?: string;
};

/** POST /v1/cli/device-codes/{userCode}/deny: Deny a CLI sign-in */
export type PostCliDeviceCodesUserCodeDenyResponse = Ok;

/** POST /v1/cli/listeners: Open a CLI event listener */
export type PostCliListenersBody = {
  topics?: Array<string>;
  forwardTo?: string;
};

/** GET /v1/cli/listeners/{id}/events: Receive listener events */
export type GetCliListenersIdEventsQuery = {
  wait?: number;
};

/** DELETE /v1/cli/listeners/{id}: Close a CLI listener */
export type DeleteCliListenersIdResponse = Ok;

/** POST /v1/cli/trigger: Send a test event */
export type PostCliTriggerBody = {
  topic: string;
  data?: Record<string, unknown>;
};

/** GET /v1/cli/topics: List triggerable topics */

/** GET /v1/cli/logs: Tail the request log */
export type GetCliLogsQuery = {
  after?: number;
  wait?: number;
  limit?: number;
};

/** POST /v1/links: Create a tracked link */
export type PostLinksBody = {
  programId: string;
  partnerId: string;
  code?: string;
  destinationUrl: string;
};
export type PostLinksResponse = CreatedLink;

/** GET /v1/links: List links */
export type GetLinksQuery = {
  programId?: string;
  partnerId?: string;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/links/{id}/qr: Get a link's QR code */
export type GetLinksIdQrResponse = string;

/** POST /v1/coupons: Create a coupon code */
export type PostCouponsBody = {
  programId: string;
  partnerId: string;
  code: string;
};

/** GET /v1/coupons: List coupon codes */
export type GetCouponsQuery = {
  programId?: string;
  partnerId?: string;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/widget/tokens: Mint a referral widget token */
export type PostWidgetTokensBody = {
  programId: string;
  customerRef?: string;
  partnerExternalRef?: string;
  email?: string;
  displayName?: string;
  ttlSeconds?: number;
};

/** POST /v1/referrals/associate: Attribute a new customer */
export type PostReferralsAssociateBody = {
  programId: string;
  customerRef: string;
  anonId?: string;
  referralToken?: string;
  couponCode?: string;
  emailHash?: string;
  ip?: string;
  ua?: string;
  idempotencyKey?: string;
  occurredAt?: string;
  emailDomain?: string;
};
export type PostReferralsAssociateResponse = AssociateResponse;

/** GET /v1/referrals: List referrals */
export type GetReferralsQuery = {
  programId?: string;
  partnerId?: string;
  status?: "active" | "pending_review" | "paused" | "void";
  customerRef?: string;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/referrals/{id}: Get a referral */
export type GetReferralsIdResponse = Referral;

/** PATCH /v1/referrals/{id}: Pause or resume a referral */
export type PatchReferralsIdBody = {
  status: "paused" | "active";
};
export type PatchReferralsIdResponse = Referral;

/** GET /v1/referrals/{id}/journey: Get the attribution journey */

/** POST /v1/referrals/{id}/void: Void a referral */
export type PostReferralsIdVoidResponse = Referral;

/** POST /v1/referrals/{id}/reassign: Reassign a referral */
export type PostReferralsIdReassignBody = {
  partnerId: string;
};
export type PostReferralsIdReassignResponse = Referral;

/** POST /v1/referrals/{id}/approve: Approve a held referral */
export type PostReferralsIdApproveResponse = Referral;

/** POST /v1/attribution/replay: Replay attribution */
export type PostAttributionReplayBody = {
  programId: string;
};

/** POST /v1/track/events: Track an event */
export type PostTrackEventsBody = {
  programId: string;
  partnerId: string;
  linkId?: string;
  url?: string;
  anonId?: string;
  ip?: string;
  ua?: string;
  type: "click";
} | {
  programId: string;
  partnerId: string;
  linkId?: string;
  url?: string;
  anonId?: string;
  ip?: string;
  ua?: string;
  type: "custom";
} | {
  type: "event";
  programId: string;
  customerRef: string;
  event: string;
  occurredAt?: string;
  idempotencyKey?: string;
};

/** POST /v1/commission-rules: Publish a commission rule */
export type PostCommissionRulesBody = {
  programId: string;
  config: {
    base: {
      kind: "percent";
      bps: number;
    } | {
      kind: "fixed";
      amountMinor: number;
      currency: string;
    };
    appliesTo?: "gross" | "net_of_tax" | "net_of_fees";
    recurring?: {
      type: "one_time";
    } | {
      type: "lifetime";
    } | {
      type: "months";
      months: number;
    };
    holdDays?: number;
    rounding?: "half_even" | "floor";
    conditions?: {
      countries?: Array<string>;
      excludeCountries?: Array<string>;
      metadata?: Array<{
        key: string;
        equals?: string | number | boolean;
        in?: Array<string | number | boolean>;
      }>;
    };
    overrides?: Array<{
      match: {
        partnerId?: string;
        linkId?: string;
        productRef?: string;
        countries?: Array<string>;
        metadata?: Array<{
          key: string;
          equals?: string | number | boolean;
          in?: Array<string | number | boolean>;
        }>;
      };
      base: {
        kind: "percent";
        bps: number;
      } | {
        kind: "fixed";
        amountMinor: number;
        currency: string;
      };
    }>;
    tiers?: Array<{
      minCustomers: number;
      bps: number;
    }>;
    bounties?: Array<{
      event: string;
      amountMinor: number;
      currency: string;
    }>;
    subAffiliate?: {
      levels: number;
      ratesBps: Array<number>;
    };
    newVsExpansion?: {
      newBps: number;
      expansionBps: number;
    };
  };
};

/** GET /v1/commission-rules: List commission rules */
export type GetCommissionRulesQuery = {
  programId?: string;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/commissions: List commission ledger events */
export type GetCommissionsQuery = {
  partnerId?: string;
  programId?: string;
  type?: "earned" | "adjusted" | "reversed" | "approved" | "paid";
  referralId?: string;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/commissions/{id}: Get a commission */
export type GetCommissionsIdResponse = CommissionLine;

/** GET /v1/partners/{id}/balances: Get a partner's balances */
export type GetPartnersIdBalancesQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/commissions/approve-due: Approve due commissions */

/** POST /v1/commissions/{id}/adjust: Adjust a commission */
export type PostCommissionsIdAdjustBody = {
  amountMinor: number;
  memo: string;
  allowNegative?: boolean;
};

/** POST /v1/commissions/{id}/settle: Settle a commission yourself */
export type PostCommissionsIdSettleBody = {
  method?: "store_credit";
  reference: string;
  memo?: string;
};
export type PostCommissionsIdSettleResponse = Settlement;

/** POST /v1/billing/connections: Create a billing connection */
export type PostBillingConnectionsBody = {
  provider: "stripe" | "paddle" | "lemonsqueezy" | "polar" | "chargebee" | "shopify" | "generic" | "recurly" | "braintree" | "woocommerce" | "bigcommerce";
  name?: string;
  webhookSecret?: string;
};
export type PostBillingConnectionsResponse = CreatedBillingConnection;

/** GET /v1/billing/connections: List billing connections */
export type GetBillingConnectionsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** PUT /v1/billing/connections/{id}/secret: Set the webhook signing secret */
export type PutBillingConnectionsIdSecretBody = {
  webhookSecret: string;
};

/** PUT /v1/billing/connections/{id}/credentials: Set provider API credentials */
export type PutBillingConnectionsIdCredentialsBody = {
  apiKey?: string;
  apiToken?: string;
  storeHash?: string;
  region?: "us" | "eu";
};

/** GET /v1/billing/connections/{id}: Get a billing connection */
export type GetBillingConnectionsIdResponse = BillingConnection;

/** PATCH /v1/billing/connections/{id}: Update a billing connection */
export type PatchBillingConnectionsIdBody = {
  status?: "active" | "paused";
  name?: string;
};
export type PatchBillingConnectionsIdResponse = BillingConnection;

/** DELETE /v1/billing/connections/{id}: Delete a billing connection */
export type DeleteBillingConnectionsIdResponse = Ok;

/** PUT /v1/billing/connections/{id}/value-mapping: Set the value mapping */
export type PutBillingConnectionsIdValueMappingBody = {
  cash?: string;
  creditApplied?: string;
  discount?: string;
  cost?: string;
  productRef?: string;
  unit: "minor" | "major";
};

/** POST /v1/billing/connections/{id}/value-mapping/preview: Preview the value mapping */
export type PostBillingConnectionsIdValueMappingPreviewBody = {
  payload: unknown;
  currency?: string;
  mapping?: {
    cash?: string;
    creditApplied?: string;
    discount?: string;
    cost?: string;
    productRef?: string;
    unit: "minor" | "major";
  };
};
export type PostBillingConnectionsIdValueMappingPreviewResponse = ValueMappingPreview;

/** POST /v1/billing/connections/{id}/rotate-secret: Rotate the webhook signing secret */

/** GET /v1/billing/events: List billing events */
export type GetBillingEventsQuery = {
  customerRef?: string;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** PUT /v1/partners/{id}/payout-profile: Set a partner's payout profile */
export type PutPartnersIdPayoutProfileBody = {
  method: "paypal" | "wise" | "stripe_connect" | "ach" | "crypto" | "payoneer" | "tremendous" | "csv";
  details?: Record<string, unknown>;
  payoutCurrency?: string;
  minThresholdMinor?: number;
};

/** GET /v1/partners/{id}/payout-profile: Get a partner's payout profile */
export type GetPartnersIdPayoutProfileResponse = PayoutProfile;

/** PATCH /v1/partners/{id}/payout-profile: Change a partner's payout threshold */
export type PatchPartnersIdPayoutProfileBody = {
  minThresholdMinor: number;
};

/** POST /v1/partners/{id}/tax-form: Record a partner's tax form */
export type PostPartnersIdTaxFormBody = {
  type: "w9" | "w8ben" | "w8bene";
  data: unknown;
};
export type PostPartnersIdTaxFormResponse = Ok;

/** POST /v1/payout-runs: Create a payout run */
export type PostPayoutRunsResponse = PayoutRunCreated;

/** GET /v1/payout-runs: List payout runs */
export type GetPayoutRunsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/payout-runs/{id}/execute: Execute a payout run */

/** POST /v1/payout-runs/{id}/cancel: Cancel a payout run */

/** GET /v1/payouts: List payouts */
export type GetPayoutsQuery = {
  partnerId?: string;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/tax/1099: Export 1099-NEC data */
export type GetTax1099Query = {
  year: number;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/fx-rates: Record an FX rate */
export type PostFxRatesBody = {
  base: string;
  quote: string;
  rate: string | number;
  effectiveAt?: string;
};
export type PostFxRatesResponse = FxRate;

/** GET /v1/fx-rates: List FX rates */
export type GetFxRatesQuery = {
  base?: string;
  quote?: string;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/org/fx-feed: Get the FX feed setting */

/** PUT /v1/org/fx-feed: Turn the FX feed on or off */
export type PutOrgFxFeedBody = {
  enabled: boolean;
};

/** POST /v1/fx-rates/sync: Sync the FX feed now */

/** POST /v1/fx-rates/clear-override: Clear a manual FX rate */
export type PostFxRatesClearOverrideBody = {
  base: string;
  quote: string;
};

/** GET /v1/payout-connections: List payout provider connections */
export type GetPayoutConnectionsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** PUT /v1/payout-connections/{provider}: Connect a payout provider */
export type PutPayoutConnectionsProviderBody = ({
  clientId: string;
  secret: string;
  env?: "sandbox" | "live";
}) | ({
  secretKey: string;
  env?: "sandbox" | "live";
}) | ({
  apiKey: string;
  walletId: string;
  defaultChain?: string;
  env?: "sandbox" | "live";
}) | ({
  apiToken: string;
  profileId: string;
  env?: "sandbox" | "live";
}) | ({
  clientId: string;
  secret: string;
  programId: string;
  env?: "sandbox" | "live";
}) | ({
  apiKey: string;
  fundingSourceId: string;
  campaignId?: string;
  env?: "sandbox" | "live";
});

/** DELETE /v1/payout-connections/{provider}: Disconnect a payout provider */

/** POST /v1/fraud/invalid-traffic/scan: Scan for invalid traffic */
export type PostFraudInvalidTrafficScanBody = {
  windowHours?: number;
};

/** GET /v1/fraud/cases: List fraud cases */
export type GetFraudCasesQuery = {
  status?: "open" | "dismissed" | "actioned";
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/fraud/cases/{id}/resolve: Resolve a fraud case */
export type PostFraudCasesIdResolveBody = {
  action: "dismiss" | "void_referral" | "suspend_partner" | "ban_partner";
};
export type PostFraudCasesIdResolveResponse = Ok;

/** GET /v1/partners/{id}/quality: Get a partner's quality score */

/** POST /v1/quality/recompute: Recompute quality scores */

/** POST /v1/fraud/detect-rings: Detect referral rings */

/** GET /v1/reports/filtered-clicks: Report filtered clicks */
export type GetReportsFilteredClicksQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/analytics/overview: Get the funnel overview */
export type GetAnalyticsOverviewQuery = {
  programId?: string;
  days?: number;
};

/** GET /v1/analytics/timeseries: Get a daily time series */
export type GetAnalyticsTimeseriesQuery = {
  metric: "clicks" | "signups" | "revenue";
  days?: number;
  programId?: string;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/analytics/cohort-ltv: Get cohort LTV */
export type GetAnalyticsCohortLtvQuery = {
  months?: number;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/analytics/by-geo: Get revenue by country */
export type GetAnalyticsByGeoQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/analytics/by-channel: Get revenue by channel */
export type GetAnalyticsByChannelQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/analytics/coupon-performance: Get coupon performance */
export type GetAnalyticsCouponPerformanceQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/reports/partner-performance: Get partner performance */
export type GetReportsPartnerPerformanceQuery = {
  format?: "json" | "csv";
};

/** GET /v1/profitability/settings: Get profitability settings */
export type GetProfitabilitySettingsQuery = {
  programId?: string;
};

/** PUT /v1/profitability/settings: Update profitability settings */
export type PutProfitabilitySettingsBody = {
  reportingCurrency?: string;
  defaultMarginBps?: number | null;
  creditCostModel?: "face" | "margin" | "fixed_ratio";
  creditCostRatioBps?: number;
  inference?: "fifo_next_payments" | "report_only" | "on_grant";
  creditDraw?: "grants_first" | "pro_rata";
  windowDays?: 30 | 90 | 180 | 365 | 0;
  churnWindowDays?: number;
  countReferrerSpend?: boolean;
  costToServeMinorPerMonth?: number;
  taxFeesReduceProfit?: boolean;
  valuePatternWeight?: number;
  targetRoiBps?: number | null;
  programId?: string;
};
export type PutProfitabilitySettingsResponse = GetProfitabilitySettingsResponse;

/** GET /v1/profitability/products: List product margins */

/** GET /v1/profitability/products/{productRef}: Get a product margin */

/** PUT /v1/profitability/products/{productRef}: Set a product margin */
export type PutProfitabilityProductsProductRefBody = {
  marginBps?: number;
  unitCostMinor?: number;
  currency?: string;
};
export type PutProfitabilityProductsProductRefResponse = GetProfitabilityProductsProductRefResponse;

/** DELETE /v1/profitability/products/{productRef}: Delete a product margin */
export type DeleteProfitabilityProductsProductRefResponse = OkStatus;

/** POST /v1/profitability/rebuild: Rebuild ROI figures */

/** GET /v1/profitability/rebuild/{jobId}: Get a rebuild job */

/** GET /v1/roi/summary: Get the ROI summary */
export type GetRoiSummaryQuery = {
  from?: string | string;
  to?: string | string;
  programId?: string;
  partnerId?: string;
  windowDays?: number;
  currency?: string;
  format?: "json" | "csv";
  model?: "naive" | "incremental";
  includeProjection?: "true" | "false";
};
export type GetRoiSummaryResponse = RoiSummary;

/** GET /v1/roi/breakdown: Get the ROI breakdown */
export type GetRoiBreakdownQuery = {
  from?: string | string;
  to?: string | string;
  programId?: string;
  partnerId?: string;
  windowDays?: number;
  currency?: string;
  format?: "json" | "csv";
  by: "program" | "partner" | "cohort" | "source" | "role";
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/roi/grants: List credit grants */
export type GetRoiGrantsQuery = {
  from?: string | string;
  to?: string | string;
  programId?: string;
  partnerId?: string;
  windowDays?: number;
  currency?: string;
  format?: "json" | "csv";
  status?: "open" | "used" | "expired" | "revoked";
  role?: "referee" | "referrer";
  paidBack?: "true" | "false";
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/roi/trace/{customerRef}: Trace a customer's value */
export type GetRoiTraceCustomerRefQuery = {
  windowDays?: number;
  format?: "json" | "csv";
};
export type GetRoiTraceCustomerRefResponse = RoiTrace;

/** GET /v1/roi/partners/{id}/trace: Trace a partner's value */
export type GetRoiPartnersIdTraceQuery = {
  windowDays?: number;
  format?: "json" | "csv";
};
export type GetRoiPartnersIdTraceResponse = RoiTrace;

/** GET /v1/roi/patterns: List value patterns */

/** GET /v1/roi/patterns/{pattern}: Get a value pattern */
export type GetRoiPatternsPatternQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/roi/patterns/{pattern}/review: Open a review for a pattern match */
export type PostRoiPatternsPatternReviewBody = {
  customerRef?: string;
  partnerId?: string;
  programId?: string;
};
export type PostRoiPatternsPatternReviewResponse = FraudCase;

/** GET /v1/roi/data-quality: Get ROI data quality */
export type GetRoiDataQualityQuery = {
  from?: string | string;
  to?: string | string;
  format?: "json" | "csv";
};

/** POST /v1/value/events: Record value events */
export type PostValueEventsBody = {
  events: Array<unknown>;
};

/** POST /v1/value/import: Import value events from CSV */
export type PostValueImportBody = {
  csv: string;
  mapping: Record<string, "kind" | "customerRef" | "partnerId" | "partnerExternalRef" | "creditGrantId" | "referralId" | "programId" | "productRef" | "currency" | "externalId" | "invoiceRef" | "provider" | "occurredAt" | "role" | "cashMinor" | "creditAppliedMinor" | "discountMinor" | "taxMinor" | "feesMinor" | "costMinor" | "faceMinor" | "cashMajor" | "creditAppliedMajor" | "discountMajor" | "taxMajor" | "feesMajor" | "costMajor" | "faceMajor">;
  kind?: "payment" | "refund" | "credit_granted" | "credit_redeemed" | "credit_expired" | "credit_revoked" | "cost" | "adjustment";
  dryRun?: boolean;
  defaultCurrency?: string;
};

/** GET /v1/value/import/{jobId}: Get a value import job */

/** GET /v1/partner/kyc/status: Get my identity verification status */

/** POST /v1/partner/kyc/submit: Submit identity verification */
export type PostPartnerKycSubmitBody = {
  legalName: string;
  country: string;
  dateOfBirth?: string;
  documentRef?: string;
};

/** GET /v1/partner/me: Get my account and memberships */

/** GET /v1/partner/stats: Get my stats */
export type GetPartnerStatsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/partner/links: List my links */
export type GetPartnerLinksQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/partner/links: Create a link */
export type PostPartnerLinksBody = {
  orgId: string;
  programId: string;
  destinationUrl: string;
  assetId?: string;
  code?: string;
};
export type PostPartnerLinksResponse = CreatedLink;

/** GET /v1/partner/assets: List marketing assets */
export type GetPartnerAssetsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/partner/disputes: List my disputes */
export type GetPartnerDisputesQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/partner/disputes: File a dispute */
export type PostPartnerDisputesBody = {
  orgId: string;
  referralId?: string;
  kind: "missing_attribution" | "unpaid_commission";
  detail: string;
};

/** GET /v1/partner/links/{id}/qr: Get my link's QR code */
export type GetPartnerLinksIdQrResponse = string;

/** GET /v1/partner/referrals: List my referrals */
export type GetPartnerReferralsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/partner/referrals/{id}/transparency: Explain a referral */

/** GET /v1/partner/payouts: List my payouts */
export type GetPartnerPayoutsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** PUT /v1/partner/orgs/{orgId}/payout-profile: Set my payout details */
export type PutPartnerOrgsOrgIdPayoutProfileBody = {
  method: "paypal" | "wise" | "stripe_connect" | "ach" | "crypto" | "payoneer" | "tremendous" | "csv";
  details?: Record<string, unknown>;
  payoutCurrency?: string;
};

/** POST /v1/partner/orgs/{orgId}/tax-form: Submit my tax form */
export type PostPartnerOrgsOrgIdTaxFormBody = {
  type: "w9" | "w8ben" | "w8bene";
  data: unknown;
};
export type PostPartnerOrgsOrgIdTaxFormResponse = Ok;

/** GET /v1/partner/programs/{programId}/leaderboard: Get a program leaderboard */

/** POST /v1/partner/programs/{programId}/apply: Apply to a program */

/** POST /v1/webhook-endpoints: Create a webhook endpoint */
export type PostWebhookEndpointsBody = {
  url: string;
  topics?: Array<string>;
  legacySignature?: boolean;
  programIds?: Array<string> | null;
};

/** GET /v1/webhook-endpoints: List webhook endpoints */
export type GetWebhookEndpointsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** PATCH /v1/webhook-endpoints/{id}: Update a webhook endpoint */
export type PatchWebhookEndpointsIdBody = {
  status?: "active" | "paused";
  url?: string;
  topics?: Array<string>;
  legacySignature?: boolean;
  programIds?: Array<string> | null;
};
export type PatchWebhookEndpointsIdResponse = WebhookEndpoint;

/** DELETE /v1/webhook-endpoints/{id}: Delete a webhook endpoint */
export type DeleteWebhookEndpointsIdResponse = Ok;

/** GET /v1/webhook-endpoints/{id}: Get a webhook endpoint */
export type GetWebhookEndpointsIdResponse = WebhookEndpoint;

/** POST /v1/webhook-endpoints/{id}/rotate-secret: Rotate an endpoint secret */

/** GET /v1/webhook-deliveries: List webhook deliveries */
export type GetWebhookDeliveriesQuery = {
  endpointId?: string;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/webhook-endpoints/{id}/deliveries: List an endpoint's deliveries */
export type GetWebhookEndpointsIdDeliveriesQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/webhook-deliveries/{id}: Get a webhook delivery */

/** POST /v1/webhook-deliveries/{id}/replay: Replay a webhook delivery */
export type PostWebhookDeliveriesIdReplayResponse = Ok;

/** POST /v1/sandbox/simulate: Simulate billing history */
export type PostSandboxSimulateBody = {
  programId: string;
  partnerId: string;
  scenario?: "subscription" | "refund" | "churn";
  priceMinor?: number;
  months?: number;
};

/** POST /v1/import/{provider}: Import partners from another tool */
export type PostImportProviderBody = {
  /** The tool's partner export, as CSV text. */
  csv: string;
};
export type PostImportProviderQuery = {
  programId: string;
  dryRun?: boolean;
  destinationUrl?: string;
};

/** GET /v1/openapi.json: Get the OpenAPI document */

/** GET /v1/openapi.yaml: Get the OpenAPI document as YAML */
export type GetOpenapiYamlResponse = string;

/** GET /v1/branding: Get branding */

/** PUT /v1/branding: Update branding */
export type PutBrandingBody = {
  logoUrl?: string;
  theme?: Record<string, string>;
  emailFrom?: string;
};
export type PutBrandingResponse = Ok;

/** POST /v1/branding/link-domain: Set a custom link domain */
export type PostBrandingLinkDomainBody = {
  domain: string;
};

/** DELETE /v1/branding/link-domain: Remove the link domain */
export type DeleteBrandingLinkDomainResponse = Ok;

/** POST /v1/branding/link-domain/verify: Verify the link domain */

/** POST /v1/branding/domain: Set a custom portal domain */
export type PostBrandingDomainBody = {
  domain: string;
};

/** DELETE /v1/branding/domain: Remove the portal domain */
export type DeleteBrandingDomainResponse = Ok;

/** POST /v1/branding/domain/verify: Verify the portal domain */
export type PostBrandingDomainVerifyResponse = PostBrandingLinkDomainVerifyResponse;

/** POST /v1/embed/tokens: Mint a partner embed token */
export type PostEmbedTokensBody = {
  partnerEmail: string;
};

/** GET /v1/embed/summary: Read embedded partner stats */

/** POST /v1/discovery/search: Search for prospective partners */
export type PostDiscoverySearchBody = {
  keywords: Array<string>;
  category?: string;
};

/** POST /v1/discovery/corpus: Ingest prospects */
export type PostDiscoveryCorpusBody = {
  keywords?: Array<string>;
  entries: Array<{
    name: string;
    url: string;
    channel?: "youtube" | "blog" | "newsletter" | "podcast" | "x";
    audienceSize?: number;
    language?: string;
    categories?: Array<string>;
    keywords?: Array<string>;
    contactEmail?: string;
    html?: string;
    evidenceSnippet?: string;
    evidenceSource?: string;
  }>;
};

/** GET /v1/prospects: List prospects */
export type GetProspectsQuery = {
  status?: "identified" | "queued" | "contacted" | "replied" | "interested" | "declined" | "converted";
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/outreach/draft: Draft an outreach sequence */
export type PostOutreachDraftBody = {
  prospectId: string;
  programName?: string;
};

/** GET /v1/outreach: List outreach messages */
export type GetOutreachQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/outreach/{id}/approve: Approve an outreach message */
export type PostOutreachIdApproveResponse = Ok;

/** POST /v1/outreach/send-due: Send due outreach */

/** POST /v1/unsubscribe/{token}: Unsubscribe from outreach */

/** GET /v1/assistant/suggestions: Get program suggestions */
export type GetAssistantSuggestionsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** PUT /v1/marketplace/listing: List a program in the marketplace */
export type PutMarketplaceListingBody = {
  programId: string;
  visibility?: "public" | "unlisted";
  category?: string;
  headline?: string;
  description?: string;
  sponsored?: boolean;
};
export type PutMarketplaceListingResponse = Ok;

/** GET /v1/marketplace/listing: List the org's marketplace listings */
export type GetMarketplaceListingQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/partner/marketplace: Browse the marketplace */
export type GetPartnerMarketplaceQuery = {
  category?: string;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/partner/profile/verified: Get my verified performance */

/** GET /v1/disputes: List partner disputes */
export type GetDisputesQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/disputes/{id}/resolve: Resolve a dispute */
export type PostDisputesIdResolveBody = {
  resolution: string;
};
export type PostDisputesIdResolveResponse = Ok;

/** GET /v1/partner/profile: Get my creator profile */
export type GetPartnerProfileResponse = CreatorProfile;

/** PUT /v1/partner/profile: Update my creator profile */
export type PutPartnerProfileBody = {
  published?: boolean;
  headline?: string;
  bio?: string;
  categories?: Array<string>;
  languages?: Array<string>;
  country?: string;
  channels?: Array<{
    type: "youtube" | "blog" | "newsletter" | "podcast" | "x" | "tiktok" | "instagram" | "other";
    handle?: string;
    url?: string;
    audience?: number;
  }>;
  website?: string;
  acceptsInvites?: boolean;
  audience?: {
    countries?: Array<{
      code: string;
      pct: number;
    }>;
    age?: Record<string, number>;
    gender?: Record<string, number>;
  };
  engagementBps?: number;
};
export type PutPartnerProfileResponse = Ok;

/** GET /v1/creators: Search creators */
export type GetCreatorsQuery = {
  q?: string;
  category?: string;
  channel?: string;
  minAudience?: number;
  minEngagementBps?: number;
  audienceCountry?: string;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/creators/{accountId}: Get a creator */
export type GetCreatorsAccountIdResponse = CreatorProfile;

/** POST /v1/creators/{accountId}/invite: Invite a creator */
export type PostCreatorsAccountIdInviteBody = {
  programId: string;
  message?: string;
};

/** POST /v1/invitations/{id}/withdraw: Withdraw an invitation */
export type PostInvitationsIdWithdrawResponse = OkStatus;

/** GET /v1/invitations: List creator invitations */
export type GetInvitationsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/partner/invitations: List my invitations */
export type GetPartnerInvitationsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/partner/invitations/{id}/accept: Accept an invitation */
export type PostPartnerInvitationsIdAcceptResponse = OkStatus;

/** POST /v1/partner/invitations/{id}/decline: Decline an invitation */
export type PostPartnerInvitationsIdDeclineResponse = OkStatus;

/** GET /v1/billing/plan: Get the plan */

/** POST /v1/billing/checkout: Start a plan checkout */
export type PostBillingCheckoutBody = {
  plan: "growth" | "pro" | "scale";
};

/** POST /v1/billing/portal: Open the subscription portal */

/** POST /v1/billing/activate: Activate a plan directly */
export type PostBillingActivateBody = {
  plan: "free" | "growth" | "pro" | "scale" | "starter";
};

/** GET /v1/programs/{id}/referee-reward: Get the referee reward */

/** PUT /v1/programs/{id}/referee-reward: Set the referee reward */
export type PutProgramsIdRefereeRewardBody = {
  enabled?: boolean;
  kind?: "store_credit" | "coupon" | "gift_card";
  amountMinor?: number;
  bps?: number;
  capMinor?: number;
  on?: "first_commission" | "first_payment";
  rounding?: "half_even" | "floor";
  currency?: string;
};

/** GET /v1/rewards: List issued referee rewards */
export type GetRewardsQuery = {
  status?: "issued" | "redeemed" | "void";
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/rewards/lookup/{code}: Look up a reward code */

/** POST /v1/rewards/redeem-by-code: Redeem a reward by code */
export type PostRewardsRedeemByCodeBody = {
  amountMinor?: number;
  billingEventId?: string;
  invoiceRef?: string;
  externalId?: string;
  occurredAt?: unknown;
  code: string;
};

/** POST /v1/rewards/{id}/redeem: Redeem a reward */
export type PostRewardsIdRedeemBody = {
  amountMinor?: number;
  billingEventId?: string;
  invoiceRef?: string;
  externalId?: string;
  occurredAt?: unknown;
};
export type PostRewardsIdRedeemResponse = PostRewardsRedeemByCodeResponse;

/** GET /v1/programs/{id}/groups: List partner groups */
export type GetProgramsIdGroupsQuery = {
  includeArchived?: "true" | "false";
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/programs/{id}/groups: Create a partner group */
export type PostProgramsIdGroupsBody = {
  name: string;
  base?: ({
    kind: "percent";
    bps: number;
  } | {
    kind: "fixed";
    amountMinor: number;
    currency: string;
  }) | null;
  holdDays?: number | null;
  minThresholdMinor?: number | null;
  payoutCurrency?: string | null;
  onboardingMessage?: string | null;
  onboardingChecklist?: Array<string>;
};
export type PostProgramsIdGroupsResponse = PartnerGroup;

/** PATCH /v1/partner-groups/{id}: Update a partner group */
export type PatchPartnerGroupsIdBody = {
  name?: string;
  base?: ({
    kind: "percent";
    bps: number;
  } | {
    kind: "fixed";
    amountMinor: number;
    currency: string;
  }) | null;
  holdDays?: number | null;
  minThresholdMinor?: number | null;
  payoutCurrency?: string | null;
  onboardingMessage?: string | null;
  onboardingChecklist?: Array<string>;
  archived?: boolean;
};
export type PatchPartnerGroupsIdResponse = PartnerGroup;

/** PUT /v1/programs/{id}/partners/{partnerId}/group: Set a partner's group */
export type PutProgramsIdPartnersPartnerIdGroupBody = {
  groupId: string | null;
};

/** GET /v1/programs/{id}/promotions: List promotions */
export type GetProgramsIdPromotionsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/programs/{id}/promotions: Create a promotion */
export type PostProgramsIdPromotionsBody = {
  name: string;
  groupId?: string | null;
  effect: ({
    kind: "replace";
    base: {
      kind: "percent";
      bps: number;
    } | {
      kind: "fixed";
      amountMinor: number;
      currency: string;
    };
  }) | {
    kind: "boost";
    bps: number;
  };
  startsAt: string;
  endsAt: string;
};
export type PostProgramsIdPromotionsResponse = Promotion;

/** POST /v1/promotions/{id}/end: End a promotion */
export type PostPromotionsIdEndResponse = Promotion;

/** GET /v1/partner/groups: List my groups */
export type GetPartnerGroupsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/contracts: Create a partner contract */
export type PostContractsBody = {
  programId: string;
  partnerId: string;
  title?: string;
  termsMd?: string;
  compensation: {
    kind: "percent";
    bps: number;
  } | {
    kind: "fixed";
    amountMinor: number;
    currency: string;
  };
  send?: boolean;
};

/** GET /v1/contracts: List partner contracts */
export type GetContractsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/contracts/{id}/send: Send a contract */
export type PostContractsIdSendResponse = OkStatus;

/** GET /v1/partner/contracts: List my contracts */
export type GetPartnerContractsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/partner/contracts/{id}/accept: Accept a contract */
export type PostPartnerContractsIdAcceptResponse = OkStatus;

/** POST /v1/partner/contracts/{id}/decline: Decline a contract */
export type PostPartnerContractsIdDeclineResponse = OkStatus;

/** PUT /v1/programs/{id}/incrementality: Set the incrementality holdout */
export type PutProgramsIdIncrementalityBody = {
  holdoutBps: number;
};

/** GET /v1/incrementality: Get incrementality results */
export type GetIncrementalityQuery = {
  programId: string;
};

/** PUT /v1/programs/{id}/autopricing: Configure autopricing */
export type PutProgramsIdAutopricingBody = {
  enabled?: boolean;
  targetRoas?: number;
  minBps?: number;
  maxBps?: number;
  objective?: "roas" | "roi";
  targetRoi?: number;
};

/** GET /v1/programs/{id}/autopricing: Get autopricing settings */

/** POST /v1/programs/{id}/autoprice/run: Run autopricing */
export type PostProgramsIdAutopriceRunBody = {
  objective?: "roas" | "roi";
};

/** GET /v1/passport/public-key: Get the passport signing key */

/** POST /v1/passport/verify: Verify a partner passport */
export type PostPassportVerifyBody = {
  passport: unknown;
};

/** GET /v1/partner/passport: Get my reputation passport */
export type GetPartnerPassportResponse = Passport;

/** GET /v1/partner/advance/offer: Get my advance offer */

/** POST /v1/partner/advance/accept: Take a commission advance */
export type PostPartnerAdvanceAcceptBody = {
  amountMinor: number;
};

/** GET /v1/partner/advance: List my advances */
export type GetPartnerAdvanceQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** PUT /v1/network/settings: Join or leave the attribution network */
export type PutNetworkSettingsBody = {
  enabled: boolean;
};

/** GET /v1/network/settings: Get network membership */

/** GET /v1/network/journey: Get a customer's network journey */
export type GetNetworkJourneyQuery = {
  emailHash: string;
  model?: "linear" | "first" | "last" | "time_decay";
};

/** PUT /v1/programs/{id}/negotiation-policy: Set the agent negotiation policy */
export type PutProgramsIdNegotiationPolicyBody = {
  enabled?: boolean;
  minBps: number;
  maxBps: number;
  autoAcceptMaxBps: number;
};

/** GET /v1/programs/{id}/negotiation-policy: Get the agent negotiation policy */

/** GET /v1/negotiations: List negotiation rounds */
export type GetNegotiationsQuery = {
  programId?: string;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/cleanroom/consent: Get a customer's consent */
export type GetCleanroomConsentQuery = {
  customerRef: string;
};

/** GET /v1/cleanroom/query: Query the clean room */
export type GetCleanroomQueryQuery = {
  dimension: string;
};

/** GET /v1/agents: List partnered AI agents */
export type GetAgentsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/agents/recommendations: List agent recommendations */
export type GetAgentsRecommendationsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/admin/metrics: Get platform metrics */

/** GET /v1/admin/orgs: List organizations */
export type GetAdminOrgsQuery = {
  q?: string;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/admin/orgs/{id}/suspend: Suspend an organization */
export type PostAdminOrgsIdSuspendBody = {
  reason?: string;
};

/** POST /v1/admin/orgs/{id}/plan: Set an organization's plan */
export type PostAdminOrgsIdPlanBody = {
  plan: "free" | "growth" | "pro" | "scale" | "starter";
};

/** POST /v1/admin/orgs/{id}/unsuspend: Unsuspend an organization */

/** GET /v1/admin/partner-accounts: List partner accounts */
export type GetAdminPartnerAccountsQuery = {
  flagged?: boolean;
  q?: string;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/admin/partner-accounts/{id}/ban: Ban a partner account */

/** POST /v1/admin/partner-accounts/{id}/unban: Unban a partner account */

/** GET /v1/notifications: List notifications */
export type GetNotificationsQuery = {
  unread?: "true" | "false";
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/notifications/{id}/read: Mark a notification read */
export type PostNotificationsIdReadResponse = Ok;

/** GET /v1/partner/notifications: List my notifications */
export type GetPartnerNotificationsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/partner/notifications/{id}/read: Mark my notification read */
export type PostPartnerNotificationsIdReadResponse = Ok;

/** POST /v1/assets: Create a marketing asset */
export type PostAssetsBody = {
  programId: string;
  kind: "banner" | "copy" | "video" | "logo";
  title: string;
  content?: string;
  dimensions?: string;
  groupId?: string | null;
};

/** GET /v1/assets: List marketing assets */
export type GetAssetsQuery = {
  programId?: string;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** DELETE /v1/assets/{id}: Delete a marketing asset */
export type DeleteAssetsIdResponse = Ok;

/** POST /v1/partner/deals: Register a deal */
export type PostPartnerDealsBody = {
  orgId: string;
  programId: string;
  company: string;
  contactEmail: string;
  valueMinor?: number;
  currency?: string;
  notes?: string;
};

/** GET /v1/partner/deals: List my deals */
export type GetPartnerDealsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/deals: List registered deals */
export type GetDealsQuery = {
  status?: "submitted" | "approved" | "rejected" | "won" | "lost";
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/deals/{id}/approve: Approve a deal */
export type PostDealsIdApproveBody = {
  protectionDays?: number;
};

/** POST /v1/deals/{id}/reject: Reject a deal */

/** POST /v1/deals/{id}/won: Mark a deal won */
export type PostDealsIdWonBody = {
  customerRef: string;
};

/** POST /v1/programs/{id}/apply-leveling: Apply partner levels */

/** POST /v1/payout-runs/run-scheduled: Run due payout schedules */

/** PUT /v1/partner/orgs/{orgId}/postback: Set my conversion postback */
export type PutPartnerOrgsOrgIdPostbackBody = {
  url: string;
};

/** GET /v1/partner/postback-logs: List my postback calls */
export type GetPartnerPostbackLogsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/partner/recruit: Get my recruiting link */

/** GET /v1/partner/achievements: List my achievements */
export type GetPartnerAchievementsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/partner/terms: List program terms */
export type GetPartnerTermsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/partner/terms/{versionId}/accept: Accept program terms */
export type PostPartnerTermsVersionIdAcceptResponse = Ok;

/** GET /v1/programs/{id}/terms-acceptances: List terms acceptances */
export type GetProgramsIdTermsAcceptancesQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/setup/status: Get setup progress */

/** GET /v1/export/accounting: Export payouts for accounting */
export type GetExportAccountingQuery = {
  format?: "quickbooks" | "xero";
  year: number;
};
export type GetExportAccountingResponse = string;

/** GET /v1/export/full: Export all org data */
export type GetExportFullResponse = string;

/** POST /v1/anomalies/scan: Scan for anomalies */

/** GET /v1/privacy/export: Export a customer's data */
export type GetPrivacyExportQuery = {
  customerRef: string;
};
export type GetPrivacyExportResponse = CustomerExport;

/** POST /v1/privacy/forget: Erase a data subject */
export type PostPrivacyForgetBody = {
  email?: string;
  customerRef?: string;
  partnerId?: string;
};

/** POST /v1/privacy/lookup: Find a data subject by email */
export type PostPrivacyLookupBody = {
  email: string;
};

/** POST /v1/privacy/requests: Open a data-subject request */
export type PostPrivacyRequestsBody = {
  subject: {
    email?: string;
    customerRef?: string;
    partnerId?: string;
  };
  type: "access" | "erasure";
};

/** GET /v1/privacy/requests: List data-subject requests */
export type GetPrivacyRequestsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/privacy/requests/{id}: Get a data-subject request */
export type GetPrivacyRequestsIdResponse = PrivacyRequest;

/** GET /v1/privacy/requests/{id}/result: Get a data-subject request result */

/** GET /v1/email/settings: Get email settings */
export type GetEmailSettingsResponse = EmailSettings;

/** PUT /v1/email/settings: Update email settings */
export type PutEmailSettingsBody = {
  provider?: ("resend" | "brevo" | "postmark") | null;
  apiKey?: string | null;
  fromAddress?: string | null;
  fromName?: string | null;
  replyTo?: string | null;
  defaultLocale?: "en" | "es" | "de" | "fr" | "pt" | "it" | "nl" | "sv" | "ja" | "zh";
  logoUrl?: string | null;
  primaryColor?: string | null;
};
export type PutEmailSettingsResponse = EmailSettings;

/** POST /v1/email/settings/verify-domain: Check the sending domain */

/** GET /v1/email/templates: List email templates */
export type GetEmailTemplatesQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** PUT /v1/email/templates/{event}/{locale}: Override an email template */
export type PutEmailTemplatesEventLocaleBody = {
  subject: string;
  text: string;
  html?: string | null;
};

/** DELETE /v1/email/templates/{event}/{locale}: Reset an email template */

/** POST /v1/email/preview: Preview an email */
export type PostEmailPreviewBody = {
  event: "payout_sent" | "payout_failed" | "invitation_received" | "partner_approved" | "contract_sent" | "webhook_endpoint_disabled" | "tax_document_ready";
  locale: "en" | "es" | "de" | "fr" | "pt" | "it" | "nl" | "sv" | "ja" | "zh";
  draft?: {
    subject: string;
    text: string;
    html?: string | null;
  };
};
export type PostEmailPreviewResponse = EmailRendered;

/** POST /v1/email/test: Send a test email */
export type PostEmailTestBody = {
  event: "payout_sent" | "payout_failed" | "invitation_received" | "partner_approved" | "contract_sent" | "webhook_endpoint_disabled" | "tax_document_ready";
  locale: "en" | "es" | "de" | "fr" | "pt" | "it" | "nl" | "sv" | "ja" | "zh";
  to: string;
};

/** PUT /v1/me/locale: Set my email language */
export type PutMeLocaleBody = {
  locale: "en" | "es" | "de" | "fr" | "pt" | "it" | "nl" | "sv" | "ja" | "zh";
};

/** PUT /v1/me/roi-digest: Turn my ROI digest on or off */
export type PutMeRoiDigestBody = {
  enabled: boolean;
};

/** PUT /v1/partner/locale: Set my email language (partner) */
export type PutPartnerLocaleBody = {
  locale: "en" | "es" | "de" | "fr" | "pt" | "it" | "nl" | "sv" | "ja" | "zh";
};

/** GET /v1/integrations: List integrations */

/** PUT /v1/integrations/hubspot: Connect HubSpot */
export type PutIntegrationsHubspotBody = {
  token?: string;
  pipeline?: string | null;
  newDealStage?: string | null;
  paidDealStage?: string | null;
  status?: "active" | "paused";
};
export type PutIntegrationsHubspotResponse = IntegrationConnection;

/** PUT /v1/integrations/segment: Connect Segment */
export type PutIntegrationsSegmentBody = {
  writeKey?: string;
  events?: (Array<"referral.created" | "commission.earned" | "commission.reversed" | "commission.settled" | "payout.sent" | "payout.failed" | "partner.applied" | "partner.enrolled" | "partner.approved">) | null;
  status?: "active" | "paused";
};
export type PutIntegrationsSegmentResponse = IntegrationConnection;

/** DELETE /v1/integrations/{kind}: Disconnect an integration */
export type DeleteIntegrationsKindResponse = Ok;

/** POST /v1/integrations/hubspot/test: Test the HubSpot connection */
export type PostIntegrationsHubspotTestBody = {
  setupProperties?: boolean;
};

/** POST /v1/integrations/segment/test: Test the Segment connection */

/** GET /v1/integrations/deliveries: List integration deliveries */
export type GetIntegrationsDeliveriesQuery = {
  kind?: "zapier" | "hubspot" | "segment";
  status?: "pending" | "sent" | "failed" | "skipped";
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/integrations/deliveries/{id}/retry: Retry an integration delivery */
export type PostIntegrationsDeliveriesIdRetryResponse = IntegrationDelivery;

/** GET /v1/zapier/events: List Zapier trigger events */

/** POST /v1/zapier/hooks: Subscribe a Zapier hook */
export type PostZapierHooksBody = {
  target_url: string;
  event: "referral.created" | "commission.earned" | "commission.reversed" | "commission.settled" | "payout.sent" | "payout.failed" | "partner.applied" | "partner.enrolled" | "partner.approved" | "deal.submitted" | "fraud.case_opened";
};
export type PostZapierHooksResponse = ZapierHook;

/** GET /v1/zapier/hooks: List Zapier hooks */
export type GetZapierHooksQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** DELETE /v1/zapier/hooks/{id}: Unsubscribe a Zapier hook */
export type DeleteZapierHooksIdResponse = Ok;

/** GET /v1/zapier/triggers/{event}: Poll a Zapier trigger */
export type GetZapierTriggersEventQuery = {
  limit?: number;
};

/** POST /v1/zapier/conversions: Record a conversion from Zapier */
export type PostZapierConversionsBody = {
  providerEventId: string;
  type?: "invoice_paid" | "refund";
  customerRef: string;
  amountMinor: number;
  currency?: string;
  invoiceRef?: string;
  occurredAt?: string;
  connectionId?: string;
};

/** POST /v1/partner/security/totp/setup: Start two-factor setup */

/** POST /v1/partner/security/totp/enable: Turn on two-factor */
export type PostPartnerSecurityTotpEnableBody = {
  code: string;
};

/** POST /v1/partner/security/totp/disable: Turn off two-factor */
export type PostPartnerSecurityTotpDisableBody = {
  code: string;
};

/** GET /v1/partner/security: Get my security settings */

/** POST /v1/auth/connections: Connect an auth platform */
export type PostAuthConnectionsBody = {
  provider: "clerk" | "supabase" | "workos" | "generic" | "atlas" | "custom";
  programId: string;
  instanceId?: string;
  autoEnrollUsers?: boolean;
  destinationUrl?: string;
  name?: string;
  secret?: string;
  keys?: {
    referralToken?: string;
    anonId?: string;
    couponCode?: string;
    programId?: string;
    autoEnroll?: string;
  };
};
export type PostAuthConnectionsResponse = CreatedAuthConnection;

/** GET /v1/auth/connections: List auth connections */
export type GetAuthConnectionsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** POST /v1/auth/connections/{id}/rotate-secret: Rotate an auth connection secret */

/** PATCH /v1/auth/connections/{id}: Update an auth connection */
export type PatchAuthConnectionsIdBody = {
  status?: "active" | "paused";
  name?: string;
  autoEnrollUsers?: boolean;
  destinationUrl?: string | null;
  signatureVersion?: "v1+v2" | "v2";
};

/** DELETE /v1/auth/connections/{id}: Delete an auth connection */
export type DeleteAuthConnectionsIdResponse = Ok;

/** POST /v1/auth/connections/{id}/revoke-previous-secret: Revoke the previous auth secret */

/** POST /v1/auth/connections/{id}/signups: Attribute a new user (signed protocol) */
export type PostAuthConnectionsIdSignupsBody = {
  customerRef: string;
  email?: string;
  emailHash?: string;
  name?: string;
  ip?: string;
  ua?: string;
  signedUpAt: string;
  referral?: {
    code?: string;
    clickId?: string;
    anonId?: string;
    capturedAt?: string;
    consent?: "granted" | "not_required";
  };
  risk?: {
    botScore?: number;
    disposableEmail?: boolean;
    emailVerified?: boolean;
    selfReferral?: boolean;
    velocity?: number;
    reasons?: Array<string>;
    score?: number;
    level?: "low" | "medium" | "high";
    dropped?: boolean;
  };
  emailDomain?: string;
  referralCode?: string;
  autoEnroll?: boolean;
  test?: boolean;
};

/** POST /v1/auth/connections/{id}/erase: Erase a user (signed protocol) */
export type PostAuthConnectionsIdEraseBody = {
  customerRef: string;
};

/** GET /v1/auth/connections/{id}/export: Export a user (signed protocol) */
export type GetAuthConnectionsIdExportQuery = {
  customerRef: string;
};

/** POST /v1/auth/connections/{id}/ping: Test an auth connection (signed protocol) */
export type PostAuthConnectionsIdPingBody = Record<string, unknown>;

/** POST /v1/auth/connections/{id}/aliases: Change a user's id (signed protocol) */
export type PostAuthConnectionsIdAliasesBody = {
  fromCustomerRef: string;
  toCustomerRef: string;
};

/** POST /v1/auth/connections/{id}/users: Update a user (signed protocol) */
export type PostAuthConnectionsIdUsersBody = {
  customerRef: string;
  email?: string;
  name?: string;
  status?: "active" | "suspended" | "deleted";
};

/** POST /v1/auth/connections/{id}/signals: Report a user signal (signed protocol) */
export type PostAuthConnectionsIdSignalsBody = {
  customerRef: string;
  signal: "email_verified" | "banned" | "unbanned" | "fraud_confirmed" | "self_referral";
  at?: string;
  details?: Record<string, unknown>;
};

/** GET /v1/org/sso: Get SSO settings */

/** PATCH /v1/org/sso: Update SSO settings */
export type PatchOrgSsoBody = {
  requireSso?: boolean;
  roleMapping?: Record<string, "owner" | "admin" | "finance" | "analyst" | "support">;
};

/** POST /v1/org/sso/link: Link the org to SSO */

/** POST /v1/org/sso/tickets: Create an SSO setup link */
export type PostOrgSsoTicketsBody = {
  expiresInDays?: number;
};

/** POST /v1/org/sso/tickets/{id}/revoke: Revoke an SSO setup link */

/** GET /v1/org/sso/connections/{id}/saml-metadata: Get SAML metadata */

/** POST /v1/partner/auth/wallet/nonce: Get a wallet sign-in nonce */
export type PostPartnerAuthWalletNonceBody = {
  address: string;
};

/** POST /v1/partner/auth/wallet/verify: Sign in with a wallet */
export type PostPartnerAuthWalletVerifyBody = {
  address: string;
  nonce: string;
  signature: string;
  name?: string;
};

/** POST /v1/onchain/connections: Create an on-chain connection */
export type PostOnchainConnectionsBody = {
  programId: string;
  name?: string;
  secret?: string;
  decimals?: Record<string, number>;
};

/** GET /v1/onchain/connections: List on-chain connections */
export type GetOnchainConnectionsQuery = {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  "created[gte]"?: string;
  "created[lte]"?: string;
};

/** GET /v1/public/programs/{handle}: Get a program's public page */

/** POST /v1/public/programs/{handle}/join: Join a program */
export type PostPublicProgramsHandleJoinBody = {
  destinationUrl?: string | "";
};

/** POST /webhooks/billing/{connectionId}: Receive a billing provider webhook */
export type PostWebhooksBillingConnectionIdBody = {
  /** Generic connections only. */
  events?: Array<{
    providerEventId: string;
    type: string;
    customerRef: string;
    invoiceRef?: string;
    /** Integer minor units. */
    amountGross: number;
    currency: string;
    occurredAt: string;
    metadata?: Record<string, unknown>;
  }>;
};

/** POST /webhooks/auth/{connectionId}: Receive an auth platform webhook */

/** POST /webhooks/sso/{provider}: Receive SSO provider events */

/** POST /webhooks/atlas: Receive Atlas SSO events */
export type PostWebhooksAtlasResponse = PostWebhooksSsoProviderResponse;

/** POST /webhooks/onchain/{connectionId}: Receive on-chain conversions */

/** POST /webhooks/payouts/{provider}: Receive payout settlement webhooks */

/** POST /webhooks/stripe-billing: Receive Referalli's own subscription events */

/** GET /t/{orgToken}/theme.css: Get the white-label theme stylesheet */
export type GetTOrgTokenThemeCssResponse = string;

/** GET /embed.js: Get the partner stats embed script */
export type GetEmbedJsResponse = string;

/** GET /embed-signup.js: Get the embedded partner sign-up script */
export type GetEmbedSignupJsResponse = string;

/** GET /lead/{orgToken}/{code}: Show a hosted lead form */
export type GetLeadOrgTokenCodeResponse = string;

/** POST /lead/{orgToken}/{code}: Submit a hosted lead form */
export type PostLeadOrgTokenCodeBody = {
  email: string;
};
export type PostLeadOrgTokenCodeResponse = string;

/** GET /v1/graphql: Query the GraphQL read layer */

/** POST /v1/graphql: Query the GraphQL read layer (POST) */
export type PostGraphqlBody = {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
};

/** Every webhook topic and its payload. */
export type WebhookPayloads = {
  /** A tracked click was recorded */
  "click.recorded": ClickRecordedEvent;
  /** A customer was attributed to a partner */
  "referral.created": ReferralCreatedEvent;
  /** A referral was held for review */
  "referral.held": ReferralHeldEvent;
  /** A held referral was approved */
  "referral.approved": ReferralApprovedEvent;
  /** A referral was voided */
  "referral.voided": ReferralVoidedEvent;
  /** A referral was paused */
  "referral.paused": ReferralPausedEvent;
  /** A paused referral was resumed */
  "referral.resumed": ReferralResumedEvent;
  /** A referral moved to another partner */
  "referral.reassigned": ReferralReassignedEvent;
  /** A self-referral was refused */
  "referral.rejected": ReferralRejectedEvent;
  /** A customer's id changed */
  "customer.aliased": CustomerAliasedEvent;
  /** A commission line was earned */
  "commission.earned": CommissionEarnedEvent;
  /** A commission line was reversed */
  "commission.reversed": CommissionReversedEvent;
  /** A commission line was settled by the merchant */
  "commission.settled": CommissionSettledEvent;
  /** A partner applied to a program */
  "partner.applied": PartnerAppliedEvent;
  /** A partner was enrolled */
  "partner.enrolled": PartnerEnrolledEvent;
  /** A partner was approved */
  "partner.approved": PartnerApprovedEvent;
  /** A partner reached a new level */
  "partner.level_up": PartnerLevelUpEvent;
  /** A payout was created in a run */
  "payout.scheduled": PayoutScheduledEvent;
  /** A payout was submitted to the provider */
  "payout.submitted": PayoutSubmittedEvent;
  /** A payout was paid */
  "payout.sent": PayoutSentEvent;
  /** A payout failed */
  "payout.failed": PayoutFailedEvent;
  /** A payout was cancelled */
  "payout.cancelled": PayoutCancelledEvent;
  /** A tax form was delivered to a partner */
  "tax.form_delivered": TaxFormDeliveredEvent;
  /** A referred customer earned their reward */
  "referee_reward.earned": RefereeRewardEarnedEvent;
  /** A referee reward was redeemed */
  "credit.redeemed": CreditRedeemedEvent;
  /** A billing event was recorded */
  "billing_event.recorded": BillingEventRecordedEvent;
  /** A credit grant paid back */
  "roi.payback_reached": RoiPaybackReachedEvent;
  /** A value pattern changed */
  "roi.pattern_detected": RoiPatternDetectedEvent;
  /** A fraud case was opened */
  "fraud.case_opened": FraudCaseOpenedEvent;
  /** A partner registered a deal */
  "deal.submitted": DealSubmittedEvent;
  /** A partner dispute was resolved */
  "dispute.resolved": DisputeResolvedEvent;
  /** A data-subject request finished */
  "privacy.request_completed": PrivacyRequestCompletedEvent;
  /** A failing webhook endpoint was disabled */
  "webhook_endpoint.disabled": WebhookEndpointDisabledEvent;
};

/** Every operation, by operationId. */
export const operations = {
  getTOrgTokenAffJs: { method: 'GET', path: '/t/{orgToken}/aff.js' },
  getGoOrgTokenCode: { method: 'GET', path: '/go/{orgToken}/{code}' },
  postTOrgTokenVisit: { method: 'POST', path: '/t/{orgToken}/visit' },
  getTOrgTokenCodesCode: { method: 'GET', path: '/t/{orgToken}/codes/{code}' },
  postTOrgTokenIdentify: { method: 'POST', path: '/t/{orgToken}/identify' },
  getTOrgTokenWidgetJs: { method: 'GET', path: '/t/{orgToken}/widget.js' },
  getTOrgTokenWidgetMe: { method: 'GET', path: '/t/{orgToken}/widget/me' },
  getTOrgTokenMobileResolve: { method: 'GET', path: '/t/{orgToken}/mobile/resolve' },
  postTOrgTokenMobileInstall: { method: 'POST', path: '/t/{orgToken}/mobile/install' },
  postTOrgTokenMobileEvent: { method: 'POST', path: '/t/{orgToken}/mobile/event' },
  getWellKnownAppleAppSiteAssociation: { method: 'GET', path: '/.well-known/apple-app-site-association' },
  getWellKnownAssetlinksJson: { method: 'GET', path: '/.well-known/assetlinks.json' },
  postV1AgentsRegister: { method: 'POST', path: '/v1/agents/register' },
  postTOrgTokenAgentAttribute: { method: 'POST', path: '/t/{orgToken}/agent/attribute' },
  postTOrgTokenAgentNegotiate: { method: 'POST', path: '/t/{orgToken}/agent/negotiate' },
  postTOrgTokenConsent: { method: 'POST', path: '/t/{orgToken}/consent' },
  getV1Health: { method: 'GET', path: '/v1/health' },
  getV1Versions: { method: 'GET', path: '/v1/versions' },
  getV1AuthOidcStart: { method: 'GET', path: '/v1/auth/oidc/start' },
  getV1AuthAtlasStart: { method: 'GET', path: '/v1/auth/atlas/start' },
  getV1AuthOidcCallback: { method: 'GET', path: '/v1/auth/oidc/callback' },
  getV1AuthAtlasCallback: { method: 'GET', path: '/v1/auth/atlas/callback' },
  getV1AuthHandoff: { method: 'GET', path: '/v1/auth/handoff' },
  getV1AuthProviders: { method: 'GET', path: '/v1/auth/providers' },
  postV1AuthLogout: { method: 'POST', path: '/v1/auth/logout' },
  postV1Orgs: { method: 'POST', path: '/v1/orgs' },
  getV1Me: { method: 'GET', path: '/v1/me' },
  getV1HostsCurrent: { method: 'GET', path: '/v1/hosts/current' },
  getV1HostsCurrentThemeCss: { method: 'GET', path: '/v1/hosts/current/theme.css' },
  getV1AuthForumulate: { method: 'GET', path: '/v1/auth/forumulate' },
  postV1MobilePurchases: { method: 'POST', path: '/v1/mobile/purchases' },
  getV1Org: { method: 'GET', path: '/v1/org' },
  patchV1Org: { method: 'PATCH', path: '/v1/org' },
  getV1OrgMembers: { method: 'GET', path: '/v1/org/members' },
  postV1OrgMembers: { method: 'POST', path: '/v1/org/members' },
  patchV1OrgMembersUserId: { method: 'PATCH', path: '/v1/org/members/{userId}' },
  deleteV1OrgMembersUserId: { method: 'DELETE', path: '/v1/org/members/{userId}' },
  putV1OrgPayoutSchedule: { method: 'PUT', path: '/v1/org/payout-schedule' },
  getV1OrgPayoutSchedule: { method: 'GET', path: '/v1/org/payout-schedule' },
  putV1ProgramsIdPayoutSchedule: { method: 'PUT', path: '/v1/programs/{id}/payout-schedule' },
  getV1OrgTaxProfile: { method: 'GET', path: '/v1/org/tax-profile' },
  putV1OrgTaxProfile: { method: 'PUT', path: '/v1/org/tax-profile' },
  putV1PartnersIdVat: { method: 'PUT', path: '/v1/partners/{id}/vat' },
  getV1PartnerOrgsOrgIdSelfBilling: { method: 'GET', path: '/v1/partner/orgs/{orgId}/self-billing' },
  postV1PartnerOrgsOrgIdSelfBilling: { method: 'POST', path: '/v1/partner/orgs/{orgId}/self-billing' },
  putV1PartnerOrgsOrgIdVat: { method: 'PUT', path: '/v1/partner/orgs/{orgId}/vat' },
  getV1PayoutsIdInvoice: { method: 'GET', path: '/v1/payouts/{id}/invoice' },
  getV1PartnerPayoutsIdInvoice: { method: 'GET', path: '/v1/partner/payouts/{id}/invoice' },
  putV1OrgTaxFiling: { method: 'PUT', path: '/v1/org/tax-filing' },
  getV1Tax1099Preview: { method: 'GET', path: '/v1/tax/1099/preview' },
  postV1Tax1099Filings: { method: 'POST', path: '/v1/tax/1099/filings' },
  getV1Tax1099Filings: { method: 'GET', path: '/v1/tax/1099/filings' },
  postV1Tax1099FilingsIdRefresh: { method: 'POST', path: '/v1/tax/1099/filings/{id}/refresh' },
  postV1Tax1099DocumentsIdCorrect: { method: 'POST', path: '/v1/tax/1099/documents/{id}/correct' },
  getV1PartnerTaxDocuments: { method: 'GET', path: '/v1/partner/tax-documents' },
  getV1PartnerTaxDocumentsId: { method: 'GET', path: '/v1/partner/tax-documents/{id}' },
  getV1Status: { method: 'GET', path: '/v1/status' },
  getV1StatusIncidents: { method: 'GET', path: '/v1/status/incidents' },
  getV1StatusIncidentsAtom: { method: 'GET', path: '/v1/status/incidents.atom' },
  getV1StatusIncidentsId: { method: 'GET', path: '/v1/status/incidents/{id}' },
  postV1AdminStatusIncidents: { method: 'POST', path: '/v1/admin/status/incidents' },
  patchV1AdminStatusIncidentsId: { method: 'PATCH', path: '/v1/admin/status/incidents/{id}' },
  postV1AdminStatusIncidentsIdUpdates: { method: 'POST', path: '/v1/admin/status/incidents/{id}/updates' },
  getV1OrgRetention: { method: 'GET', path: '/v1/org/retention' },
  putV1OrgRetention: { method: 'PUT', path: '/v1/org/retention' },
  getV1OrgReferralParams: { method: 'GET', path: '/v1/org/referral-params' },
  putV1OrgReferralParams: { method: 'PUT', path: '/v1/org/referral-params' },
  postV1Programs: { method: 'POST', path: '/v1/programs' },
  getV1Programs: { method: 'GET', path: '/v1/programs' },
  getV1ProgramsId: { method: 'GET', path: '/v1/programs/{id}' },
  patchV1ProgramsId: { method: 'PATCH', path: '/v1/programs/{id}' },
  postV1ProgramsIdEnrollments: { method: 'POST', path: '/v1/programs/{id}/enrollments' },
  getV1ProgramsIdEnrollments: { method: 'GET', path: '/v1/programs/{id}/enrollments' },
  postV1ProgramsIdEnrollmentsEnrollmentIdApprove: { method: 'POST', path: '/v1/programs/{id}/enrollments/{enrollmentId}/approve' },
  postV1ProgramsIdEnrollmentsEnrollmentIdReject: { method: 'POST', path: '/v1/programs/{id}/enrollments/{enrollmentId}/reject' },
  postV1Partners: { method: 'POST', path: '/v1/partners' },
  getV1Partners: { method: 'GET', path: '/v1/partners' },
  getV1PartnersId: { method: 'GET', path: '/v1/partners/{id}' },
  patchV1PartnersId: { method: 'PATCH', path: '/v1/partners/{id}' },
  deleteV1PartnersId: { method: 'DELETE', path: '/v1/partners/{id}' },
  getV1PartnersIdEnrollments: { method: 'GET', path: '/v1/partners/{id}/enrollments' },
  getV1ProgramsIdGraph: { method: 'GET', path: '/v1/programs/{id}/graph' },
  postV1ApiKeys: { method: 'POST', path: '/v1/api-keys' },
  getV1ApiKeys: { method: 'GET', path: '/v1/api-keys' },
  getV1ApiKeysId: { method: 'GET', path: '/v1/api-keys/{id}' },
  patchV1ApiKeysId: { method: 'PATCH', path: '/v1/api-keys/{id}' },
  deleteV1ApiKeysId: { method: 'DELETE', path: '/v1/api-keys/{id}' },
  getV1AuditLogs: { method: 'GET', path: '/v1/audit-logs' },
  getV1TestClock: { method: 'GET', path: '/v1/test_clock' },
  postV1TestClockAdvance: { method: 'POST', path: '/v1/test_clock/advance' },
  getV1TestEmails: { method: 'GET', path: '/v1/test/emails' },
  postV1CliDeviceCodes: { method: 'POST', path: '/v1/cli/device-codes' },
  postV1CliDeviceCodesToken: { method: 'POST', path: '/v1/cli/device-codes/token' },
  getV1CliDeviceCodesUserCode: { method: 'GET', path: '/v1/cli/device-codes/{userCode}' },
  postV1CliDeviceCodesUserCodeApprove: { method: 'POST', path: '/v1/cli/device-codes/{userCode}/approve' },
  postV1CliDeviceCodesUserCodeDeny: { method: 'POST', path: '/v1/cli/device-codes/{userCode}/deny' },
  postV1CliListeners: { method: 'POST', path: '/v1/cli/listeners' },
  getV1CliListenersIdEvents: { method: 'GET', path: '/v1/cli/listeners/{id}/events' },
  deleteV1CliListenersId: { method: 'DELETE', path: '/v1/cli/listeners/{id}' },
  postV1CliTrigger: { method: 'POST', path: '/v1/cli/trigger' },
  getV1CliTopics: { method: 'GET', path: '/v1/cli/topics' },
  getV1CliLogs: { method: 'GET', path: '/v1/cli/logs' },
  postV1Links: { method: 'POST', path: '/v1/links' },
  getV1Links: { method: 'GET', path: '/v1/links' },
  getV1LinksIdQr: { method: 'GET', path: '/v1/links/{id}/qr' },
  postV1Coupons: { method: 'POST', path: '/v1/coupons' },
  getV1Coupons: { method: 'GET', path: '/v1/coupons' },
  postV1WidgetTokens: { method: 'POST', path: '/v1/widget/tokens' },
  postV1ReferralsAssociate: { method: 'POST', path: '/v1/referrals/associate' },
  getV1Referrals: { method: 'GET', path: '/v1/referrals' },
  getV1ReferralsId: { method: 'GET', path: '/v1/referrals/{id}' },
  patchV1ReferralsId: { method: 'PATCH', path: '/v1/referrals/{id}' },
  getV1ReferralsIdJourney: { method: 'GET', path: '/v1/referrals/{id}/journey' },
  postV1ReferralsIdVoid: { method: 'POST', path: '/v1/referrals/{id}/void' },
  postV1ReferralsIdReassign: { method: 'POST', path: '/v1/referrals/{id}/reassign' },
  postV1ReferralsIdApprove: { method: 'POST', path: '/v1/referrals/{id}/approve' },
  postV1AttributionReplay: { method: 'POST', path: '/v1/attribution/replay' },
  postV1TrackEvents: { method: 'POST', path: '/v1/track/events' },
  postV1CommissionRules: { method: 'POST', path: '/v1/commission-rules' },
  getV1CommissionRules: { method: 'GET', path: '/v1/commission-rules' },
  getV1Commissions: { method: 'GET', path: '/v1/commissions' },
  getV1CommissionsId: { method: 'GET', path: '/v1/commissions/{id}' },
  getV1PartnersIdBalances: { method: 'GET', path: '/v1/partners/{id}/balances' },
  postV1CommissionsApproveDue: { method: 'POST', path: '/v1/commissions/approve-due' },
  postV1CommissionsIdAdjust: { method: 'POST', path: '/v1/commissions/{id}/adjust' },
  postV1CommissionsIdSettle: { method: 'POST', path: '/v1/commissions/{id}/settle' },
  postV1BillingConnections: { method: 'POST', path: '/v1/billing/connections' },
  getV1BillingConnections: { method: 'GET', path: '/v1/billing/connections' },
  putV1BillingConnectionsIdSecret: { method: 'PUT', path: '/v1/billing/connections/{id}/secret' },
  putV1BillingConnectionsIdCredentials: { method: 'PUT', path: '/v1/billing/connections/{id}/credentials' },
  getV1BillingConnectionsId: { method: 'GET', path: '/v1/billing/connections/{id}' },
  patchV1BillingConnectionsId: { method: 'PATCH', path: '/v1/billing/connections/{id}' },
  deleteV1BillingConnectionsId: { method: 'DELETE', path: '/v1/billing/connections/{id}' },
  putV1BillingConnectionsIdValueMapping: { method: 'PUT', path: '/v1/billing/connections/{id}/value-mapping' },
  postV1BillingConnectionsIdValueMappingPreview: { method: 'POST', path: '/v1/billing/connections/{id}/value-mapping/preview' },
  postV1BillingConnectionsIdRotateSecret: { method: 'POST', path: '/v1/billing/connections/{id}/rotate-secret' },
  getV1BillingEvents: { method: 'GET', path: '/v1/billing/events' },
  putV1PartnersIdPayoutProfile: { method: 'PUT', path: '/v1/partners/{id}/payout-profile' },
  getV1PartnersIdPayoutProfile: { method: 'GET', path: '/v1/partners/{id}/payout-profile' },
  patchV1PartnersIdPayoutProfile: { method: 'PATCH', path: '/v1/partners/{id}/payout-profile' },
  postV1PartnersIdTaxForm: { method: 'POST', path: '/v1/partners/{id}/tax-form' },
  postV1PayoutRuns: { method: 'POST', path: '/v1/payout-runs' },
  getV1PayoutRuns: { method: 'GET', path: '/v1/payout-runs' },
  postV1PayoutRunsIdExecute: { method: 'POST', path: '/v1/payout-runs/{id}/execute' },
  postV1PayoutRunsIdCancel: { method: 'POST', path: '/v1/payout-runs/{id}/cancel' },
  getV1Payouts: { method: 'GET', path: '/v1/payouts' },
  getV1Tax1099: { method: 'GET', path: '/v1/tax/1099' },
  postV1FxRates: { method: 'POST', path: '/v1/fx-rates' },
  getV1FxRates: { method: 'GET', path: '/v1/fx-rates' },
  getV1OrgFxFeed: { method: 'GET', path: '/v1/org/fx-feed' },
  putV1OrgFxFeed: { method: 'PUT', path: '/v1/org/fx-feed' },
  postV1FxRatesSync: { method: 'POST', path: '/v1/fx-rates/sync' },
  postV1FxRatesClearOverride: { method: 'POST', path: '/v1/fx-rates/clear-override' },
  getV1PayoutConnections: { method: 'GET', path: '/v1/payout-connections' },
  putV1PayoutConnectionsProvider: { method: 'PUT', path: '/v1/payout-connections/{provider}' },
  deleteV1PayoutConnectionsProvider: { method: 'DELETE', path: '/v1/payout-connections/{provider}' },
  postV1FraudInvalidTrafficScan: { method: 'POST', path: '/v1/fraud/invalid-traffic/scan' },
  getV1FraudCases: { method: 'GET', path: '/v1/fraud/cases' },
  postV1FraudCasesIdResolve: { method: 'POST', path: '/v1/fraud/cases/{id}/resolve' },
  getV1PartnersIdQuality: { method: 'GET', path: '/v1/partners/{id}/quality' },
  postV1QualityRecompute: { method: 'POST', path: '/v1/quality/recompute' },
  postV1FraudDetectRings: { method: 'POST', path: '/v1/fraud/detect-rings' },
  getV1ReportsFilteredClicks: { method: 'GET', path: '/v1/reports/filtered-clicks' },
  getV1AnalyticsOverview: { method: 'GET', path: '/v1/analytics/overview' },
  getV1AnalyticsTimeseries: { method: 'GET', path: '/v1/analytics/timeseries' },
  getV1AnalyticsCohortLtv: { method: 'GET', path: '/v1/analytics/cohort-ltv' },
  getV1AnalyticsByGeo: { method: 'GET', path: '/v1/analytics/by-geo' },
  getV1AnalyticsByChannel: { method: 'GET', path: '/v1/analytics/by-channel' },
  getV1AnalyticsCouponPerformance: { method: 'GET', path: '/v1/analytics/coupon-performance' },
  getV1ReportsPartnerPerformance: { method: 'GET', path: '/v1/reports/partner-performance' },
  getV1ProfitabilitySettings: { method: 'GET', path: '/v1/profitability/settings' },
  putV1ProfitabilitySettings: { method: 'PUT', path: '/v1/profitability/settings' },
  getV1ProfitabilityProducts: { method: 'GET', path: '/v1/profitability/products' },
  getV1ProfitabilityProductsProductRef: { method: 'GET', path: '/v1/profitability/products/{productRef}' },
  putV1ProfitabilityProductsProductRef: { method: 'PUT', path: '/v1/profitability/products/{productRef}' },
  deleteV1ProfitabilityProductsProductRef: { method: 'DELETE', path: '/v1/profitability/products/{productRef}' },
  postV1ProfitabilityRebuild: { method: 'POST', path: '/v1/profitability/rebuild' },
  getV1ProfitabilityRebuildJobId: { method: 'GET', path: '/v1/profitability/rebuild/{jobId}' },
  getV1RoiSummary: { method: 'GET', path: '/v1/roi/summary' },
  getV1RoiBreakdown: { method: 'GET', path: '/v1/roi/breakdown' },
  getV1RoiGrants: { method: 'GET', path: '/v1/roi/grants' },
  getV1RoiTraceCustomerRef: { method: 'GET', path: '/v1/roi/trace/{customerRef}' },
  getV1RoiPartnersIdTrace: { method: 'GET', path: '/v1/roi/partners/{id}/trace' },
  getV1RoiPatterns: { method: 'GET', path: '/v1/roi/patterns' },
  getV1RoiPatternsPattern: { method: 'GET', path: '/v1/roi/patterns/{pattern}' },
  postV1RoiPatternsPatternReview: { method: 'POST', path: '/v1/roi/patterns/{pattern}/review' },
  getV1RoiDataQuality: { method: 'GET', path: '/v1/roi/data-quality' },
  postV1ValueEvents: { method: 'POST', path: '/v1/value/events' },
  postV1ValueImport: { method: 'POST', path: '/v1/value/import' },
  getV1ValueImportJobId: { method: 'GET', path: '/v1/value/import/{jobId}' },
  getV1PartnerKycStatus: { method: 'GET', path: '/v1/partner/kyc/status' },
  postV1PartnerKycSubmit: { method: 'POST', path: '/v1/partner/kyc/submit' },
  getV1PartnerMe: { method: 'GET', path: '/v1/partner/me' },
  getV1PartnerStats: { method: 'GET', path: '/v1/partner/stats' },
  getV1PartnerLinks: { method: 'GET', path: '/v1/partner/links' },
  postV1PartnerLinks: { method: 'POST', path: '/v1/partner/links' },
  getV1PartnerAssets: { method: 'GET', path: '/v1/partner/assets' },
  getV1PartnerDisputes: { method: 'GET', path: '/v1/partner/disputes' },
  postV1PartnerDisputes: { method: 'POST', path: '/v1/partner/disputes' },
  getV1PartnerLinksIdQr: { method: 'GET', path: '/v1/partner/links/{id}/qr' },
  getV1PartnerReferrals: { method: 'GET', path: '/v1/partner/referrals' },
  getV1PartnerReferralsIdTransparency: { method: 'GET', path: '/v1/partner/referrals/{id}/transparency' },
  getV1PartnerPayouts: { method: 'GET', path: '/v1/partner/payouts' },
  putV1PartnerOrgsOrgIdPayoutProfile: { method: 'PUT', path: '/v1/partner/orgs/{orgId}/payout-profile' },
  postV1PartnerOrgsOrgIdTaxForm: { method: 'POST', path: '/v1/partner/orgs/{orgId}/tax-form' },
  getV1PartnerProgramsProgramIdLeaderboard: { method: 'GET', path: '/v1/partner/programs/{programId}/leaderboard' },
  postV1PartnerProgramsProgramIdApply: { method: 'POST', path: '/v1/partner/programs/{programId}/apply' },
  postV1WebhookEndpoints: { method: 'POST', path: '/v1/webhook-endpoints' },
  getV1WebhookEndpoints: { method: 'GET', path: '/v1/webhook-endpoints' },
  patchV1WebhookEndpointsId: { method: 'PATCH', path: '/v1/webhook-endpoints/{id}' },
  deleteV1WebhookEndpointsId: { method: 'DELETE', path: '/v1/webhook-endpoints/{id}' },
  getV1WebhookEndpointsId: { method: 'GET', path: '/v1/webhook-endpoints/{id}' },
  postV1WebhookEndpointsIdRotateSecret: { method: 'POST', path: '/v1/webhook-endpoints/{id}/rotate-secret' },
  getV1WebhookDeliveries: { method: 'GET', path: '/v1/webhook-deliveries' },
  getV1WebhookEndpointsIdDeliveries: { method: 'GET', path: '/v1/webhook-endpoints/{id}/deliveries' },
  getV1WebhookDeliveriesId: { method: 'GET', path: '/v1/webhook-deliveries/{id}' },
  postV1WebhookDeliveriesIdReplay: { method: 'POST', path: '/v1/webhook-deliveries/{id}/replay' },
  postV1SandboxSimulate: { method: 'POST', path: '/v1/sandbox/simulate' },
  postV1ImportProvider: { method: 'POST', path: '/v1/import/{provider}' },
  getV1OpenapiJson: { method: 'GET', path: '/v1/openapi.json' },
  getV1OpenapiYaml: { method: 'GET', path: '/v1/openapi.yaml' },
  getV1Branding: { method: 'GET', path: '/v1/branding' },
  putV1Branding: { method: 'PUT', path: '/v1/branding' },
  postV1BrandingLinkDomain: { method: 'POST', path: '/v1/branding/link-domain' },
  deleteV1BrandingLinkDomain: { method: 'DELETE', path: '/v1/branding/link-domain' },
  postV1BrandingLinkDomainVerify: { method: 'POST', path: '/v1/branding/link-domain/verify' },
  postV1BrandingDomain: { method: 'POST', path: '/v1/branding/domain' },
  deleteV1BrandingDomain: { method: 'DELETE', path: '/v1/branding/domain' },
  postV1BrandingDomainVerify: { method: 'POST', path: '/v1/branding/domain/verify' },
  postV1EmbedTokens: { method: 'POST', path: '/v1/embed/tokens' },
  getV1EmbedSummary: { method: 'GET', path: '/v1/embed/summary' },
  postV1DiscoverySearch: { method: 'POST', path: '/v1/discovery/search' },
  postV1DiscoveryCorpus: { method: 'POST', path: '/v1/discovery/corpus' },
  getV1Prospects: { method: 'GET', path: '/v1/prospects' },
  postV1OutreachDraft: { method: 'POST', path: '/v1/outreach/draft' },
  getV1Outreach: { method: 'GET', path: '/v1/outreach' },
  postV1OutreachIdApprove: { method: 'POST', path: '/v1/outreach/{id}/approve' },
  postV1OutreachSendDue: { method: 'POST', path: '/v1/outreach/send-due' },
  postV1UnsubscribeToken: { method: 'POST', path: '/v1/unsubscribe/{token}' },
  getV1AssistantSuggestions: { method: 'GET', path: '/v1/assistant/suggestions' },
  putV1MarketplaceListing: { method: 'PUT', path: '/v1/marketplace/listing' },
  getV1MarketplaceListing: { method: 'GET', path: '/v1/marketplace/listing' },
  getV1PartnerMarketplace: { method: 'GET', path: '/v1/partner/marketplace' },
  getV1PartnerProfileVerified: { method: 'GET', path: '/v1/partner/profile/verified' },
  getV1Disputes: { method: 'GET', path: '/v1/disputes' },
  postV1DisputesIdResolve: { method: 'POST', path: '/v1/disputes/{id}/resolve' },
  getV1PartnerProfile: { method: 'GET', path: '/v1/partner/profile' },
  putV1PartnerProfile: { method: 'PUT', path: '/v1/partner/profile' },
  getV1Creators: { method: 'GET', path: '/v1/creators' },
  getV1CreatorsAccountId: { method: 'GET', path: '/v1/creators/{accountId}' },
  postV1CreatorsAccountIdInvite: { method: 'POST', path: '/v1/creators/{accountId}/invite' },
  postV1InvitationsIdWithdraw: { method: 'POST', path: '/v1/invitations/{id}/withdraw' },
  getV1Invitations: { method: 'GET', path: '/v1/invitations' },
  getV1PartnerInvitations: { method: 'GET', path: '/v1/partner/invitations' },
  postV1PartnerInvitationsIdAccept: { method: 'POST', path: '/v1/partner/invitations/{id}/accept' },
  postV1PartnerInvitationsIdDecline: { method: 'POST', path: '/v1/partner/invitations/{id}/decline' },
  getV1BillingPlan: { method: 'GET', path: '/v1/billing/plan' },
  postV1BillingCheckout: { method: 'POST', path: '/v1/billing/checkout' },
  postV1BillingPortal: { method: 'POST', path: '/v1/billing/portal' },
  postV1BillingActivate: { method: 'POST', path: '/v1/billing/activate' },
  getV1ProgramsIdRefereeReward: { method: 'GET', path: '/v1/programs/{id}/referee-reward' },
  putV1ProgramsIdRefereeReward: { method: 'PUT', path: '/v1/programs/{id}/referee-reward' },
  getV1Rewards: { method: 'GET', path: '/v1/rewards' },
  getV1RewardsLookupCode: { method: 'GET', path: '/v1/rewards/lookup/{code}' },
  postV1RewardsRedeemByCode: { method: 'POST', path: '/v1/rewards/redeem-by-code' },
  postV1RewardsIdRedeem: { method: 'POST', path: '/v1/rewards/{id}/redeem' },
  getV1ProgramsIdGroups: { method: 'GET', path: '/v1/programs/{id}/groups' },
  postV1ProgramsIdGroups: { method: 'POST', path: '/v1/programs/{id}/groups' },
  patchV1PartnerGroupsId: { method: 'PATCH', path: '/v1/partner-groups/{id}' },
  putV1ProgramsIdPartnersPartnerIdGroup: { method: 'PUT', path: '/v1/programs/{id}/partners/{partnerId}/group' },
  getV1ProgramsIdPromotions: { method: 'GET', path: '/v1/programs/{id}/promotions' },
  postV1ProgramsIdPromotions: { method: 'POST', path: '/v1/programs/{id}/promotions' },
  postV1PromotionsIdEnd: { method: 'POST', path: '/v1/promotions/{id}/end' },
  getV1PartnerGroups: { method: 'GET', path: '/v1/partner/groups' },
  postV1Contracts: { method: 'POST', path: '/v1/contracts' },
  getV1Contracts: { method: 'GET', path: '/v1/contracts' },
  postV1ContractsIdSend: { method: 'POST', path: '/v1/contracts/{id}/send' },
  getV1PartnerContracts: { method: 'GET', path: '/v1/partner/contracts' },
  postV1PartnerContractsIdAccept: { method: 'POST', path: '/v1/partner/contracts/{id}/accept' },
  postV1PartnerContractsIdDecline: { method: 'POST', path: '/v1/partner/contracts/{id}/decline' },
  putV1ProgramsIdIncrementality: { method: 'PUT', path: '/v1/programs/{id}/incrementality' },
  getV1Incrementality: { method: 'GET', path: '/v1/incrementality' },
  putV1ProgramsIdAutopricing: { method: 'PUT', path: '/v1/programs/{id}/autopricing' },
  getV1ProgramsIdAutopricing: { method: 'GET', path: '/v1/programs/{id}/autopricing' },
  postV1ProgramsIdAutopriceRun: { method: 'POST', path: '/v1/programs/{id}/autoprice/run' },
  getV1PassportPublicKey: { method: 'GET', path: '/v1/passport/public-key' },
  postV1PassportVerify: { method: 'POST', path: '/v1/passport/verify' },
  getV1PartnerPassport: { method: 'GET', path: '/v1/partner/passport' },
  getV1PartnerAdvanceOffer: { method: 'GET', path: '/v1/partner/advance/offer' },
  postV1PartnerAdvanceAccept: { method: 'POST', path: '/v1/partner/advance/accept' },
  getV1PartnerAdvance: { method: 'GET', path: '/v1/partner/advance' },
  putV1NetworkSettings: { method: 'PUT', path: '/v1/network/settings' },
  getV1NetworkSettings: { method: 'GET', path: '/v1/network/settings' },
  getV1NetworkJourney: { method: 'GET', path: '/v1/network/journey' },
  putV1ProgramsIdNegotiationPolicy: { method: 'PUT', path: '/v1/programs/{id}/negotiation-policy' },
  getV1ProgramsIdNegotiationPolicy: { method: 'GET', path: '/v1/programs/{id}/negotiation-policy' },
  getV1Negotiations: { method: 'GET', path: '/v1/negotiations' },
  getV1CleanroomConsent: { method: 'GET', path: '/v1/cleanroom/consent' },
  getV1CleanroomQuery: { method: 'GET', path: '/v1/cleanroom/query' },
  getV1Agents: { method: 'GET', path: '/v1/agents' },
  getV1AgentsRecommendations: { method: 'GET', path: '/v1/agents/recommendations' },
  getV1AdminMetrics: { method: 'GET', path: '/v1/admin/metrics' },
  getV1AdminOrgs: { method: 'GET', path: '/v1/admin/orgs' },
  postV1AdminOrgsIdSuspend: { method: 'POST', path: '/v1/admin/orgs/{id}/suspend' },
  postV1AdminOrgsIdPlan: { method: 'POST', path: '/v1/admin/orgs/{id}/plan' },
  postV1AdminOrgsIdUnsuspend: { method: 'POST', path: '/v1/admin/orgs/{id}/unsuspend' },
  getV1AdminPartnerAccounts: { method: 'GET', path: '/v1/admin/partner-accounts' },
  postV1AdminPartnerAccountsIdBan: { method: 'POST', path: '/v1/admin/partner-accounts/{id}/ban' },
  postV1AdminPartnerAccountsIdUnban: { method: 'POST', path: '/v1/admin/partner-accounts/{id}/unban' },
  getV1Notifications: { method: 'GET', path: '/v1/notifications' },
  postV1NotificationsIdRead: { method: 'POST', path: '/v1/notifications/{id}/read' },
  getV1PartnerNotifications: { method: 'GET', path: '/v1/partner/notifications' },
  postV1PartnerNotificationsIdRead: { method: 'POST', path: '/v1/partner/notifications/{id}/read' },
  postV1Assets: { method: 'POST', path: '/v1/assets' },
  getV1Assets: { method: 'GET', path: '/v1/assets' },
  deleteV1AssetsId: { method: 'DELETE', path: '/v1/assets/{id}' },
  postV1PartnerDeals: { method: 'POST', path: '/v1/partner/deals' },
  getV1PartnerDeals: { method: 'GET', path: '/v1/partner/deals' },
  getV1Deals: { method: 'GET', path: '/v1/deals' },
  postV1DealsIdApprove: { method: 'POST', path: '/v1/deals/{id}/approve' },
  postV1DealsIdReject: { method: 'POST', path: '/v1/deals/{id}/reject' },
  postV1DealsIdWon: { method: 'POST', path: '/v1/deals/{id}/won' },
  postV1ProgramsIdApplyLeveling: { method: 'POST', path: '/v1/programs/{id}/apply-leveling' },
  postV1PayoutRunsRunScheduled: { method: 'POST', path: '/v1/payout-runs/run-scheduled' },
  putV1PartnerOrgsOrgIdPostback: { method: 'PUT', path: '/v1/partner/orgs/{orgId}/postback' },
  getV1PartnerPostbackLogs: { method: 'GET', path: '/v1/partner/postback-logs' },
  getV1PartnerRecruit: { method: 'GET', path: '/v1/partner/recruit' },
  getV1PartnerAchievements: { method: 'GET', path: '/v1/partner/achievements' },
  getV1PartnerTerms: { method: 'GET', path: '/v1/partner/terms' },
  postV1PartnerTermsVersionIdAccept: { method: 'POST', path: '/v1/partner/terms/{versionId}/accept' },
  getV1ProgramsIdTermsAcceptances: { method: 'GET', path: '/v1/programs/{id}/terms-acceptances' },
  getV1SetupStatus: { method: 'GET', path: '/v1/setup/status' },
  getV1ExportAccounting: { method: 'GET', path: '/v1/export/accounting' },
  getV1ExportFull: { method: 'GET', path: '/v1/export/full' },
  postV1AnomaliesScan: { method: 'POST', path: '/v1/anomalies/scan' },
  getV1PrivacyExport: { method: 'GET', path: '/v1/privacy/export' },
  postV1PrivacyForget: { method: 'POST', path: '/v1/privacy/forget' },
  postV1PrivacyLookup: { method: 'POST', path: '/v1/privacy/lookup' },
  postV1PrivacyRequests: { method: 'POST', path: '/v1/privacy/requests' },
  getV1PrivacyRequests: { method: 'GET', path: '/v1/privacy/requests' },
  getV1PrivacyRequestsId: { method: 'GET', path: '/v1/privacy/requests/{id}' },
  getV1PrivacyRequestsIdResult: { method: 'GET', path: '/v1/privacy/requests/{id}/result' },
  getV1EmailSettings: { method: 'GET', path: '/v1/email/settings' },
  putV1EmailSettings: { method: 'PUT', path: '/v1/email/settings' },
  postV1EmailSettingsVerifyDomain: { method: 'POST', path: '/v1/email/settings/verify-domain' },
  getV1EmailTemplates: { method: 'GET', path: '/v1/email/templates' },
  putV1EmailTemplatesEventLocale: { method: 'PUT', path: '/v1/email/templates/{event}/{locale}' },
  deleteV1EmailTemplatesEventLocale: { method: 'DELETE', path: '/v1/email/templates/{event}/{locale}' },
  postV1EmailPreview: { method: 'POST', path: '/v1/email/preview' },
  postV1EmailTest: { method: 'POST', path: '/v1/email/test' },
  putV1MeLocale: { method: 'PUT', path: '/v1/me/locale' },
  putV1MeRoiDigest: { method: 'PUT', path: '/v1/me/roi-digest' },
  putV1PartnerLocale: { method: 'PUT', path: '/v1/partner/locale' },
  getV1Integrations: { method: 'GET', path: '/v1/integrations' },
  putV1IntegrationsHubspot: { method: 'PUT', path: '/v1/integrations/hubspot' },
  putV1IntegrationsSegment: { method: 'PUT', path: '/v1/integrations/segment' },
  deleteV1IntegrationsKind: { method: 'DELETE', path: '/v1/integrations/{kind}' },
  postV1IntegrationsHubspotTest: { method: 'POST', path: '/v1/integrations/hubspot/test' },
  postV1IntegrationsSegmentTest: { method: 'POST', path: '/v1/integrations/segment/test' },
  getV1IntegrationsDeliveries: { method: 'GET', path: '/v1/integrations/deliveries' },
  postV1IntegrationsDeliveriesIdRetry: { method: 'POST', path: '/v1/integrations/deliveries/{id}/retry' },
  getV1ZapierEvents: { method: 'GET', path: '/v1/zapier/events' },
  postV1ZapierHooks: { method: 'POST', path: '/v1/zapier/hooks' },
  getV1ZapierHooks: { method: 'GET', path: '/v1/zapier/hooks' },
  deleteV1ZapierHooksId: { method: 'DELETE', path: '/v1/zapier/hooks/{id}' },
  getV1ZapierTriggersEvent: { method: 'GET', path: '/v1/zapier/triggers/{event}' },
  postV1ZapierConversions: { method: 'POST', path: '/v1/zapier/conversions' },
  postV1PartnerSecurityTotpSetup: { method: 'POST', path: '/v1/partner/security/totp/setup' },
  postV1PartnerSecurityTotpEnable: { method: 'POST', path: '/v1/partner/security/totp/enable' },
  postV1PartnerSecurityTotpDisable: { method: 'POST', path: '/v1/partner/security/totp/disable' },
  getV1PartnerSecurity: { method: 'GET', path: '/v1/partner/security' },
  postV1AuthConnections: { method: 'POST', path: '/v1/auth/connections' },
  getV1AuthConnections: { method: 'GET', path: '/v1/auth/connections' },
  postV1AuthConnectionsIdRotateSecret: { method: 'POST', path: '/v1/auth/connections/{id}/rotate-secret' },
  patchV1AuthConnectionsId: { method: 'PATCH', path: '/v1/auth/connections/{id}' },
  deleteV1AuthConnectionsId: { method: 'DELETE', path: '/v1/auth/connections/{id}' },
  postV1AuthConnectionsIdRevokePreviousSecret: { method: 'POST', path: '/v1/auth/connections/{id}/revoke-previous-secret' },
  postV1AuthConnectionsIdSignups: { method: 'POST', path: '/v1/auth/connections/{id}/signups' },
  postV1AuthConnectionsIdErase: { method: 'POST', path: '/v1/auth/connections/{id}/erase' },
  getV1AuthConnectionsIdExport: { method: 'GET', path: '/v1/auth/connections/{id}/export' },
  postV1AuthConnectionsIdPing: { method: 'POST', path: '/v1/auth/connections/{id}/ping' },
  postV1AuthConnectionsIdAliases: { method: 'POST', path: '/v1/auth/connections/{id}/aliases' },
  postV1AuthConnectionsIdUsers: { method: 'POST', path: '/v1/auth/connections/{id}/users' },
  postV1AuthConnectionsIdSignals: { method: 'POST', path: '/v1/auth/connections/{id}/signals' },
  getV1OrgSso: { method: 'GET', path: '/v1/org/sso' },
  patchV1OrgSso: { method: 'PATCH', path: '/v1/org/sso' },
  postV1OrgSsoLink: { method: 'POST', path: '/v1/org/sso/link' },
  postV1OrgSsoTickets: { method: 'POST', path: '/v1/org/sso/tickets' },
  postV1OrgSsoTicketsIdRevoke: { method: 'POST', path: '/v1/org/sso/tickets/{id}/revoke' },
  getV1OrgSsoConnectionsIdSamlMetadata: { method: 'GET', path: '/v1/org/sso/connections/{id}/saml-metadata' },
  postV1PartnerAuthWalletNonce: { method: 'POST', path: '/v1/partner/auth/wallet/nonce' },
  postV1PartnerAuthWalletVerify: { method: 'POST', path: '/v1/partner/auth/wallet/verify' },
  postV1OnchainConnections: { method: 'POST', path: '/v1/onchain/connections' },
  getV1OnchainConnections: { method: 'GET', path: '/v1/onchain/connections' },
  getV1PublicProgramsHandle: { method: 'GET', path: '/v1/public/programs/{handle}' },
  postV1PublicProgramsHandleJoin: { method: 'POST', path: '/v1/public/programs/{handle}/join' },
  postWebhooksBillingConnectionId: { method: 'POST', path: '/webhooks/billing/{connectionId}' },
  postWebhooksAuthConnectionId: { method: 'POST', path: '/webhooks/auth/{connectionId}' },
  postWebhooksSsoProvider: { method: 'POST', path: '/webhooks/sso/{provider}' },
  postWebhooksAtlas: { method: 'POST', path: '/webhooks/atlas' },
  postWebhooksOnchainConnectionId: { method: 'POST', path: '/webhooks/onchain/{connectionId}' },
  postWebhooksPayoutsProvider: { method: 'POST', path: '/webhooks/payouts/{provider}' },
  postWebhooksStripeBilling: { method: 'POST', path: '/webhooks/stripe-billing' },
  getTOrgTokenThemeCss: { method: 'GET', path: '/t/{orgToken}/theme.css' },
  getEmbedJs: { method: 'GET', path: '/embed.js' },
  getEmbedSignupJs: { method: 'GET', path: '/embed-signup.js' },
  getLeadOrgTokenCode: { method: 'GET', path: '/lead/{orgToken}/{code}' },
  postLeadOrgTokenCode: { method: 'POST', path: '/lead/{orgToken}/{code}' },
  getV1Graphql: { method: 'GET', path: '/v1/graphql' },
  postV1Graphql: { method: 'POST', path: '/v1/graphql' },
} as const;

export type OperationId = keyof typeof operations;
