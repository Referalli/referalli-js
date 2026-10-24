// Generated from the Referalli OpenAPI document by packages/sdkgen. Do not edit by hand:
// run `pnpm --filter referalli gen` after changing the API.
import type * as T from './generated.js';
import type { ListPromise, OperationSpec, PageParams, RequestOptions, Transport } from './core.js';

/** The API version this SDK was generated against (sent as `referalli-version`). */
export const API_VERSION = "2026-11-01";

/** Every operation: method, path, path params, query params (wire names), body and response kind. */
export const operations = {
  deleteApiKeysId: { method: "DELETE", path: "/v1/api-keys/{id}", pathParams: ["id"], query: ["cascade","pair"], body: false, kind: "json" },
  deleteAssetsId: { method: "DELETE", path: "/v1/assets/{id}", pathParams: ["id"], query: [], body: false, kind: "json" },
  deleteAuthConnectionsId: { method: "DELETE", path: "/v1/auth/connections/{id}", pathParams: ["id"], query: [], body: false, kind: "json" },
  deleteBillingConnectionsId: { method: "DELETE", path: "/v1/billing/connections/{id}", pathParams: ["id"], query: [], body: false, kind: "json" },
  deleteBillingInternalCustomersCustomerRef: { method: "DELETE", path: "/v1/billing/internal-customers/{customerRef}", pathParams: ["customerRef"], query: [], body: false, kind: "json" },
  deleteBrandingDomain: { method: "DELETE", path: "/v1/branding/domain", pathParams: [], query: [], body: false, kind: "json" },
  deleteBrandingLinkDomain: { method: "DELETE", path: "/v1/branding/link-domain", pathParams: [], query: [], body: false, kind: "json" },
  deleteCliListenersId: { method: "DELETE", path: "/v1/cli/listeners/{id}", pathParams: ["id"], query: [], body: false, kind: "json" },
  deleteEmailTemplatesEventLocale: { method: "DELETE", path: "/v1/email/templates/{event}/{locale}", pathParams: ["event","locale"], query: [], body: false, kind: "json" },
  deleteIntegrationsKind: { method: "DELETE", path: "/v1/integrations/{kind}", pathParams: ["kind"], query: [], body: false, kind: "json" },
  deleteOrgMembersUserId: { method: "DELETE", path: "/v1/org/members/{userId}", pathParams: ["userId"], query: [], body: false, kind: "json" },
  deleteOrgSsoDirect: { method: "DELETE", path: "/v1/org/sso/direct", pathParams: [], query: [], body: false, kind: "json" },
  deletePartnersId: { method: "DELETE", path: "/v1/partners/{id}", pathParams: ["id"], query: [], body: false, kind: "json" },
  deletePayoutConnectionsProvider: { method: "DELETE", path: "/v1/payout-connections/{provider}", pathParams: ["provider"], query: [], body: false, kind: "json" },
  deletePrivacyExecutorsAdapter: { method: "DELETE", path: "/v1/privacy/executors/{adapter}", pathParams: ["adapter"], query: [], body: false, kind: "json" },
  deleteProfitabilityProductsProductRef: { method: "DELETE", path: "/v1/profitability/products/{productRef}", pathParams: ["productRef"], query: [], body: false, kind: "json" },
  deleteRewardsRulesKey: { method: "DELETE", path: "/v1/rewards/rules/{key}", pathParams: ["key"], query: [], body: false, kind: "json" },
  deleteSupportAppsAdapter: { method: "DELETE", path: "/v1/support/apps/{adapter}", pathParams: ["adapter"], query: [], body: false, kind: "json" },
  deleteWebhookEndpointsId: { method: "DELETE", path: "/v1/webhook-endpoints/{id}", pathParams: ["id"], query: [], body: false, kind: "json" },
  deleteZapierHooksId: { method: "DELETE", path: "/v1/zapier/hooks/{id}", pathParams: ["id"], query: [], body: false, kind: "json" },
  getAdminMetrics: { method: "GET", path: "/v1/admin/metrics", pathParams: [], query: [], body: false, kind: "json" },
  getAdminOrgs: { method: "GET", path: "/v1/admin/orgs", pathParams: [], query: ["q","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getAdminPartnerAccounts: { method: "GET", path: "/v1/admin/partner-accounts", pathParams: [], query: ["flagged","q","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getAgents: { method: "GET", path: "/v1/agents", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getAgentsRecommendations: { method: "GET", path: "/v1/agents/recommendations", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getAnalyticsByChannel: { method: "GET", path: "/v1/analytics/by-channel", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getAnalyticsByGeo: { method: "GET", path: "/v1/analytics/by-geo", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getAnalyticsCohortLtv: { method: "GET", path: "/v1/analytics/cohort-ltv", pathParams: [], query: ["months","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getAnalyticsCouponPerformance: { method: "GET", path: "/v1/analytics/coupon-performance", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getAnalyticsOverview: { method: "GET", path: "/v1/analytics/overview", pathParams: [], query: ["programId","days"], body: false, kind: "json" },
  getAnalyticsTimeseries: { method: "GET", path: "/v1/analytics/timeseries", pathParams: [], query: ["metric","days","programId","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getApiKeys: { method: "GET", path: "/v1/api-keys", pathParams: [], query: ["mode","owner","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getApiKeysId: { method: "GET", path: "/v1/api-keys/{id}", pathParams: ["id"], query: [], body: false, kind: "json" },
  getAssets: { method: "GET", path: "/v1/assets", pathParams: [], query: ["programId","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getAssistantSuggestions: { method: "GET", path: "/v1/assistant/suggestions", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getAuditLogs: { method: "GET", path: "/v1/audit-logs", pathParams: [], query: ["actor","actorType","action","subjectType","subjectId","created[gte]","created[lte]","limit","starting_after","ending_before"], body: false, kind: "list" },
  getAuthConnections: { method: "GET", path: "/v1/auth/connections", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getAuthConnectionsIdExport: { method: "GET", path: "/v1/auth/connections/{id}/export", pathParams: ["id"], query: ["customerRef"], body: false, kind: "json", public: true },
  getAuthConnectionsProviders: { method: "GET", path: "/v1/auth/connections/providers", pathParams: [], query: [], body: false, kind: "json" },
  getAuthProviders: { method: "GET", path: "/v1/auth/providers", pathParams: [], query: [], body: false, kind: "json", public: true },
  getBillingConnections: { method: "GET", path: "/v1/billing/connections", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getBillingConnectionsId: { method: "GET", path: "/v1/billing/connections/{id}", pathParams: ["id"], query: [], body: false, kind: "json" },
  getBillingEvents: { method: "GET", path: "/v1/billing/events", pathParams: [], query: ["customerRef","status","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getBillingInternalCustomers: { method: "GET", path: "/v1/billing/internal-customers", pathParams: [], query: [], body: false, kind: "json" },
  getBillingPlan: { method: "GET", path: "/v1/billing/plan", pathParams: [], query: [], body: false, kind: "json" },
  getBranding: { method: "GET", path: "/v1/branding", pathParams: [], query: [], body: false, kind: "json" },
  getChatlyIdentity: { method: "GET", path: "/v1/chatly/identity", pathParams: [], query: [], body: false, kind: "json", public: true },
  getCleanroomConsent: { method: "GET", path: "/v1/cleanroom/consent", pathParams: [], query: ["customerRef"], body: false, kind: "json" },
  getCleanroomQuery: { method: "GET", path: "/v1/cleanroom/query", pathParams: [], query: ["dimension"], body: false, kind: "json" },
  getClicksConsentCoverage: { method: "GET", path: "/v1/clicks/consent-coverage", pathParams: [], query: ["days"], body: false, kind: "json" },
  getClicksId: { method: "GET", path: "/v1/clicks/{id}", pathParams: ["id"], query: [], body: false, kind: "json" },
  getCliDeviceCodesUserCode: { method: "GET", path: "/v1/cli/device-codes/{userCode}", pathParams: ["userCode"], query: [], body: false, kind: "json" },
  getCliListenersIdEvents: { method: "GET", path: "/v1/cli/listeners/{id}/events", pathParams: ["id"], query: ["wait"], body: false, kind: "json" },
  getCliLogs: { method: "GET", path: "/v1/cli/logs", pathParams: [], query: ["after","wait","limit"], body: false, kind: "json" },
  getCliTopics: { method: "GET", path: "/v1/cli/topics", pathParams: [], query: [], body: false, kind: "json" },
  getCommissionRules: { method: "GET", path: "/v1/commission-rules", pathParams: [], query: ["programId","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getCommissions: { method: "GET", path: "/v1/commissions", pathParams: [], query: ["partnerId","programId","type","referralId","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getCommissionsId: { method: "GET", path: "/v1/commissions/{id}", pathParams: ["id"], query: [], body: false, kind: "json" },
  getContracts: { method: "GET", path: "/v1/contracts", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getCoupons: { method: "GET", path: "/v1/coupons", pathParams: [], query: ["programId","partnerId","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getCreators: { method: "GET", path: "/v1/creators", pathParams: [], query: ["q","category","channel","minAudience","minEngagementBps","audienceCountry","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getCreatorsAccountId: { method: "GET", path: "/v1/creators/{accountId}", pathParams: ["accountId"], query: [], body: false, kind: "json" },
  getDeals: { method: "GET", path: "/v1/deals", pathParams: [], query: ["status","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getDisputes: { method: "GET", path: "/v1/disputes", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getEmailSettings: { method: "GET", path: "/v1/email/settings", pathParams: [], query: [], body: false, kind: "json" },
  getEmailTemplates: { method: "GET", path: "/v1/email/templates", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getEmbed: { method: "GET", path: "/v1/embed", pathParams: [], query: ["token"], body: false, kind: "json", public: true },
  getEmbedSummary: { method: "GET", path: "/v1/embed/summary", pathParams: [], query: [], body: false, kind: "json", public: true },
  getEvents: { method: "GET", path: "/v1/events", pathParams: [], query: ["since","topics","after","limit"], body: false, kind: "json" },
  getExportAccounting: { method: "GET", path: "/v1/export/accounting", pathParams: [], query: ["format","year"], body: false, kind: "text" },
  getExportFull: { method: "GET", path: "/v1/export/full", pathParams: [], query: [], body: false, kind: "text" },
  getFraudCases: { method: "GET", path: "/v1/fraud/cases", pathParams: [], query: ["status","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getFxRates: { method: "GET", path: "/v1/fx-rates", pathParams: [], query: ["base","quote","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getGraphql: { method: "GET", path: "/v1/graphql", pathParams: [], query: [], body: false, kind: "json" },
  getHealth: { method: "GET", path: "/v1/health", pathParams: [], query: [], body: false, kind: "json", public: true },
  getHostsCurrent: { method: "GET", path: "/v1/hosts/current", pathParams: [], query: [], body: false, kind: "json", public: true },
  getHostsCurrentThemeCss: { method: "GET", path: "/v1/hosts/current/theme.css", pathParams: [], query: [], body: false, kind: "text", public: true },
  getIncrementality: { method: "GET", path: "/v1/incrementality", pathParams: [], query: ["programId"], body: false, kind: "json" },
  getIntegrationHealth: { method: "GET", path: "/v1/integration-health", pathParams: [], query: [], body: false, kind: "json" },
  getIntegrations: { method: "GET", path: "/v1/integrations", pathParams: [], query: [], body: false, kind: "json" },
  getIntegrationsDeliveries: { method: "GET", path: "/v1/integrations/deliveries", pathParams: [], query: ["kind","status","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getInvitations: { method: "GET", path: "/v1/invitations", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getLinks: { method: "GET", path: "/v1/links", pathParams: [], query: ["programId","partnerId","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getLinksIdQr: { method: "GET", path: "/v1/links/{id}/qr", pathParams: ["id"], query: [], body: false, kind: "text" },
  getMarketplaceListing: { method: "GET", path: "/v1/marketplace/listing", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getMe: { method: "GET", path: "/v1/me", pathParams: [], query: [], body: false, kind: "json" },
  getNegotiations: { method: "GET", path: "/v1/negotiations", pathParams: [], query: ["programId","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getNetworkJourney: { method: "GET", path: "/v1/network/journey", pathParams: [], query: ["emailHash","model"], body: false, kind: "json" },
  getNetworkSettings: { method: "GET", path: "/v1/network/settings", pathParams: [], query: [], body: false, kind: "json" },
  getNotifications: { method: "GET", path: "/v1/notifications", pathParams: [], query: ["unread","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getOnchainConnections: { method: "GET", path: "/v1/onchain/connections", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getOpenapiJson: { method: "GET", path: "/v1/openapi.json", pathParams: [], query: [], body: false, kind: "json", public: true },
  getOpenapiYaml: { method: "GET", path: "/v1/openapi.yaml", pathParams: [], query: [], body: false, kind: "text", public: true },
  getOrg: { method: "GET", path: "/v1/org", pathParams: [], query: [], body: false, kind: "json" },
  getOrgFxFeed: { method: "GET", path: "/v1/org/fx-feed", pathParams: [], query: [], body: false, kind: "json" },
  getOrgHostedPages: { method: "GET", path: "/v1/org/hosted-pages", pathParams: [], query: [], body: false, kind: "json" },
  getOrgMembers: { method: "GET", path: "/v1/org/members", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getOrgPayoutSchedule: { method: "GET", path: "/v1/org/payout-schedule", pathParams: [], query: [], body: false, kind: "json" },
  getOrgPortalAuth: { method: "GET", path: "/v1/org/portal-auth", pathParams: [], query: [], body: false, kind: "json" },
  getOrgReferralParams: { method: "GET", path: "/v1/org/referral-params", pathParams: [], query: [], body: false, kind: "json" },
  getOrgRetention: { method: "GET", path: "/v1/org/retention", pathParams: [], query: [], body: false, kind: "json" },
  getOrgSso: { method: "GET", path: "/v1/org/sso", pathParams: [], query: [], body: false, kind: "json" },
  getOrgSsoConnectionsIdSamlMetadata: { method: "GET", path: "/v1/org/sso/connections/{id}/saml-metadata", pathParams: ["id"], query: [], body: false, kind: "json" },
  getOrgTaxProfile: { method: "GET", path: "/v1/org/tax-profile", pathParams: [], query: [], body: false, kind: "json" },
  getOrgTrackingConsent: { method: "GET", path: "/v1/org/tracking-consent", pathParams: [], query: [], body: false, kind: "json" },
  getOutreach: { method: "GET", path: "/v1/outreach", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPartnerAchievements: { method: "GET", path: "/v1/partner/achievements", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPartnerAdvance: { method: "GET", path: "/v1/partner/advance", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPartnerAdvanceOffer: { method: "GET", path: "/v1/partner/advance/offer", pathParams: [], query: [], body: false, kind: "json" },
  getPartnerAssets: { method: "GET", path: "/v1/partner/assets", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPartnerContracts: { method: "GET", path: "/v1/partner/contracts", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPartnerDeals: { method: "GET", path: "/v1/partner/deals", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPartnerDisputes: { method: "GET", path: "/v1/partner/disputes", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPartnerGroups: { method: "GET", path: "/v1/partner/groups", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPartnerInvitations: { method: "GET", path: "/v1/partner/invitations", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPartnerKycStatus: { method: "GET", path: "/v1/partner/kyc/status", pathParams: [], query: [], body: false, kind: "json" },
  getPartnerLinks: { method: "GET", path: "/v1/partner/links", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPartnerLinksIdQr: { method: "GET", path: "/v1/partner/links/{id}/qr", pathParams: ["id"], query: [], body: false, kind: "text" },
  getPartnerMarketplace: { method: "GET", path: "/v1/partner/marketplace", pathParams: [], query: ["category","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPartnerMe: { method: "GET", path: "/v1/partner/me", pathParams: [], query: [], body: false, kind: "json" },
  getPartnerNotifications: { method: "GET", path: "/v1/partner/notifications", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPartnerOrgsOrgIdSelfBilling: { method: "GET", path: "/v1/partner/orgs/{orgId}/self-billing", pathParams: ["orgId"], query: [], body: false, kind: "json" },
  getPartnerPassport: { method: "GET", path: "/v1/partner/passport", pathParams: [], query: [], body: false, kind: "json" },
  getPartnerPayouts: { method: "GET", path: "/v1/partner/payouts", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPartnerPayoutsIdInvoice: { method: "GET", path: "/v1/partner/payouts/{id}/invoice", pathParams: ["id"], query: ["format"], body: false, kind: "json" },
  getPartnerPostbackLogs: { method: "GET", path: "/v1/partner/postback-logs", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPartnerProfile: { method: "GET", path: "/v1/partner/profile", pathParams: [], query: [], body: false, kind: "json" },
  getPartnerProfileVerified: { method: "GET", path: "/v1/partner/profile/verified", pathParams: [], query: [], body: false, kind: "json" },
  getPartnerProgramsProgramIdLeaderboard: { method: "GET", path: "/v1/partner/programs/{programId}/leaderboard", pathParams: ["programId"], query: [], body: false, kind: "json" },
  getPartnerRecruit: { method: "GET", path: "/v1/partner/recruit", pathParams: [], query: [], body: false, kind: "json" },
  getPartnerReferrals: { method: "GET", path: "/v1/partner/referrals", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPartnerReferralsIdTransparency: { method: "GET", path: "/v1/partner/referrals/{id}/transparency", pathParams: ["id"], query: [], body: false, kind: "json" },
  getPartners: { method: "GET", path: "/v1/partners", pathParams: [], query: ["email","externalRef","status","includeArchived","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPartnerSecurity: { method: "GET", path: "/v1/partner/security", pathParams: [], query: [], body: false, kind: "json" },
  getPartnersId: { method: "GET", path: "/v1/partners/{id}", pathParams: ["id"], query: [], body: false, kind: "json" },
  getPartnersIdBalances: { method: "GET", path: "/v1/partners/{id}/balances", pathParams: ["id"], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPartnersIdEnrollments: { method: "GET", path: "/v1/partners/{id}/enrollments", pathParams: ["id"], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPartnersIdPayoutProfile: { method: "GET", path: "/v1/partners/{id}/payout-profile", pathParams: ["id"], query: [], body: false, kind: "json" },
  getPartnersIdQuality: { method: "GET", path: "/v1/partners/{id}/quality", pathParams: ["id"], query: [], body: false, kind: "json" },
  getPartnerStats: { method: "GET", path: "/v1/partner/stats", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPartnerTaxDocuments: { method: "GET", path: "/v1/partner/tax-documents", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPartnerTaxDocumentsId: { method: "GET", path: "/v1/partner/tax-documents/{id}", pathParams: ["id"], query: [], body: false, kind: "text" },
  getPartnerTerms: { method: "GET", path: "/v1/partner/terms", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPassportPublicKey: { method: "GET", path: "/v1/passport/public-key", pathParams: [], query: [], body: false, kind: "json", public: true },
  getPayoutConnections: { method: "GET", path: "/v1/payout-connections", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPayoutRuns: { method: "GET", path: "/v1/payout-runs", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPayouts: { method: "GET", path: "/v1/payouts", pathParams: [], query: ["partnerId","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPayoutsIdInvoice: { method: "GET", path: "/v1/payouts/{id}/invoice", pathParams: ["id"], query: ["format"], body: false, kind: "json" },
  getPlans: { method: "GET", path: "/v1/plans", pathParams: [], query: [], body: false, kind: "json", public: true },
  getPortalAuthCurrent: { method: "GET", path: "/v1/portal-auth/current", pathParams: [], query: ["org"], body: false, kind: "json", public: true },
  getPrivacyExecutorRequests: { method: "GET", path: "/v1/privacy/executor-requests", pathParams: [], query: [], body: false, kind: "json" },
  getPrivacyExecutors: { method: "GET", path: "/v1/privacy/executors", pathParams: [], query: [], body: false, kind: "json" },
  getPrivacyExport: { method: "GET", path: "/v1/privacy/export", pathParams: [], query: ["customerRef"], body: false, kind: "json" },
  getPrivacyRequests: { method: "GET", path: "/v1/privacy/requests", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPrivacyRequestsId: { method: "GET", path: "/v1/privacy/requests/{id}", pathParams: ["id"], query: [], body: false, kind: "json" },
  getPrivacyRequestsIdResult: { method: "GET", path: "/v1/privacy/requests/{id}/result", pathParams: ["id"], query: [], body: false, kind: "json" },
  getProfitabilityProducts: { method: "GET", path: "/v1/profitability/products", pathParams: [], query: [], body: false, kind: "json" },
  getProfitabilityProductsProductRef: { method: "GET", path: "/v1/profitability/products/{productRef}", pathParams: ["productRef"], query: [], body: false, kind: "json" },
  getProfitabilityRebuildJobId: { method: "GET", path: "/v1/profitability/rebuild/{jobId}", pathParams: ["jobId"], query: [], body: false, kind: "json" },
  getProfitabilitySettings: { method: "GET", path: "/v1/profitability/settings", pathParams: [], query: ["programId"], body: false, kind: "json" },
  getPrograms: { method: "GET", path: "/v1/programs", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getProgramsId: { method: "GET", path: "/v1/programs/{id}", pathParams: ["id"], query: [], body: false, kind: "json" },
  getProgramsIdAutopricing: { method: "GET", path: "/v1/programs/{id}/autopricing", pathParams: ["id"], query: [], body: false, kind: "json" },
  getProgramsIdEnrollments: { method: "GET", path: "/v1/programs/{id}/enrollments", pathParams: ["id"], query: ["status","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getProgramsIdGraph: { method: "GET", path: "/v1/programs/{id}/graph", pathParams: ["id"], query: ["root","depth"], body: false, kind: "json" },
  getProgramsIdGroups: { method: "GET", path: "/v1/programs/{id}/groups", pathParams: ["id"], query: ["includeArchived","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getProgramsIdNegotiationPolicy: { method: "GET", path: "/v1/programs/{id}/negotiation-policy", pathParams: ["id"], query: [], body: false, kind: "json" },
  getProgramsIdPromotions: { method: "GET", path: "/v1/programs/{id}/promotions", pathParams: ["id"], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getProgramsIdRefereeReward: { method: "GET", path: "/v1/programs/{id}/referee-reward", pathParams: ["id"], query: [], body: false, kind: "json" },
  getProgramsIdTermsAcceptances: { method: "GET", path: "/v1/programs/{id}/terms-acceptances", pathParams: ["id"], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getProspects: { method: "GET", path: "/v1/prospects", pathParams: [], query: ["status","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getPublicProgramsHandle: { method: "GET", path: "/v1/public/programs/{handle}", pathParams: ["handle"], query: [], body: false, kind: "json", public: true },
  getReferrals: { method: "GET", path: "/v1/referrals", pathParams: [], query: ["programId","partnerId","status","customerRef","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getReferralsId: { method: "GET", path: "/v1/referrals/{id}", pathParams: ["id"], query: [], body: false, kind: "json" },
  getReferralsIdJourney: { method: "GET", path: "/v1/referrals/{id}/journey", pathParams: ["id"], query: [], body: false, kind: "json" },
  getReportsFilteredClicks: { method: "GET", path: "/v1/reports/filtered-clicks", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getReportsPartnerPerformance: { method: "GET", path: "/v1/reports/partner-performance", pathParams: [], query: ["format"], body: false, kind: "json" },
  getRewards: { method: "GET", path: "/v1/rewards", pathParams: [], query: ["status","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getRewardsGranted: { method: "GET", path: "/v1/rewards/granted", pathParams: [], query: [], body: false, kind: "json" },
  getRewardsLookupCode: { method: "GET", path: "/v1/rewards/lookup/{code}", pathParams: ["code"], query: [], body: false, kind: "json" },
  getRewardsRules: { method: "GET", path: "/v1/rewards/rules", pathParams: [], query: [], body: false, kind: "json" },
  getRoiBreakdown: { method: "GET", path: "/v1/roi/breakdown", pathParams: [], query: ["from","to","programId","partnerId","windowDays","currency","format","by","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getRoiDataQuality: { method: "GET", path: "/v1/roi/data-quality", pathParams: [], query: ["from","to","format"], body: false, kind: "json" },
  getRoiGrants: { method: "GET", path: "/v1/roi/grants", pathParams: [], query: ["from","to","programId","partnerId","windowDays","currency","format","status","role","paidBack","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getRoiPartnersIdTrace: { method: "GET", path: "/v1/roi/partners/{id}/trace", pathParams: ["id"], query: ["windowDays","format"], body: false, kind: "json" },
  getRoiPatterns: { method: "GET", path: "/v1/roi/patterns", pathParams: [], query: [], body: false, kind: "json" },
  getRoiPatternsPattern: { method: "GET", path: "/v1/roi/patterns/{pattern}", pathParams: ["pattern"], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getRoiSummary: { method: "GET", path: "/v1/roi/summary", pathParams: [], query: ["from","to","programId","partnerId","windowDays","currency","format","model","includeProjection"], body: false, kind: "json" },
  getRoiTraceCustomerRef: { method: "GET", path: "/v1/roi/trace/{customerRef}", pathParams: ["customerRef"], query: ["windowDays","format"], body: false, kind: "json" },
  getSetupStatus: { method: "GET", path: "/v1/setup/status", pathParams: [], query: [], body: false, kind: "json" },
  getStatus: { method: "GET", path: "/v1/status", pathParams: [], query: [], body: false, kind: "json", public: true },
  getStatusIncidents: { method: "GET", path: "/v1/status/incidents", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list", public: true },
  getStatusIncidentsAtom: { method: "GET", path: "/v1/status/incidents.atom", pathParams: [], query: [], body: false, kind: "text", public: true },
  getStatusIncidentsId: { method: "GET", path: "/v1/status/incidents/{id}", pathParams: ["id"], query: [], body: false, kind: "json", public: true },
  getSupportApps: { method: "GET", path: "/v1/support/apps", pathParams: [], query: [], body: false, kind: "json" },
  getSupportCardsOrgIdAdapter: { method: "GET", path: "/v1/support/cards/{orgId}/{adapter}", pathParams: ["orgId","adapter"], query: ["email","externalId"], body: false, kind: "json", public: true },
  getSupportContext: { method: "GET", path: "/v1/support/context", pathParams: [], query: ["email","customerRef","partnerExternalRef","ext"], body: false, kind: "json" },
  getTax1099: { method: "GET", path: "/v1/tax/1099", pathParams: [], query: ["year","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getTax1099Filings: { method: "GET", path: "/v1/tax/1099/filings", pathParams: [], query: ["year","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getTax1099Preview: { method: "GET", path: "/v1/tax/1099/preview", pathParams: [], query: ["year"], body: false, kind: "json" },
  getTestClock: { method: "GET", path: "/v1/test_clock", pathParams: [], query: [], body: false, kind: "json" },
  getTestEmails: { method: "GET", path: "/v1/test/emails", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getValueImportJobId: { method: "GET", path: "/v1/value/import/{jobId}", pathParams: ["jobId"], query: [], body: false, kind: "json" },
  getVersions: { method: "GET", path: "/v1/versions", pathParams: [], query: [], body: false, kind: "json", public: true },
  getWebhookDeliveries: { method: "GET", path: "/v1/webhook-deliveries", pathParams: [], query: ["endpointId","limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getWebhookDeliveriesId: { method: "GET", path: "/v1/webhook-deliveries/{id}", pathParams: ["id"], query: [], body: false, kind: "json" },
  getWebhookEndpoints: { method: "GET", path: "/v1/webhook-endpoints", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getWebhookEndpointsId: { method: "GET", path: "/v1/webhook-endpoints/{id}", pathParams: ["id"], query: [], body: false, kind: "json" },
  getWebhookEndpointsIdDeliveries: { method: "GET", path: "/v1/webhook-endpoints/{id}/deliveries", pathParams: ["id"], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getZapierEvents: { method: "GET", path: "/v1/zapier/events", pathParams: [], query: [], body: false, kind: "json" },
  getZapierHooks: { method: "GET", path: "/v1/zapier/hooks", pathParams: [], query: ["limit","starting_after","ending_before","created[gte]","created[lte]"], body: false, kind: "list" },
  getZapierTriggersEvent: { method: "GET", path: "/v1/zapier/triggers/{event}", pathParams: ["event"], query: ["limit"], body: false, kind: "json" },
  patchAdminStatusIncidentsId: { method: "PATCH", path: "/v1/admin/status/incidents/{id}", pathParams: ["id"], query: [], body: true, kind: "json" },
  patchApiKeysId: { method: "PATCH", path: "/v1/api-keys/{id}", pathParams: ["id"], query: [], body: true, kind: "json" },
  patchAuthConnectionsId: { method: "PATCH", path: "/v1/auth/connections/{id}", pathParams: ["id"], query: [], body: true, kind: "json" },
  patchBillingConnectionsId: { method: "PATCH", path: "/v1/billing/connections/{id}", pathParams: ["id"], query: [], body: true, kind: "json" },
  patchOrg: { method: "PATCH", path: "/v1/org", pathParams: [], query: [], body: true, kind: "json" },
  patchOrgMembersUserId: { method: "PATCH", path: "/v1/org/members/{userId}", pathParams: ["userId"], query: [], body: true, kind: "json" },
  patchOrgSso: { method: "PATCH", path: "/v1/org/sso", pathParams: [], query: [], body: true, kind: "json" },
  patchPartnerGroupsId: { method: "PATCH", path: "/v1/partner-groups/{id}", pathParams: ["id"], query: [], body: true, kind: "json" },
  patchPartnersId: { method: "PATCH", path: "/v1/partners/{id}", pathParams: ["id"], query: [], body: true, kind: "json" },
  patchPartnersIdPayoutProfile: { method: "PATCH", path: "/v1/partners/{id}/payout-profile", pathParams: ["id"], query: [], body: true, kind: "json" },
  patchProgramsId: { method: "PATCH", path: "/v1/programs/{id}", pathParams: ["id"], query: [], body: true, kind: "json" },
  patchReferralsId: { method: "PATCH", path: "/v1/referrals/{id}", pathParams: ["id"], query: [], body: true, kind: "json" },
  patchWebhookEndpointsId: { method: "PATCH", path: "/v1/webhook-endpoints/{id}", pathParams: ["id"], query: [], body: true, kind: "json" },
  postAccountClose: { method: "POST", path: "/v1/account/close", pathParams: [], query: [], body: true, kind: "json" },
  postAdminOrgsIdPlan: { method: "POST", path: "/v1/admin/orgs/{id}/plan", pathParams: ["id"], query: [], body: true, kind: "json" },
  postAdminOrgsIdSuspend: { method: "POST", path: "/v1/admin/orgs/{id}/suspend", pathParams: ["id"], query: [], body: true, kind: "json" },
  postAdminOrgsIdUnsuspend: { method: "POST", path: "/v1/admin/orgs/{id}/unsuspend", pathParams: ["id"], query: [], body: false, kind: "json" },
  postAdminPartnerAccountsIdBan: { method: "POST", path: "/v1/admin/partner-accounts/{id}/ban", pathParams: ["id"], query: [], body: false, kind: "json" },
  postAdminPartnerAccountsIdUnban: { method: "POST", path: "/v1/admin/partner-accounts/{id}/unban", pathParams: ["id"], query: [], body: false, kind: "json" },
  postAdminStatusIncidents: { method: "POST", path: "/v1/admin/status/incidents", pathParams: [], query: [], body: true, kind: "json" },
  postAdminStatusIncidentsIdUpdates: { method: "POST", path: "/v1/admin/status/incidents/{id}/updates", pathParams: ["id"], query: [], body: true, kind: "json" },
  postAgentsRegister: { method: "POST", path: "/v1/agents/register", pathParams: [], query: [], body: true, kind: "json", public: true },
  postAnomaliesScan: { method: "POST", path: "/v1/anomalies/scan", pathParams: [], query: [], body: false, kind: "json" },
  postApiKeys: { method: "POST", path: "/v1/api-keys", pathParams: [], query: [], body: true, kind: "json" },
  postAssets: { method: "POST", path: "/v1/assets", pathParams: [], query: [], body: true, kind: "json" },
  postAttributionReplay: { method: "POST", path: "/v1/attribution/replay", pathParams: [], query: [], body: true, kind: "json" },
  postAuthBackchannelLogout: { method: "POST", path: "/v1/auth/backchannel-logout", pathParams: [], query: [], body: true, kind: "json", public: true },
  postAuthConnections: { method: "POST", path: "/v1/auth/connections", pathParams: [], query: [], body: true, kind: "json" },
  postAuthConnectionsIdAliases: { method: "POST", path: "/v1/auth/connections/{id}/aliases", pathParams: ["id"], query: [], body: true, kind: "json", public: true },
  postAuthConnectionsIdErase: { method: "POST", path: "/v1/auth/connections/{id}/erase", pathParams: ["id"], query: [], body: true, kind: "json", public: true },
  postAuthConnectionsIdPartners: { method: "POST", path: "/v1/auth/connections/{id}/partners", pathParams: ["id"], query: [], body: true, kind: "json", public: true },
  postAuthConnectionsIdPing: { method: "POST", path: "/v1/auth/connections/{id}/ping", pathParams: ["id"], query: [], body: true, kind: "json", public: true },
  postAuthConnectionsIdRevokePreviousSecret: { method: "POST", path: "/v1/auth/connections/{id}/revoke-previous-secret", pathParams: ["id"], query: [], body: false, kind: "json" },
  postAuthConnectionsIdRotateSecret: { method: "POST", path: "/v1/auth/connections/{id}/rotate-secret", pathParams: ["id"], query: [], body: false, kind: "json" },
  postAuthConnectionsIdSignals: { method: "POST", path: "/v1/auth/connections/{id}/signals", pathParams: ["id"], query: [], body: true, kind: "json", public: true },
  postAuthConnectionsIdSignups: { method: "POST", path: "/v1/auth/connections/{id}/signups", pathParams: ["id"], query: [], body: true, kind: "json", public: true },
  postAuthConnectionsIdUsers: { method: "POST", path: "/v1/auth/connections/{id}/users", pathParams: ["id"], query: [], body: true, kind: "json", public: true },
  postAuthConnectionsInstall: { method: "POST", path: "/v1/auth/connections/install", pathParams: [], query: [], body: true, kind: "json" },
  postAuthLogout: { method: "POST", path: "/v1/auth/logout", pathParams: [], query: [], body: false, kind: "json", public: true },
  postBillingActivate: { method: "POST", path: "/v1/billing/activate", pathParams: [], query: [], body: true, kind: "json" },
  postBillingCheckout: { method: "POST", path: "/v1/billing/checkout", pathParams: [], query: [], body: true, kind: "json" },
  postBillingConnections: { method: "POST", path: "/v1/billing/connections", pathParams: [], query: [], body: true, kind: "json" },
  postBillingConnectionsIdRotateSecret: { method: "POST", path: "/v1/billing/connections/{id}/rotate-secret", pathParams: ["id"], query: [], body: false, kind: "json" },
  postBillingConnectionsIdValueMappingPreview: { method: "POST", path: "/v1/billing/connections/{id}/value-mapping/preview", pathParams: ["id"], query: [], body: true, kind: "json" },
  postBillingInternalCustomers: { method: "POST", path: "/v1/billing/internal-customers", pathParams: [], query: [], body: true, kind: "json" },
  postBillingPortal: { method: "POST", path: "/v1/billing/portal", pathParams: [], query: [], body: false, kind: "json" },
  postBrandingDomain: { method: "POST", path: "/v1/branding/domain", pathParams: [], query: [], body: true, kind: "json" },
  postBrandingDomainVerify: { method: "POST", path: "/v1/branding/domain/verify", pathParams: [], query: [], body: false, kind: "json" },
  postBrandingLinkDomain: { method: "POST", path: "/v1/branding/link-domain", pathParams: [], query: [], body: true, kind: "json" },
  postBrandingLinkDomainVerify: { method: "POST", path: "/v1/branding/link-domain/verify", pathParams: [], query: [], body: false, kind: "json" },
  postCliDeviceCodes: { method: "POST", path: "/v1/cli/device-codes", pathParams: [], query: [], body: true, kind: "json", public: true },
  postCliDeviceCodesToken: { method: "POST", path: "/v1/cli/device-codes/token", pathParams: [], query: [], body: true, kind: "json", public: true },
  postCliDeviceCodesUserCodeApprove: { method: "POST", path: "/v1/cli/device-codes/{userCode}/approve", pathParams: ["userCode"], query: [], body: true, kind: "json" },
  postCliDeviceCodesUserCodeDeny: { method: "POST", path: "/v1/cli/device-codes/{userCode}/deny", pathParams: ["userCode"], query: [], body: false, kind: "json" },
  postCliListeners: { method: "POST", path: "/v1/cli/listeners", pathParams: [], query: [], body: true, kind: "json" },
  postCliTrigger: { method: "POST", path: "/v1/cli/trigger", pathParams: [], query: [], body: true, kind: "json" },
  postCommissionRules: { method: "POST", path: "/v1/commission-rules", pathParams: [], query: [], body: true, kind: "json" },
  postCommissionsApproveDue: { method: "POST", path: "/v1/commissions/approve-due", pathParams: [], query: [], body: false, kind: "json" },
  postCommissionsIdAdjust: { method: "POST", path: "/v1/commissions/{id}/adjust", pathParams: ["id"], query: [], body: true, kind: "json" },
  postCommissionsIdSettle: { method: "POST", path: "/v1/commissions/{id}/settle", pathParams: ["id"], query: [], body: true, kind: "json" },
  postContracts: { method: "POST", path: "/v1/contracts", pathParams: [], query: [], body: true, kind: "json" },
  postContractsIdSend: { method: "POST", path: "/v1/contracts/{id}/send", pathParams: ["id"], query: [], body: false, kind: "json" },
  postCoupons: { method: "POST", path: "/v1/coupons", pathParams: [], query: [], body: true, kind: "json" },
  postCreatorsAccountIdInvite: { method: "POST", path: "/v1/creators/{accountId}/invite", pathParams: ["accountId"], query: [], body: true, kind: "json" },
  postDealsIdApprove: { method: "POST", path: "/v1/deals/{id}/approve", pathParams: ["id"], query: [], body: true, kind: "json" },
  postDealsIdReject: { method: "POST", path: "/v1/deals/{id}/reject", pathParams: ["id"], query: [], body: false, kind: "json" },
  postDealsIdWon: { method: "POST", path: "/v1/deals/{id}/won", pathParams: ["id"], query: [], body: true, kind: "json" },
  postDiscoveryCorpus: { method: "POST", path: "/v1/discovery/corpus", pathParams: [], query: [], body: true, kind: "json" },
  postDiscoverySearch: { method: "POST", path: "/v1/discovery/search", pathParams: [], query: [], body: true, kind: "json" },
  postDisputesIdResolve: { method: "POST", path: "/v1/disputes/{id}/resolve", pathParams: ["id"], query: [], body: true, kind: "json" },
  postEmailPreview: { method: "POST", path: "/v1/email/preview", pathParams: [], query: [], body: true, kind: "json" },
  postEmailSettingsVerifyDomain: { method: "POST", path: "/v1/email/settings/verify-domain", pathParams: [], query: [], body: false, kind: "json" },
  postEmailTest: { method: "POST", path: "/v1/email/test", pathParams: [], query: [], body: true, kind: "json" },
  postEmbedTokens: { method: "POST", path: "/v1/embed/tokens", pathParams: [], query: [], body: true, kind: "json" },
  postFraudCasesIdResolve: { method: "POST", path: "/v1/fraud/cases/{id}/resolve", pathParams: ["id"], query: [], body: true, kind: "json" },
  postFraudDetectRings: { method: "POST", path: "/v1/fraud/detect-rings", pathParams: [], query: [], body: false, kind: "json" },
  postFraudInvalidTrafficScan: { method: "POST", path: "/v1/fraud/invalid-traffic/scan", pathParams: [], query: [], body: true, kind: "json" },
  postFxRates: { method: "POST", path: "/v1/fx-rates", pathParams: [], query: [], body: true, kind: "json" },
  postFxRatesClearOverride: { method: "POST", path: "/v1/fx-rates/clear-override", pathParams: [], query: [], body: true, kind: "json" },
  postFxRatesSync: { method: "POST", path: "/v1/fx-rates/sync", pathParams: [], query: [], body: false, kind: "json" },
  postGraphql: { method: "POST", path: "/v1/graphql", pathParams: [], query: [], body: true, kind: "json" },
  postImportProvider: { method: "POST", path: "/v1/import/{provider}", pathParams: ["provider"], query: ["programId","dryRun","destinationUrl"], body: true, kind: "json" },
  postIntegrationsDeliveriesIdRetry: { method: "POST", path: "/v1/integrations/deliveries/{id}/retry", pathParams: ["id"], query: [], body: false, kind: "json" },
  postIntegrationsHubspotTest: { method: "POST", path: "/v1/integrations/hubspot/test", pathParams: [], query: [], body: true, kind: "json" },
  postIntegrationsSegmentTest: { method: "POST", path: "/v1/integrations/segment/test", pathParams: [], query: [], body: false, kind: "json" },
  postInvitationsIdWithdraw: { method: "POST", path: "/v1/invitations/{id}/withdraw", pathParams: ["id"], query: [], body: false, kind: "json" },
  postLinks: { method: "POST", path: "/v1/links", pathParams: [], query: [], body: true, kind: "json" },
  postMobilePurchases: { method: "POST", path: "/v1/mobile/purchases", pathParams: [], query: [], body: true, kind: "json" },
  postNotificationsIdRead: { method: "POST", path: "/v1/notifications/{id}/read", pathParams: ["id"], query: [], body: false, kind: "json" },
  postOauthToken: { method: "POST", path: "/v1/oauth/token", pathParams: [], query: [], body: true, kind: "json", public: true },
  postOnchainConnections: { method: "POST", path: "/v1/onchain/connections", pathParams: [], query: [], body: true, kind: "json" },
  postOrgHostedPagesCheck: { method: "POST", path: "/v1/org/hosted-pages/check", pathParams: [], query: [], body: false, kind: "json" },
  postOrgMembers: { method: "POST", path: "/v1/org/members", pathParams: [], query: [], body: true, kind: "json" },
  postOrgPortalAuthTest: { method: "POST", path: "/v1/org/portal-auth/test", pathParams: [], query: [], body: false, kind: "json" },
  postOrgs: { method: "POST", path: "/v1/orgs", pathParams: [], query: [], body: true, kind: "json" },
  postOrgSsoDirectTest: { method: "POST", path: "/v1/org/sso/direct/test", pathParams: [], query: [], body: false, kind: "json" },
  postOrgSsoLink: { method: "POST", path: "/v1/org/sso/link", pathParams: [], query: [], body: false, kind: "json" },
  postOrgSsoTickets: { method: "POST", path: "/v1/org/sso/tickets", pathParams: [], query: [], body: true, kind: "json" },
  postOrgSsoTicketsIdRevoke: { method: "POST", path: "/v1/org/sso/tickets/{id}/revoke", pathParams: ["id"], query: [], body: false, kind: "json" },
  postOutreachDraft: { method: "POST", path: "/v1/outreach/draft", pathParams: [], query: [], body: true, kind: "json" },
  postOutreachIdApprove: { method: "POST", path: "/v1/outreach/{id}/approve", pathParams: ["id"], query: [], body: false, kind: "json" },
  postOutreachSendDue: { method: "POST", path: "/v1/outreach/send-due", pathParams: [], query: [], body: false, kind: "json" },
  postPartnerAdvanceAccept: { method: "POST", path: "/v1/partner/advance/accept", pathParams: [], query: [], body: true, kind: "json" },
  postPartnerAuthWalletNonce: { method: "POST", path: "/v1/partner/auth/wallet/nonce", pathParams: [], query: [], body: true, kind: "json", public: true },
  postPartnerAuthWalletVerify: { method: "POST", path: "/v1/partner/auth/wallet/verify", pathParams: [], query: [], body: true, kind: "json", public: true },
  postPartnerContractsIdAccept: { method: "POST", path: "/v1/partner/contracts/{id}/accept", pathParams: ["id"], query: [], body: false, kind: "json" },
  postPartnerContractsIdDecline: { method: "POST", path: "/v1/partner/contracts/{id}/decline", pathParams: ["id"], query: [], body: false, kind: "json" },
  postPartnerDeals: { method: "POST", path: "/v1/partner/deals", pathParams: [], query: [], body: true, kind: "json" },
  postPartnerDisputes: { method: "POST", path: "/v1/partner/disputes", pathParams: [], query: [], body: true, kind: "json" },
  postPartnerInvitationsIdAccept: { method: "POST", path: "/v1/partner/invitations/{id}/accept", pathParams: ["id"], query: [], body: false, kind: "json" },
  postPartnerInvitationsIdDecline: { method: "POST", path: "/v1/partner/invitations/{id}/decline", pathParams: ["id"], query: [], body: false, kind: "json" },
  postPartnerKycSubmit: { method: "POST", path: "/v1/partner/kyc/submit", pathParams: [], query: [], body: true, kind: "json" },
  postPartnerLinks: { method: "POST", path: "/v1/partner/links", pathParams: [], query: [], body: true, kind: "json" },
  postPartnerNotificationsIdRead: { method: "POST", path: "/v1/partner/notifications/{id}/read", pathParams: ["id"], query: [], body: false, kind: "json" },
  postPartnerOrgsOrgIdSelfBilling: { method: "POST", path: "/v1/partner/orgs/{orgId}/self-billing", pathParams: ["orgId"], query: [], body: true, kind: "json" },
  postPartnerOrgsOrgIdTaxForm: { method: "POST", path: "/v1/partner/orgs/{orgId}/tax-form", pathParams: ["orgId"], query: [], body: true, kind: "json" },
  postPartnerProgramsProgramIdApply: { method: "POST", path: "/v1/partner/programs/{programId}/apply", pathParams: ["programId"], query: [], body: false, kind: "json" },
  postPartners: { method: "POST", path: "/v1/partners", pathParams: [], query: [], body: true, kind: "json" },
  postPartnerSecurityTotpDisable: { method: "POST", path: "/v1/partner/security/totp/disable", pathParams: [], query: [], body: true, kind: "json" },
  postPartnerSecurityTotpEnable: { method: "POST", path: "/v1/partner/security/totp/enable", pathParams: [], query: [], body: true, kind: "json" },
  postPartnerSecurityTotpSetup: { method: "POST", path: "/v1/partner/security/totp/setup", pathParams: [], query: [], body: false, kind: "json" },
  postPartnersIdTaxForm: { method: "POST", path: "/v1/partners/{id}/tax-form", pathParams: ["id"], query: [], body: true, kind: "json" },
  postPartnerTermsVersionIdAccept: { method: "POST", path: "/v1/partner/terms/{versionId}/accept", pathParams: ["versionId"], query: [], body: false, kind: "json" },
  postPassportVerify: { method: "POST", path: "/v1/passport/verify", pathParams: [], query: [], body: true, kind: "json", public: true },
  postPayoutRuns: { method: "POST", path: "/v1/payout-runs", pathParams: [], query: [], body: false, kind: "json" },
  postPayoutRunsIdCancel: { method: "POST", path: "/v1/payout-runs/{id}/cancel", pathParams: ["id"], query: [], body: false, kind: "json" },
  postPayoutRunsIdExecute: { method: "POST", path: "/v1/payout-runs/{id}/execute", pathParams: ["id"], query: [], body: false, kind: "json" },
  postPayoutRunsRunScheduled: { method: "POST", path: "/v1/payout-runs/run-scheduled", pathParams: [], query: [], body: false, kind: "json" },
  postPrivacyExecutorKeys: { method: "POST", path: "/v1/privacy/executor-keys", pathParams: [], query: [], body: true, kind: "json" },
  postPrivacyExecutorsAdapterCheck: { method: "POST", path: "/v1/privacy/executors/{adapter}/check", pathParams: ["adapter"], query: [], body: false, kind: "json" },
  postPrivacyForget: { method: "POST", path: "/v1/privacy/forget", pathParams: [], query: [], body: true, kind: "json" },
  postPrivacyLookup: { method: "POST", path: "/v1/privacy/lookup", pathParams: [], query: [], body: true, kind: "json" },
  postPrivacyRequests: { method: "POST", path: "/v1/privacy/requests", pathParams: [], query: [], body: true, kind: "json" },
  postProfitabilityRebuild: { method: "POST", path: "/v1/profitability/rebuild", pathParams: [], query: [], body: false, kind: "json" },
  postPrograms: { method: "POST", path: "/v1/programs", pathParams: [], query: [], body: true, kind: "json" },
  postProgramsIdApplyLeveling: { method: "POST", path: "/v1/programs/{id}/apply-leveling", pathParams: ["id"], query: [], body: false, kind: "json" },
  postProgramsIdAutopriceRun: { method: "POST", path: "/v1/programs/{id}/autoprice/run", pathParams: ["id"], query: [], body: true, kind: "json" },
  postProgramsIdEnrollments: { method: "POST", path: "/v1/programs/{id}/enrollments", pathParams: ["id"], query: [], body: true, kind: "json" },
  postProgramsIdEnrollmentsEnrollmentIdApprove: { method: "POST", path: "/v1/programs/{id}/enrollments/{enrollmentId}/approve", pathParams: ["id","enrollmentId"], query: [], body: false, kind: "json" },
  postProgramsIdEnrollmentsEnrollmentIdReject: { method: "POST", path: "/v1/programs/{id}/enrollments/{enrollmentId}/reject", pathParams: ["id","enrollmentId"], query: [], body: false, kind: "json" },
  postProgramsIdGroups: { method: "POST", path: "/v1/programs/{id}/groups", pathParams: ["id"], query: [], body: true, kind: "json" },
  postProgramsIdPromotions: { method: "POST", path: "/v1/programs/{id}/promotions", pathParams: ["id"], query: [], body: true, kind: "json" },
  postPromotionsIdEnd: { method: "POST", path: "/v1/promotions/{id}/end", pathParams: ["id"], query: [], body: false, kind: "json" },
  postPublicProgramsHandleJoin: { method: "POST", path: "/v1/public/programs/{handle}/join", pathParams: ["handle"], query: [], body: true, kind: "json" },
  postQualityRecompute: { method: "POST", path: "/v1/quality/recompute", pathParams: [], query: [], body: false, kind: "json" },
  postReferralsAssociate: { method: "POST", path: "/v1/referrals/associate", pathParams: [], query: [], body: true, kind: "json" },
  postReferralsIdApprove: { method: "POST", path: "/v1/referrals/{id}/approve", pathParams: ["id"], query: [], body: false, kind: "json" },
  postReferralsIdReassign: { method: "POST", path: "/v1/referrals/{id}/reassign", pathParams: ["id"], query: [], body: true, kind: "json" },
  postReferralsIdVoid: { method: "POST", path: "/v1/referrals/{id}/void", pathParams: ["id"], query: [], body: false, kind: "json" },
  postRewards: { method: "POST", path: "/v1/rewards", pathParams: [], query: [], body: true, kind: "json" },
  postRewardsIdRedeem: { method: "POST", path: "/v1/rewards/{id}/redeem", pathParams: ["id"], query: [], body: true, kind: "json" },
  postRewardsRedeemByCode: { method: "POST", path: "/v1/rewards/redeem-by-code", pathParams: [], query: [], body: true, kind: "json" },
  postRoiPatternsPatternReview: { method: "POST", path: "/v1/roi/patterns/{pattern}/review", pathParams: ["pattern"], query: [], body: true, kind: "json" },
  postSandboxSimulate: { method: "POST", path: "/v1/sandbox/simulate", pathParams: [], query: [], body: true, kind: "json" },
  postSupportAppsAdapterTest: { method: "POST", path: "/v1/support/apps/{adapter}/test", pathParams: ["adapter"], query: [], body: true, kind: "json" },
  postSupportCardsOrgIdAdapter: { method: "POST", path: "/v1/support/cards/{orgId}/{adapter}", pathParams: ["orgId","adapter"], query: [], body: true, kind: "json", public: true },
  postTax1099DocumentsIdCorrect: { method: "POST", path: "/v1/tax/1099/documents/{id}/correct", pathParams: ["id"], query: [], body: false, kind: "json" },
  postTax1099Filings: { method: "POST", path: "/v1/tax/1099/filings", pathParams: [], query: [], body: true, kind: "json" },
  postTax1099FilingsIdRefresh: { method: "POST", path: "/v1/tax/1099/filings/{id}/refresh", pathParams: ["id"], query: [], body: false, kind: "json" },
  postTestClockAdvance: { method: "POST", path: "/v1/test_clock/advance", pathParams: [], query: [], body: true, kind: "json" },
  postTrackEvents: { method: "POST", path: "/v1/track/events", pathParams: [], query: [], body: true, kind: "json" },
  postUnsubscribeToken: { method: "POST", path: "/v1/unsubscribe/{token}", pathParams: ["token"], query: [], body: false, kind: "json", public: true },
  postValueEvents: { method: "POST", path: "/v1/value/events", pathParams: [], query: [], body: true, kind: "json" },
  postValueImport: { method: "POST", path: "/v1/value/import", pathParams: [], query: [], body: true, kind: "json" },
  postWebhookDeliveriesIdReplay: { method: "POST", path: "/v1/webhook-deliveries/{id}/replay", pathParams: ["id"], query: [], body: false, kind: "json" },
  postWebhookEndpoints: { method: "POST", path: "/v1/webhook-endpoints", pathParams: [], query: [], body: true, kind: "json" },
  postWebhookEndpointsIdReplay: { method: "POST", path: "/v1/webhook-endpoints/{id}/replay", pathParams: ["id"], query: ["since"], body: false, kind: "json" },
  postWebhookEndpointsIdRotateSecret: { method: "POST", path: "/v1/webhook-endpoints/{id}/rotate-secret", pathParams: ["id"], query: [], body: false, kind: "json" },
  postWidgetTokens: { method: "POST", path: "/v1/widget/tokens", pathParams: [], query: [], body: true, kind: "json" },
  postZapierConversions: { method: "POST", path: "/v1/zapier/conversions", pathParams: [], query: [], body: true, kind: "json" },
  postZapierHooks: { method: "POST", path: "/v1/zapier/hooks", pathParams: [], query: [], body: true, kind: "json" },
  putAuthConnectionsIdSecret: { method: "PUT", path: "/v1/auth/connections/{id}/secret", pathParams: ["id"], query: [], body: true, kind: "json" },
  putBillingConnectionsIdCredentials: { method: "PUT", path: "/v1/billing/connections/{id}/credentials", pathParams: ["id"], query: [], body: true, kind: "json" },
  putBillingConnectionsIdSecret: { method: "PUT", path: "/v1/billing/connections/{id}/secret", pathParams: ["id"], query: [], body: true, kind: "json" },
  putBillingConnectionsIdValueMapping: { method: "PUT", path: "/v1/billing/connections/{id}/value-mapping", pathParams: ["id"], query: [], body: true, kind: "json" },
  putBranding: { method: "PUT", path: "/v1/branding", pathParams: [], query: [], body: true, kind: "json" },
  putEmailSettings: { method: "PUT", path: "/v1/email/settings", pathParams: [], query: [], body: true, kind: "json" },
  putEmailTemplatesEventLocale: { method: "PUT", path: "/v1/email/templates/{event}/{locale}", pathParams: ["event","locale"], query: [], body: true, kind: "json" },
  putIntegrationsHubspot: { method: "PUT", path: "/v1/integrations/hubspot", pathParams: [], query: [], body: true, kind: "json" },
  putIntegrationsSegment: { method: "PUT", path: "/v1/integrations/segment", pathParams: [], query: [], body: true, kind: "json" },
  putMarketplaceListing: { method: "PUT", path: "/v1/marketplace/listing", pathParams: [], query: [], body: true, kind: "json" },
  putMeLocale: { method: "PUT", path: "/v1/me/locale", pathParams: [], query: [], body: true, kind: "json" },
  putMeRoiDigest: { method: "PUT", path: "/v1/me/roi-digest", pathParams: [], query: [], body: true, kind: "json" },
  putNetworkSettings: { method: "PUT", path: "/v1/network/settings", pathParams: [], query: [], body: true, kind: "json" },
  putOrgFxFeed: { method: "PUT", path: "/v1/org/fx-feed", pathParams: [], query: [], body: true, kind: "json" },
  putOrgHostedPages: { method: "PUT", path: "/v1/org/hosted-pages", pathParams: [], query: [], body: true, kind: "json" },
  putOrgPayoutSchedule: { method: "PUT", path: "/v1/org/payout-schedule", pathParams: [], query: [], body: true, kind: "json" },
  putOrgPortalAuth: { method: "PUT", path: "/v1/org/portal-auth", pathParams: [], query: [], body: true, kind: "json" },
  putOrgReferralParams: { method: "PUT", path: "/v1/org/referral-params", pathParams: [], query: [], body: true, kind: "json" },
  putOrgRetention: { method: "PUT", path: "/v1/org/retention", pathParams: [], query: [], body: true, kind: "json" },
  putOrgSsoDirect: { method: "PUT", path: "/v1/org/sso/direct", pathParams: [], query: [], body: true, kind: "json" },
  putOrgTaxFiling: { method: "PUT", path: "/v1/org/tax-filing", pathParams: [], query: [], body: true, kind: "json" },
  putOrgTaxProfile: { method: "PUT", path: "/v1/org/tax-profile", pathParams: [], query: [], body: true, kind: "json" },
  putOrgTrackingConsent: { method: "PUT", path: "/v1/org/tracking-consent", pathParams: [], query: [], body: true, kind: "json" },
  putPartnerLocale: { method: "PUT", path: "/v1/partner/locale", pathParams: [], query: [], body: true, kind: "json" },
  putPartnerOrgsOrgIdPayoutProfile: { method: "PUT", path: "/v1/partner/orgs/{orgId}/payout-profile", pathParams: ["orgId"], query: [], body: true, kind: "json" },
  putPartnerOrgsOrgIdPostback: { method: "PUT", path: "/v1/partner/orgs/{orgId}/postback", pathParams: ["orgId"], query: [], body: true, kind: "json" },
  putPartnerOrgsOrgIdVat: { method: "PUT", path: "/v1/partner/orgs/{orgId}/vat", pathParams: ["orgId"], query: [], body: true, kind: "json" },
  putPartnerProfile: { method: "PUT", path: "/v1/partner/profile", pathParams: [], query: [], body: true, kind: "json" },
  putPartnersIdPayoutProfile: { method: "PUT", path: "/v1/partners/{id}/payout-profile", pathParams: ["id"], query: [], body: true, kind: "json" },
  putPartnersIdVat: { method: "PUT", path: "/v1/partners/{id}/vat", pathParams: ["id"], query: [], body: true, kind: "json" },
  putPayoutConnectionsProvider: { method: "PUT", path: "/v1/payout-connections/{provider}", pathParams: ["provider"], query: [], body: true, kind: "json" },
  putProfitabilityProductsProductRef: { method: "PUT", path: "/v1/profitability/products/{productRef}", pathParams: ["productRef"], query: [], body: true, kind: "json" },
  putProfitabilitySettings: { method: "PUT", path: "/v1/profitability/settings", pathParams: [], query: [], body: true, kind: "json" },
  putProgramsIdAutopricing: { method: "PUT", path: "/v1/programs/{id}/autopricing", pathParams: ["id"], query: [], body: true, kind: "json" },
  putProgramsIdIncrementality: { method: "PUT", path: "/v1/programs/{id}/incrementality", pathParams: ["id"], query: [], body: true, kind: "json" },
  putProgramsIdNegotiationPolicy: { method: "PUT", path: "/v1/programs/{id}/negotiation-policy", pathParams: ["id"], query: [], body: true, kind: "json" },
  putProgramsIdPartnersPartnerIdGroup: { method: "PUT", path: "/v1/programs/{id}/partners/{partnerId}/group", pathParams: ["id","partnerId"], query: [], body: true, kind: "json" },
  putProgramsIdPayoutSchedule: { method: "PUT", path: "/v1/programs/{id}/payout-schedule", pathParams: ["id"], query: [], body: true, kind: "json" },
  putProgramsIdRefereeReward: { method: "PUT", path: "/v1/programs/{id}/referee-reward", pathParams: ["id"], query: [], body: true, kind: "json" },
  putRewardsRulesKey: { method: "PUT", path: "/v1/rewards/rules/{key}", pathParams: ["key"], query: [], body: true, kind: "json" },
  putSupportAppsAdapter: { method: "PUT", path: "/v1/support/apps/{adapter}", pathParams: ["adapter"], query: [], body: true, kind: "json" },
} as const satisfies Record<string, OperationSpec>;

export type OperationId = keyof typeof operations;

/** Every operation as a typed method, grouped by resource. */
export function buildResources(t: Transport) {
  return {
    account: {
      /** Close your own account. POST /v1/account/close */
      close: (body: T.PostAccountCloseBody, options?: RequestOptions): Promise<T.PostAccountCloseResponse> => t.op("postAccountClose", { body }, options),
    },
    admin: {
      /** Get platform metrics. GET /v1/admin/metrics */
      metrics: (options?: RequestOptions): Promise<T.GetAdminMetricsResponse> => t.op("getAdminMetrics", {  }, options),
      orgs: {
        /** List organizations. GET /v1/admin/orgs */
        list: (query?: T.GetAdminOrgsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetAdminOrgsResponse['data'][number], T.GetAdminOrgsResponse> => t.list("getAdminOrgs", { query }, options),
        /** Set an organization's plan. POST /v1/admin/orgs/{id}/plan */
        plan: (id: string, body: T.PostAdminOrgsIdPlanBody, options?: RequestOptions): Promise<T.PostAdminOrgsIdPlanResponse> => t.op("postAdminOrgsIdPlan", { path: { id }, body }, options),
        /** Suspend an organization. POST /v1/admin/orgs/{id}/suspend */
        suspend: (id: string, body: T.PostAdminOrgsIdSuspendBody, options?: RequestOptions): Promise<T.PostAdminOrgsIdSuspendResponse> => t.op("postAdminOrgsIdSuspend", { path: { id }, body }, options),
        /** Unsuspend an organization. POST /v1/admin/orgs/{id}/unsuspend */
        unsuspend: (id: string, options?: RequestOptions): Promise<T.PostAdminOrgsIdUnsuspendResponse> => t.op("postAdminOrgsIdUnsuspend", { path: { id } }, options),
      },
      partnerAccounts: {
        /** List partner accounts. GET /v1/admin/partner-accounts */
        list: (query?: T.GetAdminPartnerAccountsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetAdminPartnerAccountsResponse['data'][number], T.GetAdminPartnerAccountsResponse> => t.list("getAdminPartnerAccounts", { query }, options),
        /** Ban a partner account. POST /v1/admin/partner-accounts/{id}/ban */
        ban: (id: string, options?: RequestOptions): Promise<T.PostAdminPartnerAccountsIdBanResponse> => t.op("postAdminPartnerAccountsIdBan", { path: { id } }, options),
        /** Unban a partner account. POST /v1/admin/partner-accounts/{id}/unban */
        unban: (id: string, options?: RequestOptions): Promise<T.PostAdminPartnerAccountsIdUnbanResponse> => t.op("postAdminPartnerAccountsIdUnban", { path: { id } }, options),
      },
      status: {
        incidents: {
          /** Edit a status incident. PATCH /v1/admin/status/incidents/{id} */
          update: (id: string, body: T.PatchAdminStatusIncidentsIdBody, options?: RequestOptions): Promise<T.PatchAdminStatusIncidentsIdResponse> => t.op("patchAdminStatusIncidentsId", { path: { id }, body }, options),
          /** Open a status incident. POST /v1/admin/status/incidents */
          create: (body: T.PostAdminStatusIncidentsBody, options?: RequestOptions): Promise<T.PostAdminStatusIncidentsResponse> => t.op("postAdminStatusIncidents", { body }, options),
          /** Post an incident update. POST /v1/admin/status/incidents/{id}/updates */
          updates: (id: string, body: T.PostAdminStatusIncidentsIdUpdatesBody, options?: RequestOptions): Promise<T.PostAdminStatusIncidentsIdUpdatesResponse> => t.op("postAdminStatusIncidentsIdUpdates", { path: { id }, body }, options),
        },
      },
    },
    agents: {
      /** List partnered AI agents. GET /v1/agents */
      list: (query?: T.GetAgentsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetAgentsResponse['data'][number], T.GetAgentsResponse> => t.list("getAgents", { query }, options),
      /** List agent recommendations. GET /v1/agents/recommendations */
      recommendations: (query?: T.GetAgentsRecommendationsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetAgentsRecommendationsResponse['data'][number], T.GetAgentsRecommendationsResponse> => t.list("getAgentsRecommendations", { query }, options),
      /** Register an AI agent. POST /v1/agents/register */
      register: (body: T.PostAgentsRegisterBody, options?: RequestOptions): Promise<T.PostAgentsRegisterResponse> => t.op("postAgentsRegister", { body }, options),
    },
    analytics: {
      /** Get revenue by channel. GET /v1/analytics/by-channel */
      byChannel: (query?: T.GetAnalyticsByChannelQuery & PageParams, options?: RequestOptions): ListPromise<T.GetAnalyticsByChannelResponse['data'][number], T.GetAnalyticsByChannelResponse> => t.list("getAnalyticsByChannel", { query }, options),
      /** Get revenue by country. GET /v1/analytics/by-geo */
      byGeo: (query?: T.GetAnalyticsByGeoQuery & PageParams, options?: RequestOptions): ListPromise<T.GetAnalyticsByGeoResponse['data'][number], T.GetAnalyticsByGeoResponse> => t.list("getAnalyticsByGeo", { query }, options),
      /** Get cohort LTV. GET /v1/analytics/cohort-ltv */
      cohortLtv: (query?: T.GetAnalyticsCohortLtvQuery & PageParams, options?: RequestOptions): ListPromise<T.GetAnalyticsCohortLtvResponse['data'][number], T.GetAnalyticsCohortLtvResponse> => t.list("getAnalyticsCohortLtv", { query }, options),
      /** Get coupon performance. GET /v1/analytics/coupon-performance */
      couponPerformance: (query?: T.GetAnalyticsCouponPerformanceQuery & PageParams, options?: RequestOptions): ListPromise<T.GetAnalyticsCouponPerformanceResponse['data'][number], T.GetAnalyticsCouponPerformanceResponse> => t.list("getAnalyticsCouponPerformance", { query }, options),
      /** Get the funnel overview. GET /v1/analytics/overview */
      overview: (query?: T.GetAnalyticsOverviewQuery, options?: RequestOptions): Promise<T.GetAnalyticsOverviewResponse> => t.op("getAnalyticsOverview", { query }, options),
      /** Get a daily time series. GET /v1/analytics/timeseries */
      timeseries: (query: T.GetAnalyticsTimeseriesQuery & PageParams, options?: RequestOptions): ListPromise<T.GetAnalyticsTimeseriesResponse['data'][number], T.GetAnalyticsTimeseriesResponse> => t.list("getAnalyticsTimeseries", { query }, options),
    },
    anomalies: {
      /** Scan for anomalies. POST /v1/anomalies/scan */
      scan: (options?: RequestOptions): Promise<T.PostAnomaliesScanResponse> => t.op("postAnomaliesScan", {  }, options),
    },
    apiKeys: {
      /** Revoke an API key. DELETE /v1/api-keys/{id} */
      delete: (id: string, query?: T.DeleteApiKeysIdQuery, options?: RequestOptions): Promise<T.DeleteApiKeysIdResponse> => t.op("deleteApiKeysId", { path: { id }, query }, options),
      /** List API keys. GET /v1/api-keys */
      list: (query?: T.GetApiKeysQuery & PageParams, options?: RequestOptions): ListPromise<T.GetApiKeysResponse['data'][number], T.GetApiKeysResponse> => t.list("getApiKeys", { query }, options),
      /** Get an API key. GET /v1/api-keys/{id} */
      retrieve: (id: string, options?: RequestOptions): Promise<T.GetApiKeysIdResponse> => t.op("getApiKeysId", { path: { id } }, options),
      /** Update an API key. PATCH /v1/api-keys/{id} */
      update: (id: string, body: T.PatchApiKeysIdBody, options?: RequestOptions): Promise<T.PatchApiKeysIdResponse> => t.op("patchApiKeysId", { path: { id }, body }, options),
      /** Create an API key. POST /v1/api-keys */
      create: (body: T.PostApiKeysBody, options?: RequestOptions): Promise<T.PostApiKeysResponse> => t.op("postApiKeys", { body }, options),
    },
    assets: {
      /** Delete a marketing asset. DELETE /v1/assets/{id} */
      delete: (id: string, options?: RequestOptions): Promise<T.DeleteAssetsIdResponse> => t.op("deleteAssetsId", { path: { id } }, options),
      /** List marketing assets. GET /v1/assets */
      list: (query?: T.GetAssetsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetAssetsResponse['data'][number], T.GetAssetsResponse> => t.list("getAssets", { query }, options),
      /** Create a marketing asset. POST /v1/assets */
      create: (body: T.PostAssetsBody, options?: RequestOptions): Promise<T.PostAssetsResponse> => t.op("postAssets", { body }, options),
    },
    assistant: {
      /** Get program suggestions. GET /v1/assistant/suggestions */
      suggestions: (query?: T.GetAssistantSuggestionsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetAssistantSuggestionsResponse['data'][number], T.GetAssistantSuggestionsResponse> => t.list("getAssistantSuggestions", { query }, options),
    },
    attribution: {
      /** Replay attribution. POST /v1/attribution/replay */
      replay: (body: T.PostAttributionReplayBody, options?: RequestOptions): Promise<T.PostAttributionReplayResponse> => t.op("postAttributionReplay", { body }, options),
    },
    auditLogs: {
      /** List audit log entries. GET /v1/audit-logs */
      list: (query?: T.GetAuditLogsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetAuditLogsResponse['data'][number], T.GetAuditLogsResponse> => t.list("getAuditLogs", { query }, options),
    },
    auth: {
      /** List sign-in providers. GET /v1/auth/providers */
      providers: (options?: RequestOptions): Promise<T.GetAuthProvidersResponse> => t.op("getAuthProviders", {  }, options),
      /** Receive an OpenID Connect back-channel logout. POST /v1/auth/backchannel-logout */
      backchannelLogout: (body: T.PostAuthBackchannelLogoutBody, options?: RequestOptions): Promise<T.PostAuthBackchannelLogoutResponse> => t.op("postAuthBackchannelLogout", { body }, options),
      /** Sign out. POST /v1/auth/logout */
      logout: (options?: RequestOptions): Promise<T.PostAuthLogoutResponse> => t.op("postAuthLogout", {  }, options),
      connections: {
        /** Delete an auth connection. DELETE /v1/auth/connections/{id} */
        delete: (id: string, options?: RequestOptions): Promise<T.DeleteAuthConnectionsIdResponse> => t.op("deleteAuthConnectionsId", { path: { id } }, options),
        /** List auth connections. GET /v1/auth/connections */
        list: (query?: T.GetAuthConnectionsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetAuthConnectionsResponse['data'][number], T.GetAuthConnectionsResponse> => t.list("getAuthConnections", { query }, options),
        /** Export a user (signed protocol). GET /v1/auth/connections/{id}/export */
        export: (id: string, query: T.GetAuthConnectionsIdExportQuery, options?: RequestOptions): Promise<T.GetAuthConnectionsIdExportResponse> => t.op("getAuthConnectionsIdExport", { path: { id }, query }, options),
        /** List identity connectors. GET /v1/auth/connections/providers */
        providers: (options?: RequestOptions): Promise<T.GetAuthConnectionsProvidersResponse> => t.op("getAuthConnectionsProviders", {  }, options),
        /** Update an auth connection. PATCH /v1/auth/connections/{id} */
        update: (id: string, body: T.PatchAuthConnectionsIdBody, options?: RequestOptions): Promise<T.PatchAuthConnectionsIdResponse> => t.op("patchAuthConnectionsId", { path: { id }, body }, options),
        /** Connect an auth platform. POST /v1/auth/connections */
        create: (body: T.PostAuthConnectionsBody, options?: RequestOptions): Promise<T.PostAuthConnectionsResponse> => t.op("postAuthConnections", { body }, options),
        /** Change a user's id (signed protocol). POST /v1/auth/connections/{id}/aliases */
        aliases: (id: string, body: T.PostAuthConnectionsIdAliasesBody, options?: RequestOptions): Promise<T.PostAuthConnectionsIdAliasesResponse> => t.op("postAuthConnectionsIdAliases", { path: { id }, body }, options),
        /** Erase a user (signed protocol). POST /v1/auth/connections/{id}/erase */
        erase: (id: string, body: T.PostAuthConnectionsIdEraseBody, options?: RequestOptions): Promise<T.PostAuthConnectionsIdEraseResponse> => t.op("postAuthConnectionsIdErase", { path: { id }, body }, options),
        /** Enrol a user as a partner (signed protocol). POST /v1/auth/connections/{id}/partners */
        partners: (id: string, body: T.PostAuthConnectionsIdPartnersBody, options?: RequestOptions): Promise<T.PostAuthConnectionsIdPartnersResponse> => t.op("postAuthConnectionsIdPartners", { path: { id }, body }, options),
        /** Test an auth connection (signed protocol). POST /v1/auth/connections/{id}/ping */
        ping: (id: string, body: T.PostAuthConnectionsIdPingBody, options?: RequestOptions): Promise<T.PostAuthConnectionsIdPingResponse> => t.op("postAuthConnectionsIdPing", { path: { id }, body }, options),
        /** Revoke the previous auth secret. POST /v1/auth/connections/{id}/revoke-previous-secret */
        revokePreviousSecret: (id: string, options?: RequestOptions): Promise<T.PostAuthConnectionsIdRevokePreviousSecretResponse> => t.op("postAuthConnectionsIdRevokePreviousSecret", { path: { id } }, options),
        /** Rotate an auth connection secret. POST /v1/auth/connections/{id}/rotate-secret */
        rotateSecret: (id: string, options?: RequestOptions): Promise<T.PostAuthConnectionsIdRotateSecretResponse> => t.op("postAuthConnectionsIdRotateSecret", { path: { id } }, options),
        /** Report a user signal (signed protocol). POST /v1/auth/connections/{id}/signals */
        signals: (id: string, body: T.PostAuthConnectionsIdSignalsBody, options?: RequestOptions): Promise<T.PostAuthConnectionsIdSignalsResponse> => t.op("postAuthConnectionsIdSignals", { path: { id }, body }, options),
        /** Attribute a new user (signed protocol). POST /v1/auth/connections/{id}/signups */
        signups: (id: string, body: T.PostAuthConnectionsIdSignupsBody, options?: RequestOptions): Promise<T.PostAuthConnectionsIdSignupsResponse> => t.op("postAuthConnectionsIdSignups", { path: { id }, body }, options),
        /** Update a user (signed protocol). POST /v1/auth/connections/{id}/users */
        users: (id: string, body: T.PostAuthConnectionsIdUsersBody, options?: RequestOptions): Promise<T.PostAuthConnectionsIdUsersResponse> => t.op("postAuthConnectionsIdUsers", { path: { id }, body }, options),
        /** Approve a one-click install. POST /v1/auth/connections/install */
        install: (body: T.PostAuthConnectionsInstallBody, options?: RequestOptions): Promise<T.PostAuthConnectionsInstallResponse> => t.op("postAuthConnectionsInstall", { body }, options),
        /** Set a vendor-issued secret. PUT /v1/auth/connections/{id}/secret */
        updateSecret: (id: string, body: T.PutAuthConnectionsIdSecretBody, options?: RequestOptions): Promise<T.PutAuthConnectionsIdSecretResponse> => t.op("putAuthConnectionsIdSecret", { path: { id }, body }, options),
      },
    },
    billing: {
      /** List billing events. GET /v1/billing/events */
      events: (query?: T.GetBillingEventsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetBillingEventsResponse['data'][number], T.GetBillingEventsResponse> => t.list("getBillingEvents", { query }, options),
      /** Get the plan. GET /v1/billing/plan */
      plan: (options?: RequestOptions): Promise<T.GetBillingPlanResponse> => t.op("getBillingPlan", {  }, options),
      /** Activate a plan directly. POST /v1/billing/activate */
      activate: (body: T.PostBillingActivateBody, options?: RequestOptions): Promise<T.PostBillingActivateResponse> => t.op("postBillingActivate", { body }, options),
      /** Start a plan checkout. POST /v1/billing/checkout */
      checkout: (body: T.PostBillingCheckoutBody, options?: RequestOptions): Promise<T.PostBillingCheckoutResponse> => t.op("postBillingCheckout", { body }, options),
      /** Open the subscription portal. POST /v1/billing/portal */
      portal: (options?: RequestOptions): Promise<T.PostBillingPortalResponse> => t.op("postBillingPortal", {  }, options),
      connections: {
        /** Delete a billing connection. DELETE /v1/billing/connections/{id} */
        delete: (id: string, options?: RequestOptions): Promise<T.DeleteBillingConnectionsIdResponse> => t.op("deleteBillingConnectionsId", { path: { id } }, options),
        /** List billing connections. GET /v1/billing/connections */
        list: (query?: T.GetBillingConnectionsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetBillingConnectionsResponse['data'][number], T.GetBillingConnectionsResponse> => t.list("getBillingConnections", { query }, options),
        /** Get a billing connection. GET /v1/billing/connections/{id} */
        retrieve: (id: string, options?: RequestOptions): Promise<T.GetBillingConnectionsIdResponse> => t.op("getBillingConnectionsId", { path: { id } }, options),
        /** Update a billing connection. PATCH /v1/billing/connections/{id} */
        update: (id: string, body: T.PatchBillingConnectionsIdBody, options?: RequestOptions): Promise<T.PatchBillingConnectionsIdResponse> => t.op("patchBillingConnectionsId", { path: { id }, body }, options),
        /** Create a billing connection. POST /v1/billing/connections */
        create: (body: T.PostBillingConnectionsBody, options?: RequestOptions): Promise<T.PostBillingConnectionsResponse> => t.op("postBillingConnections", { body }, options),
        /** Rotate the webhook signing secret. POST /v1/billing/connections/{id}/rotate-secret */
        rotateSecret: (id: string, options?: RequestOptions): Promise<T.PostBillingConnectionsIdRotateSecretResponse> => t.op("postBillingConnectionsIdRotateSecret", { path: { id } }, options),
        /** Set provider API credentials. PUT /v1/billing/connections/{id}/credentials */
        updateCredentials: (id: string, body: T.PutBillingConnectionsIdCredentialsBody, options?: RequestOptions): Promise<T.PutBillingConnectionsIdCredentialsResponse> => t.op("putBillingConnectionsIdCredentials", { path: { id }, body }, options),
        /** Set the webhook signing secret. PUT /v1/billing/connections/{id}/secret */
        updateSecret: (id: string, body: T.PutBillingConnectionsIdSecretBody, options?: RequestOptions): Promise<T.PutBillingConnectionsIdSecretResponse> => t.op("putBillingConnectionsIdSecret", { path: { id }, body }, options),
        valueMapping: {
          /** Preview the value mapping. POST /v1/billing/connections/{id}/value-mapping/preview */
          preview: (id: string, body: T.PostBillingConnectionsIdValueMappingPreviewBody, options?: RequestOptions): Promise<T.PostBillingConnectionsIdValueMappingPreviewResponse> => t.op("postBillingConnectionsIdValueMappingPreview", { path: { id }, body }, options),
          /** Set the value mapping. PUT /v1/billing/connections/{id}/value-mapping */
          update: (id: string, body: T.PutBillingConnectionsIdValueMappingBody, options?: RequestOptions): Promise<T.PutBillingConnectionsIdValueMappingResponse> => t.op("putBillingConnectionsIdValueMapping", { path: { id }, body }, options),
        },
      },
      internalCustomers: {
        /** Remove an internal customer. DELETE /v1/billing/internal-customers/{customerRef} */
        delete: (customerRef: string, options?: RequestOptions): Promise<T.DeleteBillingInternalCustomersCustomerRefResponse> => t.op("deleteBillingInternalCustomersCustomerRef", { path: { customerRef } }, options),
        /** List internal customers. GET /v1/billing/internal-customers */
        retrieve: (options?: RequestOptions): Promise<T.GetBillingInternalCustomersResponse> => t.op("getBillingInternalCustomers", {  }, options),
        /** Add an internal customer. POST /v1/billing/internal-customers */
        create: (body: T.PostBillingInternalCustomersBody, options?: RequestOptions): Promise<T.PostBillingInternalCustomersResponse> => t.op("postBillingInternalCustomers", { body }, options),
      },
    },
    branding: {
      /** Get branding. GET /v1/branding */
      retrieve: (options?: RequestOptions): Promise<T.GetBrandingResponse> => t.op("getBranding", {  }, options),
      /** Update branding. PUT /v1/branding */
      update: (body: T.PutBrandingBody, options?: RequestOptions): Promise<T.PutBrandingResponse> => t.op("putBranding", { body }, options),
      domain: {
        /** Remove the portal domain. DELETE /v1/branding/domain */
        delete: (options?: RequestOptions): Promise<T.DeleteBrandingDomainResponse> => t.op("deleteBrandingDomain", {  }, options),
        /** Set a custom portal domain. POST /v1/branding/domain */
        create: (body: T.PostBrandingDomainBody, options?: RequestOptions): Promise<T.PostBrandingDomainResponse> => t.op("postBrandingDomain", { body }, options),
        /** Verify the portal domain. POST /v1/branding/domain/verify */
        verify: (options?: RequestOptions): Promise<T.PostBrandingDomainVerifyResponse> => t.op("postBrandingDomainVerify", {  }, options),
      },
      linkDomain: {
        /** Remove the link domain. DELETE /v1/branding/link-domain */
        delete: (options?: RequestOptions): Promise<T.DeleteBrandingLinkDomainResponse> => t.op("deleteBrandingLinkDomain", {  }, options),
        /** Set a custom link domain. POST /v1/branding/link-domain */
        create: (body: T.PostBrandingLinkDomainBody, options?: RequestOptions): Promise<T.PostBrandingLinkDomainResponse> => t.op("postBrandingLinkDomain", { body }, options),
        /** Verify the link domain. POST /v1/branding/link-domain/verify */
        verify: (options?: RequestOptions): Promise<T.PostBrandingLinkDomainVerifyResponse> => t.op("postBrandingLinkDomainVerify", {  }, options),
      },
    },
    chatly: {
      /** Get the support-chat identity. GET /v1/chatly/identity */
      identity: (options?: RequestOptions): Promise<T.GetChatlyIdentityResponse> => t.op("getChatlyIdentity", {  }, options),
    },
    cleanroom: {
      /** Get a customer's consent. GET /v1/cleanroom/consent */
      consent: (query: T.GetCleanroomConsentQuery, options?: RequestOptions): Promise<T.GetCleanroomConsentResponse> => t.op("getCleanroomConsent", { query }, options),
      /** Query the clean room. GET /v1/cleanroom/query */
      query: (query: T.GetCleanroomQueryQuery, options?: RequestOptions): Promise<T.GetCleanroomQueryResponse> => t.op("getCleanroomQuery", { query }, options),
    },
    cli: {
      /** Tail the request log. GET /v1/cli/logs */
      logs: (query?: T.GetCliLogsQuery, options?: RequestOptions): Promise<T.GetCliLogsResponse> => t.op("getCliLogs", { query }, options),
      /** List triggerable topics. GET /v1/cli/topics */
      topics: (options?: RequestOptions): Promise<T.GetCliTopicsResponse> => t.op("getCliTopics", {  }, options),
      /** Send a test event. POST /v1/cli/trigger */
      trigger: (body: T.PostCliTriggerBody, options?: RequestOptions): Promise<T.PostCliTriggerResponse> => t.op("postCliTrigger", { body }, options),
      deviceCodes: {
        /** Get a pending CLI sign-in. GET /v1/cli/device-codes/{userCode} */
        retrieve: (userCode: string, options?: RequestOptions): Promise<T.GetCliDeviceCodesUserCodeResponse> => t.op("getCliDeviceCodesUserCode", { path: { userCode } }, options),
        /** Start a CLI sign-in. POST /v1/cli/device-codes */
        create: (body: T.PostCliDeviceCodesBody, options?: RequestOptions): Promise<T.PostCliDeviceCodesResponse> => t.op("postCliDeviceCodes", { body }, options),
        /** Poll a CLI sign-in. POST /v1/cli/device-codes/token */
        token: (body: T.PostCliDeviceCodesTokenBody, options?: RequestOptions): Promise<T.PostCliDeviceCodesTokenResponse> => t.op("postCliDeviceCodesToken", { body }, options),
        /** Approve a CLI sign-in. POST /v1/cli/device-codes/{userCode}/approve */
        approve: (userCode: string, body: T.PostCliDeviceCodesUserCodeApproveBody, options?: RequestOptions): Promise<T.PostCliDeviceCodesUserCodeApproveResponse> => t.op("postCliDeviceCodesUserCodeApprove", { path: { userCode }, body }, options),
        /** Deny a CLI sign-in. POST /v1/cli/device-codes/{userCode}/deny */
        deny: (userCode: string, options?: RequestOptions): Promise<T.PostCliDeviceCodesUserCodeDenyResponse> => t.op("postCliDeviceCodesUserCodeDeny", { path: { userCode } }, options),
      },
      listeners: {
        /** Close a CLI listener. DELETE /v1/cli/listeners/{id} */
        delete: (id: string, options?: RequestOptions): Promise<T.DeleteCliListenersIdResponse> => t.op("deleteCliListenersId", { path: { id } }, options),
        /** Receive listener events. GET /v1/cli/listeners/{id}/events */
        events: (id: string, query?: T.GetCliListenersIdEventsQuery, options?: RequestOptions): Promise<T.GetCliListenersIdEventsResponse> => t.op("getCliListenersIdEvents", { path: { id }, query }, options),
        /** Open a CLI event listener. POST /v1/cli/listeners */
        create: (body: T.PostCliListenersBody, options?: RequestOptions): Promise<T.PostCliListenersResponse> => t.op("postCliListeners", { body }, options),
      },
    },
    clicks: {
      /** Get consent coverage. GET /v1/clicks/consent-coverage */
      consentCoverage: (query?: T.GetClicksConsentCoverageQuery, options?: RequestOptions): Promise<T.GetClicksConsentCoverageResponse> => t.op("getClicksConsentCoverage", { query }, options),
      /** Get a click. GET /v1/clicks/{id} */
      retrieve: (id: string, options?: RequestOptions): Promise<T.GetClicksIdResponse> => t.op("getClicksId", { path: { id } }, options),
    },
    commissionRules: {
      /** List commission rules. GET /v1/commission-rules */
      list: (query?: T.GetCommissionRulesQuery & PageParams, options?: RequestOptions): ListPromise<T.GetCommissionRulesResponse['data'][number], T.GetCommissionRulesResponse> => t.list("getCommissionRules", { query }, options),
      /** Publish a commission rule. POST /v1/commission-rules */
      create: (body: T.PostCommissionRulesBody, options?: RequestOptions): Promise<T.PostCommissionRulesResponse> => t.op("postCommissionRules", { body }, options),
    },
    commissions: {
      /** List commission ledger events. GET /v1/commissions */
      list: (query?: T.GetCommissionsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetCommissionsResponse['data'][number], T.GetCommissionsResponse> => t.list("getCommissions", { query }, options),
      /** Get a commission. GET /v1/commissions/{id} */
      retrieve: (id: string, options?: RequestOptions): Promise<T.GetCommissionsIdResponse> => t.op("getCommissionsId", { path: { id } }, options),
      /** Approve due commissions. POST /v1/commissions/approve-due */
      approveDue: (options?: RequestOptions): Promise<T.PostCommissionsApproveDueResponse> => t.op("postCommissionsApproveDue", {  }, options),
      /** Adjust a commission. POST /v1/commissions/{id}/adjust */
      adjust: (id: string, body: T.PostCommissionsIdAdjustBody, options?: RequestOptions): Promise<T.PostCommissionsIdAdjustResponse> => t.op("postCommissionsIdAdjust", { path: { id }, body }, options),
      /** Settle a commission yourself. POST /v1/commissions/{id}/settle */
      settle: (id: string, body: T.PostCommissionsIdSettleBody, options?: RequestOptions): Promise<T.PostCommissionsIdSettleResponse> => t.op("postCommissionsIdSettle", { path: { id }, body }, options),
    },
    contracts: {
      /** List partner contracts. GET /v1/contracts */
      list: (query?: T.GetContractsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetContractsResponse['data'][number], T.GetContractsResponse> => t.list("getContracts", { query }, options),
      /** Create a partner contract. POST /v1/contracts */
      create: (body: T.PostContractsBody, options?: RequestOptions): Promise<T.PostContractsResponse> => t.op("postContracts", { body }, options),
      /** Send a contract. POST /v1/contracts/{id}/send */
      send: (id: string, options?: RequestOptions): Promise<T.PostContractsIdSendResponse> => t.op("postContractsIdSend", { path: { id } }, options),
    },
    coupons: {
      /** List coupon codes. GET /v1/coupons */
      list: (query?: T.GetCouponsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetCouponsResponse['data'][number], T.GetCouponsResponse> => t.list("getCoupons", { query }, options),
      /** Create a coupon code. POST /v1/coupons */
      create: (body: T.PostCouponsBody, options?: RequestOptions): Promise<T.PostCouponsResponse> => t.op("postCoupons", { body }, options),
    },
    creators: {
      /** Search creators. GET /v1/creators */
      list: (query?: T.GetCreatorsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetCreatorsResponse['data'][number], T.GetCreatorsResponse> => t.list("getCreators", { query }, options),
      /** Get a creator. GET /v1/creators/{accountId} */
      retrieve: (accountId: string, options?: RequestOptions): Promise<T.GetCreatorsAccountIdResponse> => t.op("getCreatorsAccountId", { path: { accountId } }, options),
      /** Invite a creator. POST /v1/creators/{accountId}/invite */
      invite: (accountId: string, body: T.PostCreatorsAccountIdInviteBody, options?: RequestOptions): Promise<T.PostCreatorsAccountIdInviteResponse> => t.op("postCreatorsAccountIdInvite", { path: { accountId }, body }, options),
    },
    deals: {
      /** List registered deals. GET /v1/deals */
      list: (query?: T.GetDealsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetDealsResponse['data'][number], T.GetDealsResponse> => t.list("getDeals", { query }, options),
      /** Approve a deal. POST /v1/deals/{id}/approve */
      approve: (id: string, body: T.PostDealsIdApproveBody, options?: RequestOptions): Promise<T.PostDealsIdApproveResponse> => t.op("postDealsIdApprove", { path: { id }, body }, options),
      /** Reject a deal. POST /v1/deals/{id}/reject */
      reject: (id: string, options?: RequestOptions): Promise<T.PostDealsIdRejectResponse> => t.op("postDealsIdReject", { path: { id } }, options),
      /** Mark a deal won. POST /v1/deals/{id}/won */
      won: (id: string, body: T.PostDealsIdWonBody, options?: RequestOptions): Promise<T.PostDealsIdWonResponse> => t.op("postDealsIdWon", { path: { id }, body }, options),
    },
    discovery: {
      /** Ingest prospects. POST /v1/discovery/corpus */
      corpus: (body: T.PostDiscoveryCorpusBody, options?: RequestOptions): Promise<T.PostDiscoveryCorpusResponse> => t.op("postDiscoveryCorpus", { body }, options),
      /** Search for prospective partners. POST /v1/discovery/search */
      search: (body: T.PostDiscoverySearchBody, options?: RequestOptions): Promise<T.PostDiscoverySearchResponse> => t.op("postDiscoverySearch", { body }, options),
    },
    disputes: {
      /** List partner disputes. GET /v1/disputes */
      list: (query?: T.GetDisputesQuery & PageParams, options?: RequestOptions): ListPromise<T.GetDisputesResponse['data'][number], T.GetDisputesResponse> => t.list("getDisputes", { query }, options),
      /** Resolve a dispute. POST /v1/disputes/{id}/resolve */
      resolve: (id: string, body: T.PostDisputesIdResolveBody, options?: RequestOptions): Promise<T.PostDisputesIdResolveResponse> => t.op("postDisputesIdResolve", { path: { id }, body }, options),
    },
    email: {
      /** Preview an email. POST /v1/email/preview */
      preview: (body: T.PostEmailPreviewBody, options?: RequestOptions): Promise<T.PostEmailPreviewResponse> => t.op("postEmailPreview", { body }, options),
      /** Send a test email. POST /v1/email/test */
      test: (body: T.PostEmailTestBody, options?: RequestOptions): Promise<T.PostEmailTestResponse> => t.op("postEmailTest", { body }, options),
      settings: {
        /** Get email settings. GET /v1/email/settings */
        retrieve: (options?: RequestOptions): Promise<T.GetEmailSettingsResponse> => t.op("getEmailSettings", {  }, options),
        /** Check the sending domain. POST /v1/email/settings/verify-domain */
        verifyDomain: (options?: RequestOptions): Promise<T.PostEmailSettingsVerifyDomainResponse> => t.op("postEmailSettingsVerifyDomain", {  }, options),
        /** Update email settings. PUT /v1/email/settings */
        update: (body: T.PutEmailSettingsBody, options?: RequestOptions): Promise<T.PutEmailSettingsResponse> => t.op("putEmailSettings", { body }, options),
      },
      templates: {
        /** Reset an email template. DELETE /v1/email/templates/{event}/{locale} */
        delete: (event: string, locale: string, options?: RequestOptions): Promise<T.DeleteEmailTemplatesEventLocaleResponse> => t.op("deleteEmailTemplatesEventLocale", { path: { event, locale } }, options),
        /** List email templates. GET /v1/email/templates */
        list: (query?: T.GetEmailTemplatesQuery & PageParams, options?: RequestOptions): ListPromise<T.GetEmailTemplatesResponse['data'][number], T.GetEmailTemplatesResponse> => t.list("getEmailTemplates", { query }, options),
        /** Override an email template. PUT /v1/email/templates/{event}/{locale} */
        update: (event: string, locale: string, body: T.PutEmailTemplatesEventLocaleBody, options?: RequestOptions): Promise<T.PutEmailTemplatesEventLocaleResponse> => t.op("putEmailTemplatesEventLocale", { path: { event, locale }, body }, options),
      },
    },
    embed: {
      /** Get one org's embed manifest. GET /v1/embed */
      retrieve: (query: T.GetEmbedQuery, options?: RequestOptions): Promise<T.GetEmbedResponse> => t.op("getEmbed", { query }, options),
      /** Read embedded partner stats. GET /v1/embed/summary */
      summary: (options?: RequestOptions): Promise<T.GetEmbedSummaryResponse> => t.op("getEmbedSummary", {  }, options),
      /** Mint a partner embed token. POST /v1/embed/tokens */
      tokens: (body: T.PostEmbedTokensBody, options?: RequestOptions): Promise<T.PostEmbedTokensResponse> => t.op("postEmbedTokens", { body }, options),
    },
    events: {
      /** List past events. GET /v1/events */
      retrieve: (query?: T.GetEventsQuery, options?: RequestOptions): Promise<T.GetEventsResponse> => t.op("getEvents", { query }, options),
    },
    export: {
      /** Export payouts for accounting. GET /v1/export/accounting */
      accounting: (query: T.GetExportAccountingQuery, options?: RequestOptions): Promise<string> => t.op("getExportAccounting", { query }, options),
      /** Export all org data. GET /v1/export/full */
      full: (options?: RequestOptions): Promise<string> => t.op("getExportFull", {  }, options),
    },
    fraud: {
      /** Detect referral rings. POST /v1/fraud/detect-rings */
      detectRings: (options?: RequestOptions): Promise<T.PostFraudDetectRingsResponse> => t.op("postFraudDetectRings", {  }, options),
      cases: {
        /** List fraud cases. GET /v1/fraud/cases */
        list: (query?: T.GetFraudCasesQuery & PageParams, options?: RequestOptions): ListPromise<T.GetFraudCasesResponse['data'][number], T.GetFraudCasesResponse> => t.list("getFraudCases", { query }, options),
        /** Resolve a fraud case. POST /v1/fraud/cases/{id}/resolve */
        resolve: (id: string, body: T.PostFraudCasesIdResolveBody, options?: RequestOptions): Promise<T.PostFraudCasesIdResolveResponse> => t.op("postFraudCasesIdResolve", { path: { id }, body }, options),
      },
      invalidTraffic: {
        /** Scan for invalid traffic. POST /v1/fraud/invalid-traffic/scan */
        scan: (body: T.PostFraudInvalidTrafficScanBody, options?: RequestOptions): Promise<T.PostFraudInvalidTrafficScanResponse> => t.op("postFraudInvalidTrafficScan", { body }, options),
      },
    },
    fxRates: {
      /** List FX rates. GET /v1/fx-rates */
      list: (query?: T.GetFxRatesQuery & PageParams, options?: RequestOptions): ListPromise<T.GetFxRatesResponse['data'][number], T.GetFxRatesResponse> => t.list("getFxRates", { query }, options),
      /** Record an FX rate. POST /v1/fx-rates */
      create: (body: T.PostFxRatesBody, options?: RequestOptions): Promise<T.PostFxRatesResponse> => t.op("postFxRates", { body }, options),
      /** Clear a manual FX rate. POST /v1/fx-rates/clear-override */
      clearOverride: (body: T.PostFxRatesClearOverrideBody, options?: RequestOptions): Promise<T.PostFxRatesClearOverrideResponse> => t.op("postFxRatesClearOverride", { body }, options),
      /** Sync the FX feed now. POST /v1/fx-rates/sync */
      sync: (options?: RequestOptions): Promise<T.PostFxRatesSyncResponse> => t.op("postFxRatesSync", {  }, options),
    },
    graphql: {
      /** Query the GraphQL read layer. GET /v1/graphql */
      retrieve: (options?: RequestOptions): Promise<T.GetGraphqlResponse> => t.op("getGraphql", {  }, options),
      /** Query the GraphQL read layer (POST). POST /v1/graphql */
      create: (body: T.PostGraphqlBody, options?: RequestOptions): Promise<T.PostGraphqlResponse> => t.op("postGraphql", { body }, options),
    },
    health: {
      /** Check API health. GET /v1/health */
      retrieve: (options?: RequestOptions): Promise<T.GetHealthResponse> => t.op("getHealth", {  }, options),
    },
    hosts: {
      current: {
        /** Describe the current host. GET /v1/hosts/current */
        retrieve: (options?: RequestOptions): Promise<T.GetHostsCurrentResponse> => t.op("getHostsCurrent", {  }, options),
        /** Get the current host's theme stylesheet. GET /v1/hosts/current/theme.css */
        themeCss: (options?: RequestOptions): Promise<string> => t.op("getHostsCurrentThemeCss", {  }, options),
      },
    },
    import: {
      /** Import partners from another tool. POST /v1/import/{provider} */
      create: (provider: string, body: T.PostImportProviderBody, query: T.PostImportProviderQuery, options?: RequestOptions): Promise<T.PostImportProviderResponse> => t.op("postImportProvider", { path: { provider }, body, query }, options),
    },
    incrementality: {
      /** Get incrementality results. GET /v1/incrementality */
      retrieve: (query: T.GetIncrementalityQuery, options?: RequestOptions): Promise<T.GetIncrementalityResponse> => t.op("getIncrementality", { query }, options),
    },
    integrationHealth: {
      /** Check integration health. GET /v1/integration-health */
      retrieve: (options?: RequestOptions): Promise<T.GetIntegrationHealthResponse> => t.op("getIntegrationHealth", {  }, options),
    },
    integrations: {
      /** Disconnect an integration. DELETE /v1/integrations/{kind} */
      delete: (kind: string, options?: RequestOptions): Promise<T.DeleteIntegrationsKindResponse> => t.op("deleteIntegrationsKind", { path: { kind } }, options),
      /** List integrations. GET /v1/integrations */
      retrieve: (options?: RequestOptions): Promise<T.GetIntegrationsResponse> => t.op("getIntegrations", {  }, options),
      deliveries: {
        /** List integration deliveries. GET /v1/integrations/deliveries */
        list: (query?: T.GetIntegrationsDeliveriesQuery & PageParams, options?: RequestOptions): ListPromise<T.GetIntegrationsDeliveriesResponse['data'][number], T.GetIntegrationsDeliveriesResponse> => t.list("getIntegrationsDeliveries", { query }, options),
        /** Retry an integration delivery. POST /v1/integrations/deliveries/{id}/retry */
        retry: (id: string, options?: RequestOptions): Promise<T.PostIntegrationsDeliveriesIdRetryResponse> => t.op("postIntegrationsDeliveriesIdRetry", { path: { id } }, options),
      },
      hubspot: {
        /** Test the HubSpot connection. POST /v1/integrations/hubspot/test */
        test: (body: T.PostIntegrationsHubspotTestBody, options?: RequestOptions): Promise<T.PostIntegrationsHubspotTestResponse> => t.op("postIntegrationsHubspotTest", { body }, options),
        /** Connect HubSpot. PUT /v1/integrations/hubspot */
        update: (body: T.PutIntegrationsHubspotBody, options?: RequestOptions): Promise<T.PutIntegrationsHubspotResponse> => t.op("putIntegrationsHubspot", { body }, options),
      },
      segment: {
        /** Test the Segment connection. POST /v1/integrations/segment/test */
        test: (options?: RequestOptions): Promise<T.PostIntegrationsSegmentTestResponse> => t.op("postIntegrationsSegmentTest", {  }, options),
        /** Connect Segment. PUT /v1/integrations/segment */
        update: (body: T.PutIntegrationsSegmentBody, options?: RequestOptions): Promise<T.PutIntegrationsSegmentResponse> => t.op("putIntegrationsSegment", { body }, options),
      },
    },
    invitations: {
      /** List creator invitations. GET /v1/invitations */
      list: (query?: T.GetInvitationsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetInvitationsResponse['data'][number], T.GetInvitationsResponse> => t.list("getInvitations", { query }, options),
      /** Withdraw an invitation. POST /v1/invitations/{id}/withdraw */
      withdraw: (id: string, options?: RequestOptions): Promise<T.PostInvitationsIdWithdrawResponse> => t.op("postInvitationsIdWithdraw", { path: { id } }, options),
    },
    links: {
      /** List links. GET /v1/links */
      list: (query?: T.GetLinksQuery & PageParams, options?: RequestOptions): ListPromise<T.GetLinksResponse['data'][number], T.GetLinksResponse> => t.list("getLinks", { query }, options),
      /** Get a link's QR code. GET /v1/links/{id}/qr */
      qr: (id: string, options?: RequestOptions): Promise<string> => t.op("getLinksIdQr", { path: { id } }, options),
      /** Create a tracked link. POST /v1/links */
      create: (body: T.PostLinksBody, options?: RequestOptions): Promise<T.PostLinksResponse> => t.op("postLinks", { body }, options),
    },
    marketplace: {
      listing: {
        /** List the org's marketplace listings. GET /v1/marketplace/listing */
        list: (query?: T.GetMarketplaceListingQuery & PageParams, options?: RequestOptions): ListPromise<T.GetMarketplaceListingResponse['data'][number], T.GetMarketplaceListingResponse> => t.list("getMarketplaceListing", { query }, options),
        /** List a program in the marketplace. PUT /v1/marketplace/listing */
        update: (body: T.PutMarketplaceListingBody, options?: RequestOptions): Promise<T.PutMarketplaceListingResponse> => t.op("putMarketplaceListing", { body }, options),
      },
    },
    me: {
      /** Get the current caller. GET /v1/me */
      retrieve: (options?: RequestOptions): Promise<T.GetMeResponse> => t.op("getMe", {  }, options),
      /** Set my email language. PUT /v1/me/locale */
      updateLocale: (body: T.PutMeLocaleBody, options?: RequestOptions): Promise<T.PutMeLocaleResponse> => t.op("putMeLocale", { body }, options),
      /** Turn my ROI digest on or off. PUT /v1/me/roi-digest */
      updateRoiDigest: (body: T.PutMeRoiDigestBody, options?: RequestOptions): Promise<T.PutMeRoiDigestResponse> => t.op("putMeRoiDigest", { body }, options),
    },
    mobile: {
      /** Report an in-app purchase. POST /v1/mobile/purchases */
      purchases: (body: T.PostMobilePurchasesBody, options?: RequestOptions): Promise<T.PostMobilePurchasesResponse> => t.op("postMobilePurchases", { body }, options),
    },
    negotiations: {
      /** List negotiation rounds. GET /v1/negotiations */
      list: (query?: T.GetNegotiationsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetNegotiationsResponse['data'][number], T.GetNegotiationsResponse> => t.list("getNegotiations", { query }, options),
    },
    network: {
      /** Get a customer's network journey. GET /v1/network/journey */
      journey: (query: T.GetNetworkJourneyQuery, options?: RequestOptions): Promise<T.GetNetworkJourneyResponse> => t.op("getNetworkJourney", { query }, options),
      settings: {
        /** Get network membership. GET /v1/network/settings */
        retrieve: (options?: RequestOptions): Promise<T.GetNetworkSettingsResponse> => t.op("getNetworkSettings", {  }, options),
        /** Join or leave the attribution network. PUT /v1/network/settings */
        update: (body: T.PutNetworkSettingsBody, options?: RequestOptions): Promise<T.PutNetworkSettingsResponse> => t.op("putNetworkSettings", { body }, options),
      },
    },
    notifications: {
      /** List notifications. GET /v1/notifications */
      list: (query?: T.GetNotificationsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetNotificationsResponse['data'][number], T.GetNotificationsResponse> => t.list("getNotifications", { query }, options),
      /** Mark a notification read. POST /v1/notifications/{id}/read */
      read: (id: string, options?: RequestOptions): Promise<T.PostNotificationsIdReadResponse> => t.op("postNotificationsIdRead", { path: { id } }, options),
    },
    oauth: {
      /** Exchange an install code. POST /v1/oauth/token */
      token: (body: T.PostOauthTokenBody, options?: RequestOptions): Promise<T.PostOauthTokenResponse> => t.op("postOauthToken", { body }, options),
    },
    onchain: {
      connections: {
        /** List on-chain connections. GET /v1/onchain/connections */
        list: (query?: T.GetOnchainConnectionsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetOnchainConnectionsResponse['data'][number], T.GetOnchainConnectionsResponse> => t.list("getOnchainConnections", { query }, options),
        /** Create an on-chain connection. POST /v1/onchain/connections */
        create: (body: T.PostOnchainConnectionsBody, options?: RequestOptions): Promise<T.PostOnchainConnectionsResponse> => t.op("postOnchainConnections", { body }, options),
      },
    },
    openapiJson: {
      /** Get the OpenAPI document. GET /v1/openapi.json */
      retrieve: (options?: RequestOptions): Promise<T.GetOpenapiJsonResponse> => t.op("getOpenapiJson", {  }, options),
    },
    openapiYaml: {
      /** Get the OpenAPI document as YAML. GET /v1/openapi.yaml */
      retrieve: (options?: RequestOptions): Promise<string> => t.op("getOpenapiYaml", {  }, options),
    },
    org: {
      /** Get the organization. GET /v1/org */
      retrieve: (options?: RequestOptions): Promise<T.GetOrgResponse> => t.op("getOrg", {  }, options),
      /** Update the organization. PATCH /v1/org */
      update: (body: T.PatchOrgBody, options?: RequestOptions): Promise<T.PatchOrgResponse> => t.op("patchOrg", { body }, options),
      /** Connect a 1099 filing provider. PUT /v1/org/tax-filing */
      updateTaxFiling: (body: T.PutOrgTaxFilingBody, options?: RequestOptions): Promise<T.PutOrgTaxFilingResponse> => t.op("putOrgTaxFiling", { body }, options),
      fxFeed: {
        /** Get the FX feed setting. GET /v1/org/fx-feed */
        retrieve: (options?: RequestOptions): Promise<T.GetOrgFxFeedResponse> => t.op("getOrgFxFeed", {  }, options),
        /** Turn the FX feed on or off. PUT /v1/org/fx-feed */
        update: (body: T.PutOrgFxFeedBody, options?: RequestOptions): Promise<T.PutOrgFxFeedResponse> => t.op("putOrgFxFeed", { body }, options),
      },
      hostedPages: {
        /** Get the hosted-page consent and chat. GET /v1/org/hosted-pages */
        retrieve: (options?: RequestOptions): Promise<T.GetOrgHostedPagesResponse> => t.op("getOrgHostedPages", {  }, options),
        /** Check the hosted-page adapters. POST /v1/org/hosted-pages/check */
        check: (options?: RequestOptions): Promise<T.PostOrgHostedPagesCheckResponse> => t.op("postOrgHostedPagesCheck", {  }, options),
        /** Set the hosted-page consent and chat. PUT /v1/org/hosted-pages */
        update: (body: T.PutOrgHostedPagesBody, options?: RequestOptions): Promise<T.PutOrgHostedPagesResponse> => t.op("putOrgHostedPages", { body }, options),
      },
      members: {
        /** Remove a team member. DELETE /v1/org/members/{userId} */
        delete: (userId: string, options?: RequestOptions): Promise<T.DeleteOrgMembersUserIdResponse> => t.op("deleteOrgMembersUserId", { path: { userId } }, options),
        /** List team members. GET /v1/org/members */
        list: (query?: T.GetOrgMembersQuery & PageParams, options?: RequestOptions): ListPromise<T.GetOrgMembersResponse['data'][number], T.GetOrgMembersResponse> => t.list("getOrgMembers", { query }, options),
        /** Change a member's role. PATCH /v1/org/members/{userId} */
        update: (userId: string, body: T.PatchOrgMembersUserIdBody, options?: RequestOptions): Promise<T.PatchOrgMembersUserIdResponse> => t.op("patchOrgMembersUserId", { path: { userId }, body }, options),
        /** Add a team member. POST /v1/org/members */
        create: (body: T.PostOrgMembersBody, options?: RequestOptions): Promise<T.PostOrgMembersResponse> => t.op("postOrgMembers", { body }, options),
      },
      payoutSchedule: {
        /** Get payout schedules. GET /v1/org/payout-schedule */
        retrieve: (options?: RequestOptions): Promise<T.GetOrgPayoutScheduleResponse> => t.op("getOrgPayoutSchedule", {  }, options),
        /** Set the org payout schedule. PUT /v1/org/payout-schedule */
        update: (body: T.PutOrgPayoutScheduleBody, options?: RequestOptions): Promise<T.PutOrgPayoutScheduleResponse> => t.op("putOrgPayoutSchedule", { body }, options),
      },
      portalAuth: {
        /** Get partner sign-in settings. GET /v1/org/portal-auth */
        retrieve: (options?: RequestOptions): Promise<T.GetOrgPortalAuthResponse> => t.op("getOrgPortalAuth", {  }, options),
        /** Test partner sign-in. POST /v1/org/portal-auth/test */
        test: (options?: RequestOptions): Promise<T.PostOrgPortalAuthTestResponse> => t.op("postOrgPortalAuthTest", {  }, options),
        /** Set partner sign-in. PUT /v1/org/portal-auth */
        update: (body: T.PutOrgPortalAuthBody, options?: RequestOptions): Promise<T.PutOrgPortalAuthResponse> => t.op("putOrgPortalAuth", { body }, options),
      },
      referralParams: {
        /** Get referral query parameters. GET /v1/org/referral-params */
        retrieve: (options?: RequestOptions): Promise<T.GetOrgReferralParamsResponse> => t.op("getOrgReferralParams", {  }, options),
        /** Set referral query parameters. PUT /v1/org/referral-params */
        update: (body: T.PutOrgReferralParamsBody, options?: RequestOptions): Promise<T.PutOrgReferralParamsResponse> => t.op("putOrgReferralParams", { body }, options),
      },
      retention: {
        /** Get the data retention policy. GET /v1/org/retention */
        retrieve: (options?: RequestOptions): Promise<T.GetOrgRetentionResponse> => t.op("getOrgRetention", {  }, options),
        /** Set the data retention policy. PUT /v1/org/retention */
        update: (body: T.PutOrgRetentionBody, options?: RequestOptions): Promise<T.PutOrgRetentionResponse> => t.op("putOrgRetention", { body }, options),
      },
      sso: {
        /** Get SSO settings. GET /v1/org/sso */
        retrieve: (options?: RequestOptions): Promise<T.GetOrgSsoResponse> => t.op("getOrgSso", {  }, options),
        /** Update SSO settings. PATCH /v1/org/sso */
        update: (body: T.PatchOrgSsoBody, options?: RequestOptions): Promise<T.PatchOrgSsoResponse> => t.op("patchOrgSso", { body }, options),
        /** Link the org to SSO. POST /v1/org/sso/link */
        link: (options?: RequestOptions): Promise<T.PostOrgSsoLinkResponse> => t.op("postOrgSsoLink", {  }, options),
        connections: {
          /** Get SAML metadata. GET /v1/org/sso/connections/{id}/saml-metadata */
          samlMetadata: (id: string, options?: RequestOptions): Promise<T.GetOrgSsoConnectionsIdSamlMetadataResponse> => t.op("getOrgSsoConnectionsIdSamlMetadata", { path: { id } }, options),
        },
        direct: {
          /** Remove your identity provider. DELETE /v1/org/sso/direct */
          delete: (options?: RequestOptions): Promise<T.DeleteOrgSsoDirectResponse> => t.op("deleteOrgSsoDirect", {  }, options),
          /** Test your identity provider. POST /v1/org/sso/direct/test */
          test: (options?: RequestOptions): Promise<T.PostOrgSsoDirectTestResponse> => t.op("postOrgSsoDirectTest", {  }, options),
          /** Connect your own identity provider. PUT /v1/org/sso/direct */
          update: (body: T.PutOrgSsoDirectBody, options?: RequestOptions): Promise<T.PutOrgSsoDirectResponse> => t.op("putOrgSsoDirect", { body }, options),
        },
        tickets: {
          /** Create an SSO setup link. POST /v1/org/sso/tickets */
          create: (body: T.PostOrgSsoTicketsBody, options?: RequestOptions): Promise<T.PostOrgSsoTicketsResponse> => t.op("postOrgSsoTickets", { body }, options),
          /** Revoke an SSO setup link. POST /v1/org/sso/tickets/{id}/revoke */
          revoke: (id: string, options?: RequestOptions): Promise<T.PostOrgSsoTicketsIdRevokeResponse> => t.op("postOrgSsoTicketsIdRevoke", { path: { id } }, options),
        },
      },
      taxProfile: {
        /** Get the tax profile. GET /v1/org/tax-profile */
        retrieve: (options?: RequestOptions): Promise<T.GetOrgTaxProfileResponse> => t.op("getOrgTaxProfile", {  }, options),
        /** Update the tax profile. PUT /v1/org/tax-profile */
        update: (body: T.PutOrgTaxProfileBody, options?: RequestOptions): Promise<T.PutOrgTaxProfileResponse> => t.op("putOrgTaxProfile", { body }, options),
      },
      trackingConsent: {
        /** Get the tracker's consent default. GET /v1/org/tracking-consent */
        retrieve: (options?: RequestOptions): Promise<T.GetOrgTrackingConsentResponse> => t.op("getOrgTrackingConsent", {  }, options),
        /** Set the tracker's consent default. PUT /v1/org/tracking-consent */
        update: (body: T.PutOrgTrackingConsentBody, options?: RequestOptions): Promise<T.PutOrgTrackingConsentResponse> => t.op("putOrgTrackingConsent", { body }, options),
      },
    },
    orgs: {
      /** Create an organization. POST /v1/orgs */
      create: (body: T.PostOrgsBody, options?: RequestOptions): Promise<T.PostOrgsResponse> => t.op("postOrgs", { body }, options),
    },
    outreach: {
      /** List outreach messages. GET /v1/outreach */
      list: (query?: T.GetOutreachQuery & PageParams, options?: RequestOptions): ListPromise<T.GetOutreachResponse['data'][number], T.GetOutreachResponse> => t.list("getOutreach", { query }, options),
      /** Draft an outreach sequence. POST /v1/outreach/draft */
      draft: (body: T.PostOutreachDraftBody, options?: RequestOptions): Promise<T.PostOutreachDraftResponse> => t.op("postOutreachDraft", { body }, options),
      /** Approve an outreach message. POST /v1/outreach/{id}/approve */
      approve: (id: string, options?: RequestOptions): Promise<T.PostOutreachIdApproveResponse> => t.op("postOutreachIdApprove", { path: { id } }, options),
      /** Send due outreach. POST /v1/outreach/send-due */
      sendDue: (options?: RequestOptions): Promise<T.PostOutreachSendDueResponse> => t.op("postOutreachSendDue", {  }, options),
    },
    partner: {
      /** List my achievements. GET /v1/partner/achievements */
      achievements: (query?: T.GetPartnerAchievementsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPartnerAchievementsResponse['data'][number], T.GetPartnerAchievementsResponse> => t.list("getPartnerAchievements", { query }, options),
      /** List marketing assets. GET /v1/partner/assets */
      assets: (query?: T.GetPartnerAssetsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPartnerAssetsResponse['data'][number], T.GetPartnerAssetsResponse> => t.list("getPartnerAssets", { query }, options),
      /** List my groups. GET /v1/partner/groups */
      groups: (query?: T.GetPartnerGroupsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPartnerGroupsResponse['data'][number], T.GetPartnerGroupsResponse> => t.list("getPartnerGroups", { query }, options),
      /** Browse the marketplace. GET /v1/partner/marketplace */
      marketplace: (query?: T.GetPartnerMarketplaceQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPartnerMarketplaceResponse['data'][number], T.GetPartnerMarketplaceResponse> => t.list("getPartnerMarketplace", { query }, options),
      /** Get my account and memberships. GET /v1/partner/me */
      me: (options?: RequestOptions): Promise<T.GetPartnerMeResponse> => t.op("getPartnerMe", {  }, options),
      /** Get my reputation passport. GET /v1/partner/passport */
      passport: (options?: RequestOptions): Promise<T.GetPartnerPassportResponse> => t.op("getPartnerPassport", {  }, options),
      /** List my postback calls. GET /v1/partner/postback-logs */
      postbackLogs: (query?: T.GetPartnerPostbackLogsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPartnerPostbackLogsResponse['data'][number], T.GetPartnerPostbackLogsResponse> => t.list("getPartnerPostbackLogs", { query }, options),
      /** Get my recruiting link. GET /v1/partner/recruit */
      recruit: (options?: RequestOptions): Promise<T.GetPartnerRecruitResponse> => t.op("getPartnerRecruit", {  }, options),
      /** Get my stats. GET /v1/partner/stats */
      stats: (query?: T.GetPartnerStatsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPartnerStatsResponse['data'][number], T.GetPartnerStatsResponse> => t.list("getPartnerStats", { query }, options),
      /** Set my email language (partner). PUT /v1/partner/locale */
      updateLocale: (body: T.PutPartnerLocaleBody, options?: RequestOptions): Promise<T.PutPartnerLocaleResponse> => t.op("putPartnerLocale", { body }, options),
      advance: {
        /** List my advances. GET /v1/partner/advance */
        list: (query?: T.GetPartnerAdvanceQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPartnerAdvanceResponse['data'][number], T.GetPartnerAdvanceResponse> => t.list("getPartnerAdvance", { query }, options),
        /** Get my advance offer. GET /v1/partner/advance/offer */
        offer: (options?: RequestOptions): Promise<T.GetPartnerAdvanceOfferResponse> => t.op("getPartnerAdvanceOffer", {  }, options),
        /** Take a commission advance. POST /v1/partner/advance/accept */
        accept: (body: T.PostPartnerAdvanceAcceptBody, options?: RequestOptions): Promise<T.PostPartnerAdvanceAcceptResponse> => t.op("postPartnerAdvanceAccept", { body }, options),
      },
      auth: {
        wallet: {
          /** Get a wallet sign-in nonce. POST /v1/partner/auth/wallet/nonce */
          nonce: (body: T.PostPartnerAuthWalletNonceBody, options?: RequestOptions): Promise<T.PostPartnerAuthWalletNonceResponse> => t.op("postPartnerAuthWalletNonce", { body }, options),
          /** Sign in with a wallet. POST /v1/partner/auth/wallet/verify */
          verify: (body: T.PostPartnerAuthWalletVerifyBody, options?: RequestOptions): Promise<T.PostPartnerAuthWalletVerifyResponse> => t.op("postPartnerAuthWalletVerify", { body }, options),
        },
      },
      contracts: {
        /** List my contracts. GET /v1/partner/contracts */
        list: (query?: T.GetPartnerContractsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPartnerContractsResponse['data'][number], T.GetPartnerContractsResponse> => t.list("getPartnerContracts", { query }, options),
        /** Accept a contract. POST /v1/partner/contracts/{id}/accept */
        accept: (id: string, options?: RequestOptions): Promise<T.PostPartnerContractsIdAcceptResponse> => t.op("postPartnerContractsIdAccept", { path: { id } }, options),
        /** Decline a contract. POST /v1/partner/contracts/{id}/decline */
        decline: (id: string, options?: RequestOptions): Promise<T.PostPartnerContractsIdDeclineResponse> => t.op("postPartnerContractsIdDecline", { path: { id } }, options),
      },
      deals: {
        /** List my deals. GET /v1/partner/deals */
        list: (query?: T.GetPartnerDealsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPartnerDealsResponse['data'][number], T.GetPartnerDealsResponse> => t.list("getPartnerDeals", { query }, options),
        /** Register a deal. POST /v1/partner/deals */
        create: (body: T.PostPartnerDealsBody, options?: RequestOptions): Promise<T.PostPartnerDealsResponse> => t.op("postPartnerDeals", { body }, options),
      },
      disputes: {
        /** List my disputes. GET /v1/partner/disputes */
        list: (query?: T.GetPartnerDisputesQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPartnerDisputesResponse['data'][number], T.GetPartnerDisputesResponse> => t.list("getPartnerDisputes", { query }, options),
        /** File a dispute. POST /v1/partner/disputes */
        create: (body: T.PostPartnerDisputesBody, options?: RequestOptions): Promise<T.PostPartnerDisputesResponse> => t.op("postPartnerDisputes", { body }, options),
      },
      invitations: {
        /** List my invitations. GET /v1/partner/invitations */
        list: (query?: T.GetPartnerInvitationsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPartnerInvitationsResponse['data'][number], T.GetPartnerInvitationsResponse> => t.list("getPartnerInvitations", { query }, options),
        /** Accept an invitation. POST /v1/partner/invitations/{id}/accept */
        accept: (id: string, options?: RequestOptions): Promise<T.PostPartnerInvitationsIdAcceptResponse> => t.op("postPartnerInvitationsIdAccept", { path: { id } }, options),
        /** Decline an invitation. POST /v1/partner/invitations/{id}/decline */
        decline: (id: string, options?: RequestOptions): Promise<T.PostPartnerInvitationsIdDeclineResponse> => t.op("postPartnerInvitationsIdDecline", { path: { id } }, options),
      },
      kyc: {
        /** Get my identity verification status. GET /v1/partner/kyc/status */
        status: (options?: RequestOptions): Promise<T.GetPartnerKycStatusResponse> => t.op("getPartnerKycStatus", {  }, options),
        /** Submit identity verification. POST /v1/partner/kyc/submit */
        submit: (body: T.PostPartnerKycSubmitBody, options?: RequestOptions): Promise<T.PostPartnerKycSubmitResponse> => t.op("postPartnerKycSubmit", { body }, options),
      },
      links: {
        /** List my links. GET /v1/partner/links */
        list: (query?: T.GetPartnerLinksQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPartnerLinksResponse['data'][number], T.GetPartnerLinksResponse> => t.list("getPartnerLinks", { query }, options),
        /** Get my link's QR code. GET /v1/partner/links/{id}/qr */
        qr: (id: string, options?: RequestOptions): Promise<string> => t.op("getPartnerLinksIdQr", { path: { id } }, options),
        /** Create a link. POST /v1/partner/links */
        create: (body: T.PostPartnerLinksBody, options?: RequestOptions): Promise<T.PostPartnerLinksResponse> => t.op("postPartnerLinks", { body }, options),
      },
      notifications: {
        /** List my notifications. GET /v1/partner/notifications */
        list: (query?: T.GetPartnerNotificationsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPartnerNotificationsResponse['data'][number], T.GetPartnerNotificationsResponse> => t.list("getPartnerNotifications", { query }, options),
        /** Mark my notification read. POST /v1/partner/notifications/{id}/read */
        read: (id: string, options?: RequestOptions): Promise<T.PostPartnerNotificationsIdReadResponse> => t.op("postPartnerNotificationsIdRead", { path: { id } }, options),
      },
      orgs: {
        /** Submit my tax form. POST /v1/partner/orgs/{orgId}/tax-form */
        taxForm: (orgId: string, body: T.PostPartnerOrgsOrgIdTaxFormBody, options?: RequestOptions): Promise<T.PostPartnerOrgsOrgIdTaxFormResponse> => t.op("postPartnerOrgsOrgIdTaxForm", { path: { orgId }, body }, options),
        /** Set my payout details. PUT /v1/partner/orgs/{orgId}/payout-profile */
        updatePayoutProfile: (orgId: string, body: T.PutPartnerOrgsOrgIdPayoutProfileBody, options?: RequestOptions): Promise<T.PutPartnerOrgsOrgIdPayoutProfileResponse> => t.op("putPartnerOrgsOrgIdPayoutProfile", { path: { orgId }, body }, options),
        /** Set my conversion postback. PUT /v1/partner/orgs/{orgId}/postback */
        updatePostback: (orgId: string, body: T.PutPartnerOrgsOrgIdPostbackBody, options?: RequestOptions): Promise<T.PutPartnerOrgsOrgIdPostbackResponse> => t.op("putPartnerOrgsOrgIdPostback", { path: { orgId }, body }, options),
        /** Set my VAT number. PUT /v1/partner/orgs/{orgId}/vat */
        updateVat: (orgId: string, body: T.PutPartnerOrgsOrgIdVatBody, options?: RequestOptions): Promise<T.PutPartnerOrgsOrgIdVatResponse> => t.op("putPartnerOrgsOrgIdVat", { path: { orgId }, body }, options),
        selfBilling: {
          /** Get self-billing status. GET /v1/partner/orgs/{orgId}/self-billing */
          retrieve: (orgId: string, options?: RequestOptions): Promise<T.GetPartnerOrgsOrgIdSelfBillingResponse> => t.op("getPartnerOrgsOrgIdSelfBilling", { path: { orgId } }, options),
          /** Accept self-billing. POST /v1/partner/orgs/{orgId}/self-billing */
          create: (orgId: string, body: T.PostPartnerOrgsOrgIdSelfBillingBody, options?: RequestOptions): Promise<T.PostPartnerOrgsOrgIdSelfBillingResponse> => t.op("postPartnerOrgsOrgIdSelfBilling", { path: { orgId }, body }, options),
        },
      },
      payouts: {
        /** List my payouts. GET /v1/partner/payouts */
        list: (query?: T.GetPartnerPayoutsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPartnerPayoutsResponse['data'][number], T.GetPartnerPayoutsResponse> => t.list("getPartnerPayouts", { query }, options),
        /** Get my payout invoice. GET /v1/partner/payouts/{id}/invoice */
        invoice: (id: string, query?: T.GetPartnerPayoutsIdInvoiceQuery, options?: RequestOptions): Promise<T.GetPartnerPayoutsIdInvoiceResponse> => t.op("getPartnerPayoutsIdInvoice", { path: { id }, query }, options),
      },
      profile: {
        /** Get my creator profile. GET /v1/partner/profile */
        retrieve: (options?: RequestOptions): Promise<T.GetPartnerProfileResponse> => t.op("getPartnerProfile", {  }, options),
        /** Get my verified performance. GET /v1/partner/profile/verified */
        verified: (options?: RequestOptions): Promise<T.GetPartnerProfileVerifiedResponse> => t.op("getPartnerProfileVerified", {  }, options),
        /** Update my creator profile. PUT /v1/partner/profile */
        update: (body: T.PutPartnerProfileBody, options?: RequestOptions): Promise<T.PutPartnerProfileResponse> => t.op("putPartnerProfile", { body }, options),
      },
      programs: {
        /** Get a program leaderboard. GET /v1/partner/programs/{programId}/leaderboard */
        leaderboard: (programId: string, options?: RequestOptions): Promise<T.GetPartnerProgramsProgramIdLeaderboardResponse> => t.op("getPartnerProgramsProgramIdLeaderboard", { path: { programId } }, options),
        /** Apply to a program. POST /v1/partner/programs/{programId}/apply */
        apply: (programId: string, options?: RequestOptions): Promise<T.PostPartnerProgramsProgramIdApplyResponse> => t.op("postPartnerProgramsProgramIdApply", { path: { programId } }, options),
      },
      referrals: {
        /** List my referrals. GET /v1/partner/referrals */
        list: (query?: T.GetPartnerReferralsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPartnerReferralsResponse['data'][number], T.GetPartnerReferralsResponse> => t.list("getPartnerReferrals", { query }, options),
        /** Explain a referral. GET /v1/partner/referrals/{id}/transparency */
        transparency: (id: string, options?: RequestOptions): Promise<T.GetPartnerReferralsIdTransparencyResponse> => t.op("getPartnerReferralsIdTransparency", { path: { id } }, options),
      },
      security: {
        /** Get my security settings. GET /v1/partner/security */
        retrieve: (options?: RequestOptions): Promise<T.GetPartnerSecurityResponse> => t.op("getPartnerSecurity", {  }, options),
        totp: {
          /** Turn off two-factor. POST /v1/partner/security/totp/disable */
          disable: (body: T.PostPartnerSecurityTotpDisableBody, options?: RequestOptions): Promise<T.PostPartnerSecurityTotpDisableResponse> => t.op("postPartnerSecurityTotpDisable", { body }, options),
          /** Turn on two-factor. POST /v1/partner/security/totp/enable */
          enable: (body: T.PostPartnerSecurityTotpEnableBody, options?: RequestOptions): Promise<T.PostPartnerSecurityTotpEnableResponse> => t.op("postPartnerSecurityTotpEnable", { body }, options),
          /** Start two-factor setup. POST /v1/partner/security/totp/setup */
          setup: (options?: RequestOptions): Promise<T.PostPartnerSecurityTotpSetupResponse> => t.op("postPartnerSecurityTotpSetup", {  }, options),
        },
      },
      taxDocuments: {
        /** List my tax documents. GET /v1/partner/tax-documents */
        list: (query?: T.GetPartnerTaxDocumentsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPartnerTaxDocumentsResponse['data'][number], T.GetPartnerTaxDocumentsResponse> => t.list("getPartnerTaxDocuments", { query }, options),
        /** Get my tax document. GET /v1/partner/tax-documents/{id} */
        retrieve: (id: string, options?: RequestOptions): Promise<string> => t.op("getPartnerTaxDocumentsId", { path: { id } }, options),
      },
      terms: {
        /** List program terms. GET /v1/partner/terms */
        list: (query?: T.GetPartnerTermsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPartnerTermsResponse['data'][number], T.GetPartnerTermsResponse> => t.list("getPartnerTerms", { query }, options),
        /** Accept program terms. POST /v1/partner/terms/{versionId}/accept */
        accept: (versionId: string, options?: RequestOptions): Promise<T.PostPartnerTermsVersionIdAcceptResponse> => t.op("postPartnerTermsVersionIdAccept", { path: { versionId } }, options),
      },
    },
    partnerGroups: {
      /** Update a partner group. PATCH /v1/partner-groups/{id} */
      update: (id: string, body: T.PatchPartnerGroupsIdBody, options?: RequestOptions): Promise<T.PatchPartnerGroupsIdResponse> => t.op("patchPartnerGroupsId", { path: { id }, body }, options),
    },
    partners: {
      /** Delete a partner. DELETE /v1/partners/{id} */
      delete: (id: string, options?: RequestOptions): Promise<T.DeletePartnersIdResponse> => t.op("deletePartnersId", { path: { id } }, options),
      /** List partners. GET /v1/partners */
      list: (query?: T.GetPartnersQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPartnersResponse['data'][number], T.GetPartnersResponse> => t.list("getPartners", { query }, options),
      /** Get a partner. GET /v1/partners/{id} */
      retrieve: (id: string, options?: RequestOptions): Promise<T.GetPartnersIdResponse> => t.op("getPartnersId", { path: { id } }, options),
      /** Get a partner's balances. GET /v1/partners/{id}/balances */
      balances: (id: string, query?: T.GetPartnersIdBalancesQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPartnersIdBalancesResponse['data'][number], T.GetPartnersIdBalancesResponse> => t.list("getPartnersIdBalances", { path: { id }, query }, options),
      /** List a partner's enrollments. GET /v1/partners/{id}/enrollments */
      enrollments: (id: string, query?: T.GetPartnersIdEnrollmentsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPartnersIdEnrollmentsResponse['data'][number], T.GetPartnersIdEnrollmentsResponse> => t.list("getPartnersIdEnrollments", { path: { id }, query }, options),
      /** Get a partner's quality score. GET /v1/partners/{id}/quality */
      quality: (id: string, options?: RequestOptions): Promise<T.GetPartnersIdQualityResponse> => t.op("getPartnersIdQuality", { path: { id } }, options),
      /** Update a partner. PATCH /v1/partners/{id} */
      update: (id: string, body: T.PatchPartnersIdBody, options?: RequestOptions): Promise<T.PatchPartnersIdResponse> => t.op("patchPartnersId", { path: { id }, body }, options),
      /** Create a partner. POST /v1/partners */
      create: (body: T.PostPartnersBody, options?: RequestOptions): Promise<T.PostPartnersResponse> => t.op("postPartners", { body }, options),
      /** Record a partner's tax form. POST /v1/partners/{id}/tax-form */
      taxForm: (id: string, body: T.PostPartnersIdTaxFormBody, options?: RequestOptions): Promise<T.PostPartnersIdTaxFormResponse> => t.op("postPartnersIdTaxForm", { path: { id }, body }, options),
      /** Set a partner's VAT number. PUT /v1/partners/{id}/vat */
      updateVat: (id: string, body: T.PutPartnersIdVatBody, options?: RequestOptions): Promise<T.PutPartnersIdVatResponse> => t.op("putPartnersIdVat", { path: { id }, body }, options),
      payoutProfile: {
        /** Get a partner's payout profile. GET /v1/partners/{id}/payout-profile */
        retrieve: (id: string, options?: RequestOptions): Promise<T.GetPartnersIdPayoutProfileResponse> => t.op("getPartnersIdPayoutProfile", { path: { id } }, options),
        /** Change a partner's payout threshold. PATCH /v1/partners/{id}/payout-profile */
        update: (id: string, body: T.PatchPartnersIdPayoutProfileBody, options?: RequestOptions): Promise<T.PatchPartnersIdPayoutProfileResponse> => t.op("patchPartnersIdPayoutProfile", { path: { id }, body }, options),
        /** Set a partner's payout profile. PUT /v1/partners/{id}/payout-profile */
        replace: (id: string, body: T.PutPartnersIdPayoutProfileBody, options?: RequestOptions): Promise<T.PutPartnersIdPayoutProfileResponse> => t.op("putPartnersIdPayoutProfile", { path: { id }, body }, options),
      },
    },
    passport: {
      /** Get the passport signing key. GET /v1/passport/public-key */
      publicKey: (options?: RequestOptions): Promise<T.GetPassportPublicKeyResponse> => t.op("getPassportPublicKey", {  }, options),
      /** Verify a partner passport. POST /v1/passport/verify */
      verify: (body: T.PostPassportVerifyBody, options?: RequestOptions): Promise<T.PostPassportVerifyResponse> => t.op("postPassportVerify", { body }, options),
    },
    payoutConnections: {
      /** Disconnect a payout provider. DELETE /v1/payout-connections/{provider} */
      delete: (provider: string, options?: RequestOptions): Promise<T.DeletePayoutConnectionsProviderResponse> => t.op("deletePayoutConnectionsProvider", { path: { provider } }, options),
      /** List payout provider connections. GET /v1/payout-connections */
      list: (query?: T.GetPayoutConnectionsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPayoutConnectionsResponse['data'][number], T.GetPayoutConnectionsResponse> => t.list("getPayoutConnections", { query }, options),
      /** Connect a payout provider. PUT /v1/payout-connections/{provider} */
      update: (provider: string, body: T.PutPayoutConnectionsProviderBody, options?: RequestOptions): Promise<T.PutPayoutConnectionsProviderResponse> => t.op("putPayoutConnectionsProvider", { path: { provider }, body }, options),
    },
    payoutRuns: {
      /** List payout runs. GET /v1/payout-runs */
      list: (query?: T.GetPayoutRunsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPayoutRunsResponse['data'][number], T.GetPayoutRunsResponse> => t.list("getPayoutRuns", { query }, options),
      /** Create a payout run. POST /v1/payout-runs */
      create: (options?: RequestOptions): Promise<T.PostPayoutRunsResponse> => t.op("postPayoutRuns", {  }, options),
      /** Cancel a payout run. POST /v1/payout-runs/{id}/cancel */
      cancel: (id: string, options?: RequestOptions): Promise<T.PostPayoutRunsIdCancelResponse> => t.op("postPayoutRunsIdCancel", { path: { id } }, options),
      /** Execute a payout run. POST /v1/payout-runs/{id}/execute */
      execute: (id: string, options?: RequestOptions): Promise<T.PostPayoutRunsIdExecuteResponse> => t.op("postPayoutRunsIdExecute", { path: { id } }, options),
      /** Run due payout schedules. POST /v1/payout-runs/run-scheduled */
      runScheduled: (options?: RequestOptions): Promise<T.PostPayoutRunsRunScheduledResponse> => t.op("postPayoutRunsRunScheduled", {  }, options),
    },
    payouts: {
      /** List payouts. GET /v1/payouts */
      list: (query?: T.GetPayoutsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPayoutsResponse['data'][number], T.GetPayoutsResponse> => t.list("getPayouts", { query }, options),
      /** Get a payout's invoice. GET /v1/payouts/{id}/invoice */
      invoice: (id: string, query?: T.GetPayoutsIdInvoiceQuery, options?: RequestOptions): Promise<T.GetPayoutsIdInvoiceResponse> => t.op("getPayoutsIdInvoice", { path: { id }, query }, options),
    },
    plans: {
      /** List public plans. GET /v1/plans */
      retrieve: (options?: RequestOptions): Promise<T.GetPlansResponse> => t.op("getPlans", {  }, options),
    },
    portalAuth: {
      /** What a merchant's portal sign-in offers. GET /v1/portal-auth/current */
      current: (query?: T.GetPortalAuthCurrentQuery, options?: RequestOptions): Promise<T.GetPortalAuthCurrentResponse> => t.op("getPortalAuthCurrent", { query }, options),
    },
    privacy: {
      /** List DSAR tool requests. GET /v1/privacy/executor-requests */
      executorRequests: (options?: RequestOptions): Promise<T.GetPrivacyExecutorRequestsResponse> => t.op("getPrivacyExecutorRequests", {  }, options),
      /** Export a customer's data. GET /v1/privacy/export */
      export: (query: T.GetPrivacyExportQuery, options?: RequestOptions): Promise<T.GetPrivacyExportResponse> => t.op("getPrivacyExport", { query }, options),
      /** Mint a DSAR executor key. POST /v1/privacy/executor-keys */
      executorKeys: (body: T.PostPrivacyExecutorKeysBody, options?: RequestOptions): Promise<T.PostPrivacyExecutorKeysResponse> => t.op("postPrivacyExecutorKeys", { body }, options),
      /** Erase a data subject. POST /v1/privacy/forget */
      forget: (body: T.PostPrivacyForgetBody, options?: RequestOptions): Promise<T.PostPrivacyForgetResponse> => t.op("postPrivacyForget", { body }, options),
      /** Find a data subject by email. POST /v1/privacy/lookup */
      lookup: (body: T.PostPrivacyLookupBody, options?: RequestOptions): Promise<T.PostPrivacyLookupResponse> => t.op("postPrivacyLookup", { body }, options),
      executors: {
        /** Disconnect a DSAR tool. DELETE /v1/privacy/executors/{adapter} */
        delete: (adapter: string, options?: RequestOptions): Promise<T.DeletePrivacyExecutorsAdapterResponse> => t.op("deletePrivacyExecutorsAdapter", { path: { adapter } }, options),
        /** List connected DSAR tools. GET /v1/privacy/executors */
        retrieve: (options?: RequestOptions): Promise<T.GetPrivacyExecutorsResponse> => t.op("getPrivacyExecutors", {  }, options),
        /** Check a DSAR tool connection. POST /v1/privacy/executors/{adapter}/check */
        check: (adapter: string, options?: RequestOptions): Promise<T.PostPrivacyExecutorsAdapterCheckResponse> => t.op("postPrivacyExecutorsAdapterCheck", { path: { adapter } }, options),
      },
      requests: {
        /** List data-subject requests. GET /v1/privacy/requests */
        list: (query?: T.GetPrivacyRequestsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetPrivacyRequestsResponse['data'][number], T.GetPrivacyRequestsResponse> => t.list("getPrivacyRequests", { query }, options),
        /** Get a data-subject request. GET /v1/privacy/requests/{id} */
        retrieve: (id: string, options?: RequestOptions): Promise<T.GetPrivacyRequestsIdResponse> => t.op("getPrivacyRequestsId", { path: { id } }, options),
        /** Get a data-subject request result. GET /v1/privacy/requests/{id}/result */
        result: (id: string, options?: RequestOptions): Promise<T.GetPrivacyRequestsIdResultResponse> => t.op("getPrivacyRequestsIdResult", { path: { id } }, options),
        /** Open a data-subject request. POST /v1/privacy/requests */
        create: (body: T.PostPrivacyRequestsBody, options?: RequestOptions): Promise<T.PostPrivacyRequestsResponse> => t.op("postPrivacyRequests", { body }, options),
      },
    },
    profitability: {
      products: {
        /** Delete a product margin. DELETE /v1/profitability/products/{productRef} */
        delete: (productRef: string, options?: RequestOptions): Promise<T.DeleteProfitabilityProductsProductRefResponse> => t.op("deleteProfitabilityProductsProductRef", { path: { productRef } }, options),
        /** List product margins. GET /v1/profitability/products */
        list: (options?: RequestOptions): Promise<T.GetProfitabilityProductsResponse> => t.op("getProfitabilityProducts", {  }, options),
        /** Get a product margin. GET /v1/profitability/products/{productRef} */
        retrieve: (productRef: string, options?: RequestOptions): Promise<T.GetProfitabilityProductsProductRefResponse> => t.op("getProfitabilityProductsProductRef", { path: { productRef } }, options),
        /** Set a product margin. PUT /v1/profitability/products/{productRef} */
        update: (productRef: string, body: T.PutProfitabilityProductsProductRefBody, options?: RequestOptions): Promise<T.PutProfitabilityProductsProductRefResponse> => t.op("putProfitabilityProductsProductRef", { path: { productRef }, body }, options),
      },
      rebuild: {
        /** Get a rebuild job. GET /v1/profitability/rebuild/{jobId} */
        retrieve: (jobId: string, options?: RequestOptions): Promise<T.GetProfitabilityRebuildJobIdResponse> => t.op("getProfitabilityRebuildJobId", { path: { jobId } }, options),
        /** Rebuild ROI figures. POST /v1/profitability/rebuild */
        create: (options?: RequestOptions): Promise<T.PostProfitabilityRebuildResponse> => t.op("postProfitabilityRebuild", {  }, options),
      },
      settings: {
        /** Get profitability settings. GET /v1/profitability/settings */
        retrieve: (query?: T.GetProfitabilitySettingsQuery, options?: RequestOptions): Promise<T.GetProfitabilitySettingsResponse> => t.op("getProfitabilitySettings", { query }, options),
        /** Update profitability settings. PUT /v1/profitability/settings */
        update: (body: T.PutProfitabilitySettingsBody, options?: RequestOptions): Promise<T.PutProfitabilitySettingsResponse> => t.op("putProfitabilitySettings", { body }, options),
      },
    },
    programs: {
      /** List programs. GET /v1/programs */
      list: (query?: T.GetProgramsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetProgramsResponse['data'][number], T.GetProgramsResponse> => t.list("getPrograms", { query }, options),
      /** Get a program. GET /v1/programs/{id} */
      retrieve: (id: string, options?: RequestOptions): Promise<T.GetProgramsIdResponse> => t.op("getProgramsId", { path: { id } }, options),
      /** Get the referral tree. GET /v1/programs/{id}/graph */
      graph: (id: string, query: T.GetProgramsIdGraphQuery, options?: RequestOptions): Promise<T.GetProgramsIdGraphResponse> => t.op("getProgramsIdGraph", { path: { id }, query }, options),
      /** List terms acceptances. GET /v1/programs/{id}/terms-acceptances */
      termsAcceptances: (id: string, query?: T.GetProgramsIdTermsAcceptancesQuery & PageParams, options?: RequestOptions): ListPromise<T.GetProgramsIdTermsAcceptancesResponse['data'][number], T.GetProgramsIdTermsAcceptancesResponse> => t.list("getProgramsIdTermsAcceptances", { path: { id }, query }, options),
      /** Update a program. PATCH /v1/programs/{id} */
      update: (id: string, body: T.PatchProgramsIdBody, options?: RequestOptions): Promise<T.PatchProgramsIdResponse> => t.op("patchProgramsId", { path: { id }, body }, options),
      /** Create a program. POST /v1/programs */
      create: (body: T.PostProgramsBody, options?: RequestOptions): Promise<T.PostProgramsResponse> => t.op("postPrograms", { body }, options),
      /** Apply partner levels. POST /v1/programs/{id}/apply-leveling */
      applyLeveling: (id: string, options?: RequestOptions): Promise<T.PostProgramsIdApplyLevelingResponse> => t.op("postProgramsIdApplyLeveling", { path: { id } }, options),
      /** Set the incrementality holdout. PUT /v1/programs/{id}/incrementality */
      updateIncrementality: (id: string, body: T.PutProgramsIdIncrementalityBody, options?: RequestOptions): Promise<T.PutProgramsIdIncrementalityResponse> => t.op("putProgramsIdIncrementality", { path: { id }, body }, options),
      /** Set a program's payout schedule. PUT /v1/programs/{id}/payout-schedule */
      updatePayoutSchedule: (id: string, body: T.PutProgramsIdPayoutScheduleBody, options?: RequestOptions): Promise<T.PutProgramsIdPayoutScheduleResponse> => t.op("putProgramsIdPayoutSchedule", { path: { id }, body }, options),
      autoprice: {
        /** Run autopricing. POST /v1/programs/{id}/autoprice/run */
        run: (id: string, body: T.PostProgramsIdAutopriceRunBody, options?: RequestOptions): Promise<T.PostProgramsIdAutopriceRunResponse> => t.op("postProgramsIdAutopriceRun", { path: { id }, body }, options),
      },
      autopricing: {
        /** Get autopricing settings. GET /v1/programs/{id}/autopricing */
        retrieve: (id: string, options?: RequestOptions): Promise<T.GetProgramsIdAutopricingResponse> => t.op("getProgramsIdAutopricing", { path: { id } }, options),
        /** Configure autopricing. PUT /v1/programs/{id}/autopricing */
        update: (id: string, body: T.PutProgramsIdAutopricingBody, options?: RequestOptions): Promise<T.PutProgramsIdAutopricingResponse> => t.op("putProgramsIdAutopricing", { path: { id }, body }, options),
      },
      enrollments: {
        /** List program enrollments. GET /v1/programs/{id}/enrollments */
        list: (id: string, query?: T.GetProgramsIdEnrollmentsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetProgramsIdEnrollmentsResponse['data'][number], T.GetProgramsIdEnrollmentsResponse> => t.list("getProgramsIdEnrollments", { path: { id }, query }, options),
        /** Enroll a partner. POST /v1/programs/{id}/enrollments */
        create: (id: string, body: T.PostProgramsIdEnrollmentsBody, options?: RequestOptions): Promise<T.PostProgramsIdEnrollmentsResponse> => t.op("postProgramsIdEnrollments", { path: { id }, body }, options),
        /** Approve an application. POST /v1/programs/{id}/enrollments/{enrollmentId}/approve */
        approve: (id: string, enrollmentId: string, options?: RequestOptions): Promise<T.PostProgramsIdEnrollmentsEnrollmentIdApproveResponse> => t.op("postProgramsIdEnrollmentsEnrollmentIdApprove", { path: { id, enrollmentId } }, options),
        /** Reject an application. POST /v1/programs/{id}/enrollments/{enrollmentId}/reject */
        reject: (id: string, enrollmentId: string, options?: RequestOptions): Promise<T.PostProgramsIdEnrollmentsEnrollmentIdRejectResponse> => t.op("postProgramsIdEnrollmentsEnrollmentIdReject", { path: { id, enrollmentId } }, options),
      },
      groups: {
        /** List partner groups. GET /v1/programs/{id}/groups */
        list: (id: string, query?: T.GetProgramsIdGroupsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetProgramsIdGroupsResponse['data'][number], T.GetProgramsIdGroupsResponse> => t.list("getProgramsIdGroups", { path: { id }, query }, options),
        /** Create a partner group. POST /v1/programs/{id}/groups */
        create: (id: string, body: T.PostProgramsIdGroupsBody, options?: RequestOptions): Promise<T.PostProgramsIdGroupsResponse> => t.op("postProgramsIdGroups", { path: { id }, body }, options),
      },
      negotiationPolicy: {
        /** Get the agent negotiation policy. GET /v1/programs/{id}/negotiation-policy */
        retrieve: (id: string, options?: RequestOptions): Promise<T.GetProgramsIdNegotiationPolicyResponse> => t.op("getProgramsIdNegotiationPolicy", { path: { id } }, options),
        /** Set the agent negotiation policy. PUT /v1/programs/{id}/negotiation-policy */
        update: (id: string, body: T.PutProgramsIdNegotiationPolicyBody, options?: RequestOptions): Promise<T.PutProgramsIdNegotiationPolicyResponse> => t.op("putProgramsIdNegotiationPolicy", { path: { id }, body }, options),
      },
      partners: {
        /** Set a partner's group. PUT /v1/programs/{id}/partners/{partnerId}/group */
        updateGroup: (id: string, partnerId: string, body: T.PutProgramsIdPartnersPartnerIdGroupBody, options?: RequestOptions): Promise<T.PutProgramsIdPartnersPartnerIdGroupResponse> => t.op("putProgramsIdPartnersPartnerIdGroup", { path: { id, partnerId }, body }, options),
      },
      promotions: {
        /** List promotions. GET /v1/programs/{id}/promotions */
        list: (id: string, query?: T.GetProgramsIdPromotionsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetProgramsIdPromotionsResponse['data'][number], T.GetProgramsIdPromotionsResponse> => t.list("getProgramsIdPromotions", { path: { id }, query }, options),
        /** Create a promotion. POST /v1/programs/{id}/promotions */
        create: (id: string, body: T.PostProgramsIdPromotionsBody, options?: RequestOptions): Promise<T.PostProgramsIdPromotionsResponse> => t.op("postProgramsIdPromotions", { path: { id }, body }, options),
      },
      refereeReward: {
        /** Get the referee reward. GET /v1/programs/{id}/referee-reward */
        retrieve: (id: string, options?: RequestOptions): Promise<T.GetProgramsIdRefereeRewardResponse> => t.op("getProgramsIdRefereeReward", { path: { id } }, options),
        /** Set the referee reward. PUT /v1/programs/{id}/referee-reward */
        update: (id: string, body: T.PutProgramsIdRefereeRewardBody, options?: RequestOptions): Promise<T.PutProgramsIdRefereeRewardResponse> => t.op("putProgramsIdRefereeReward", { path: { id }, body }, options),
      },
    },
    promotions: {
      /** End a promotion. POST /v1/promotions/{id}/end */
      end: (id: string, options?: RequestOptions): Promise<T.PostPromotionsIdEndResponse> => t.op("postPromotionsIdEnd", { path: { id } }, options),
    },
    prospects: {
      /** List prospects. GET /v1/prospects */
      list: (query?: T.GetProspectsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetProspectsResponse['data'][number], T.GetProspectsResponse> => t.list("getProspects", { query }, options),
    },
    public: {
      programs: {
        /** Get a program's public page. GET /v1/public/programs/{handle} */
        retrieve: (handle: string, options?: RequestOptions): Promise<T.GetPublicProgramsHandleResponse> => t.op("getPublicProgramsHandle", { path: { handle } }, options),
        /** Join a program. POST /v1/public/programs/{handle}/join */
        join: (handle: string, body: T.PostPublicProgramsHandleJoinBody, options?: RequestOptions): Promise<T.PostPublicProgramsHandleJoinResponse> => t.op("postPublicProgramsHandleJoin", { path: { handle }, body }, options),
      },
    },
    quality: {
      /** Recompute quality scores. POST /v1/quality/recompute */
      recompute: (options?: RequestOptions): Promise<T.PostQualityRecomputeResponse> => t.op("postQualityRecompute", {  }, options),
    },
    referrals: {
      /** List referrals. GET /v1/referrals */
      list: (query?: T.GetReferralsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetReferralsResponse['data'][number], T.GetReferralsResponse> => t.list("getReferrals", { query }, options),
      /** Get a referral. GET /v1/referrals/{id} */
      retrieve: (id: string, options?: RequestOptions): Promise<T.GetReferralsIdResponse> => t.op("getReferralsId", { path: { id } }, options),
      /** Get the attribution journey. GET /v1/referrals/{id}/journey */
      journey: (id: string, options?: RequestOptions): Promise<T.GetReferralsIdJourneyResponse> => t.op("getReferralsIdJourney", { path: { id } }, options),
      /** Pause or resume a referral. PATCH /v1/referrals/{id} */
      update: (id: string, body: T.PatchReferralsIdBody, options?: RequestOptions): Promise<T.PatchReferralsIdResponse> => t.op("patchReferralsId", { path: { id }, body }, options),
      /** Attribute a new customer. POST /v1/referrals/associate */
      associate: (body: T.PostReferralsAssociateBody, options?: RequestOptions): Promise<T.PostReferralsAssociateResponse> => t.op("postReferralsAssociate", { body }, options),
      /** Approve a held referral. POST /v1/referrals/{id}/approve */
      approve: (id: string, options?: RequestOptions): Promise<T.PostReferralsIdApproveResponse> => t.op("postReferralsIdApprove", { path: { id } }, options),
      /** Reassign a referral. POST /v1/referrals/{id}/reassign */
      reassign: (id: string, body: T.PostReferralsIdReassignBody, options?: RequestOptions): Promise<T.PostReferralsIdReassignResponse> => t.op("postReferralsIdReassign", { path: { id }, body }, options),
      /** Void a referral. POST /v1/referrals/{id}/void */
      void: (id: string, options?: RequestOptions): Promise<T.PostReferralsIdVoidResponse> => t.op("postReferralsIdVoid", { path: { id } }, options),
    },
    reports: {
      /** Report filtered clicks. GET /v1/reports/filtered-clicks */
      filteredClicks: (query?: T.GetReportsFilteredClicksQuery & PageParams, options?: RequestOptions): ListPromise<T.GetReportsFilteredClicksResponse['data'][number], T.GetReportsFilteredClicksResponse> => t.list("getReportsFilteredClicks", { query }, options),
      /** Get partner performance. GET /v1/reports/partner-performance */
      partnerPerformance: (query?: T.GetReportsPartnerPerformanceQuery, options?: RequestOptions): Promise<T.GetReportsPartnerPerformanceResponse> => t.op("getReportsPartnerPerformance", { query }, options),
    },
    rewards: {
      /** List issued referee rewards. GET /v1/rewards */
      list: (query?: T.GetRewardsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetRewardsResponse['data'][number], T.GetRewardsResponse> => t.list("getRewards", { query }, options),
      /** List partner rewards. GET /v1/rewards/granted */
      granted: (options?: RequestOptions): Promise<T.GetRewardsGrantedResponse> => t.op("getRewardsGranted", {  }, options),
      /** Look up a reward code. GET /v1/rewards/lookup/{code} */
      lookup: (code: string, options?: RequestOptions): Promise<T.GetRewardsLookupCodeResponse> => t.op("getRewardsLookupCode", { path: { code } }, options),
      /** Reward a partner. POST /v1/rewards */
      create: (body: T.PostRewardsBody, options?: RequestOptions): Promise<T.PostRewardsResponse> => t.op("postRewards", { body }, options),
      /** Redeem a reward. POST /v1/rewards/{id}/redeem */
      redeem: (id: string, body: T.PostRewardsIdRedeemBody, options?: RequestOptions): Promise<T.PostRewardsIdRedeemResponse> => t.op("postRewardsIdRedeem", { path: { id }, body }, options),
      /** Redeem a reward by code. POST /v1/rewards/redeem-by-code */
      redeemByCode: (body: T.PostRewardsRedeemByCodeBody, options?: RequestOptions): Promise<T.PostRewardsRedeemByCodeResponse> => t.op("postRewardsRedeemByCode", { body }, options),
      rules: {
        /** Delete a reward rule. DELETE /v1/rewards/rules/{key} */
        delete: (key: string, options?: RequestOptions): Promise<T.DeleteRewardsRulesKeyResponse> => t.op("deleteRewardsRulesKey", { path: { key } }, options),
        /** List reward rules. GET /v1/rewards/rules */
        retrieve: (options?: RequestOptions): Promise<T.GetRewardsRulesResponse> => t.op("getRewardsRules", {  }, options),
        /** Save a reward rule. PUT /v1/rewards/rules/{key} */
        update: (key: string, body: T.PutRewardsRulesKeyBody, options?: RequestOptions): Promise<T.PutRewardsRulesKeyResponse> => t.op("putRewardsRulesKey", { path: { key }, body }, options),
      },
    },
    roi: {
      /** Get the ROI breakdown. GET /v1/roi/breakdown */
      breakdown: (query: T.GetRoiBreakdownQuery & PageParams, options?: RequestOptions): ListPromise<T.GetRoiBreakdownResponse['data'][number], T.GetRoiBreakdownResponse> => t.list("getRoiBreakdown", { query }, options),
      /** Get ROI data quality. GET /v1/roi/data-quality */
      dataQuality: (query?: T.GetRoiDataQualityQuery, options?: RequestOptions): Promise<T.GetRoiDataQualityResponse> => t.op("getRoiDataQuality", { query }, options),
      /** List credit grants. GET /v1/roi/grants */
      grants: (query?: T.GetRoiGrantsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetRoiGrantsResponse['data'][number], T.GetRoiGrantsResponse> => t.list("getRoiGrants", { query }, options),
      /** Get the ROI summary. GET /v1/roi/summary */
      summary: (query?: T.GetRoiSummaryQuery, options?: RequestOptions): Promise<T.GetRoiSummaryResponse> => t.op("getRoiSummary", { query }, options),
      /** Trace a customer's value. GET /v1/roi/trace/{customerRef} */
      trace: (customerRef: string, query?: T.GetRoiTraceCustomerRefQuery, options?: RequestOptions): Promise<T.GetRoiTraceCustomerRefResponse> => t.op("getRoiTraceCustomerRef", { path: { customerRef }, query }, options),
      partners: {
        /** Trace a partner's value. GET /v1/roi/partners/{id}/trace */
        trace: (id: string, query?: T.GetRoiPartnersIdTraceQuery, options?: RequestOptions): Promise<T.GetRoiPartnersIdTraceResponse> => t.op("getRoiPartnersIdTrace", { path: { id }, query }, options),
      },
      patterns: {
        /** List value patterns. GET /v1/roi/patterns */
        list: (options?: RequestOptions): Promise<T.GetRoiPatternsResponse> => t.op("getRoiPatterns", {  }, options),
        /** Get a value pattern. GET /v1/roi/patterns/{pattern} */
        retrieve: (pattern: string, query?: T.GetRoiPatternsPatternQuery & PageParams, options?: RequestOptions): ListPromise<T.GetRoiPatternsPatternResponse['data'][number], T.GetRoiPatternsPatternResponse> => t.list("getRoiPatternsPattern", { path: { pattern }, query }, options),
        /** Open a review for a pattern match. POST /v1/roi/patterns/{pattern}/review */
        review: (pattern: string, body: T.PostRoiPatternsPatternReviewBody, options?: RequestOptions): Promise<T.PostRoiPatternsPatternReviewResponse> => t.op("postRoiPatternsPatternReview", { path: { pattern }, body }, options),
      },
    },
    sandbox: {
      /** Simulate billing history. POST /v1/sandbox/simulate */
      simulate: (body: T.PostSandboxSimulateBody, options?: RequestOptions): Promise<T.PostSandboxSimulateResponse> => t.op("postSandboxSimulate", { body }, options),
    },
    setup: {
      /** Get setup progress. GET /v1/setup/status */
      status: (options?: RequestOptions): Promise<T.GetSetupStatusResponse> => t.op("getSetupStatus", {  }, options),
    },
    status: {
      /** Get platform status. GET /v1/status */
      retrieve: (options?: RequestOptions): Promise<T.GetStatusResponse> => t.op("getStatus", {  }, options),
      /** Get the incidents feed. GET /v1/status/incidents.atom */
      incidentsAtom: (options?: RequestOptions): Promise<string> => t.op("getStatusIncidentsAtom", {  }, options),
      incidents: {
        /** List status incidents. GET /v1/status/incidents */
        list: (query?: T.GetStatusIncidentsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetStatusIncidentsResponse['data'][number], T.GetStatusIncidentsResponse> => t.list("getStatusIncidents", { query }, options),
        /** Get a status incident. GET /v1/status/incidents/{id} */
        retrieve: (id: string, options?: RequestOptions): Promise<T.GetStatusIncidentsIdResponse> => t.op("getStatusIncidentsId", { path: { id } }, options),
      },
    },
    support: {
      /** Get referral context for a support contact. GET /v1/support/context */
      context: (query?: T.GetSupportContextQuery, options?: RequestOptions): Promise<T.GetSupportContextResponse> => t.op("getSupportContext", { query }, options),
      apps: {
        /** Disconnect a support tool. DELETE /v1/support/apps/{adapter} */
        delete: (adapter: string, options?: RequestOptions): Promise<T.DeleteSupportAppsAdapterResponse> => t.op("deleteSupportAppsAdapter", { path: { adapter } }, options),
        /** List support tool connections. GET /v1/support/apps */
        retrieve: (options?: RequestOptions): Promise<T.GetSupportAppsResponse> => t.op("getSupportApps", {  }, options),
        /** Preview a support card. POST /v1/support/apps/{adapter}/test */
        test: (adapter: string, body: T.PostSupportAppsAdapterTestBody, options?: RequestOptions): Promise<T.PostSupportAppsAdapterTestResponse> => t.op("postSupportAppsAdapterTest", { path: { adapter }, body }, options),
        /** Connect a support tool. PUT /v1/support/apps/{adapter} */
        update: (adapter: string, body: T.PutSupportAppsAdapterBody, options?: RequestOptions): Promise<T.PutSupportAppsAdapterResponse> => t.op("putSupportAppsAdapter", { path: { adapter }, body }, options),
      },
      cards: {
        /** Render a support card for a tool (GET). GET /v1/support/cards/{orgId}/{adapter} */
        retrieve: (orgId: string, adapter: string, query?: T.GetSupportCardsOrgIdAdapterQuery, options?: RequestOptions): Promise<T.GetSupportCardsOrgIdAdapterResponse> => t.op("getSupportCardsOrgIdAdapter", { path: { orgId, adapter }, query }, options),
        /** Render a support card for a tool. POST /v1/support/cards/{orgId}/{adapter} */
        create: (orgId: string, adapter: string, body: T.PostSupportCardsOrgIdAdapterBody, options?: RequestOptions): Promise<T.PostSupportCardsOrgIdAdapterResponse> => t.op("postSupportCardsOrgIdAdapter", { path: { orgId, adapter }, body }, options),
      },
    },
    tax: {
      form1099: {
        /** Export 1099-NEC data. GET /v1/tax/1099 */
        list: (query: T.GetTax1099Query & PageParams, options?: RequestOptions): ListPromise<T.GetTax1099Response['data'][number], T.GetTax1099Response> => t.list("getTax1099", { query }, options),
        /** Preview 1099-NEC filings. GET /v1/tax/1099/preview */
        preview: (query: T.GetTax1099PreviewQuery, options?: RequestOptions): Promise<T.GetTax1099PreviewResponse> => t.op("getTax1099Preview", { query }, options),
        documents: {
          /** File a corrected 1099. POST /v1/tax/1099/documents/{id}/correct */
          correct: (id: string, options?: RequestOptions): Promise<T.PostTax1099DocumentsIdCorrectResponse> => t.op("postTax1099DocumentsIdCorrect", { path: { id } }, options),
        },
        filings: {
          /** List 1099 filings. GET /v1/tax/1099/filings */
          list: (query: T.GetTax1099FilingsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetTax1099FilingsResponse['data'][number], T.GetTax1099FilingsResponse> => t.list("getTax1099Filings", { query }, options),
          /** File 1099-NEC forms. POST /v1/tax/1099/filings */
          create: (body: T.PostTax1099FilingsBody, options?: RequestOptions): Promise<T.PostTax1099FilingsResponse> => t.op("postTax1099Filings", { body }, options),
          /** Refresh a filing status. POST /v1/tax/1099/filings/{id}/refresh */
          refresh: (id: string, options?: RequestOptions): Promise<T.PostTax1099FilingsIdRefreshResponse> => t.op("postTax1099FilingsIdRefresh", { path: { id } }, options),
        },
      },
    },
    test: {
      /** List captured test emails. GET /v1/test/emails */
      emails: (query?: T.GetTestEmailsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetTestEmailsResponse['data'][number], T.GetTestEmailsResponse> => t.list("getTestEmails", { query }, options),
    },
    testClock: {
      /** Get the test clock. GET /v1/test_clock */
      retrieve: (options?: RequestOptions): Promise<T.GetTestClockResponse> => t.op("getTestClock", {  }, options),
      /** Advance the test clock. POST /v1/test_clock/advance */
      advance: (body: T.PostTestClockAdvanceBody, options?: RequestOptions): Promise<T.PostTestClockAdvanceResponse> => t.op("postTestClockAdvance", { body }, options),
    },
    track: {
      /** Track an event. POST /v1/track/events */
      events: (body: T.PostTrackEventsBody, options?: RequestOptions): Promise<T.PostTrackEventsResponse> => t.op("postTrackEvents", { body }, options),
    },
    unsubscribe: {
      /** Unsubscribe from outreach. POST /v1/unsubscribe/{token} */
      create: (token: string, options?: RequestOptions): Promise<T.PostUnsubscribeTokenResponse> => t.op("postUnsubscribeToken", { path: { token } }, options),
    },
    value: {
      /** Record value events. POST /v1/value/events */
      events: (body: T.PostValueEventsBody, options?: RequestOptions): Promise<T.PostValueEventsResponse> => t.op("postValueEvents", { body }, options),
      import: {
        /** Get a value import job. GET /v1/value/import/{jobId} */
        retrieve: (jobId: string, options?: RequestOptions): Promise<T.GetValueImportJobIdResponse> => t.op("getValueImportJobId", { path: { jobId } }, options),
        /** Import value events from CSV. POST /v1/value/import */
        create: (body: T.PostValueImportBody, options?: RequestOptions): Promise<T.PostValueImportResponse> => t.op("postValueImport", { body }, options),
      },
    },
    versions: {
      /** List API versions. GET /v1/versions */
      retrieve: (options?: RequestOptions): Promise<T.GetVersionsResponse> => t.op("getVersions", {  }, options),
    },
    webhookDeliveries: {
      /** List webhook deliveries. GET /v1/webhook-deliveries */
      list: (query?: T.GetWebhookDeliveriesQuery & PageParams, options?: RequestOptions): ListPromise<T.GetWebhookDeliveriesResponse['data'][number], T.GetWebhookDeliveriesResponse> => t.list("getWebhookDeliveries", { query }, options),
      /** Get a webhook delivery. GET /v1/webhook-deliveries/{id} */
      retrieve: (id: string, options?: RequestOptions): Promise<T.GetWebhookDeliveriesIdResponse> => t.op("getWebhookDeliveriesId", { path: { id } }, options),
      /** Replay a webhook delivery. POST /v1/webhook-deliveries/{id}/replay */
      replay: (id: string, options?: RequestOptions): Promise<T.PostWebhookDeliveriesIdReplayResponse> => t.op("postWebhookDeliveriesIdReplay", { path: { id } }, options),
    },
    webhookEndpoints: {
      /** Delete a webhook endpoint. DELETE /v1/webhook-endpoints/{id} */
      delete: (id: string, options?: RequestOptions): Promise<T.DeleteWebhookEndpointsIdResponse> => t.op("deleteWebhookEndpointsId", { path: { id } }, options),
      /** List webhook endpoints. GET /v1/webhook-endpoints */
      list: (query?: T.GetWebhookEndpointsQuery & PageParams, options?: RequestOptions): ListPromise<T.GetWebhookEndpointsResponse['data'][number], T.GetWebhookEndpointsResponse> => t.list("getWebhookEndpoints", { query }, options),
      /** Get a webhook endpoint. GET /v1/webhook-endpoints/{id} */
      retrieve: (id: string, options?: RequestOptions): Promise<T.GetWebhookEndpointsIdResponse> => t.op("getWebhookEndpointsId", { path: { id } }, options),
      /** List an endpoint's deliveries. GET /v1/webhook-endpoints/{id}/deliveries */
      deliveries: (id: string, query?: T.GetWebhookEndpointsIdDeliveriesQuery & PageParams, options?: RequestOptions): ListPromise<T.GetWebhookEndpointsIdDeliveriesResponse['data'][number], T.GetWebhookEndpointsIdDeliveriesResponse> => t.list("getWebhookEndpointsIdDeliveries", { path: { id }, query }, options),
      /** Update a webhook endpoint. PATCH /v1/webhook-endpoints/{id} */
      update: (id: string, body: T.PatchWebhookEndpointsIdBody, options?: RequestOptions): Promise<T.PatchWebhookEndpointsIdResponse> => t.op("patchWebhookEndpointsId", { path: { id }, body }, options),
      /** Create a webhook endpoint. POST /v1/webhook-endpoints */
      create: (body: T.PostWebhookEndpointsBody, options?: RequestOptions): Promise<T.PostWebhookEndpointsResponse> => t.op("postWebhookEndpoints", { body }, options),
      /** Replay failed deliveries. POST /v1/webhook-endpoints/{id}/replay */
      replay: (id: string, query: T.PostWebhookEndpointsIdReplayQuery, options?: RequestOptions): Promise<T.PostWebhookEndpointsIdReplayResponse> => t.op("postWebhookEndpointsIdReplay", { path: { id }, query }, options),
      /** Rotate an endpoint secret. POST /v1/webhook-endpoints/{id}/rotate-secret */
      rotateSecret: (id: string, options?: RequestOptions): Promise<T.PostWebhookEndpointsIdRotateSecretResponse> => t.op("postWebhookEndpointsIdRotateSecret", { path: { id } }, options),
    },
    widget: {
      /** Mint a referral widget token. POST /v1/widget/tokens */
      tokens: (body: T.PostWidgetTokensBody, options?: RequestOptions): Promise<T.PostWidgetTokensResponse> => t.op("postWidgetTokens", { body }, options),
    },
    zapier: {
      /** List Zapier trigger events. GET /v1/zapier/events */
      events: (options?: RequestOptions): Promise<T.GetZapierEventsResponse> => t.op("getZapierEvents", {  }, options),
      /** Poll a Zapier trigger. GET /v1/zapier/triggers/{event} */
      triggers: (event: string, query?: T.GetZapierTriggersEventQuery, options?: RequestOptions): Promise<T.GetZapierTriggersEventResponse> => t.op("getZapierTriggersEvent", { path: { event }, query }, options),
      /** Record a conversion from Zapier. POST /v1/zapier/conversions */
      conversions: (body: T.PostZapierConversionsBody, options?: RequestOptions): Promise<T.PostZapierConversionsResponse> => t.op("postZapierConversions", { body }, options),
      hooks: {
        /** Unsubscribe a Zapier hook. DELETE /v1/zapier/hooks/{id} */
        delete: (id: string, options?: RequestOptions): Promise<T.DeleteZapierHooksIdResponse> => t.op("deleteZapierHooksId", { path: { id } }, options),
        /** List Zapier hooks. GET /v1/zapier/hooks */
        list: (query?: T.GetZapierHooksQuery & PageParams, options?: RequestOptions): ListPromise<T.GetZapierHooksResponse['data'][number], T.GetZapierHooksResponse> => t.list("getZapierHooks", { query }, options),
        /** Subscribe a Zapier hook. POST /v1/zapier/hooks */
        create: (body: T.PostZapierHooksBody, options?: RequestOptions): Promise<T.PostZapierHooksResponse> => t.op("postZapierHooks", { body }, options),
      },
    },
  };
}

export type Resources = ReturnType<typeof buildResources>;
