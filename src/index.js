import "./styles.css";
const { format } = require("date-fns");

let isCelsius = true;
let weatherData;

async function getLocationInfo(location) {
  try {
    document.querySelector("#loading").style.display = "block";
    //document.querySelector(".wind-icon").style.display = "block";

    if (!location) {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      location = `${latitude},${longitude}`;
    }

    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=8b91481cdf6a423f8c7113257242805&q=${location}&days=3`, { mode: "cors" });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    weatherData = {
      current: {
        location: data.location.name,
        temperature: data.current.temp_c,
        condition: data.current.condition.text,
        wind: (data.current.wind_kph / 3.6).toFixed(1),
        feelsLike: data.current.feelslike_c
      },
      forecast: [
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
      ]
    };

    fillWeatherInfo(weatherData);

  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    document.querySelector("#loading").style.display = "none";
  }
}

function fillWeatherInfo(weather) {
  document.querySelector(".current-location").textContent = weather.current.location;
  document.querySelector(".current-temperature").textContent = (weather.current.temperature).toFixed(0) + "°C";
  document.querySelector(".current-condition").textContent = weather.current.condition;
  document.querySelector(".current-wind").textContent = weather.current.wind + " m/s";
  document.querySelector(".current-feelslike").textContent = "Feels like " + (weather.current.feelsLike).toFixed(0) + "°C";

  document.querySelector(".wind-info").style.display = "flex";
  document.querySelector(".wind-icon").style.display = "block";

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

function convertTemperature(tempCelsius) {
  return (tempCelsius * 9/5) + 32;
}

function toggleTemperatureUnit() {
  isCelsius = !isCelsius;

  document.querySelector("#togglebutton").textContent = isCelsius ? "°F" : "°C";

  const currentTemp = weatherData.current.temperature;
  const feelsLikeTemp = weatherData.current.feelsLike;
  const dayOneLowTemp = weatherData.forecast[0].low;
  const dayOneHighTemp = weatherData.forecast[0].high;
  const dayTwoLowTemp = weatherData.forecast[1].low;
  const dayTwoHighTemp = weatherData.forecast[1].high;

  document.querySelector(".current-temperature").textContent = isCelsius ? currentTemp.toFixed(0) + "°C" : convertTemperature(currentTemp).toFixed(0) + "°F";
  document.querySelector(".current-feelslike").textContent = isCelsius ? "Feels like " + feelsLikeTemp.toFixed(0) + "°C" : "Feels like " + convertTemperature(feelsLikeTemp).toFixed(0) + "°F";
  document.querySelector(".day-one-temperature").textContent = isCelsius ? "Between " + dayOneLowTemp.toFixed(0) + " and " + dayOneHighTemp.toFixed(0) + "°C" : "Between " + convertTemperature(dayOneLowTemp).toFixed(0) + " and " + convertTemperature(dayOneHighTemp).toFixed(0) + "°F";
  document.querySelector(".day-two-temperature").textContent = isCelsius ? "Between " + dayTwoLowTemp.toFixed(0) + " and " + dayTwoHighTemp.toFixed(0) + "°C" : "Between " + convertTemperature(dayTwoLowTemp).toFixed(0) + " and " + convertTemperature(dayTwoHighTemp).toFixed(0) + "°F";
}

document.querySelector("#searchbutton").addEventListener("click", () => {
  const location = document.querySelector("#location").value;
  getLocationInfo(location);
  document.querySelector("#location").value = "";
});

document.querySelector("#togglebutton").addEventListener("click", toggleTemperatureUnit);

document.querySelector("#location").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const location = document.querySelector("#location").value;
    getLocationInfo(location);
    document.querySelector("#location").value = "";
  }
});

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".wind-info").style.display = "none";
  document.querySelector(".wind-icon").style.display = "none";
  getLocationInfo();
});
