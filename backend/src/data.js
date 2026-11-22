// Multi-Touch Marketing Attribution & Funnel Drop-off Dataset

export const funnelStages = [
  { stage: "Unique Site Visitors", count: 125000, conversionRatePct: 100.0, dropOffPct: 0.0, stepNum: 1 },
  { stage: "Signup Initiated", count: 42500, conversionRatePct: 34.0, dropOffPct: 66.0, stepNum: 2 },
  { stage: "Workspace Configured", count: 28900, conversionRatePct: 23.1, dropOffPct: 32.0, stepNum: 3 },
  { stage: "14-Day Trial Active", count: 18400, conversionRatePct: 14.7, dropOffPct: 36.3, stepNum: 4 },
  { stage: "Paid Enterprise Plan", count: 4850, conversionRatePct: 3.88, dropOffPct: 73.6, stepNum: 5 }
];

export const attributionModels = [
  {
    channel: "Google Paid Search (Intent)",
    firstTouchPct: 38.5,
    lastTouchPct: 18.2,
    linearPct: 28.4,
    uShapedPct: 32.0,
    attributedArrUsd: 1820000
  },
  {
    channel: "LinkedIn Enterprise B2B",
    firstTouchPct: 29.0,
    lastTouchPct: 12.5,
    linearPct: 22.1,
    uShapedPct: 26.5,
    attributedArrUsd: 1450000
  },
  {
    channel: "Organic Search / SEO Docs",
    firstTouchPct: 18.2,
    lastTouchPct: 24.1,
    linearPct: 20.8,
    uShapedPct: 19.4,
    attributedArrUsd: 980000
  },
  {
    channel: "Automated Email Dunning / Nurture",
    firstTouchPct: 2.1,
    lastTouchPct: 34.8,
    linearPct: 18.5,
    uShapedPct: 14.2,
    attributedArrUsd: 1280000
  },
  {
    channel: "Direct Referral & Word of Mouth",
    firstTouchPct: 12.2,
    lastTouchPct: 10.4,
    linearPct: 10.2,
    uShapedPct: 7.9,
    attributedArrUsd: 620000
  }
];

export const dropOffRootCauses = [
  { cause: "Pricing Sticker Shock (Post-Trial Paywall)", dropOffCount: 9940, impactScore: "HIGH", funnelStep: "Trial -> Paid" },
  { cause: "Auth Failure / SSO Not Available", dropOffCount: 8250, impactScore: "CRITICAL", funnelStep: "Landing -> Signup" },
  { cause: "Feature Gated (Missing Integration)", dropOffCount: 6810, impactScore: "HIGH", funnelStep: "Workspace Config" },
  { cause: "Payment Gateway Decline (3D Secure)", dropOffCount: 3610, impactScore: "MEDIUM", funnelStep: "Trial -> Paid" }
];
