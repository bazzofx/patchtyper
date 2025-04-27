// Game configuration settings

export const gameConfig = {
  // Player settings
  player: {
    initialHealth: 300,
    maxThreats: 6,
    healthRestorePerWave: 20, // Increased from 20 to 60 to maintain the same proportion
  },

  // Scoring settings
  scoring: {
    timeBonus: {
      maxBonus: 10, // Maximum time bonus points
      threshold: 10, // Seconds threshold for calculating time bonus
    },
    levelUpThreshold: 100, // Score needed to level up (multiplied by current level)
    waveCompletionBonus: 50, // Bonus points for completing a wave
  },

  // Wave settings
  waves: {
    threatsPerWave: 5, // Number of threats to defeat per wave
    difficultyIncrease: 0.2, // How much to increase difficulty per wave (20%)
    maxWaves: 10, // Maximum number of waves
  },

  // Difficulty settings
  difficulty: {
    initialSpawnRate: 4000, // Initial milliseconds between threat spawns
    spawnRateDecrease: 300, // How much to decrease spawn rate per level (ms)
    minSpawnRate: 1000, // Minimum spawn rate (ms)
    threatCheckInterval: 500, // How often to check for expired threats (ms)
  },

  // UI settings
  ui: {
    showFixHint: true, // Whether to show hints for the fix
    hintStyle: "floating", // "none", "partial", "full", or "floating"
  },

  // Time settings
  time: {
    timeMultiplier: 1.5, // Multiplier for all time limits (higher = more time)
    timePerCard: 20, // Base time in seconds per card (will be adjusted by difficulty)
    // Time reduction per wave (percentage as decimal)
    timeReductionPerWave: 0.05, // 5% reduction per wave
    minTimePercentage: 0.6, // Minimum time percentage (60% of base time)
  },
}
