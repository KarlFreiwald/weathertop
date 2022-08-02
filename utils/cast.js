const logger = require("../utils/logger.js");
const stationStore = require("../models/station-store.js");
const measurementStore = require("../models/measurement-store.js");

const windDirections = [
    'Nord', 'Nord-Ost', 'Ost', 'Süd-Ost', 'Süd', 'Süd-West', 'West', 'Nord-West'
];

const codeToDescriptions = {
    200: 'Gewitter',
    300: 'Nieselregen',
    400: 'Unwetter',
    500: 'Regen',
    600: 'Schnee',
    700: 'Nebel',
    800: 'Klar bis bewölkt'
};

const codeToIcon = {
    200: "bi-lightning",
    300: "bi-cloud-rain",
    400: "bi-cloud-lightning-rain",
    500: "bi-cloud-rain",
    600: "bi-snow",
    700: "bi-cloud-haze",
    800: "bi-sun"
};

const trendToArrow = {
    0: "bi-arrow-down-right",
    1: "bi-arrow-right",
    2: "bi-arrow-up-right"
};

const  cast = {
    codeToLanguage (weather) {
        return codeToDescriptions[weather];
    },

    codeToImage (weather) {
        return codeToIcon[weather];
    },

    trendToIndex (trend) {
        switch(Number(trend)) {
            case -1:
                return 0;
            case 0:
                return 1;
            case 1:
                return 2;
            default:
                return 0;
        }
    },

    codeToArrow (trend) {
        let index = Number(cast.trendToIndex(trend));
        return trendToArrow[index];
    },

    degreeToWindDirection(wind_direction) {
        const index = Math.floor(Math.abs((wind_direction + 22.5) % 360) / 45);
        return windDirections[index];
    }

}

module.exports = cast;