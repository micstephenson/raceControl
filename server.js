import express from 'express';

const app = express();

app.use(express.static('raceControl'));
app.use(express.json());

const results = [];

function getResults(req, res) {
    res.json(results);
}


function postResult(req, res) {
    console.log('post request')
    // results = [req.body.msg, ...results];
    // res.json(results);
    const runnerResults = req.body;
    results.push(runnerResults);
    console.log(text);
    res.send(200);
}

app.get('/results', getResults);
app.post('/results', postResult);

app.listen(8080, () => {
    console.log('Server is running on port 8080 at http://localhost:8080')
});