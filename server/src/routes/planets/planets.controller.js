const {getPlanets} = require("../../models/planets.model")

async function getAllPlanets(req, res) {
  // const planets = getPlanets()
  // console.log(planets)
  const planets = await getPlanets()
  return res.status(200).json(planets)
}

module.exports = getAllPlanets
