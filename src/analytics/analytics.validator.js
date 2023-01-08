const { check, validationResult, query } = require('express-validator')

/**
 * method to validate request body of a record to be created
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const validateCreateRecord = async (req, res, next) => {
    await check('itemName', 'itemName is required').exists().run(req);
    await check('itemName', 'itemName should be a string').isString().run(req);
    await check('itemName', 'itemName should have length in range [1-1000]').isLength({ min: 1, max: 1000 }).run(req);

    await check('itemUrl', 'itemUrl is required').exists().run(req);
    await check('itemUrl', 'itemUrl should be a URL').isURL().run(req);
    await check('itemUrl', 'itemUrl should have length in range [1-1000]').isLength({ min: 1, max: 1000 }).run(req);

    await check('date', 'invalid date supplied').optional().isDate().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ errors: errors.array() });
    }
    next();
}

/**
 * method to validate request query params
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const validateFilterInsightByDateRange = async (req, res, next) => {
    await query('from', 'from is required').exists().run(req);
    await query('from', 'from should be a date').isDate().run(req);

    await query('to', 'to is required').exists().run(req);
    await query('to', 'to should be a date').isDate().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ errors: errors.array() });
    }
    next();
}

module.exports = {
    validateCreateRecord,
    validateFilterInsightByDateRange
}