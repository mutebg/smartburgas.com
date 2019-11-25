const request = require("request-promise-native");
const _ = require("lodash");
const db = require("./db");

const getWeather = () => {
  const apiKey = functions.config().apikey.darksky;
  const coord = "42.504553, 27.471796"; // Burgas
  //const coord = "44.499557, 11.343360"; // Alpies for testing
  const exclude = "currently,minutely,hourly,daily,flags";
  const uri = `https://api.darksky.net/forecast/${apiKey}/${coord}?lang=bg&exclude=${exclude}`;
  return request({ uri, json: true });
};

const getAlerts = forecast => {
  return _.get(forecast, "alerts", []);
};

const handler = async () => {
  try {
    const weatherData = await getWeather();
    const alerts = getAlerts(weatherData);
    const result = {
      lastTime: Date.now(),
      alerts: alerts.length,
      message: _.get(alerts, "0.title", "")
    };
    await db.addRecord("weather", result);
    return true;
  } catch (e) {
    return false;
  }
};

const makeDecision = async () => {
  const [[record], { time }] = await Promise.all([
    db.getLastRecords("weather"),
    db.getLastTime("weather")
  ]);
  console.log(record, time);
  const hoursDiff = 6 * 60 * 60 * 1000;
  //More that 6 hours and record is poluted
  if (record.alerts > 0 && Date.now() - time > hoursDiff) {
    return true;
  }
  return false;
};

const createMessage = async () => {
  // TODO: query DB and generate the message
  return Promise.resolve({
    title: "Прогноза за времето",
    body: "Прогноза за лошо време в следващите часове",
    type: "weather"
  });
};

exports.handler = handler;
exports.makeDecision = makeDecision;
exports.createMessage = createMessage;
