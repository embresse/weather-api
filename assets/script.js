// Get HTML elements with querySelectors
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

// API key and base URL stored in variables
const apiKey = "90bdacb6c43ad76dbce6067c9a3a966e";
const baseUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=imperial&q=`;

// event listener to handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const city = userInput.value;
  getWeather(city);
// runs getWeather(city) function when search is submitted
  userInput.value = "";
//   userInput will be a string, set up as empty string
});

// Get weather data from API
async function getWeather(city) {
  try {
    const response = await fetch(baseUrl + city);
    // fetch will use the baseURL and city variables to get local weather from weatherapi
    const data = await response.json();
    renderWeather(data);
    // then renders weather to page with data that was retrieved

    // Save recent search to local storage
    const recentSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    recentSearches.unshift(data.city.name);
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  } catch (error) {
    console.error(error);
  }
}

// Display/renders weather data
function renderWeather(data) {
  // Display current weather once search is submitted through event listener that activated getWeather function
  const current = data.list[0];
  const iconUrl = `http://openweathermap.org/img/w/${current.weather[0].icon}.png`;
  //sets up icons used for weather forecast
  const date = dayjs(current.dt_txt).format("dddd, MMMM D, YYYY");
  //   sets up date structure with dayjs
  const time = dayjs(current.dt_txt).format("h:mm A");
  currentDay.textContent = `As of ${time} on ${date}`;
  currentCity.textContent = `${data.city.name}, ${data.city.country}`;
  //lists city and country - after search is submitted in currentCity
  currentDate.textContent = date;
  //   displays date
  currentIcon.setAttribute("src", iconUrl);
  //math.round to round temp and wind mph to nearest integer
  currentTemp.textContent = `Temp: ${Math.round(current.main.temp)}ºF`;
  currentWind.textContent = `Wind: ${Math.round(current.wind.speed)} MPH`;
  currentHumidity.textContent = `Humidity: ${current.main.humidity}%`;

  // Display 5-day forecast
  //for loop sets up 5 day forecast
  for (let i = 1; i < 6; i++) {
    const forecast = data.list[i * 8 - 1];
    const forecastCard = forecastCards[i - 1];
    const forecastDate = dayjs(forecast.dt_txt).format("ddd, M/D");
    // sets up date structure for forecastDate with dayjs
    const forecastIconUrl = `http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    forecastCard.querySelector(".date").textContent = forecastDate;
    forecastCard.querySelector(".icon").setAttribute("src", forecastIconUrl);
    // use math.round to round numbers to nearest integer
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

  // Display recent searches - shows 5 recent cities searched
  const recentSearchesContainer = document.querySelector("#recentSearches");
  const recentSearches =
    JSON.parse(localStorage.getItem("recentSearches")) || [];
  recentSearchesContainer.innerHTML = ""; // clear the container first
  const maxRecentSearches = 5; // set the maximum number of recent searches to display
  for (let i = 0; i < Math.min(recentSearches.length, maxRecentSearches); i++) {
    // math.min func stop loop  if recent searches is < 5 OR if max searches is met
    const recentSearch = document.createElement("div");
    // creates new div for recent search
    recentSearch.classList.add("recent-search");
    // adds class to new div element
    recentSearch.textContent = recentSearches[i];
    recentSearch.addEventListener("click", function () {
      getWeather(recentSearches[i]);
    });
    // event listener that will allow user to click on cities in div element to revisit recent weather searches
    // reruns getWeather() function
    recentSearchesContainer.appendChild(recentSearch);
    // appends recent city to #recentSearches container
  }

  // Show forecast cards, css set to display none, this allows cards to show once search is made
  forecastCards.forEach((card) => (card.style.display = "block"));
}
