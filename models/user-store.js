const dataStore = require("./data-store.js");
const dataStoreClient = dataStore.getDataStore();
const logger = require("../utils/logger.js");

const userStore = {
    async addUser(user) {
        const query = 'INSERT INTO users (email, first_name, last_name, password) VALUES ($1, $2, $3, $4)';
        const values = [user.email, user.first_name, user.last_name, user.password];
        try {
            await dataStoreClient.query(query, values);
        } catch (e) {
            logger.error("Error adding user", e);
        }
    },

    async authenticateUser(email, password) {
        const query = 'SELECT * FROM USERS WHERE email=$1 AND password=$2';
        const values = [email, password];
        try {
            let dbRes = await dataStoreClient.query(query, values);
            if (dbRes.rows[0] !== undefined) {
                return {id: dbRes.rows[0].user_id};
            } else {
                return undefined;
            }
        } catch (e) {
            console.log("Error authenticating user", e);
        }
    },

    async getUserById(user_id) {
        logger.info(`Getting user ${user_id}`);
        const query = 'SELECT * FROM USERS WHERE user_id=$1';
        const values = [user_id];
        try {
            let dbRes = await dataStoreClient.query(query, values);
            //logger.info(`Getting user ${dbRes.rows[0].user_id}`);
            if (dbRes.rows[0] !== undefined) {
                return {
                    user_id: dbRes.rows[0].user_id
                    //firstName: dbRes.rows[0].first_name,
                    //lastName: dbRes.rows[0].last_name
                };
            } else {
                return undefined;
            }
        } catch (e) {
            console.log("Error getting user", e);
        }
    },
};

module.exports = userStore;