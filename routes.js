const express = require("express");
const router = express.Router();

const home = require("./controllers/home.js");
const dashboard = require("./controllers/dashboard.js");
const measurements = require("./controllers/measurements.js");
const accounts = require("./controllers/login.js");

const auth = require("./utils/auth.js");

router.get("/", home.index);
router.get("/login", accounts.login);
router.get("/signup", accounts.signup);
router.get("/logout", accounts.logout);
router.post("/register", accounts.register);
router.post("/authenticate", accounts.authenticate);
router.get("/dashboard", dashboard.index);
router.get("/measurements/:s_id", measurements.index);

//protected routes
router.get("/dashboard", auth.protected, dashboard.index);
router.get("/dashboard/deletestation/:s_id", auth.protected, dashboard.deleteStation);
router.post("/dashboard/addstation", auth.protected, dashboard.addStation);
router.get("/measurements/:s_id", auth.protected, measurements.index);
router.get("/measurements/:s_id/deletemeasurement/:measurement_id", auth.protected, measurements.removeMeasurement);
router.post("/measurements/:s_id/addmeasurement", auth.protected, measurements.addMeasurement);
router.post("/measurements/:s_id/addautomaticmeasurement", auth.protected, measurements.addAutomaticMeasurement);

module.exports = router;
