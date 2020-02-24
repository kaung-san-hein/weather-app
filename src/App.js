import React, { Component } from "react";
import "./App.css";
import "weather-icons/css/weather-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Weather from "./components/Weather";
import Form from "./components/Form";

const API_key = "071cf3b0c4db17038ab83faf56d2dcaa";

class App extends Component {
  constructor() {
    super();
    this.state = {
      city: "",
      icon: "",
      main: "",
      celsius: "",
      temp_max: "",
      temp_min: "",
      description: "",
      error: false
    };
    this.weatherIcon = {
      Thunderstorm: "wi-thunderstorm",
      Drizzle: "wi-sleet",
      Rain: "wi-storm-showers",
      Snow: "wi-snow",
      Atmosphere: "wi-fog",
      Clear: "wi-day-sunny",
      Clouds: "wi-day-fog"
    };
  }
  calCelsius(temp) {
    let celsius = Math.floor(temp - 273.15);
    return celsius;
  }
  getWeatherIcon = rangeID => {
    switch (true) {
      case rangeID >= 200 && rangeID <= 232:
        this.setState({ icon: this.weatherIcon.Thunderstorm });
        break;
      case rangeID >= 300 && rangeID <= 321:
        this.setState({ icon: this.weatherIcon.Drizzle });
        break;
      case rangeID >= 500 && rangeID <= 531:
        this.setState({ icon: this.weatherIcon.Rain });
        break;
      case rangeID >= 600 && rangeID <= 622:
        this.setState({ icon: this.weatherIcon.Snow });
        break;
      case rangeID >= 701 && rangeID <= 781:
        this.setState({ icon: this.weatherIcon.Atmosphere });
        break;
      case rangeID === 800:
        this.setState({ icon: this.weatherIcon.Clear });
        break;
      case rangeID >= 801 && rangeID <= 804:
        this.setState({ icon: this.weatherIcon.Clouds });
        break;
      default:
        this.setState({ icon: this.weatherIcon.Clouds });
        break;
    }
  };
  getWeather = async event => {
    event.preventDefault();
    const city = event.target.elements.city.value;
    const country = event.target.elements.country.value;

    if (city && country) {
      const api_call = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_key}`
      );
      const response = await api_call.json();

      try {
        console.log(response);
        this.setState({
          city: `${response.name},${response.sys.country}`,
          celsius: this.calCelsius(response.main.temp),
          temp_min: this.calCelsius(response.main.temp_min),
          temp_max: this.calCelsius(response.main.temp_max),
          description: response.weather[0].description,
          error: false
        });
        this.getWeatherIcon(response.weather[0].id);
      } catch (response) {
        if (response.cod === 404) {
          console.log(response.message);
        }
      }
    } else {
      this.setState({
        error: true
      });
    }
  };
  render() {
    const {
      city,
      celsius,
      temp_min,
      temp_max,
      description,
      icon,
      error
    } = this.state;
    return (
      <div className="App">
        <Form loadweather={this.getWeather} error={error} />
        <Weather
          city={city}
          temp_celsius={celsius}
          temp_min={temp_min}
          temp_max={temp_max}
          description={description}
          weatherIcon={icon}
        />
      </div>
    );
  }
}

export default App;
