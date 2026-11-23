/**
 * First-Order Markov Chain Multi-Touch Attribution Engine
 * Determines true algorithmic channel conversion credits by modeling multi-touch customer journeys
 * as state transitions and measuring the Removal Effect when each channel is removed from the network.
 */

class MarkovChainAttributionEngine {
  constructor(journeyPaths = []) {
    this.paths = journeyPaths; // Array of { path: ['Organic', 'Paid Search', 'Email'], converted: true }
    this.channels = new Set();
    this.transitions = {}; // transitions[from][to] = count
    this.probabilities = {}; // probabilities[from][to] = probability
  }

  /**
   * Builds the state transition probability matrix from observed customer touchpoint journeys
   */
  buildTransitionMatrix() {
    this.transitions = {};
    this.channels = new Set();

    this.paths.forEach(({ path, converted }) => {
      const fullPath = ['(START)', ...path, converted ? '(CONVERSION)' : '(NULL)'];

      for (let i = 0; i < fullPath.length - 1; i++) {
        const from = fullPath[i];
        const to = fullPath[i + 1];

        if (from !== '(START)' && from !== '(CONVERSION)' && from !== '(NULL)') {
          this.channels.add(from);
        }

        if (!this.transitions[from]) {
          this.transitions[from] = {};
        }
        this.transitions[from][to] = (this.transitions[from][to] || 0) + 1;
      }
    });

    // Compute transition probabilities
    this.probabilities = {};
    for (const from in this.transitions) {
      const totalOut = Object.values(this.transitions[from]).reduce((sum, c) => sum + c, 0);
      this.probabilities[from] = {};
      for (const to in this.transitions[from]) {
        this.probabilities[from][to] = this.transitions[from][to] / totalOut;
      }
    }

    return this.probabilities;
  }

  /**
   * Computes the baseline conversion rate through absorbing Markov chain probability propagation
   * @param {string|null} removedChannel - Optional channel to simulate removal of
   * @returns {number} Conversion probability from (START) to (CONVERSION)
   */
  calculateConversionProbability(removedChannel = null) {
    let currentDistribution = { '(START)': 1.0 };
    let conversionAccumulator = 0.0;
    const maxIterations = 30; // Bound maximum journey hops

    for (let step = 0; step < maxIterations; step++) {
      const nextDistribution = {};

      for (const state in currentDistribution) {
        const stateProb = currentDistribution[state];
        if (stateProb <= 1e-7) continue;

        // Absorbing states terminate propagation
        if (state === '(CONVERSION)') {
          conversionAccumulator += stateProb;
          continue;
        }
        if (state === '(NULL)') {
          continue;
        }

        // If this state is the removed channel, paths hitting it are dropped to (NULL)
        if (removedChannel && state === removedChannel) {
          continue;
        }

        const outTransitions = this.probabilities[state] || {};
        for (const nextState in outTransitions) {
          let transProb = outTransitions[nextState];

          // If transitioning to removed channel, it reroutes to failure (NULL)
          if (removedChannel && nextState === removedChannel) {
            continue;
          }

          nextDistribution[nextState] = (nextDistribution[nextState] || 0) + (stateProb * transProb);
        }
      }

      currentDistribution = nextDistribution;
      if (Object.keys(currentDistribution).length === 0) break;
    }

    // Capture remaining converted probability
    if (currentDistribution['(CONVERSION)']) {
      conversionAccumulator += currentDistribution['(CONVERSION)'];
    }

    return conversionAccumulator;
  }

  /**
   * Executes full Markov Removal Effect attribution calculation
   * @returns {Object} Normalized attribution shares and removal effects per channel
   */
  computeAttribution() {
    this.buildTransitionMatrix();
    const baselineConversionRate = this.calculateConversionProbability(null);

    const removalEffects = {};
    let totalRemovalEffect = 0.0;

    for (const channel of this.channels) {
      const probWithoutChannel = this.calculateConversionProbability(channel);
      // Removal Effect: % drop in overall conversions if channel didn't exist
      const removalEffect = Math.max(0, (baselineConversionRate - probWithoutChannel) / baselineConversionRate);
      removalEffects[channel] = removalEffect;
      totalRemovalEffect += removalEffect;
    }

    // Normalize removal effects into fair attribution percentage weights
    const attributionShares = {};
    for (const channel of this.channels) {
      attributionShares[channel] = totalRemovalEffect > 0
        ? Math.round((removalEffects[channel] / totalRemovalEffect) * 1000) / 10
        : 0;
    }

    return {
      baselineConversionRate: Math.round(baselineConversionRate * 1000) / 10,
      totalTrackedChannels: this.channels.size,
      removalEffects: Object.fromEntries(
        Object.entries(removalEffects).map(([k, v]) => [k, Math.round(v * 1000) / 1000])
      ),
      attributionSharesPercentage: attributionShares
    };
  }
}

module.exports = MarkovChainAttributionEngine;
