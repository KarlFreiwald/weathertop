const express = require("express");
const logger = require("./utils/logger");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require("express-session");

const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(session({
    secret: "50419a26167ee59b57d5c6e6622bc3c8e287b3485193a21338354ecee45c2fbf",
    cookie: {
        maxAge: 3600000
    },
    resave: false,
    saveUninitialized: false
}));

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: false}));

app.engine('.hbs', handlebars.engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');

const routes = require("./routes");
app.use("/", routes);

app.listen(process.env.PORT, () => {
    console.log(`Weathertop listening on ${process.env.PORT}`);
});


module.exports = app;
