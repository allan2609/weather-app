import "./styles.css";
import Weather from "./Weather.js";

async function getLocationInfo(location = "Pärnu") {

  try {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=8b91481cdf6a423f8c7113257242805&q=${location}&days=3`, { mode: "cors" });
    
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    
    const data = await response.json();

    const currentWeather = {
      temperature: data.current.temp_c,
      condition: data.current.condition.text,
      wind: data.current.wind_kph / 3.6,
      feelsLike: data.current.feelslike_c
    };

    const forecastWeather = [
      {
        day: 1,
        low: data.forecast.forecastday[1].day.mintemp_c,
        high: data.forecast.forecastday[1].day.maxtemp_c,
        condition: data.forecast.forecastday[1].day.condition.text
      },
      {
        day: 2,
        low: data.forecast.forecastday[2].day.mintemp_c,
        high: data.forecast.forecastday[2].day.maxtemp_c,
        condition: data.forecast.forecastday[2].day.condition.text
      }
    ];

    const weather = new Weather(currentWeather, forecastWeather);
    
    console.log(weather);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

document.querySelector("#searchbutton").addEventListener("click", () => {
  const location = document.querySelector("#location").value;
  getLocationInfo(location);
});

getLocationInfo();
