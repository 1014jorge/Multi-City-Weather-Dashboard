const btnHolderEl = document.getElementById('btnHolder');


var cityLocalStorage;
const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
// API key for OpenWeatherMap API
const apiKey = "1354cc726d8de2a117f45eeb347ece87";

const createWeatherCard = (cityName, weatherItem, index) => {
    if (index === 0) {
        // HTML for the main weather card
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h6>Temperature: ${(weatherItem.main.temp)}°F</h6>
                    <h6>Wind: ${weatherItem.wind.speed} mph</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>${weatherItem.weather[0].description}</h6>
                </div>`;
    } else {
        // HTML for the other five day forecast card
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>Temp: ${(weatherItem.main.temp)}°F</h6>
                    <h6>Wind: ${weatherItem.wind.speed} mph</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
    }
}

const getWeatherDetails = (cityName, latitude, longitude) => {
    const weatherApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;

    fetch(weatherApi).then(response => response.json()).then(data => {
        // Filter the forecasts to get only one forecast per day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        // Clearing previous weather data
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        // Creating weather cards and adding them to the DOM
        fiveDaysForecast.forEach((weatherItem, index) => {
            const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!");
    });
}

const saveToLocalStorage = function (cityName) {
    //to do implement local storage step1 pull value of city name str
    var pastSearches = [];

    if (localStorage["pastSearches"]) {
        pastSearches = JSON.parse(localStorage.getItem('pastSearches'))
    }
    pastSearches.push(cityName);
    localStorage.setItem('pastSearches', JSON.stringify(pastSearches));
};
// var counter = 0
// function createButton() {
//     var btn = document.createElement (button);
//     btn.
// }

function view() {
    if (localStorage.getitem('pastSearches') === ! null) {
        pastSearches = [];
    }
    pastSearches = JSON.parse(localStorage.getItem('pastSearches'));
    for (let i = 0; i < pastSearches.length; i++) {
        var historySearch = document.createElement("button");
        historySearch.textContent = pastSearches[i];
        historySearch.setAttribute('class', 'search-btn');
        btnHolderEl.appendChild(historySearch);
    }
}
view();

function getCityCoordinates() {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    saveToLocalStorage(cityName);
    const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&units=imperial&appid=${apiKey}`;

    // Get entered city coordinates (latitude, longitude, and name) from the API response
    fetch(apiUrl).then(response => response.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const { lat, lon, name } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}



btnHolderEl.addEventListener("click", function (event) {
    cityInput.value = event.target.textContent;
    getCityCoordinates(cityInput.value);
})


searchButton.addEventListener("click", getCityCoordinates);
