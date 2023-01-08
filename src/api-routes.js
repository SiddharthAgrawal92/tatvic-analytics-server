const routes = require('express').Router();
const analyticsRoutes = require('./analytics/analytics.routes');

//route to check server status using home url '/' 
routes.get('/', (req, res) => {
    res.send(200);
})

//handler for all routes of "insights" module
routes.use('/insights', analyticsRoutes)

//handler for all unknown(404) routes
routes.use((req, res) => {
    res.status(404).send({ msg: 'URL Not Found!' });
})

module.exports = routes;