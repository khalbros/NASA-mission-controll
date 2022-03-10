const launches = require("./launches.mongo")
const planets = require("./planets.mongo")
const axios = require("axios")

const DefualtFlightNumber = 100
const SPACEX_API = "https://api.spacexdata.com/v4/launches/query"

async function getLaunches(skip, limit) {
  return await launches
    .find({}, {__v: 0})
    .sort({flightNumber: 1})
    .skip(skip)
    .limit(limit)
}

async function populateLaunches(params) {
  const response = await axios.post(SPACEX_API, {
    query: {},
    options: {
      // pagination: false,
      limit: 50,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  })
  const launchDocs = response.data.docs
  for (const launchDoc of launchDocs) {
    const customers = launchDoc["payloads"].flatMap(
      (payload) => payload.customers
    )
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    }
    console.log(
      `${launch.flightNumber} = ${launch.mission} - ${launch.rocket} - ${launch.customers}`
    )
    await saveLaunches(launch)
  }
}

async function loadLaunches() {
  console.log("Downloading Launches....")
  const firstlaunch = await findLaunch({
    flightNumber: 1,
    mission: "Falcon 1",
    rocket: "FalconSat",
  })
  if (firstlaunch) {
    console.log("Launches Already exist")
  } else {
    await populateLaunches()
  }
}

async function saveLaunches(launch) {
  await launches.findOneAndUpdate({flightNumber: launch.flightNumber}, launch, {
    upsert: true,
  })
}

async function getLatestFlightNumber() {
  const lastFlightNumber = await launches.findOne().sort("-flightNumber")
  if (!lastFlightNumber) {
    return DefualtFlightNumber
  }
  return lastFlightNumber.flightNumber
}

async function addNewLaunch(launch) {
  const planet = await planets.findOne({keplerName: launch.target})
  if (!planet) {
    throw new Error("Invalide Planet")
  }
  const latestFlightNumber = await getLatestFlightNumber()
  const newLaunch = Object.assign(launch, {
    flightNumber: Number(latestFlightNumber) + 1,
    success: true,
    upcoming: true,
    customers: ["ZTM", "NASA"],
  })
  await saveLaunches(newLaunch)
}

async function findLaunch(filterID) {
  return await launches.findOne(filterID)
}
async function existLaunch(id) {
  return await findLaunch({flightNumber: id})
}

async function deleteLaunch(id) {
  const aborted = await launches.updateOne(
    {flightNumber: id},
    {upcoming: false, success: false}
  )
  return aborted
}

module.exports = {
  launches,
  getLaunches,
  loadLaunches,
  addNewLaunch,
  existLaunch,
  deleteLaunch,
}
