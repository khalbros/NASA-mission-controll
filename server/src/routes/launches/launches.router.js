const express = require("express")
const {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpDeleteLaunches,
} = require("./launches.controller")

const launchRouter = express.Router()

launchRouter.get("/launches", httpGetAllLaunches)
launchRouter.post("/launches", httpAddNewLaunch)
launchRouter.delete("/launches/:id", httpDeleteLaunches)

module.exports = launchRouter
