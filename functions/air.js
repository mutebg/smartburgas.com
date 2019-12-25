const request = require("request-promise-native");
const db = require("./db");

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

const handler = async () => {
  try {
    const data = await getAirStations();
    const polutionSensors = filterPolutionTypeOfSensors(data);
    const outOfNormSensors = filterOutOfNormSensors(polutionSensors);

    const result = {
      lastTime: Date.now(),
      politedSensors: outOfNormSensors.length
    };
    await db.addRecord("air", result);
    return true;
  } catch (e) {
    return false;
  }
};

const makeDecision = async () => {
  const [[record], { time }] = await Promise.all([
    db.getLastRecords("air"),
    db.getLastTime("air")
  ]);
  const hoursDiff = 8 * 60 * 60 * 1000;
  //More that 6 hours and record is poluted
  if (record.politedSensors > 0 && Date.now() - time > hoursDiff) {
    return true;
  }
  return false;
};

const createMessage = async () => {
  // TODO: query DB and generate the message
  return Promise.resolve({
    title: "Качество на въздуха",
    body: "Замърсяване над допустимите стойности",
    type: "air"
  });
};

exports.handler = handler;
exports.makeDecision = makeDecision;
exports.createMessage = createMessage;
