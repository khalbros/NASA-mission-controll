const fs = require("fs")
const path = require("path")
const {parse} = require("csv-parse")
const planetSchema = require("./planets.mongo")

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  )
}

async function loadPlanets() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "..", "..", "data", "kepler.csv"))
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          await savePlanet(data)
        }
      })
      .on("error", (error) => {
        console.log(error)
        reject()
      })
      .on("end", async () => {
        const planetCount = (await getPlanets()).length
        console.log(planetCount + " Habitable Planets Found")
        resolve()
      })
  })
}

async function getPlanets() {
  return await planetSchema.find({})
}

async function savePlanet(data) {
  try {
    await planetSchema.updateOne(
      {keplerName: data.kepler_name},
      {keplerName: data.kepler_name},
      {upsert: true}
    )
  } catch (error) {
    console.error(`Could not save ${error}`)
  }
}

module.exports = {loadPlanets, getPlanets}
