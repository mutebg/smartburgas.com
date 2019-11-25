const admin = require("firebase-admin");
const db = admin.firestore();

const addRecord = (type, data) =>
  db.collection(`alerts`).add(Object.assign(data, { type }));

const getLastRecords = (type = "air", limit = 1) =>
  db
    .collection(`alerts`)
    .where("type", "==", type)
    .orderBy("lastTime", "desc")
    .limit(limit)
    .get()
    .then(snapshot => {
      const data = [];
      snapshot.forEach(doc => {
        data.push(doc.data());
      });
      return data;
    });

const getLastTime = type =>
  db
    .collection("time")
    .doc(type)
    .get()
    .then(doc => doc.data());

const setLastTime = type =>
  db
    .collection("time")
    .doc(type)
    .set({ time: Date.now() });

const getAllUsers = () => db.collection("users").get();

exports.getAllUsers = getAllUsers;
exports.addRecord = addRecord;
exports.getLastRecords = getLastRecords;
exports.getLastTime = getLastTime;
exports.setLastTime = setLastTime;
