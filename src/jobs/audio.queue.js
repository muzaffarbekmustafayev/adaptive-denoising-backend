const { Queue } = require("bullmq");
const connection = require("./redis.connection");

const audioQueue = new Queue("audio-processing", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

const addAudioJob = async (data) => {
  try {
    const client = await audioQueue.client;
    if (client.status !== "ready") {
      throw new Error("Redis is not ready. Background processing unavailable.");
    }
    return await audioQueue.add("denoise", data);
  } catch (error) {
    // If Redis fails, we can either throw or implement a fallback
    throw error;
  }
};

module.exports = { audioQueue, addAudioJob };
