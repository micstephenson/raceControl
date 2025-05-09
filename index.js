// switch between pages*/
// ------------------------------------------------------------------------------------------------------
    // Main to runner
    document.querySelector('.runner__button').addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default behavior of the <a> tag
    
        // Hide the main page
        document.getElementById('main-page').style.display = 'none';
    
        // Show the runner page
        document.getElementById('runner-page').style.display = 'block';
    });
    
    // Runner to main
    document.querySelector('.navbar__name').addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default behavior of the <a> tag
    
        // Hide the runner page
        document.getElementById('runner-page').style.display = 'none';
    
        // Show the main page
        document.getElementById('main-page').style.display = 'block';
    });
    // Main to spectator
    document.querySelector('.spectator__button').addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default behavior of the <a> tag
    
        // Hide the main page
        document.getElementById('main-page').style.display = 'none';
    
        // Show the runner page
        document.getElementById('spectator-page').style.display = 'block';
    });
    
    
    // start page*/
    // ------------------------------------------------------------------------------------------------------
    const participants = [];
    const NoOfParticipants = [];
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
            alert('Please enter both first and last name. ');
            return;
        } else {
            const full_name = `${first_name} ${last_name}`;
        
        // Generate a random number
            let randomNum;
            const existingNumbers = participants.map((participant) => participant.racerNum);
            do {
                randomNum = Math.floor(Math.random() * 900) + 100;
            } while (existingNumbers.includes(randomNum));
            
        // Add participants to the array
            participants.push({first_name: `${first_name}`, last_name: `${last_name}`, racerNum: `${randomNum}`});
            console.log(participants);
        
        // Try and add everything to local storage afterwards
            localStorage.setItem("stored_participants", participants);
    
        // Send data to the server
            try {
                const response = await fetch('http://localhost:8080/participants', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(participant),
                });
    
                if (response.ok) {
                    console.log('Participant added successfully');
                } else {
                    console.error('Failed to add');
                }
            } catch (error) {
                console.error('Error:', error);
            }
    
    
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
    
    // const partName = localStorage.getItem('participantName');
    // const number = localStorage.getItem('participantNumber');
    
    // document.getElementById('nameDisplay').innerText = 'Name: ' + partName;
    // document.getElementById('numberDisplay').innerText = 'Number: ' + number; 
    
    
    // Runner 
    // ------------------------------------------------------------------------------------------------------
    // Stopwatch
    let timer;
    let seconds = 0;
    let milliseconds = 0;
    let isRunning = false;
    let position = 1;
    let lapTime = {};
    const results = [];
    
    const display = document.getElementById('display');
    const startButton = document.querySelector('.runner__button');
    const submitButton = document.getElementById('submit-button');
    
    function updateDisplay() {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        const millis = Math.floor(milliseconds / 10);
    
        display.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(millis).padStart(2, '0')}`;
    }
    
    startButton.addEventListener('click', () => {
        if (!isRunning) {
            isRunning = true;
            timer = setInterval(() => {
                milliseconds += 10;
                if (milliseconds >= 1000) {
                    milliseconds = 0; // reset milliseconds
                    seconds++;
                }
                updateDisplay();
            }, 10); // update every 10milliseconds
        }
    });
    
    submitButton.addEventListener('click', () => {
        const lapTime = display.textContent;
        const lapDiv = document.createElement('div');
        let lapContainer = document.getElementById('lap-list-container');
    
        if (!lapContainer) {
            lapContainer = document.createElement('div');
            lapContainer.id = 'lap-list-container';
            document.body.appendChild(lapContainer); // Append to the DOM
        }
    
        // create new lap entry
        lapDiv.className = 'lap-entry';
        lapDiv.setAttribute('data-position', `${position}`); //set data position
        lapDiv.innerHTML = `
        <p class="lap-time">Position: ${position}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${lapTime} </p>
        <p class="participant-selection">*No Runner Assigned*</p>
        <button class="select-time" data-position="${position}"> Select </button>
        `;
        lapContainer.appendChild(lapDiv);
    
        // append results to a json
        results.push({position: `${position}`, lap_time: `${lapTime}`, racerName: ` `, racerNum: ` `});
        console.log(results);
        localStorage.setItem("stored_results", JSON.stringify(results));
    
        position++; // Increment position for the next lap
    });
    
     6
    // assign user to time POPUP
    
    // Create Participant list in popup
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
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('select-time')) {
            event.preventDefault();
            
            const participantListPopup = document.getElementById('participant-list-popup');
            const overlay = document.getElementById('overlay');
    
            // populate participant list
            populateParticipantList();
    
            // Show the popup
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
    });
    
    // assign participant
    let selectedParticipant = null;
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('participant-selection-button')) {
            event.preventDefault(); // Prevent the default form submission behavior
    
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
            const [racerNum, ...nameParts] = buttonText.split(/\s+/); // Split by whitespace
            const participantName = nameParts.join(' '); // Join the remaining parts as the name
            selectedParticipant = { racerNum, participantName };
    
            if (selectedParticipant) {
                const participantSelectionElement = document.querySelector('.participant-selection');
                if (participantSelectionElement) {
                    participantSelectionElement.textContent = `${selectedParticipant.racerNum}              ${selectedParticipant.participantName}`;
                }
    
                // update results array
                const lastResultIndex = results.length - 1;
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
    
                // Clear the selected participant
                selectedParticipant = null;
            } else {
                alert('Please select a participant first.');
            }
        }
    });
    
    // document.addEventListener('click', (event) => {
    //     if (event.target.classList.contains('participant-selection-button')) {
    //         event.preventDefault();
    
    //         if (selectedParticipant) {
    //             const participantSelectionElement = document.querySelector('.participant-selection');
    //             if (participantSelectionElement) {
    //                 participantSelectionElement.textContent = `${selectedParticipant.racerNum}              ${selectedParticipant.participantName}`;
    //             }
    
    //             // update results array
    //             const lastResultIndex = results.length - 1;
    //             if (lastResultIndex >= 0) {
    //                 results[lastResultIndex].racerName = selectedParticipant.participantName;
    //                 results[lastResultIndex].racerNum = selectedParticipant.racerNum;
    //             }
    //             console.log(results);
    
    //             // save results to local storage
    //             localStorage.setItem("stored_results", JSON.stringify(results));
    
    //             // Hide the popup
    //             const participantListPopup = document.getElementById('participant-list-popup');
    //             const overlay = document.getElementById('overlay');
    //             participantListPopup.classList.remove('active');
    //             overlay.classList.remove('active');
    
    //             // Clear the selected participant
    //             selectedParticipant = null;
    //         } else {
    //             alert('Please select a participant first.');
    //         }
    //     }
    // });
