const admin = require("firebase-admin");
const db = require("./db");
const air = require("./air");
const weather = require("./weather");

const sortUsersByTopic = users => {
  const topicsMap = { weather: [], air: [] };
  users.forEach(doc => {
    const { token, topics } = doc.data();
    if (topics && token) {
      topics.forEach(topic => {
        topicsMap[topic].push(token);
      });
    }
  });
  return topicsMap;
};

const send = (tokens, data) => {
  const myToken =
    "fJfDN7I-I473IAInAOmsD0:APA91bHAD6vwlHvdV_JfMVXR-k-zPj_bzFcpjUEvaU6CihwKwM16E69qpWsheyGKXBpAiSUPDpwChfYyGWTC05_8NKSe7cfS4u3k0vpHof4XHJxLVQzauLXmIJxeo3HPnqedCd6nhga-";

  const message = {
    data,
    tokens
    //tokens: [myToken]
  };

  return admin
    .messaging()
    .sendMulticast(message)
    .then(response => {
      console.log(response.successCount + " messages were sent successfully");
      return response;
    });
};

const ping = async (req, res) => {
  try {
    const handlers = { air, weather };
    await Promise.all(Object.values(handlers).map(h => h.handler()));

    const usersData = await db.getAllUsers();
    const usersSortedByTopic = sortUsersByTopic(usersData);

    const results = Object.keys(handlers).map(async type => {
      const tokens = usersSortedByTopic[type];
      const handler = handlers[type];
      const decision = await handler.makeDecision();
      if (decision && tokens.length) {
        const message = await handler.createMessage();
        await db.setLastTime(type);
        return await send(tokens, message);
      } else {
        return Promise.resolve("not now");
      }
    });

    return res.json({ results: await Promise.all(results) });
  } catch (e) {
    return console.log(e);
    //res.json(e);
  }
};

exports.ping = ping;
