export function auth(req, res, next) {
    if (!req.session || !req.session.passport.user) {
        return res.redirect("/login");
    }
    next();
}
