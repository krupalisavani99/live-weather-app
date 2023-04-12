import React from "react";
import apiKeys from "../apiKeys";
import Clock from "react-live-clock";
import Forcast from "./forcast";
import loader from "../images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";

const dateBuilder = (d) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};
const defaults = {
  color: "white",
  size: 112,
  animate: true,
};
class Weather extends React.Component {
  state = {
    lat: undefined,
    lon: undefined,
    errorMessage: undefined,
    temperatureC: undefined,
    temperatureF: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    icon: "CLEAR_DAY",
    sunrise: undefined,
    sunset: undefined,
    errorMsg: undefined,
  };

  componentDidMount() {
    if (navigator.geolocation) {
      this.getPosition()
        //If user allow location service then will fetch data & send it to get-weather function.
        .then((position) => {
          this.getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch((err) => {
          //If user denied location service then standard location weather will le shown on basis of latitude & latitude.
          this.getWeather(28.67, 77.22);
          alert(
            "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real time weather."
          );
        });
    } else {
      alert("Geolocation not available");
    }

    this.timerID = setInterval(
      () => this.getWeather(this.state.lat, this.state.lon),
      600000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  // tick = () => {
  //   this.getPosition()
  //   .then((position) => {
  //     this.getWeather(position.coords.latitude, position.coords.longitude)
  //   })
  //   .catch((err) => {
  //     this.setState({ errorMessage: err.message });
  //   });
  // }

  getPosition = (options) => {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };
  getWeather = async (lat, lon) => {
    const api_call = await fetch(
      `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
    );
    const data = await api_call.json();
    this.setState({
      lat: lat,
      lon: lon,
      city: data.name,
      temperatureC: Math.round(data.main.temp),
      temperatureF: Math.round(data.main.temp * 1.8 + 32),
      humidity: data.main.humidity,
      main: data.weather[0].main,
      country: data.sys.country,
      // sunrise: this.getTimeFromUnixTimeStamp(data.sys.sunrise),

      // sunset: this.getTimeFromUnixTimeStamp(data.sys.sunset),
    });
    switch (this.state.main) {
      case "Haze":
        this.setState({ icon: "CLEAR_DAY" });
        break;
      case "Clouds":
        this.setState({ icon: "CLOUDY" });
        break;
      case "Rain":
        this.setState({ icon: "RAIN" });
        break;
      case "Snow":
        this.setState({ icon: "SNOW" });
        break;
      case "Dust":
        this.setState({ icon: "WIND" });
        break;
      case "Drizzle":
        this.setState({ icon: "SLEET" });
        break;
      case "Fog":
        this.setState({ icon: "FOG" });
        break;
      case "Smoke":
        this.setState({ icon: "FOG" });
        break;
      case "Tornado":
        this.setState({ icon: "WIND" });
        break;
      default:
        this.setState({ icon: "CLEAR_DAY" });
    }
  };

  render() {
    if (this.state.temperatureC) {
      return (
        <div className="container mt-5 pt-5 d-flex justify-content-center">
          <div className="row  w-75 shadow-lg p-3 mb-5 bg-body-tertiary rounded">
            <div className="col-7 col-7 shadow-lg left-container">
              <div class="d-flex flex-column mb-3">
                <div class="mb-auto p-2">
                  <div className="fs-1 d-flex justify-content-between p-3">
                    <div className="d-inline-block temperature">
                      {this.state.temperatureC}°C
                    </div>
                    <div className="d-inline fs-1 fw-bold">
                      {this.state.city}
                      {/* <h3>{this.state.country}</h3> */}
                    </div>

                    {/* <span className="slash">/</span>
                {this.state.temperatureF} &deg;F */}
                  </div>
                </div>
                <div class="p-2">
                  <div className="weather">
                    <div className=" mb-icon">
                      {" "}
                      <ReactAnimatedWeather
                        icon={this.state.icon}
                        color={defaults.color}
                        size={defaults.size}
                        animate={defaults.animate}
                      />
                      <div className="fs-3">{this.state.main}</div>
                    </div>
                  </div>
                </div>
                <div class="mt-5 p-2 pt-4">
                  {" "}
                  <div className="date-time">
                    <div className="current-time">
                      <Clock format="HH:mm:ss" interval={1000} ticking={true} />
                    </div>
                    <div className="current-date">
                      {dateBuilder(new Date())}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-5 mb-auto mt-auto">
              {" "}
              <Forcast icon={this.state.icon} weather={this.state.main} />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container mt-5 w-50 justify-content-center">
          <img
            src={loader}
            alt="loader"
            style={{ width: "50%", WebkitUserDrag: "none" }}
          />
          <h3 style={{ fontSize: "22px", fontWeight: "600" }}>
            Detecting your location
          </h3>
          <h3 style={{ marginTop: "10px" }}>
            Your current location wil be displayed on the App <br></br> & used
            for calculating Real time weather.
          </h3>
        </div>
      );
    }
  }
}

export default Weather;
