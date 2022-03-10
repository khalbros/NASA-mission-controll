const getPagination = require("../../../services/query")
const {
  getLaunches,
  addNewLaunch,
  existLaunch,
  deleteLaunch,
} = require("../../models/launches.model")

async function httpGetAllLaunches(req, res) {
  const {skip, limit} = getPagination(req.query)
  const launches = await getLaunches(skip, limit)
  return res.status(200).json(launches)
}
async function httpDeleteLaunches(req, res) {
  const launchID = Number(req.params.id)
  const existed = await existLaunch(launchID)
  if (!existed) {
    return res.status(404).json({
      Error: "Launch not found",
    })
  }
  const aborted = await deleteLaunch(launchID)
  return res.status(200).json(aborted)
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({Error: "Some values are missing"})
  }
  launch.launchDate = new Date(launch.launchDate)
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({Error: "Invalid date"})
  }
  await addNewLaunch(launch)
  res.status(201).json(launch)
}

module.exports = {httpGetAllLaunches, httpAddNewLaunch, httpDeleteLaunches}
