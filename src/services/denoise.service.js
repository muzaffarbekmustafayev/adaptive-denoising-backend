const { createAudioEngine } = require("./audioEngine.factory");
const AudioJob = require("../modules/audio/audio.model");
const Usage = require("../modules/usage/usage.model");
const ApiKey = require("../modules/apiKey/apiKey.model");
const logger = require("../config/logger");
const path = require("path");
const fs = require("fs").promises;

const engine = createAudioEngine();

const processAudioJob = async (jobData) => {
  const { audioJobId, inputPath, options } = jobData;
  
  const audioJob = await AudioJob.findById(audioJobId);
  if (!audioJob) {
    throw new Error(`AudioJob ${audioJobId} not found`);
  }

  try {
    audioJob.status = "PROCESSING";
    audioJob.startedAt = new Date();
    await audioJob.save();

    // 1. Get duration
    const duration = await engine.getDuration(inputPath);
    audioJob.durationSeconds = duration;

    // 2. Setup output path
    const outputDir = path.join(path.dirname(inputPath), "../../output");
    await fs.mkdir(outputDir, { recursive: true });
    
    const outputFileName = `denoised-${path.basename(inputPath)}`;
    const outputPath = path.join(outputDir, outputFileName);
    audioJob.outputPath = outputPath;

    // 3. Process
    await engine.process(inputPath, outputPath, options);

    // 4. Update status
    const stats = await fs.stat(outputPath);
    audioJob.outputBytes = stats.size;
    audioJob.status = "COMPLETED";
    audioJob.completedAt = new Date();
    await audioJob.save();

    // 5. Create usage record
    await Usage.create({
      userId: audioJob.userId,
      apiKeyId: audioJob.apiKeyId,
      audioJobId: audioJob._id,
      durationSeconds: audioJob.durationSeconds,
      inputBytes: audioJob.inputBytes,
      outputBytes: audioJob.outputBytes,
      status: "SUCCESS"
    });

    // 6. Update API key usage
    await ApiKey.findByIdAndUpdate(audioJob.apiKeyId, {
      $inc: { usageCount: 1 },
      lastUsedAt: new Date()
    });

    logger.info(`AudioJob ${audioJobId} completed successfully`);
    return audioJob;
  } catch (error) {
    logger.error(`AudioJob ${audioJobId} failed: ${error.message}`);
    
    audioJob.status = "FAILED";
    audioJob.errorMessage = error.message;
    audioJob.completedAt = new Date();
    await audioJob.save();

    // Create failed usage record
    await Usage.create({
      userId: audioJob.userId,
      apiKeyId: audioJob.apiKeyId,
      audioJobId: audioJob._id,
      status: "FAILED",
      errorMessage: error.message
    });
    
    throw error;
  }
};

module.exports = { processAudioJob };
