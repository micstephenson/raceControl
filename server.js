const bodyParser = require('body-parser');
const express = require('express');
const path = require ('path');
const fs = require('fs');

const app = express();
app.use(express.static('client'));

app.use(bodyParser.json());

function ladeedada (req, res) {
        const participant = req.body;
    
        let participants = [];
        if (fs.existsSync('participants.json')) {
            try {
                const data = fs.readFileSync('participants.json');
                participants = JSON.parse(data); 
            } catch (error) {
                console.error('Error reading participants.json: ', error);
                participants = [];
            }
        } 
    
        participants.push(participant);
    
        try {
            fs.writeFileSync('participants.json', JSON.stringify(participants, null, 2));
            res.status(200).json({ message: 'Participant added successfully! '});
        } catch (error) {
            console.error('Error writing to participants.json', error);
            res.status(500).json({message: 'Failed to save participant '});
        }
}
app.post('/participants', ladeedada);               
    

// function getParticipants(req, res) {
//     res.json(participants);
// }

// app.get('/participants', getParticipants);

app.listen(8080, () => {
    console.log('Server is running on port 8080 at http://localhost:8080/')
});