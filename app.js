let wrapper = document.querySelector(".wrapper"),
  inputPart = wrapper.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  wIcon = document.querySelector(".weather-part img"),
  arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", (e) => {
  //if user pressed enter btn and input value is not empty
  if (e.key == "Enter" && inputField.value != "") {
    // console.log(e.target.value);
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click", () => {
  //Geolocation API is used to get the geographical position of a user
  if (navigator.geolocation) {
    // if browser support geolocation api
    navigator.geolocation.getCurrentPosition(onSuccess, onError); //if getCurrentPosition is worked then onSuccess function called
  } else {
    alert("Your browser does not support geolocation api");
  }
});
function onSuccess(position) {
  // console.log(position);
  let { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=89defab4072303c565a9bf452b2443f1`;
  fetchData();
}

function onError(error) {
  // console.log(error);
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

function requestApi(city) {
  // console.log(city);
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=89defab4072303c565a9bf452b2443f1`;
  fetchData();
}

function fetchData() {
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");
  fetch(api)
    .then((response) => response.json())
    .then((result) => weatherDetails(result));
}
function weatherDetails(info) {
  infoTxt.classList.replace("pending", "error");
  if (info.cod == "404") {
    infoTxt.innerText = `${inputField.value} isn't a valid city name`;
  } else {
    //get required properties value from info object
    let city = info.name;
    let country = info.sys.country;
    let { description, id } = info.weather[0];
    let { feels_like, humidity, temp } = info.main;

    //https://openweathermap.org/weather-conditions
    //using  custom icon according to the id which api return us
    if (id == 800) {
      wIcon.src = "./images/clear.svg";
    } else if (id >= 200 && id <= 232) {
      wIcon = ".images/storm.svg";
    } else if (id >= 500 && id <= 531) {
      wIcon = ".images/rain.svg";
    } else if (id >= 600 && id <= 622) {
      wIcon = ".images/snow.svg";
    } else if (id >= 701 && id <= 781) {
      wIcon = ".images/haze.svg";
    } else if (id >= 801 && id <= 804) {
      wIcon = ".images/cloud.svg";
    }

    //pass these values to a particular html element
    wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
    wrapper.querySelector(".weather").innerText = description;
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
    wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

    infoTxt.classList.remove("pending", "error");
    wrapper.classList.add("active");
    console.log(info);
  }
}

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
