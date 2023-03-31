// Get HTML elements
const form = document.querySelector("#form");
const userInput = document.querySelector("#userInput");
const currentDay = document.querySelector("#currentDay");
const currentCity = document.querySelector("#currentCity");
const currentDate = document.querySelector("#currentDate");
const currentIcon = document.querySelector("#currentIcon");
const currentTemp = document.querySelector("#currentTemp");
const currentWind = document.querySelector("#currentWind");
const currentHumidity = document.querySelector("#currentHumidity");
const recentSearchesContainer = document.querySelector("#recentSearches");
const forecastCards = document.querySelectorAll(".forecast-card");

// APIs w base URL
const apiKey = "90bdacb6c43ad76dbce6067c9a3a966e";
const baseUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=imperial&q=`;

// event listener to handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const city = userInput.value;
  getWeather(city);
  userInput.value = "";
});

// Get weather data from API
async function getWeather(city) {
  try {
    const response = await fetch(baseUrl + city);
    const data = await response.json();
    renderWeather(data);

    // Save recent search to local storage
    const recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    recentSearches.unshift(data.city.name);
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  } catch (error) {
    console.error(error);
  }
}

// Display/renders weather data
function renderWeather(data) {
  // Display current weather
  const current = data.list[0];
  const iconUrl = `http://openweathermap.org/img/w/${current.weather[0].icon}.png`;
  const date = dayjs(current.dt_txt).format("dddd, MMMM D, YYYY");
  const time = dayjs(current.dt_txt).format("h:mm A");
  currentDay.textContent = `As of ${time} on ${date}`;
  currentCity.textContent = `${data.city.name}, ${data.city.country}`;
  currentDate.textContent = date;
  currentIcon.setAttribute("src", iconUrl);
  currentTemp.textContent = `Temp: ${Math.round(current.main.temp)}ºF`;
  currentWind.textContent = `Wind: ${Math.round(current.wind.speed)} MPH`;
  currentHumidity.textContent = `Humidity: ${current.main.humidity}%`;

  // Display 5-day forecast
  for (let i = 1; i < 6; i++) {
    const forecast = data.list[i * 8 - 1];
    const forecastCard = forecastCards[i - 1];
    const forecastDate = dayjs(forecast.dt_txt).format("ddd, M/D");
    const forecastIconUrl = `http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    forecastCard.querySelector(".date").textContent = forecastDate;
    forecastCard.querySelector(".icon").setAttribute("src", forecastIconUrl);
    forecastCard.querySelector("#temp" + i).textContent = `Temp: ${Math.round(
      forecast.main.temp
    )}ºF`;
    forecastCard.querySelector("#wind" + i).textContent = `Wind: ${Math.round(
      forecast.wind.speed
    )} MPH`;
    forecastCard.querySelector(
      "#humidity" + i
    ).textContent = `Humidity: ${forecast.main.humidity}%`;
  }

  // Display recent searches 
  const recentSearches =
    JSON.parse(localStorage.getItem("recentSearches")) || [];
  for (let i = 0; i < recentSearches.length; i++) {
    const recentSearch = document.createElement("div");
    recentSearch.classList.add("recent-search");
    recentSearch.textContent = recentSearches[i];
    recentSearch.addEventListener("click", function () {
      getWeather(recentSearches[i]);
    });
    recentSearchesContainer.appendChild(recentSearch);
  }

     // Show forecast cards
     forecastCards.forEach(card => card.style.display = "block");
}
