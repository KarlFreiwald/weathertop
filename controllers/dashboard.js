const logger = require("../utils/logger.js");
const stationStore = require("../models/station-store.js");
const measurementStore = require("../models/measurement-store.js");
const accounts = require("./login.js");
const cast = require("../utils/cast")

const dashboard = {
  async index(request, response) {
    const loggedInUser = await accounts.getCurrentUser(request);
    const stationCollection = await stationStore.getAllStations(loggedInUser.user_id);
    for (const station of stationCollection) {
      let addInfo = await measurementStore.getCurrentMeasurement(station.station_id);
      let latitude = station.latitude;
      let longitude = station.longitude;
      let weatherText = undefined;
      let forecast = undefined;
      let maxMin = undefined;
      let weather_icon = undefined;
      let temperature_trend_icon = undefined;
      let wind_trend_icon = undefined;
      let airpressure_trend_icon = undefined;

      //logger.info({addInfo});
      if (addInfo !== undefined) {
        weatherText = cast.codeToLanguage(addInfo.weather);
        forecast = await measurementStore.getTrend(station.station_id);
        maxMin = await measurementStore.getMaxMin(station.station_id);
        weather_icon = cast.codeToImage(addInfo.weather);
        temperature_trend_icon = cast.codeToArrow(forecast.trend_temperature);
        wind_trend_icon = cast.codeToArrow(forecast.trend_wind);
        airpressure_trend_icon = cast.codeToArrow(forecast.trend_airpressure);
      }

      Object.assign(
          station,
          latitude,
          longitude,
          addInfo,
          {weatherText},
          forecast,
          maxMin,
          {weather_icon},
          {temperature_trend_icon},
          {wind_trend_icon},
          {airpressure_trend_icon}
      );
    }

    const viewData = {
      title: "Dashboard",
      stations: stationCollection
    };
    //logger.info({viewData});
    response.render("dashboard", viewData);
  },

  async deleteStation(request, response) {
    const stationId = request.params.s_id;
    logger.debug("Deleting Station", stationId);
    await stationStore.removeStation(stationId);
    response.redirect("/dashboard");
  },

  async addStation(request, response) {
    const loggedInUser = await accounts.getCurrentUser(request);
    const newStation = {
      user_id: loggedInUser.user_id,
      location: request.body.location,
      longitude: request.body.longitude,
      latitude: request.body.latitude
    };
    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  }

};

module.exports = dashboard;
