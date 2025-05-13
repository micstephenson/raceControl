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

    console.log('Updated results array:', results);

    saveResults();
    res.send(200);
}

function convertToString(data) {
    let resultsString = '';
    if (data.length === 0) {
        return '';
    } else {
        for (let i = 0; i < data.length; i++) {
            const result = data[i];
            resultsString += `Position: ${result.position || 'N/A'}, Runner: ${result.racerName || 'N/A'}, RacerNum: ${result.racerNum || 'N/A'}, Time: ${result.lap_time || 'N/A'}\n`;
        }
    } return resultsString;
}

function saveResults(){
    const csvData = convertToString(results);
    console.log('Generated CSV data:\n', csvData);
    fs.writeFileSync('results.csv', csvData, 'utf8')
    console.log('Results saved to results.csv');
}

app.get('/results', getResults);
app.post('/results', postResult);

app.listen(8080, () => {
    console.log('Server is running on port 8080 at http://localhost:8080')
});