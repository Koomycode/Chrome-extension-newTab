// Pictures API "https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature"

// Weather API `https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${}&lon=${}&units=${}`

// ---- Variables
const timeEl = document.getElementById("time")
const dateEl = document.getElementById("date")

const weatherIcon = document.getElementById("weather-icon")
const weatherName = document.getElementById("weather-name")
const tempEl = document.getElementById("temp")

const searchForm = document.getElementById("search-form")
const searchInput = document.getElementById("search-input")

const imageAuthor = document.getElementById("image-author")
const bgImg = document.getElementById("bg-img")

// ---- Get Image from unsplash API
async function fetchImages() {
  const res = await fetch(
    "https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature"
  )

  const data = await res.json()

  const image = data.urls.regular
  const name = data.user.name

  renderImage(image, name)
}

fetchImages()

// ---- Render Image and Author
function renderImage(img, auth) {
  imageAuthor.textContent = `Image taken by: ${auth}`
  bgImg.src = img
}

// ---- Get Time & Date
function getCurrentTimeDate() {
  let currentDate = new Date()

  let dateOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  }

  let timeOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }

  let timeString = currentDate.toLocaleTimeString("en-US", timeOptions)
  let dateString = currentDate.toLocaleDateString("en-US", dateOptions)

  return [timeString, dateString]
}

// ---- Render Time & Date
function renderDate() {
  let timeString = getCurrentTimeDate()[0]
  let dateString = getCurrentTimeDate()[1]

  timeEl.textContent = timeString
  dateEl.textContent = dateString
}

// ---- Update time & Date every second
renderDate()
setInterval(renderDate, 1000)

// ---- Get Coordinates
function getCoordinates() {
  navigator.geolocation.getCurrentPosition((pos) => {
    const longitude = pos.coords.longitude
    const latitude = pos.coords.latitude

    fetchWeather(longitude, latitude)
  })
}

// ---- Update Weather every minute
getCoordinates()
setInterval(getCoordinates, 60000)

// ---- Fetch Weather with Coords
async function fetchWeather(long, lat) {
  const res = await fetch(
    `https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${lat}&lon=${long}&units=metric`
  )

  const data = await res.json()

  const temprature = Math.floor(data.main.temp)

  renderWeather(temprature, data.weather[0])
}

// ---- Render Fetched Weather
function renderWeather(temp, weatherObject) {
  let dayIcons = [
    "Clear-sky-day.png",
    "Clouds-day.png",
    "Rain-day.png",
    "Drizzle.png",
    "Fog.png",
    "Dust.png",
    "Thunderstorm.png",
  ]

  let nightIcons = [
    "Clear-sky-night.png",
    "Clouds-night.png",
    "Rain-night.png",
    "Drizzle.png",
    "Fog.png",
    "Dust.png",
    "Thunderstorm.png",
  ]

  tempEl.textContent = `${temp}`

  let objectMain = weatherObject.main
  let objectIcon = weatherObject.icon

  let description = weatherObject.description
  let icon = ""

  if (objectIcon.includes("d")) {
    const iconToShow = dayIcons.filter((item) => {
      return item.includes(objectMain)
    })[0]

    icon = iconToShow
  } else if (objectIcon.includes("n")) {
    const iconToShow = nightIcons.filter((item) => {
      return item.includes(objectMain)
    })[0]

    icon = iconToShow
  }

  weatherName.textContent = description
  weatherIcon.src = `img/${icon}`
}

// ---- Make the Form submit a google search
searchForm.addEventListener("submit", function (e) {
  e.preventDefault()
  performSearch()
})

searchInput.addEventListener("keydown", function(e) {
  if (e.keyCode === 13 ) {
    e.preventDefault()
    performSearch()
  }
})

function performSearch() {
  // Get user search query
  const searchQuery = searchInput.value

  // Construct Google search URL
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    searchQuery
  )}`

  // Redirect the user to the Google search results page
  window.location.href = googleSearchUrl
}
