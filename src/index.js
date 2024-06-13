import "./styles.css";

async function getTemperature(searchTerm = "Pärnu") {

  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=8b91481cdf6a423f8c7113257242805&q=${searchTerm}`, { mode: "cors" });
    
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    
    const data = await response.json();
    
    console.log(`Current temperature in ${searchTerm} is ` + data.current.temp_c + "C");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

getTemperature();
