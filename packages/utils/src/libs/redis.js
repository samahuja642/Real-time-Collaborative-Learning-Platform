const Redis = require("ioredis");

const createRedisClient = (host,port,password) => {
    const client = new Redis({
        host,
        port,
        password,
        maxRetriesPerRequest: null, // important for socket.io
        enableReadyCheck: false,
    });
    client.on("connect",() => console.log('Redis Connected Successfully.'));
    client.on("error",(err) => console.log('Redis error',err));
    return client;
}

module.exports = { createRedisClient };
