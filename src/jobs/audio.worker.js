const { Worker } = require("bullmq");
const connection = require("./redis.connection");
const { processAudioJob } = require("../services/denoise.service");
const env = require("../config/env");
const logger = require("../config/logger");

const worker = new Worker(
  "audio-processing",
  async (job) => {
    logger.info(`Processing job ${job.id} of type ${job.name}`);
    await processAudioJob(job.data);
  },
  {
    connection,
    concurrency: parseInt(env.WORKER_CONCURRENCY) || 2,
  }
);

worker.on("completed", (job) => {
  logger.info(`Job ${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  logger.error(`Job ${job.id} has failed with ${err.message}`);
});

module.exports = worker;
