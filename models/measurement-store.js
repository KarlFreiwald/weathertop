const dataStore = require("./data-store.js");
const dataStoreClient = dataStore.getDataStore();
const logger = require("../utils/logger.js");

const measurementStore = {
    async getStationInfo(s_id) {
        const query = 'SELECT location, latitude, longitude FROM STATIONS WHERE station_id=$1;';
        const values = [s_id];
        try {
            let result = await dataStoreClient.query(query, values);
            return result.rows[0];
        } catch (e) {
            logger.error("Error fetching station info", e);
        }
    },

    async getAllMeasurements(s_id) {
        const query = 'SELECT * FROM MEASUREMENTS WHERE station_id=$1 ORDER BY time_of_record DESC;';
        const values = [s_id];
        try {
            let result = await dataStoreClient.query(query, values);
            return result.rows;
        } catch (e) {
            logger.error("Error fetching all measurements", e);
        }
    },

    async removeMeasurement(measurementId) {
        const query = 'DELETE FROM MEASUREMENTS WHERE measurement_id=$1';
        const values = [measurementId];
        try {
            await dataStoreClient.query(query, values);
        } catch (e) {
            logger.error("Unable to remove measurement from station", e);
        };
    },

    async addMeasurement(stationId, newMeasurement) {
        const query = 'INSERT INTO measurements ' +
            '(station_id, weather, wind, wind_direction, temperature, airpressure) ' +
            'VALUES ($1, $2, $3, $4, $5, $6);';
        const values = [
            stationId,
            Math.floor(newMeasurement.weather / 100) * 100,
            newMeasurement.wind,
            newMeasurement.wind_direction,
            newMeasurement.temperature,
            newMeasurement.airpressure
        ];
        try {
            await dataStoreClient.query(query, values);
        } catch (e) {
            logger.error("Error adding measurement", e);
        }
    },

    async getCurrentMeasurement(s_id) {
        const query = 'SELECT weather, temperature, wind, airpressure FROM MEASUREMENTS ' +
            'WHERE station_id = $1 ' +
            'order by time_of_record desc limit 1;';
        const values = [s_id];
        try {
            let result = await dataStoreClient.query(query, values);
            return result.rows[0];
        } catch (e) {
            logger.error("Error fetching current measurement", e);
        }
    },

    async getMaxMin(s_id) {
        const query = 'SELECT ' +
            'max(temperature) as max_temperature, ' +
            'min(temperature) as min_temperature, ' +
            'max(wind) as max_wind, ' +
            'min(wind) as min_wind, ' +
            'max(airpressure) as max_airpressure, ' +
            'min(airpressure) as min_airpressure ' +
            'FROM MEASUREMENTS WHERE station_id = $1;';
        const values = [s_id];
        try {
            let result = await dataStoreClient.query(query, values);
            return result.rows[0];
        } catch (e) {
            logger.error("Error fetching min / max", e);
        }
    },

    async getTrend(s_id) {
        const query = 'SELECT ' +
            'SIGN(temperature - LEAD(temperature) OVER(order by time_of_record desc)) as trend_temperature, ' +
            'SIGN(wind - LEAD(wind) OVER(order by time_of_record desc)) as trend_wind, ' +
            'SIGN(airpressure - LEAD(airpressure) OVER(order by time_of_record desc)) as trend_airpressure ' +
            'FROM MEASUREMENTS WHERE station_id = $1 limit 1;';
        const values = [s_id];
        try {
            let result = await dataStoreClient.query(query, values);
            return result.rows[0];
        } catch (e) {
            logger.error("Error fetching trend info", e);
        }
    }

};
module.exports = measurementStore;
