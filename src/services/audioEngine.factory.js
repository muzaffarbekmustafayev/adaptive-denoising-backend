const FfmpegEngine = require("./engines/ffmpeg.engine");

function createAudioEngine() {
  const engineType = process.env.AUDIO_ENGINE || "ffmpeg";

  switch (engineType) {
    case "ffmpeg":
      return new FfmpegEngine();
    // Add other engines here later
    default:
      return new FfmpegEngine();
  }
}

module.exports = { createAudioEngine };
