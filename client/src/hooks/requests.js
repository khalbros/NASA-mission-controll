// Load planets and return as JSON.
async function httpGetPlanets() {
  const response = await fetch("http://localhost:4000/planets")
  const planets = await response.json()
  console.log(planets)
  return planets
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch("http://localhost:4000/launches")
  const launches = await response.json()
  return launches.sort((a, b) => a.flightNumber - b.flightNumber)
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return await fetch("http://localhost:4000/launches", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    })
  } catch (error) {
    return {ok: false}
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await fetch("http://localhost:4000/launches/" + id, {
      method: "delete",
    })
  } catch (error) {
    return {ok: false}
  }
}

export {httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch}
