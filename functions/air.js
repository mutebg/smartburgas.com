const request = require("request-promise-native");
const getAirStations = () => {
  const uri =
    "http://data.sensor.community/airrohr/v1/filter/area=42.505228,27.476211,15";
  return request({ uri, json: true });
};

const values = {
  P1: 50,
  P2: 25
};

const filterPolutionTypeOfSensors = sensors => {
  const importantValueType = Object.keys(values);
  return sensors.filter(({ sensordatavalues }) => {
    return sensordatavalues.some(({ value_type }) =>
      importantValueType.includes(value_type)
    );
  });
};

const filterOutOfNormSensors = sensors => {
  return sensors.filter(({ sensordatavalues }) => {
    return sensordatavalues.some(
      ({ value_type, value }) => value > values[value_type]
    );
  });
};

const handler = (req, res) => {
  return getAirStations()
    .then(data => {
      const polutionSensors = filterPolutionTypeOfSensors(data);
      const outOfNormSensors = filterOutOfNormSensors(polutionSensors);
      return res.json(outOfNormSensors);
    })
    .catch(e => {
      return res.json("error");
    });
};

exports.handler = handler;
