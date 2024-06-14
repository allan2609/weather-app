import "./styles.css";
import Weather from "./Weather.js";
const { format } = require("date-fns");

async function getLocationInfo(location = "Pärnu") {

  try {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=8b91481cdf6a423f8c7113257242805&q=${location}&days=3`, { mode: "cors" });
    
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    
    const data = await response.json();

    const currentWeather = {
      location: data.location.name,
      temperature: data.current.temp_c,
      condition: data.current.condition.text,
      wind: (data.current.wind_kph / 3.6).toFixed(1),
      feelsLike: data.current.feelslike_c
    };

    const forecastWeather = [
      {
        day: 1,
        date: data.forecast.forecastday[1].date,
        low: data.forecast.forecastday[1].day.mintemp_c,
        high: data.forecast.forecastday[1].day.maxtemp_c,
        condition: data.forecast.forecastday[1].day.condition.text
      },
      {
        day: 2,
        date: data.forecast.forecastday[2].date,
        low: data.forecast.forecastday[2].day.mintemp_c,
        high: data.forecast.forecastday[2].day.maxtemp_c,
        condition: data.forecast.forecastday[2].day.condition.text
      }
    ];

    const weather = new Weather(currentWeather, forecastWeather);
    
    console.log(weather);
    fillWeatherInfo(weather);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function fillWeatherInfo(weather) {
  document.querySelector(".current-location").textContent = weather.current.location;
  document.querySelector(".current-temperature").textContent = weather.current.temperature + "°C";
  document.querySelector(".current-condition").textContent = weather.current.condition;
  document.querySelector(".current-wind").textContent = weather.current.wind + " m/s";
  document.querySelector(".current-feelslike").textContent = "Feels like " + weather.current.feelsLike + "°C";

  const dateOneValue = weather.forecast[0].date;
  const dateOneFormatted = format(dateOneValue, "eeee");
  const dateTwoValue = weather.forecast[1].date;
  const dateTwoFormatted = format(dateTwoValue, "eeee");
  document.querySelector(".day-one").textContent = dateOneFormatted;
  document.querySelector(".day-two").textContent = dateTwoFormatted;

  document.querySelector(".day-one-temperature").textContent = "Between " + (weather.forecast[0].low).toFixed(0) + " and " + (weather.forecast[0].high).toFixed(0) + "°C";
  document.querySelector(".day-one-condition").textContent = weather.forecast[0].condition;
  document.querySelector(".day-two-temperature").textContent = "Between " + (weather.forecast[1].low).toFixed(0) + " and " + (weather.forecast[1].high).toFixed(0) + "°C";
  document.querySelector(".day-two-condition").textContent = weather.forecast[1].condition;
}

document.querySelector("#searchbutton").addEventListener("click", () => {
  const location = document.querySelector("#location").value;
  getLocationInfo(location);
});

getLocationInfo();
