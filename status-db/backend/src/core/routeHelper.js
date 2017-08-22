
function safe(nf) {
    return (req, res, next) => {
        fn(req, res).catch(err => next(err))
    }
}


module.exports = {
    safe
};