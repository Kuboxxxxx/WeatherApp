const CURRENT_WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather`
const FORECAST_WEATHER_URL = "https://api.openweathermap.org/data/2.5/forecast"
const RANDOM_STRING_DONT_WORRY = "ec3ea7f59664744edd6783adde90bac7"
const ICON_URL = "http://openweathermap.org/img/w/"

const searchForm = document.getElementById("search-form")
const searchError = document.getElementById("search-error")

const searchForWeather = (event) => {
    event.preventDefault()

    const searchInput = document.getElementById("location")

    const cityName = searchInput.value

    if(!cityName){
        console.log("error")
    }
    else{
        addCityToStorage(cityName)
        renderRecentSearch()
        renderWeather(cityName)
    }
}

const toTitleCase = (inputString) => {
    const words = inputString.split(" ")
    return words.map(word => {
        let newWord = word.toLowerCase().split('')
        newWord[0] = newWord[0].toUpperCase()
        return newWord.join("")
    }).join(" ")
}

const errorHandler = (error) => {
    if(error == 404){
        searchError.innerHTML = "Enter a correct city!"
    }
    else{
        searchError.innerHTML = "Something went wrong, try again later"
    }
}

const timeConverter = (UNIX_timestamp) => {
    const a = new Date(UNIX_timestamp * 1000);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const days = [,'Mon','Tue','Wed','Thu','Fri','Sat','Sun']
    const year = a.getFullYear()
    const month = months[a.getMonth()]
    const day = days[a.getDay()]
    const date = a.getDate()
    if (date == 1){
        return `${day}, ${date}st ${month}, ${year}`
    }
    else if (date == 2){
        return `${day}, ${date}nd ${month}, ${year}`
    }
    else if (date == 3){
        return `${day}, ${date}rd ${month}, ${year}`
    }
    else{
        return `${day}, ${date}th ${month}, ${year}`
    }
}

const renderWeather = async (cityName) => {

    const location = await getLocationInfo(cityName)
    
    const {lat, lon} = location.coord

    const currentWeather = await getCurrentWeather(lat, lon)

    const currentWeatherContainer = document.getElementById("currentWeather")

    currentWeatherContainer.innerHTML = ""
    currentWeatherContainer.innerHTML += `<div class="current-card card p-3 m-1">
    <div class="d-flex justify-content-between">
        <div>
            <h4>${toTitleCase(cityName)}</h4>
            <h6>${timeConverter(currentWeather.dt)}</h6>
        </div>
        <div class="d-flex">
            <div>
                <p class="m-0">${Math.round(currentWeather.main.temp * 10)/10}°C</p>
                <p>${currentWeather.weather[0].main}</p>
            </div>
            <img src="${ICON_URL}${currentWeather.weather[0].icon}.png" alt="${currentWeather.weather[0].description}">
        </div>
    </div>
    <div>
        <ul class="list-group">
            <li class="list-group-item">Min temp: ${Math.round(currentWeather.main.temp_min * 10)/10}°C</li>
            <li class="list-group-item">Max temp: ${Math.round(currentWeather.main.temp_max * 10)/10}°C</li>
            <li class="list-group-item">Pressure: ${currentWeather.main.pressure} hPa</li>
            <li class="list-group-item">Humidity: ${currentWeather.main.humidity}%</li>
            <li class="list-group-item">Wind Speed: ${currentWeather.wind.speed} m/s</li>
        </ul>
    </div>
</div>`

    const forecast = await getWeatherForecast(lat, lon)

    let times = 5
    
    const forecastWeatherContainer = document.getElementById("forecastContainer")
    forecastWeatherContainer.innerHTML = ""

    for (let i=0; i<times; i++){
        forecastWeatherContainer.innerHTML += `
        <div class="current-card card p-3 m-1">
            <div class="d-flex justify-content-between">
                <div>
                    <h6>${timeConverter(forecast.list[i*8].dt)}</h6>
                    <div>${Math.round(forecast.list[i*8].main.temp * 10)/10}°C ${forecast.list[i*8].weather[0].main}</div>
                </div>
                <div>
                    <img src="${ICON_URL}${forecast.list[i*8].weather[0].icon}.png" alt="${forecast.list[i*8].weather[0].description}">
                </div>
            </div>
            <div>
                <ul class="list-group">
                    <li class="list-group-item">Min temp: ${Math.round(forecast.list[i*8].main.temp_min * 10)/10}°C</li>
                    <li class="list-group-item">Max temp: ${Math.round(forecast.list[i*8].main.temp_max * 10)/10}°C</li>
                    <li class="list-group-item">Pressure: ${forecast.list[i*8].main.pressure} hPa</li>
                    <li class="list-group-item">Humidity: ${forecast.list[i*8].main.humidity}%</li>
                    <li class="list-group-item">Wind Speed: ${forecast.list[i*8].wind.speed} m/s</li>
                </ul>
            </div>`
        console.log(forecast.list[i*8].dt_txt)
    }
}

const getLocationInfo = async (cityName) => {
    try {
        searchError.innerHTML = ""
        const url = `${CURRENT_WEATHER_URL}?q=${cityName}&appid=${RANDOM_STRING_DONT_WORRY}`
    
    const respone = await fetch(url)
    
    if(respone.status == 400){
        errorHandler(404)
    }
    else if(respone.status !== 200){
        errorHandler()
    }
    else{
        const data = await respone.json()
        return data
    }
    } catch (error) {
        errorHandler()
    }
}

const getCurrentWeather = async (lat, lon) => {
    try {
        const url =`${CURRENT_WEATHER_URL}?lat=${lat}&lon=${lon}&appid=${RANDOM_STRING_DONT_WORRY}&units=metric`

        const response = await fetch(url)

        if (response.status !== 200){
            errorHandler()
        }
        else{
            const data = await response.json()
            return data
        }
    } catch (error) {
        errorHandler()
    }
}

const getWeatherForecast = async (lat, lon) => {
    try {
        const url =`${FORECAST_WEATHER_URL}?lat=${lat}&lon=${lon}&appid=${RANDOM_STRING_DONT_WORRY}&units=metric`

        const response = await fetch(url)

        if (response.status !== 200){
            errorHandler()
        }
        else{
            const data = await response.json()
            return data
        }
    } catch (error) {
        errorHandler()
    }
}

const addCityToStorage = (cityName) => {
    const savedCities = JSON.parse(localStorage.getItem("cities")) || []

    if(!savedCities.includes(cityName.toLowerCase())){
        savedCities.push(cityName.toLowerCase())
    }

    localStorage.setItem("cities", JSON.stringify(savedCities))
}

const renderRecentSearch = () => {
    let cities = JSON.parse(localStorage.getItem("cities"))
    const lastSearch = document.getElementById("lastSearchContainer")
    lastSearch.innerHTML = ""

    let times = 4
    for (let i = 0;i<times; i++){
        if(cities[i] == undefined){
            break
        }
        lastSearch.innerHTML += `<a class="list-group-item list-group-item-action" id="lastSearch${i+1}">${toTitleCase(cities[i])}</a>`
    }
}

const renderWeatherOnLoad = () => {
    let cities = JSON.parse(localStorage.getItem("cities"))
    if (!cities){
        renderWeather("London")
    }
    else{
        renderWeather(toTitleCase(cities[0]))
    }
}

// const renderWeatherFromRecent = (e) => {
//     console.log("siema")
// }

window.addEventListener("load", renderRecentSearch)
window.addEventListener("load", renderWeatherOnLoad)
searchForm.addEventListener("submit", searchForWeather)

// const firstRecentSearch = document.getElementById("lastSearch1")
// const secondRecentSearch = document.getElementById("lastSearch2")
// const thirdRecentSearch = document.getElementById("lastSearch3")
// const fourthRecentSearch = document.getElementById("lastSearch4")

// firstRecentSearch.addEventListener("click", renderWeatherFromRecent)
// secondRecentSearch.addEventListener("click", renderWeatherFromRecent)
// thirdRecentSearch.addEventListener("click", renderWeatherFromRecent)
// fourthRecentSearch.addEventListener("click", renderWeatherFromRecent)
