const { createRedisClient } = require("@repo/utils");

const redis = createRedisClient(process.env.REDIS_HOST,process.env.REDIS_PORT,process.env.REDIS_PASSWORD);
module.exports = {
    redis
}