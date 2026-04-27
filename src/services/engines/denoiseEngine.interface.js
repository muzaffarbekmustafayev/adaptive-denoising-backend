class DenoiseEngine {
  /**
   * Get duration of audio file in seconds
   * @param {string} inputPath 
   * @returns {Promise<number>}
   */
  async getDuration(inputPath) {
    throw new Error("getDuration must be implemented");
  }

  /**
   * Process audio to remove noise
   * @param {string} inputPath 
   * @param {string} outputPath 
   * @param {object} options 
   * @returns {Promise<void>}
   */
  async process(inputPath, outputPath, options) {
    throw new Error("process must be implemented");
  }
}

module.exports = DenoiseEngine;
