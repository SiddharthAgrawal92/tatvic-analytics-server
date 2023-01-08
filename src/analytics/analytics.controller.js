const Insight = require('./analytics.model');

/**
 * method to create a new record in db
 * @param {*} req 
 * @param {*} res 
 */
const createRecord = async (req, res) => {
    const insight = new Insight(req.body);
    insight.save((err, data) => {
        if (err) {
            return res.status(500).send({ msg: 'Internal Server Error' });
        }
        res.status(201).send(data);
    });
}

/**
 * method to get the general insights such as no. of searchesPerHour & searchesPerDay
 * @param {*} req 
 * @param {*} res 
 */
const getInsights = async (req, res) => {
    let queryForAnHour = { date: { $gte: new Date(Date.now() - (3600 * 1000)), $lt: new Date() } };
    let queryForADay = { date: { $gte: new Date(Date.now() - (24 * 3600 * 1000)), $lt: new Date() } };
    let searchesPerformedInAnHour = await Insight.find(queryForAnHour).countDocuments();
    let searchesPerformedInADay = await Insight.find(queryForADay).countDocuments();
    res.status(200).send({ searchesPerHour: searchesPerformedInAnHour, searchesPerDay: searchesPerformedInADay });
}

/**
 * method to get the no. of searches performed in last n days at an hourly interval
based on date range filter
 * @param {*} req 
 * @param {*} res 
 */
const filterInsightByDateRange = (req, res) => {
    let query = [
        {
            $match: {
                date: { $gte: new Date(req.query.from), $lt: new Date(req.query.to) }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$date" },
                    day: { $dayOfMonth: "$date" },
                    month: { $month: "$date" },
                    hour: { $hour: "$date" }
                },
                count: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: {
                    year: "$_id.year",
                    day: "$_id.day",
                    month: "$_id.month"
                },
                // dailyCount: { $sum: "$count" },
                hourlyData: { $push: { hour: "$_id.hour", count: "$count" } },
            }
        }
    ];
    Insight.aggregate(query, (err, data) => {
        if (err) {
            return res.status(500).send({ msg: 'Internal Server Error' });
        }
        const result = data.reduce((acc, cValue) => {
            if (cValue._id.month && cValue._id.month < 10) {
                cValue._id.month = '0' + cValue._id.month;
            }
            if (cValue._id.day && cValue._id.day < 10) {
                cValue._id.day = '0' + cValue._id.day;
            }
            if (cValue.hourlyData && cValue.hourlyData.length) {
                cValue.hourlyData.forEach(e => {
                    if (e.hour < 10) {
                        e.hour = '0' + e.hour;
                    }
                    const convertedDate = new Date(`${cValue._id.year}-${cValue._id.month}-${cValue._id.day}T${e.hour}:00:00.000z`).getTime();
                    acc.push([convertedDate, e.count]);
                })
            }
            return acc;
        }, []);
        const sortedResult = result.sort(function (a, b) {
            if (a[0] == b[0]) {
                return a[1] - b[1];
            }
            return b[0] - a[0];
        });
        res.status(200).send({ result: sortedResult });
    });
}

module.exports =
{
    createRecord,
    getInsights,
    filterInsightByDateRange
}