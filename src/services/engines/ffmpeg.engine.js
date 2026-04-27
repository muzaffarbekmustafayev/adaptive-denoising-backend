const ffmpeg = require("fluent-ffmpeg");
const ffmpegStatic = require("ffmpeg-static");
const DenoiseEngine = require("./denoiseEngine.interface");

ffmpeg.setFfmpegPath(ffmpegStatic);

class FfmpegEngine extends DenoiseEngine {
  async getDuration(inputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputPath, (err, metadata) => {
        if (err) return reject(err);
        resolve(metadata.format.duration);
      });
    });
  }

  async process(inputPath, outputPath, options = {}) {
    return new Promise((resolve, reject) => {
      let command = ffmpeg(inputPath);

      // Basic noise reduction using afftdn
      // nf: noise floor, default is -25dB
      const noiseFloor = options.noiseFloor || -25;
      
      command
        .audioFilters(`afftdn=nf=${noiseFloor}`)
        .on("end", () => resolve())
        .on("error", (err) => reject(err))
        .save(outputPath);
    });
  }
}

module.exports = FfmpegEngine;
