# Race Time - By up2197433
## Key features
Replace this text with an introduction to your key features.


### Key Feature Name/Description.
Tell us briefly how to find & use it.
Describe the thinking behind the design of this feature.  


### Key Another Feature Name/Description.
Tell us briefly how to find & use it.
Describe the thinking behind the design of this feature.  

.
.
.
### Final Key Feature Name/Description.
Same for each feature… you get the idea :-)


## AI
I mainly used AI to edit my css or to build upon ideas that I wasn't entire sure how to logically execute. Sometimes it was challenging to find the correct way to position a button or reorganise the structure of a section of HTML so i would prompt it to guide me in the right direction on how to fix it. In terms of Javascript I would ask it to create the foundation of an idea I may have and then i would build upon/restructure it later.


## (1) Prompt to fix css - 
> How do i get #participant-list to be  positioned below #participants-container h1 
### Response: 
To position `#participant-list` below `#participants-container h1`, you can use CSS to ensure proper spacing and layout. Here's how you can achieve this:
### Explanation
1. **`margin-bottom` on `#participants-container h1`**: Adds spacing below the heading to separate it from the participant list.
2. **`margin-top` on `#participant-list`**: Ensures there is spacing between the heading and the list.
3. **`text-align`**: Aligns the text of the heading and the participant list as needed.
4. **`width`**: Ensures the participant list spans the full width of its container.

### Result
The `#participant-list` will now be positioned directly below `#participants-container h1` with proper spacing and alignment.

### Outcome: 
This gave me a better understanding of how to use 'margin' and led me to look into learning the css box model, I was also able to use this simple knowledge throughout the rest of my code.


## (2) Prompt to develop page switching - 
> When i go to another page and come back, (e.g begin in start.html, click to runner.html and then go back to start.html) I want the participantDivs that i created in index.js to still be there. how do i acheive this?
### Response: 
To ensure that the `participantDivs` persist when navigating between pages, you can use **localStorage** to save the participant data and reload it when the page is revisited. Here's how you can achieve this:

#### 1. **Save Participants to LocalStorage**
Update your index.js file to store the `participants` array in `localStorage` whenever a new participant is added.

Modify the `createParticipant.addEventListener` function:

```javascript
createParticipant.addEventListener('click', () => {
    const first_name = document.getElementById('first_name').value.trim();
    const last_name = document.getElementById('last_name').value.trim();

    if (first_name === '' || last_name === '') {
        alert('Please enter both first and last name.');
        return;
    }

    const full_name = `${first_name} ${last_name}`;

    // Generate a random number
    const randomNum = Math.floor(Math.random() * 1000) + 1;

    // Add participant to the array
    participants.push({ first_name, last_name, racerNum: randomNum });

    // Save participants to localStorage
    localStorage.setItem('participants', JSON.stringify(participants));

    // Display participant details
    const participantDiv = document.createElement('div');
    participantDiv.className = 'participant-entry';
    participantDiv.textContent = `${full_name} - Racer No.: ${randomNum}`;
    participantListContainer.appendChild(participantDiv);

    // Clear the input fields
    document.getElementById('first_name').value = '';
    document.getElementById('last_name').value = '';
});
```

#### 2. **Load Participants from LocalStorage**
When the page loads, retrieve the participants from `localStorage` and display them.

Add the following code to the bottom of your index.js file:

```javascript
window.addEventListener('DOMContentLoaded', () => {
    const storedParticipants = JSON.parse(localStorage.getItem('participants')) || [];

    // Update the participants array with stored data
    participants.push(...storedParticipants);

    // Display each participant
    storedParticipants.forEach((participant) => {
        const participantDiv = document.createElement('div');
        participantDiv.className = 'participant-entry';
        participantDiv.textContent = `${participant.first_name} ${participant.last_name} - Racer No.: ${participant.racerNum}`;
        participantListContainer.appendChild(participantDiv);
    });
});
```


#### 3. **Explanation**
1. **Saving to LocalStorage**:
   - When a new participant is added, the `participants` array is updated and saved to `localStorage` using `localStorage.setItem`.
   - The data is stored as a JSON string.

2. **Loading from LocalStorage**:
   - When the page loads, the `DOMContentLoaded` event retrieves the stored participants from `localStorage` using `localStorage.getItem`.
   - The data is parsed back into an array using `JSON.parse`.
   - Each participant is displayed by creating a `div` for them.

3. **Persistence**:
   - Since `localStorage` persists data even when the page is refreshed or navigated away, the participant list will remain intact when you return to the page.


#### 4. **Result**
- When you add a participant, their details are saved to `localStorage`.
- When you navigate away from `start.html` and return, the participant list will be reloaded from `localStorage` and displayed on the page.

### Outcome: 
This ended up not being very useful as I still wasn't able to access the data stored on one page when I switched to another. This led me to explore other ways of switching between pages, I initally had multiple html pages however after struggling to maintain local storage data (and not having a working server at the time) I decided to put all three my pages on one html file and seperate them by using the section tags. 

## (2.1) Prompt Prompt to develop page switching - 
> When this button is clicked i want the id=main-page to disappear and then the id=runner-page to appear

### Response:
To achieve this functionality, you can use JavaScript to toggle the visibility of the `#main-page` and `#runner-page` sections when the button is clicked.

#### Explanation
1. **Event Listener**:
   - The `addEventListener` is attached to the `.runner__button` element.
   - When the button is clicked, the default behavior of the `<a>` tag (navigating to `runner.html`) is prevented using `event.preventDefault()`.

2. **Toggle Visibility**:
   - The `#main-page` section is hidden by setting its `style.display` to `none`.
   - The `#runner-page` section is made visible by setting its `style.display` to `block`.

3. **Initial State**:
   - The `#runner-page` section is hidden by default using `style="display: none;"` in the HTML.

#### Result
When the "Runner" button is clicked:
- The `#main-page` section will disappear.
- The `#runner-page` section will appear, allowing the user to interact with the stopwatch and other elements.

### Outcome:
I then activating them when needed by adding the 'active' classList. Eventhough Ai wasn't completely useful in the first prompt, it led me to researching new options and learning different techniques.
Howver there were still issues when the contents of each section still poped up on pages outside of their container, so I turned to AI again to figure out how to fix this issue.


## (2.2) Prompt to develop page switching - 
> I dont want the lap-list-container to be visable when the main page is visable

### Response:
To ensure that the `lap-list-container` is not visible when the main page is visible, you can toggle its visibility by setting its `display` property to `none` when the main page is shown and to `block` when the runner page is shown.

#### Updated JavaScript
Modify your index.js file to include logic for hiding and showing the `lap-list-container`:

```javascript
// Main to runner
document.querySelector('.runner__button').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default behavior of the <a> tag

    // Hide the main page
    document.getElementById('main-page').style.display = 'none';

    // Show the runner page
    document.getElementById('runner-page').style.display = 'block';

    // Show the lap-list-container
    const lapListContainer = document.getElementById('lap-list-container');
    if (lapListContainer) {
        lapListContainer.style.display = 'block';
    }
});

// Runner to main
document.querySelector('.navbar__name').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default behavior of the <a> tag

    // Hide the runner page
    document.getElementById('runner-page').style.display = 'none';

    // Show the main page
    document.getElementById('main-page').style.display = 'block';

    // Hide the lap-list-container
    const lapListContainer = document.getElementById('lap-list-container');
    if (lapListContainer) {
        lapListContainer.style.display = 'none';
    }
});
```

#### Explanation
1. **Hiding the `lap-list-container`**:
   - When the main page is shown (`#main-page`), the `lap-list-container` is hidden by setting its `style.display` to `none`.

2. **Showing the `lap-list-container`**:
   - When the runner page is shown (`#runner-page`), the `lap-list-container` is made visible by setting its `style.display` to `block`.

3. **Conditional Check**:
   - The `if (lapListContainer)` check ensures that the code does not throw an error if the `lap-list-container` element does not exist in the DOM.

---

#### Optional: Default State in CSS
To ensure the `lap-list-container` is hidden by default when the page loads, you can add the following CSS rule:

```css
#lap-list-container {
    display: none; /* Hidden by default */
}
```

### Result
- When the main page is visible, the `lap-list-container` will be hidden.
- When the runner page is visible, the `lap-list-container` will be shown.

#### Outcome:
I thought that changes the style.display of the container from within the js file would be too repetitive as I'd have to do this with multiple other elements of the page so I modified the css to keep it hidden.



>  how can I integrate QRST here?
The suggestion worked with minor modifications.

### Prompts to develop GHIJ (example)
For the GHIJ feature I ...


