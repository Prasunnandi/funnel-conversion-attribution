/**
 * Multi-Touch Attribution (MTA) Classical Models Suite
 * Computes and compares First-Touch, Last-Touch, Linear, Time-Decay, and Position-Based (U-Shaped)
 * attribution models across multi-channel customer conversion journeys.
 */

export const ATTRIBUTION_MODELS = {
  FIRST_TOUCH: 'FIRST_TOUCH',
  LAST_TOUCH: 'LAST_TOUCH',
  LINEAR: 'LINEAR',
  TIME_DECAY: 'TIME_DECAY',
  POSITION_BASED: 'POSITION_BASED' // 40-20-40 U-Shaped
};

export class ClassicalAttributionEngine {
  /**
   * @param {Object} [options]
   * @param {number} [options.halfLifeDays=7] - Half-life for Time-Decay model
   * @param {number} [options.firstTouchWeight=0.4] - Position-Based first touch weight
   * @param {number} [options.lastTouchWeight=0.4] - Position-Based last touch weight
   */
  constructor(options = {}) {
    this.halfLifeDays = options.halfLifeDays || 7;
    this.firstTouchWeight = options.firstTouchWeight || 0.4;
    this.lastTouchWeight = options.lastTouchWeight || 0.4;
  }

  /**
   * Normalize an array of touchpoints from path strings or objects
   */
  _normalizeTouchpoints(journey) {
    const raw = journey.touchpoints || journey.path || [];
    const converted = Boolean(journey.converted ?? true);
    const revenue = Number(journey.revenue || (converted ? 100 : 0));
    const convTime = journey.conversionTime ? new Date(journey.conversionTime).getTime() : Date.now();

    const touchpoints = raw.map((tp, idx) => {
      if (typeof tp === 'string') {
        return {
          channel: tp.trim(),
          timestampMs: convTime - (raw.length - 1 - idx) * 24 * 3600 * 1000 // 1 day apart default
        };
      }
      return {
        channel: tp.channel || 'Direct',
        timestampMs: tp.timestamp ? new Date(tp.timestamp).getTime() : convTime - (raw.length - 1 - idx) * 24 * 3600 * 1000
      };
    });

    return { touchpoints, converted, revenue, convTime };
  }

  /**
   * First-Touch Attribution: 100% of conversion credit to first interaction
   */
  attributeFirstTouch(touchpoints, revenue = 0) {
    const credits = {};
    if (!touchpoints || touchpoints.length === 0) return { credits, revenueAttributed: {} };

    const firstChannel = touchpoints[0].channel;
    credits[firstChannel] = 1.0;
    const revenueAttributed = { [firstChannel]: revenue };

    return { credits, revenueAttributed };
  }

  /**
   * Last-Touch Attribution: 100% of conversion credit to last interaction before conversion
   */
  attributeLastTouch(touchpoints, revenue = 0) {
    const credits = {};
    if (!touchpoints || touchpoints.length === 0) return { credits, revenueAttributed: {} };

    const lastChannel = touchpoints[touchpoints.length - 1].channel;
    credits[lastChannel] = 1.0;
    const revenueAttributed = { [lastChannel]: revenue };

    return { credits, revenueAttributed };
  }

  /**
   * Linear Attribution: Equal credit across all touchpoints (1/N each)
   */
  attributeLinear(touchpoints, revenue = 0) {
    const credits = {};
    const revenueAttributed = {};
    if (!touchpoints || touchpoints.length === 0) return { credits, revenueAttributed };

    const n = touchpoints.length;
    const share = 1.0 / n;

    touchpoints.forEach((tp) => {
      credits[tp.channel] = (credits[tp.channel] || 0) + share;
      revenueAttributed[tp.channel] = (revenueAttributed[tp.channel] || 0) + share * revenue;
    });

    return { credits, revenueAttributed };
  }

  /**
   * Time-Decay Attribution: Exponential half-life decay weighted by proximity to conversion
   */
  attributeTimeDecay(touchpoints, revenue = 0, convTime = Date.now()) {
    const credits = {};
    const revenueAttributed = {};
    if (!touchpoints || touchpoints.length === 0) return { credits, revenueAttributed };

    const halfLifeMs = this.halfLifeDays * 24 * 3600 * 1000;
    const rawWeights = touchpoints.map((tp) => {
      const timeDiffMs = Math.max(0, convTime - tp.timestampMs);
      return Math.pow(2, -timeDiffMs / halfLifeMs);
    });

    const sumWeights = rawWeights.reduce((a, b) => a + b, 0) || 1.0;

    touchpoints.forEach((tp, idx) => {
      const normalizedWeight = rawWeights[idx] / sumWeights;
      credits[tp.channel] = (credits[tp.channel] || 0) + normalizedWeight;
      revenueAttributed[tp.channel] = (revenueAttributed[tp.channel] || 0) + normalizedWeight * revenue;
    });

    return { credits, revenueAttributed };
  }

  /**
   * Position-Based (U-Shaped) Attribution: 40% First, 40% Last, 20% Middle
   */
  attributePositionBased(touchpoints, revenue = 0) {
    const credits = {};
    const revenueAttributed = {};
    if (!touchpoints || touchpoints.length === 0) return { credits, revenueAttributed };

    const n = touchpoints.length;

    if (n === 1) {
      const ch = touchpoints[0].channel;
      credits[ch] = 1.0;
      revenueAttributed[ch] = revenue;
      return { credits, revenueAttributed };
    }

    if (n === 2) {
      const firstCh = touchpoints[0].channel;
      const lastCh = touchpoints[1].channel;
      credits[firstCh] = (credits[firstCh] || 0) + 0.5;
      credits[lastCh] = (credits[lastCh] || 0) + 0.5;
      revenueAttributed[firstCh] = (revenueAttributed[firstCh] || 0) + 0.5 * revenue;
      revenueAttributed[lastCh] = (revenueAttributed[lastCh] || 0) + 0.5 * revenue;
      return { credits, revenueAttributed };
    }

    const rawMidShare = (1.0 - this.firstTouchWeight - this.lastTouchWeight) / (n - 2);
    const midShare = Math.round(rawMidShare * 1e8) / 1e8;

    touchpoints.forEach((tp, idx) => {
      let weight = midShare;
      if (idx === 0) weight = this.firstTouchWeight;
      else if (idx === n - 1) weight = this.lastTouchWeight;

      credits[tp.channel] = (credits[tp.channel] || 0) + weight;
      revenueAttributed[tp.channel] = (revenueAttributed[tp.channel] || 0) + weight * revenue;
    });

    return { credits, revenueAttributed };
  }

  /**
   * Compare all 5 classical attribution models across an entire corpus of customer journeys
   * @param {Array<Object>} journeys - List of customer journey objects
   * @returns {Object} Comparative attribution table and summary metrics
   */
  compareAllModels(journeys = []) {
    const channelMap = new Map();

    const getOrCreateChannel = (name) => {
      if (!channelMap.has(name)) {
        channelMap.set(name, {
          channel: name,
          firstTouchCredits: 0,
          lastTouchCredits: 0,
          linearCredits: 0,
          timeDecayCredits: 0,
          positionBasedCredits: 0,
          firstTouchRevenue: 0,
          lastTouchRevenue: 0,
          linearRevenue: 0,
          timeDecayRevenue: 0,
          positionBasedRevenue: 0
        });
      }
      return channelMap.get(name);
    };

    let totalConversions = 0;
    let totalRevenue = 0;

    journeys.forEach((j) => {
      const { touchpoints, converted, revenue, convTime } = this._normalizeTouchpoints(j);
      if (!converted || touchpoints.length === 0) return;

      totalConversions++;
      totalRevenue += revenue;

      const ft = this.attributeFirstTouch(touchpoints, revenue);
      const lt = this.attributeLastTouch(touchpoints, revenue);
      const lin = this.attributeLinear(touchpoints, revenue);
      const td = this.attributeTimeDecay(touchpoints, revenue, convTime);
      const pb = this.attributePositionBased(touchpoints, revenue);

      // Accumulate First Touch
      for (const [ch, cred] of Object.entries(ft.credits)) {
        const c = getOrCreateChannel(ch);
        c.firstTouchCredits += cred;
        c.firstTouchRevenue += ft.revenueAttributed[ch] || 0;
      }

      // Accumulate Last Touch
      for (const [ch, cred] of Object.entries(lt.credits)) {
        const c = getOrCreateChannel(ch);
        c.lastTouchCredits += cred;
        c.lastTouchRevenue += lt.revenueAttributed[ch] || 0;
      }

      // Accumulate Linear
      for (const [ch, cred] of Object.entries(lin.credits)) {
        const c = getOrCreateChannel(ch);
        c.linearCredits += cred;
        c.linearRevenue += lin.revenueAttributed[ch] || 0;
      }

      // Accumulate Time Decay
      for (const [ch, cred] of Object.entries(td.credits)) {
        const c = getOrCreateChannel(ch);
        c.timeDecayCredits += cred;
        c.timeDecayRevenue += td.revenueAttributed[ch] || 0;
      }

      // Accumulate Position Based
      for (const [ch, cred] of Object.entries(pb.credits)) {
        const c = getOrCreateChannel(ch);
        c.positionBasedCredits += cred;
        c.positionBasedRevenue += pb.revenueAttributed[ch] || 0;
      }
    });

    // Format results
    const channelResults = Array.from(channelMap.values()).map((c) => ({
      channel: c.channel,
      firstTouch: { credits: Number(c.firstTouchCredits.toFixed(2)), revenue: Number(c.firstTouchRevenue.toFixed(2)) },
      lastTouch: { credits: Number(c.lastTouchCredits.toFixed(2)), revenue: Number(c.lastTouchRevenue.toFixed(2)) },
      linear: { credits: Number(c.linearCredits.toFixed(2)), revenue: Number(c.linearRevenue.toFixed(2)) },
      timeDecay: { credits: Number(c.timeDecayCredits.toFixed(2)), revenue: Number(c.timeDecayRevenue.toFixed(2)) },
      positionBased: { credits: Number(c.positionBasedCredits.toFixed(2)), revenue: Number(c.positionBasedRevenue.toFixed(2)) }
    }));

    // Sort by Linear credits descending
    channelResults.sort((a, b) => b.linear.credits - a.linear.credits);

    return {
      totalConversions,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      channelsCount: channelResults.length,
      channels: channelResults
    };
  }
}

// Dual ESM & CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ATTRIBUTION_MODELS,
    ClassicalAttributionEngine
  };
}

export default ClassicalAttributionEngine;
