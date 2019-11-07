const request = require("request-promise-native");
const _ = require("lodash");

const getWeather = () => {
  const apiKey = "";
  const coord = "44.499557, 11.343360";
  const exclude = "currently,minutely,hourly,daily,flags";
  const uri = `https://api.darksky.net/forecast/${apiKey}/${coord}?lang=bg&exclude=${exclude}`;
  return request({ uri, json: true });
};

const getAlerts = forecast => {
  return _.get(forecast, "alerts", []);
};

const handler = (req, res) => {
  return getWeather()
    .then(data => {
      const alerts = getAlerts(data);
      return res.json(alerts);
    })
    .catch(e => {
      return res.json("error");
    });
};

exports.handler = handler;
