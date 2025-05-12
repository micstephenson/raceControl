import express from 'express';
import fs from 'fs';

const app = express();

app.use(express.static('raceControl'));
app.use(express.json());

const results = [];

function getResults(req, res) {
    res.json(results);
}

function postResult(req, res) {
    console.log('post request')
    const runnerResults = req.body;
    results.push(runnerResults);

    saveResults();
    res.send(200);
}

function convertToCSV(data) {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
}

function saveResults(){
    const csvData = convertToCSV(results);
    fs.writeFileSync('results.csv', csvData, 'utf8')
    console.log('Results saved to results.csv');
}

app.get('/results', getResults);
app.post('/results', postResult);

app.listen(8080, () => {
    console.log('Server is running on port 8080 at http://localhost:8080')
});