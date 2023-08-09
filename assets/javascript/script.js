const weatherApi = "1354cc726d8de2a117f45eeb347ece87";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=";

async function checkWeather() {
    const response = await fetch(apiURL + '&appid=${weatherApi}');
    var data = await response.json();
    console.log(data);

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°F";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " mph";
}

checkWeather();


