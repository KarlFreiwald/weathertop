const auth = {
    /*
     * Some routes require an authenticated user.
     * Use this function as protection.
     */
    protected(request, response, next) {
        if (request.session.user) {
            next();
        } else {
            response.redirect('/');
        }
    },
}

module.exports = auth;