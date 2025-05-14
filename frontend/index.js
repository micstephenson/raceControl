// switch between pages*/
// ------------------------------------------------------------------------------------------------------
const resumeButton = document.getElementById('resume-race'); 
const restartButton = document.getElementById('restart-race');
const closeresumerestart = document.querySelector('.close-resume-restart-popup');
const startRacePopup = document.getElementById('start-race-popup');
const closeStartPopup = document.querySelector('.close-start-popup');
const resumeRestartPopup = document.getElementById('resume-restart-popup');

let started = 0;

resumeButton.addEventListener('click', resumeRace);
restartButton.addEventListener('click', restartRace);
closeresumerestart.addEventListener('click', closeresumerestartbutton);
closeStartPopup.addEventListener('click', closeStart);



document.querySelector('.runner__button').addEventListener('click', (event) => {
    event.preventDefault();
    if (participants.length === 0){
        document.getElementById('add-participants-error').classList.add('active');
    } else {
        document.getElementById('add-participants-error').classList.remove('active');
        if (!isRunning && (started === 0)) {
            startRacePopup.classList.add('active');
        } else{
            resumeRestartPopup.classList.add('active');
        }
    }
});

function closeStart(event){
    event.preventDefault();
    startRacePopup.classList.remove('active');
    startRacePopup.style.display = 'none';
}

function closeresumerestartbutton(){
    resumeRestartPopup.classList.remove('active');
}

function resumeRace(){
    switchPages('main', 'runner');
    resumeRestartPopup.classList.remove('active');
}

function restartRace(event){
    event.preventDefault();
    clearAllRaceData();
    uploadButton.textContent = 'Upload';
    uploadButton.backgroundColor = '#007bff';
    submitButton.style.display = 'block';
    resumeRestartPopup.classList.remove('active');
    document.getElementById('assign-participant-error').classList.remove('active');
    document.getElementById('every-Participant-Passed').classList.remove('active');
    startRacePopup.classList.add('active');
}

function clearAllRaceData() {
    const lapContainer = document.getElementById('lap-list-container');
    if (lapContainer) {
        lapContainer.innerHTML = ''; 
        console.log('Lap list container cleared');
    }

    participants.length = 0;

    // Clear participant list container
    const participantListContainer = document.getElementById('participants-container');
    if (participantListContainer) {
        participantListContainer.innerHTML = ''; 
        console.log('Participant list container cleared');        
    }


    // Clear results array
    results.length = 0;
    console.log('Results cleared:', results);

    // Reset timer variables
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
    }
    seconds = 0;
    milliseconds = 0;
    updateDisplay();
    console.log('Timer reset');

    // Reset UI elements
    const uploadButton = document.getElementById('upload-button');
    uploadButton.textContent = 'Upload';
    uploadButton.style.backgroundColor = '#007bff';
    

    const assignParticipantError = document.getElementById('assign-participant-error');
    assignParticipantError.classList.remove('active');

    const everyParticipantPassed = document.getElementById('every-Participant-Passed');
    everyParticipantPassed.classList.remove('active');

    console.log('All race data cleared');    
}

document.querySelector('.navbar__name').addEventListener('click', (event) => {
    event.preventDefault(); 
    switchPages('runner', 'main');
});

document.querySelector('.spectator__button').addEventListener('click', (event) => {
    event.preventDefault(); 
    switchPages('main', 'spectator');
});

function switchPages(currentPage, nextPage){ 
    document.getElementById(`${currentPage}-page`).style.display = 'none';
    document.getElementById(`${nextPage}-page`).style.display = 'block';
}

// start page*/
// ------------------------------------------------------------------------------------------------------
const participants = [];
const createParticipant = document.getElementById('submit_name');
const participantListContainer = document.getElementById('participant-list')

//capitalise names
function capFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Participants list/submittion buttons
createParticipant.addEventListener('click', async () => {
    let first_name = document.getElementById('first_name').value.trim();
    let last_name = document.getElementById('last_name').value.trim();

    first_name = capFirstLetter(first_name);
    last_name = capFirstLetter(last_name);


    if (first_name == '' || last_name === ''){
        selectFirstLast.classList.add('active');
        return;
    } else {
        selectFirstLast.classList.remove('active');
        const full_name = `${first_name} ${last_name}`;
    
        let randomNum; // Generate a random number
        const existingNumbers = participants.map((participant) => participant.racerNum);
        do {
            randomNum = Math.floor(Math.random() * 900) + 100;
        } while (existingNumbers.includes(randomNum));
        
    // Add participants to the array
        participants.push({first_name: `${first_name}`, last_name: `${last_name}`, racerNum: `${randomNum}`});
        console.log(participants);
    
    // Add participants to local storage
        localStorage.setItem("stored_participants", participants);


    // display participant details
        const participantDiv = document.createElement('div');
        participantDiv.className = 'participant-entry';
        participantDiv.textContent = `${full_name} - ${randomNum}`;
        participantListContainer.appendChild(participantDiv);

    // Clear the input fields
        document.getElementById('first_name').value = '';
        document.getElementById('last_name').value = '';
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        createParticipant.click();
    }
});


// Runner 
// ------------------------------------------------------------------------------------------------------
// Stopwatch
let timer;
let seconds = 0;
let milliseconds = 0;
let isRunning = false;
let position = 1;
let lapTime = {};
let buttonPosition = null;
let lapEntry = null;
let selectedParticipant = null;

const results = [];
const display = document.getElementById('display');
const startButton = document.getElementById('start-race');
const submitButton = document.getElementById('submit-button');
const uploadButton = document.getElementById('upload-button');

startButton.addEventListener('click', startTimer);
submitButton.addEventListener('click', submitLap);
uploadButton.addEventListener('click', uploadResults);
document.addEventListener('click', showParticipantSelectorPopup);
document.addEventListener('click', showParticipantsInPopup);
document.getElementById('search-participants').addEventListener('input', filterParticipants);

function updateDisplay() {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const millis = Math.floor(milliseconds / 10);

    display.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(millis).padStart(2, '0')}`;
}

function startTimer(event){
    event.preventDefault();
    document.getElementById('start-race-popup').classList.remove('active');
    started += 1;
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(() => {
            milliseconds += 10;
            if (milliseconds >= 1000) {
                milliseconds = 0; 
                seconds++;
            }
            updateDisplay();
        }, 10); 
    }
    switchPages('main', 'runner');
}

function submitLap(){
    const lapTime = display.textContent;
    const lapDiv = document.createElement('div');
    const everyParticipantPassed = document.getElementById('every-Participant-Passed');
    let noOfParticipants = participants.length;
    let lapContainer = document.getElementById('lap-list-container');

    if (position > noOfParticipants) {
        everyParticipantPassed.classList.add('active');
        uploadButton.style.backgroundColor = 'green';
        uploadButton.textContent = 'Upload And Stop Race?';
    } else {
        everyParticipantPassed.classList.remove('active');
        if (!lapContainer) {
            lapContainer = document.createElement('div');
            if (!lapContainer.id) {
                lapContainer.id = 'lap-list-container';
            }
            document.body.appendChild(lapContainer); 
        }

        // create new lap entry
        lapDiv.className = 'lap-entry';
        lapDiv.setAttribute('data-position', `${position}`); //set data position
        lapDiv.innerHTML = `
        <p class="lap-time">Position: ${position}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${lapTime} </p>
        <p class="participant-selection" data-position="${position}">*No Runner Assigned*</p>
        <button class="select-time" data-position="${position}"> Select </button>
        `;
        lapContainer.appendChild(lapDiv);

        // append results to a json
        results.push({position: `${position}`, lap_time: `${lapTime}`, racerName: ` `, racerNum: ` `});
        console.log(results);
        localStorage.setItem("stored_results", JSON.stringify(results));

        position++;        
    }

 
}

function populateParticipantList() {
    const participantListContainer = document.getElementById('participant-list-container');
    participantListContainer.innerHTML = '';

    if (participants.length === 0) {
        participantListContainer.innerHTML = '<p>No Participants Entered</p>';
        return;
    }

    participants.forEach((participant) => {
        const participantDiv = document.createElement('div');
        participantDiv.className = 'participant-submittion-entry';
        participantDiv.innerHTML = `
        <button class="participant-selection-button"> ${participant.racerNum}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${participant.first_name} ${participant.last_name} </button>
        `;
        participantListContainer.appendChild(participantDiv);
    });
}

// show popup
function showParticipantSelectorPopup(event){
    if (event.target.classList.contains('select-time')) {
        event.preventDefault();
        
        buttonPosition = event.target.getAttribute('data-position');
        lapEntry = document.querySelector(`.lap-entry[data-position="${buttonPosition}"]`);
        console.log(`position: ${buttonPosition}, lapEntry: ${lapEntry}`);

        const participantListPopup = document.getElementById('participant-list-popup');
        const overlay = document.getElementById('overlay');

        populateParticipantList();

        participantListPopup.classList.add('active');
        overlay.classList.add('active');
    }

    if (event.target.classList.contains('close-popup')) {
        // Hide the popup
        const participantListPopup = document.getElementById('participant-list-popup');
        const overlay = document.getElementById('overlay');
        participantListPopup.classList.remove('active');
        overlay.classList.remove('active');
    }
}

// assign participant
function showParticipantsInPopup(event) {
    if (event.target.classList.contains('participant-selection-button')) {
        event.preventDefault(); 

        if (event.target.classList.contains('selected')){
            event.target.classList.remove('selected');
        } else {
            const previouslySelected = document.querySelector('.participant-selection-button.selected');
            if (previouslySelected){
                previouslySelected.classList.remove('selected');
            }
        }
        event.target.classList.add('selected');

        // Store the selected participant's details
        const buttonText = event.target.textContent.trim();
        const [racerNum, ...nameParts] = buttonText.split(/\s+/); 
        const participantName = nameParts.join(' '); 
        selectedParticipant = { racerNum, participantName };

        if (selectedParticipant) {
            const participantSelectionElement = document.querySelector(`.participant-selection[data-position="${buttonPosition}"]`);
            if (participantSelectionElement && selectedParticipant) {
                participantSelectionElement.textContent = `${selectedParticipant.racerNum}              ${selectedParticipant.participantName}`;
            }

            // update results array 
            const lastResultIndex = buttonPosition - 1;
            if (lastResultIndex >= 0) {
                results[lastResultIndex].racerName = selectedParticipant.participantName;
                results[lastResultIndex].racerNum = selectedParticipant.racerNum;
            }
            console.log(results);

            // save results to local storage
            localStorage.setItem("stored_results", JSON.stringify(results));

            // Hide the popup
            const participantListPopup = document.getElementById('participant-list-popup');
            const overlay = document.getElementById('overlay');
            participantListPopup.classList.remove('active');
            overlay.classList.remove('active');

            // Clear the selected participant/lap entry
            selectedParticipant = null;
        } else {
            console.log('Please select a participant first.');
        }
    }
}

function checkUnassignedParticipants() {
    const lapEntries = document.querySelectorAll('.lap-entry');

    for (const lapEntry of lapEntries) {
        const participantSelection = lapEntry.querySelector('.participant-selection');

        if (participantSelection && participantSelection.textContent.trim() === '*No Runner Assigned*') {
            return false;
        }
    }
    return true;
}

function uploadResults(){
    let uploadAllowed = checkUnassignedParticipants();

    if (uploadAllowed) {
        submitButton.style.display = 'none';
        uploadButton.textContent = 'Uploaded!';
        document.getElementById('assign-participant-error').classList.remove('active');
        document.getElementById('every-Participant-Passed').classList.remove('active');
        storeResults();

        //stop timer
        if (isRunning) {
            clearInterval(timer);
            isRunning = false;
            console.log('timer stopped')
        } else {
            console.log('timer is not running');
        }
    } else {
        document.getElementById('assign-participant-error').classList.add('active');
    }
    
}

//search bar
function filterParticipants(event) {
    const searchValue = event.target.value.trim();
    const participantButtons = document.querySelectorAll('.participant-selection-button');

    participantButtons.forEach((button) => {
        const buttonText = button.textContent.trim();
        const [racerNum] = buttonText.split(/\s+/);

        if (searchValue === '' || racerNum.startsWith(searchValue)) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });
}

// Results Page

// Store Results  
// ------------------------------------------------------------------------------------------------------
 async function storeResults() {
    const response = await fetch('results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(results),
    });

    if (response.ok) {
        const updatedResults = await response.json();
        removeContentFrom(results);
    } else {
        console.log('failed to upload results', response);
    }
 }

 async function loadResults() {
    const response = await fetch('results');
    let results;
    if (response.ok) {
        results = await response.json();
    } else {
        results = ['failed to load results'];
    }
 }

 function removeContentFrom(content){
    results.length = 0;
 }

 // Airplane Mode  
// ------------------------------------------------------------------------------------------------------
if ('serviceWorker' in navigator) {
    window.addEventListener('load', registerServiceWorker);
}

function registerServiceWorker(){
    navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope)
        })
        .catch((error) => {
            console.error('Service Worker registration failed', error);
        });
}