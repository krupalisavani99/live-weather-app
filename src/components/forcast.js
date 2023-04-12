import React, { useState, useEffect } from "react";
import axios from "axios";
import apiKeys from "../apiKeys";

function Forcast(props) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});

  const search = (city) => {
    axios
      .get(
        `${apiKeys.base}weather?q=${
          city != "[object Object]" ? city : query
        }&units=metric&APPID=${apiKeys.key}`
      )
      .then((response) => {
        setWeather(response.data);
        setQuery("");
      })
      .catch(function (error) {
        console.log(error);
        setWeather("");
        setQuery("");
        setError({ message: "Not Found", query: query });
      });
  };

  useEffect(() => {
    search("Delhi");
  }, []);

  return (
    <div className="forecast">
      <div className="d-flex justify-content-center search-box">
        <input
          type="text"
          className="form-control search-bar"
          placeholder="Search any city"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />{" "}
        <img
          src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
          onClick={search}
          alt="search"
          className="search-icon"
        />
      </div>

      {typeof weather.main != "undefined" ? (
        <div className=" flex-column mb-3">
          <div className="d-flex justify-content-center p-2">
            <p>
              {weather.name}, {weather.sys.country}
            </p>
            <img
              className="temp"
              alt="weather-icon"
              style={{ marginTop: "-12px" }}
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            />
          </div>
          <div className="d-flex justify-content-between p-2">
            {" "}
            Temperature{" "}
            <span className="temp">
              {Math.round(weather.main.temp)}°c ({weather.weather[0].main})
            </span>
          </div>
          <div className="d-flex justify-content-between p-2">
            Humidity{" "}
            <span className="temp">{Math.round(weather.main.humidity)}%</span>
          </div>
          <div className="d-flex justify-content-between p-2">
            Visibility{" "}
            <span className="temp">{Math.round(weather.visibility)} mi</span>
          </div>
          <div className="d-flex justify-content-between p-2">
            Wind Speed{" "}
            <span className="temp">{Math.round(weather.wind.speed)} Km/h</span>
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-between p-2">
          {error.query} {error.message}
        </div>
      )}
    </div>
  );
}
export default Forcast;
