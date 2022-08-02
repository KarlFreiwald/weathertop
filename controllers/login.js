const userstore = require("../models/user-store.js");
const logger = require("../utils/logger.js");

const accounts = {
    login(request, response) {
        const viewData = {
            title: "Login zu Weathertop"
        };
        response.render("login", viewData);
    },

    logout(request, response) {
        request.session.destroy();
        response.redirect("/");
    },

    signup(request, response) {
        const viewData = {
            title: "Registrieren zu Weathertop"
        };
        response.render("signup", viewData);
    },

    async register(request, response) {
        const user = request.body;
        await userstore.addUser(user);
        logger.info("Registering user", user);
        response.redirect("/");
    },

    /*
    async register(request, response) {
        const user = request.body;
        let same_email = undefined;
        const query = 'SELECT email FROM USERS WHERE email=$1';
        const values = [user.email];
        try {
            same_email = await dataStoreClient.query(query, values);
        } catch (e) {
            logger.info("Unable to find email", e);
        }

        if (same_email === undefined) {
            await userstore.addUser(user);
            logger.info("Registering user", user);
            response.redirect("/");
        } else {
            response.redirect("/?message=Diese+Email+gibt+es+bereits.+&message_type=danger");
        };
    },
    */

    async authenticate(request, response) {
        let user = await userstore.authenticateUser(request.body.email, request.body.password);
        if (user) {
            request.session.user = user.id;
            logger.info("User successfully authenticated and added to session", user);
            response.redirect("/dashboard");
        } else {
            //  implement popup that says that user cannot be found
            //  response.redirect("/");
            response.redirect("/?message=Falsche+Email+oder+falsches+Passwort+&message_type=danger");
        }
    },

    async getCurrentUser(request) {
        const user = request.session.user;
        return await userstore.getUserById(user);
    }
};

module.exports = accounts;