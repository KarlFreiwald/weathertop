const logger = require("../utils/logger.js");
const measurementStore = require("../models/measurement-store.js");
const cast = require("../utils/cast.js");
const axios = require("axios");

const measurements = {
    async index(request, response) {
        logger.info("measurements rendering");
        const s_id = request.params.s_id;
        let allMeasurements = await measurementStore.getAllMeasurements(s_id);
        let mostRecentMeasurement = allMeasurements[0];
        let StationInfo = await measurementStore.getStationInfo(s_id);
        let mostRecentWeather = undefined;
        let mostRecentWindDirection = undefined;
        let forecast = undefined;
        let maxMin = undefined;
        let weather_icon = undefined;
        let temperature_trend_icon = undefined;
        let wind_trend_icon = undefined;
        let airpressure_trend_icon = undefined;

        if (typeof mostRecentMeasurement != 'undefined') {
            mostRecentWeather = cast.codeToLanguage(mostRecentMeasurement.weather);
            mostRecentWindDirection = cast.degreeToWindDirection(mostRecentMeasurement.wind_direction);
            forecast = await measurementStore.getTrend(s_id);
            maxMin = await measurementStore.getMaxMin(s_id);
            weather_icon = cast.codeToImage(mostRecentMeasurement.weather);
            temperature_trend_icon = cast.codeToArrow(forecast.trend_temperature);
            wind_trend_icon = cast.codeToArrow(forecast.trend_wind);
            airpressure_trend_icon = cast.codeToArrow(forecast.trend_airpressure);
        }

        const viewData = {
            title: "Measurements",
            s_id: s_id,
            StationInfo : StationInfo,
            allMeasurements: allMeasurements,
            mostRecentWeather: mostRecentWeather,
            mostRecentMeasurement: mostRecentMeasurement,
            mostRecentWindDirection: mostRecentWindDirection,
            forecast: forecast,
            maxMin: maxMin,
            weather_icon: weather_icon,
            temperature_trend_icon: temperature_trend_icon,
            wind_trend_icon: wind_trend_icon,
            airpressure_trend_icon: airpressure_trend_icon
        };
        logger.info({viewData})
        response.render("measurements", viewData);
    },

    async removeMeasurement(request, response) {
        const stationId = request.params.s_id;
        const measurementId = request.params.measurement_id;
        logger.debug(`Deleting Measurement ${measurementId} from Station ${stationId}`);
        await measurementStore.removeMeasurement(measurementId);
        response.redirect("/measurements/" + stationId);
    },

    async addMeasurement(request, response) {
        const stationId = request.params.s_id;
        const newMeasurement = {
            weather:        Number(request.body.weather),
            wind:           Number(request.body.wind),
            wind_direction: Number(request.body.wind_direction),
            temperature:    Number(request.body.temperature),
            airpressure:    Number(request.body.airpressure)
        };
        logger.debug("New Measurement", newMeasurement);
        await measurementStore.addMeasurement(stationId, newMeasurement);
        response.redirect("/measurements/" + stationId);
    },

    async addAutomaticMeasurement(request, response) {
        logger.info("rendering automatic measurement");
        const stationId = request.params.s_id;
        const stationInfo = await measurementStore.getStationInfo(stationId);
        logger.info(stationInfo.longitude);
        logger.info(stationInfo.latitude);
        const oneCallRequest = `https://api.openweathermap.org/data/2.5/onecall?lat=${stationInfo.latitude}&lon=${stationInfo.longitude}&units=metric&appid=` + process.env.API_KEY;
        let newMeasurement = {};
        const result = await axios.get(oneCallRequest);
        if (result.status == 200) {
            const reading = result.data.current;
            newMeasurement.weather = reading.weather[0].id;
            newMeasurement.temperature = reading.temp;
            newMeasurement.wind = reading.wind_speed;
            newMeasurement.airpressure = reading.pressure;
            newMeasurement.wind_direction = reading.wind_deg;
        }
        console.log(newMeasurement);
        const viewData = {
            title: "Automatically generated measurement",
            reading: newMeasurement
        };
        //response.render("dashboard", viewData);
        logger.debug("New Automatic Measurement", newMeasurement);
        await measurementStore.addMeasurement(stationId, newMeasurement);
        response.redirect("/measurements/" + stationId);
    },

};

module.exports = measurements;