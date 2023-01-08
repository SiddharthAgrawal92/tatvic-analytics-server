const analyticsRoutes = require('express').Router();
const { createRecord, getInsights, filterInsightByDateRange } = require('./analytics.controller');
const { validateCreateRecord, validateFilterInsightByDateRange } = require('./analytics.validator');

//to create a new record of each search
analyticsRoutes.post('/', validateCreateRecord, createRecord);

//to get the general insight data
analyticsRoutes.get('/', getInsights);

//to get the chart data
analyticsRoutes.get('/filter', validateFilterInsightByDateRange, filterInsightByDateRange);

module.exports = analyticsRoutes;