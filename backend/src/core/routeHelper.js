
function safe(fn) {
    return (req, res, next) => {
        fn(req, res)
            .catch(err => next(err))
    }
}

function getParam(req, name) {
    if (req.body[name])
        return req.body[name];
    return req.query[name];
}

function getSession(req) {
    if (req.cookies.session)
        return req.cookies.session;
    return getParam(req, "session");
}


module.exports = {
    safe, getParam, getSession
};