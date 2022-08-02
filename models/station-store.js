const dataStore = require("./data-store.js");
const dataStoreClient = dataStore.getDataStore();
const logger = require("../utils/logger.js");

const stationStore = {
    async getAllStations(user_id) {
        const query = 'SELECT * FROM STATIONS WHERE user_id=$1;';
        const values = [user_id];
        try {
            let result = await dataStoreClient.query(query, values);
            return result.rows;
        } catch (e) {
            logger.error("Error fetching all stations", e);
        }
    },

    async removeStation(s_id) {
        const query = 'DELETE FROM STATIONS WHERE station_id=$1';
        const values = [s_id];
        try {
            await dataStoreClient.query(query, values);
        } catch (e) {
            logger.error("Unable to remove station:", e);
        }
    },

    async addStation(Station) {
        try {
            const query = 'INSERT INTO stations (user_id, location, longitude, latitude) VALUES ($1, $2, $3, $4)';
            const values = [Station.user_id, Station.location, Station.longitude, Station.latitude];
            logger.info(await dataStoreClient.query(query, values));
        } catch (e) {
            logger.error("Error cannot add station", e);
        }
    }

};
module.exports = stationStore;
