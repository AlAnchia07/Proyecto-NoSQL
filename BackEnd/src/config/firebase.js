const admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");

const serviceAccount = require("./techshop-ef0e8-firebase-adminsdk-fbsvc-e4c192224d.json");

admin.initializeApp({
    credential: admin.cert(serviceAccount)
});

const storage = new Storage({
    credentials: serviceAccount
});

const bucket = storage.bucket("techshop-ef0e8.firebasestorage.app");

module.exports = bucket;

