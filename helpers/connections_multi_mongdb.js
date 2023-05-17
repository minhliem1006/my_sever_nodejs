const mongoose = require('mongoose');
require('dotenv').config();
function newConnection(uri) {
    const conn = mongoose.createConnection(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    conn.on('connected', function () {
        console.log(`mongodb:::connected:::${this.name}`);
    });

    conn.on('disconnected', function () {
        console.log(`mongodb:::disconnected:::${this.name}`);
    });

    conn.on('error', function (error) {
        console.log(`mongodb:: error:::${JSON.stringify(error)}`);
    })
    return conn;
}

//make connect db test

const testConnection = newConnection(process.env.URI_MONGODB_TEST);
const userConnection = newConnection(process.env.URI_MONGODB_USER);
module.exports = {
    testConnection,
    userConnection
}