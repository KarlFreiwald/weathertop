const logger = require("../utils/logger.js");

const home = {
  index(request, response) {
    if (request.session.user) response.redirect('/dashboard');
    logger.info("home rendering");
    const viewData = {
      title: "Weathertop",
      message: request.query.message,
      message_type: request.query.message_type
    };
    response.render("index", viewData);
  },
};

module.exports = home;
