const mongoose = require("mongoose")

const DB_URL = process.env.DB_URL

const LocalDB_URL = "mongodb://localhost:27017/nasaProject"

mongoose.connection.once("open", () => console.log("DataBase Connected"))

mongoose.connection.on("error", (err) => console.error(`Connection ${err}`))

async function mongoConnect() {
  mongoose.connect(LocalDB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}
async function mongoDisconnect() {
  mongoose.disconnect()
}

module.exports = {mongoConnect, mongoDisconnect}
