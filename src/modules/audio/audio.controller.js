const AudioJob = require("./audio.model");
const { addAudioJob } = require("../../jobs/audio.queue");
const path = require("path");
const fs = require("fs");

const denoise = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("Please upload an audio file");
      error.statusCode = 400;
      return next(error);
    }

    const { mode } = req.body;

    const audioJob = await AudioJob.create({
      userId: req.user._id,
      apiKeyId: req.apiKey._id,
      originalFileName: req.file.originalname,
      inputPath: req.file.path,
      mimeType: req.file.mimetype,
      inputBytes: req.file.size,
      status: "QUEUED"
    });

    await addAudioJob({
      audioJobId: audioJob._id,
      userId: req.user._id,
      apiKeyId: req.apiKey._id,
      inputPath: req.file.path,
      options: {
        mode: mode || "basic"
      }
    });

    res.status(202).json({
      success: true,
      data: {
        jobId: audioJob._id,
        status: audioJob.status,
        message: "Audio processing started"
      }
    });
  } catch (error) {
    next(error);
  }
};

const getJobStatus = async (req, res, next) => {
  try {
    const audioJob = await AudioJob.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!audioJob) {
      const error = new Error("Audio job not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: audioJob
    });
  } catch (error) {
    next(error);
  }
};

const downloadOutput = async (req, res, next) => {
  try {
    const audioJob = await AudioJob.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!audioJob || audioJob.status !== "COMPLETED") {
      const error = new Error("Denoised audio not found or processing not complete");
      error.statusCode = 404;
      return next(error);
    }

    if (!fs.existsSync(audioJob.outputPath)) {
      const error = new Error("Output file not found on server");
      error.statusCode = 404;
      return next(error);
    }

    res.download(audioJob.outputPath, `denoised-${audioJob.originalFileName}`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  denoise,
  getJobStatus,
  downloadOutput
};
