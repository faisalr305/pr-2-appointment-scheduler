const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect("/auth/sign-in");
        }

        if (!allowedRoles.includes(req.session.user.role)) {
            return res.status(403).send("Access denied.");
        }

        next();
    };
};

module.exports = requireRole;