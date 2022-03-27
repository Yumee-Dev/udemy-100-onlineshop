function addCsrfToken(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
}

module.exports = addCsrfToken;

// it's needed to add hidden input to all the post forms
// name="_csrf" value={locals.csrfToken} 