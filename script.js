import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, getDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyAH3oWF9S-ePd0352Ca-TdE5cu6oinzlXo",
    authDomain: "softwareengineering-94854.firebaseapp.com",
    projectId: "softwareengineering-94854",
    storageBucket: "softwareengineering-94854.appspot.com",
    messagingSenderId: "565847408909",
    appId: "1:565847408909:web:9e116dae6ede6b965bb044"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ——————LOGIN CODE TO VERIFY THE ADMIN IS LOGED IN—————//
export const login =  function(email, password){
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      location.replace('god.html');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }

  export const verification = async function(){
    const user = auth.currentUser;
    if (user) {
      return;
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      // ...
    } else {
      // No user is signed in.
      location.replace('login.html');
    }
  }

export const checkLogin = async function(){
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
            window.location.href = "login.html";
      // ...
    } 
  });
}//I WANT TO MAKE THIS DO SOMETING ELSE CASUE I NEED IT TO WORK ACROSS THE WEBSITE/APP!!!


// ————————  CLUBS IN DANGER SIDE BAR LIST CODE!!!! ———— //
export const displayClubsInDanger = async function() {
  console.log("displayClubsInDanger IS BEING CALLED")
  var clubsInDangerDiv = document.getElementById("clubsInDangerDiv");
  const databaseItems = await getDocs(collection(db, "clubs"));

  
  const todaysDate = new Date();
  // Calculate the date for two months ago
  const twoMonthsAgo = new Date(todaysDate);
  twoMonthsAgo.setMonth(todaysDate.getMonth() - 2);
  console.log(twoMonthsAgo);
  
  const clubsInDanger = [];
  
  // Loop through database items to find clubs that haven't met in the last two months
  databaseItems.forEach(club => {
    const data = club.data();
    const lastMeetingTimestamp = data.lastMeeting;
  
    // Convert Firestore Timestamp to JavaScript Date
    const lastMeetingDate = lastMeetingTimestamp.toDate();
  
    if (lastMeetingDate <= twoMonthsAgo) {
      clubsInDanger.push(club);
    }
  });

  // Render clubs in danger in the div
  clubsInDanger.sort((a, b) => {
    const nameA = a.data().clubName.toLowerCase();
    const nameB = b.data().clubName.toLowerCase();
    return nameA.localeCompare(nameB);
  });
  
  clubsInDanger.forEach(club => {
    var clubInDanger = document.createElement("button");
    clubInDanger.classList.add('dangerButton');
    clubInDanger.innerHTML=club.data().clubName;
    clubInDanger.onclick = function() {
      sessionStorage.setItem("adminClub", club.data().username);
      location.reload();
      }
    clubsInDangerDiv.appendChild(clubInDanger);
  });
}

//—————————THIS IS MY SEARCH BAR CODE!!! —————————————//
// Make an empty list to store all the clubs from the database
let clubList = [];

// This function grabs the clubs from the Firestore database and adds them to the clubList array
export const createClubList = async function () {
  const databaseItems = await getDocs(collection(db, "clubs")); // Get all the club documents from Firestore
  const names = document.getElementById("clubs");
  if (names) names.innerHTML = ""; // If there's a "clubs" element, clear whatever was in it

  // Loop through all the club data we got from Firestore
  databaseItems.forEach((item) => {
    const clubName = item.data().clubName;
    const clubUsername = item.data().username;  // Get the username from Firestore
    clubList.push({ clubName, clubUsername });      // Store as object with both values
  });
};

// This class handles the instant search functionality (like a search bar that shows results as you type)
class InstantSearch {
  constructor(instantSearch, options) {
    this.options = options;
    this.elements = {
      main: instantSearch, // Main container for the search
      input: instantSearch.querySelector(".instant-search__input"), // The actual search input box
      resultsContainer: document.createElement("div") // A div to hold the search results
    };

    // Style the results container and add it under the search input
    this.elements.resultsContainer.classList.add("instant-search__results-container");
    this.elements.main.appendChild(this.elements.resultsContainer);
    this.addListeners(); // Set up the event listeners (stuff like typing and focusing)
  }

  addListeners() {
    let delay; // Used to create a little pause before running the search (so it’s not too fast)

    this.elements.input.addEventListener("input", () => {
      clearTimeout(delay); // Stop the previous timer if you're still typing
      const query = this.elements.input.value; // Get what the user typed

      // Wait 300ms before searching (like a tiny delay so we’re not searching every single keystroke)
      delay = setTimeout(() => {
        if (query.length < 1) {
          this.populateResults([]); // If the search box is empty, show nothing
          return;
        }

        // Search through the clubList and show the matching results
        this.performSearch(query).then(results => {
          this.populateResults(results);
        });
      }, 300);
    });

    // When the input is focused (clicked into), show the results box
    this.elements.input.addEventListener("focus", () => {
      this.elements.resultsContainer.classList.add("instant-search__results-container--visible");
    });

    // When you click away from the input, hide the results after a short delay
    this.elements.input.addEventListener("blur", () => {
      setTimeout(() => {
        this.elements.resultsContainer.classList.remove("instant-search__results-container--visible");
      }, 200);
    });
  }

  // This puts the search results into the DOM
  populateResults(results) {
    this.elements.resultsContainer.innerHTML = ""; // Clear any old results

    if (results.length === 0) {
      // If nothing matches the search, show a "no results" message
      const noResultDiv = document.createElement("div");
      noResultDiv.classList.add("instant-search__no-results");
      noResultDiv.textContent = "No clubs found.";
      this.elements.resultsContainer.appendChild(noResultDiv);
      return;
    }

    // If there are matches, add each one to the results container
    for (const result of results) {
      this.elements.resultsContainer.appendChild(this.createResultElement(result));
    }
  }

  createResultElement(result) {
    const anchor = document.createElement("a");
    anchor.classList.add("instant-search__result");  
    anchor.innerHTML = this.options.templateFunction(result);
  
    anchor.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default link behavior
      
      // Save the club username to session storage
      // Assuming 'result' has a property 'clubUsername' holding that value
      sessionStorage.setItem('adminClub', result.clubUsername);
      // Reload the current page
      location.reload();
    });
  
    return anchor;
  }
  

  // This function actually filters the clubList to find matches based on what was typed
  performSearch(query) {
    const lowerQuery = query.toLowerCase(); // Make search case-insensitive
    const results = clubList
    .filter(club => club.clubName.toLowerCase().includes(lowerQuery))
    .map(club => ({ clubName: club.clubName, clubUsername: club.clubUsername })); // Return full objects
    return Promise.resolve(results); // Return the results as a promise
  }
}

// Run this after all the clubs are loaded from the database
createClubList().then(() => {
  const searchUsers = document.querySelector("#searchUsers"); // Find the search box in the HTML
  if (searchUsers) {
    // Start the InstantSearch on that element
    new InstantSearch(searchUsers, {
      templateFunction: result => `<div class="instant-search__title">${result.clubName}</div>` // Format for each result
    });
  }
});

// ———— decided to make the admin club info box an onload 
// function cause im not going to push my luck ——————///

export async function renderAdminClubInfo() {
  var clubName = document.getElementById("adminClubName");
  clubName.innerHTML = "";
  var clubInfo = document.getElementById("adminaboutClub");
  clubInfo.innerHTML="";

  var adminClub = sessionStorage.getItem('adminClub');
  if (adminClub) {

    const parentDocRef = doc(db, "clubs", adminClub);
    const clubDoc = await getDoc(parentDocRef);
    
    // sets header to the club name
    clubName.innerHTML = clubDoc.data().clubName;
  
  var clubUsername = document.createElement("h4");
  clubUsername.innerHTML =  `<strong>Username:</strong> ${adminClub}`;

  var clubPassword = document.createElement("h4");
  clubPassword.innerHTML =  `<strong>Password:</strong> ${clubDoc.data().password}`;

  var clubBio = document.createElement("h4");
  clubBio.innerHTML =  `<strong>Bio:</strong> ${clubDoc.data().bio}`;

  var meetingPlan = document.createElement("h4");
  meetingPlan.innerHTML = `<strong>Meeting frequency:</strong> ${clubDoc.data().meetingTime}`;

  var numMembers = document.createElement("h4");
  numMembers.innerHTML = `<strong>Number of members:</strong> ${clubDoc.data().memberCount}`;

  var leaderNames = document.createElement("h4");
  leaderNames.innerHTML = `<strong>Leaders:</strong> ${clubDoc.data().clubLeaders.join(", ")}`;

  console.log("read commands");

  // appends created objects to the html
  clubInfo.appendChild(clubUsername);
  clubInfo.appendChild(clubPassword);
  clubInfo.appendChild(leaderNames);
  clubInfo.appendChild(clubBio);
  clubInfo.appendChild(meetingPlan);
  clubInfo.appendChild(numMembers);


  // —————RIGHT SIDE OF ADMIN CLUB INFO PAGE—————//
  var adminInDangerDiv = document.getElementById("adminInDangerDiv");
  adminInDangerDiv.innerHTML="";
  var InDagerNoticeWrapper = document.createElement("div");
  InDagerNoticeWrapper.className = "DangerNotifWrapper"
  var InDagerNotice = document.createElement("div");
  InDagerNotice.innerHTML =  "haha";
  InDagerNotice.className = "DangerNotifDiv"
  if(await isClubInDanger(adminClub)){
    InDagerNotice.innerHTML =  "Not Active";
    InDagerNotice.style.backgroundColor = 'rgba(224, 20, 37, 0.766)';
    InDagerNotice.style.color = 'white'

    var inDangerMessage = document.createElement("h4");
    inDangerMessage.innerHTML =  "This club has not met in over two months...";
  }
  else{
    InDagerNotice.innerHTML =  "Active";
    InDagerNotice.style.backgroundColor = 'rgb(71,160,37)';

    var inDangerMessage = document.createElement("h4");
    inDangerMessage.innerHTML =  "This club has met within two months. This means it is curently active and there is no casue for concern!";
  }

  adminInDangerDiv.appendChild(InDagerNoticeWrapper);
  InDagerNoticeWrapper.appendChild(InDagerNotice);
  adminInDangerDiv.appendChild(inDangerMessage);
  } 
  
  else {
    console.log("No adminClub set in session storage yet.");
  }
  // ————— Left side future meeting div!!!———————//
  const parentDocRef = doc(db, "clubs", adminClub);
  const clubDoc = await getDoc(parentDocRef);
  const clubID = clubDoc.id;
  const docRef = doc(db, "clubs", clubID);
  const meetingsCollectionRef = collection(docRef, "all-meetings");
  const databaseItems = await getDocs(meetingsCollectionRef);
  //push aproprate meetings to each array (past and future)
  const pastMeetings = [];
  const futureMeetings = [];
  databaseItems.forEach((meeting) => {
    // Create a meeting object with necessary data.
    let meet = {
      date: meeting.data().date.toDate(),
      description: meeting.data().description,
      meetingID: meeting.id,
      attendance: meeting.data().attendance,
      location: meeting.data().location,
      isAnEvent: meeting.data().isAnEvent
    };
    // Gets today's date to compare meetings.
    let today = new Date();
    // Check if the meeting's date is in the future or past and push to appropriate array.
    if(meet.date > today){
      futureMeetings.push(meet); // Future meeting
    }
    else{
      pastMeetings.push(meet); // Past meeting
    }
  });
  // Sort both future and past meetings by date using helper function (compareDates).
  pastMeetings.sort(compareReverseDates);
  futureMeetings.sort(compareDates);

  var nextMeet = document.getElementById("adminNextMeeting"); // Get reference to "adminNextMeeting" section.
  nextMeet.innerHTML="";
  var meetingDiv = document.createElement("div");
  var meetingInfo = document.createElement("div");
  // Add appropriate classes for styling
  meetingInfo.classList.add('meetingBox');
  meetingDiv.classList.add('meetingDiv');
  meetingDiv.appendChild(meetingInfo);
  const nextMeeting = futureMeetings[0];

if (nextMeeting) {
  let meetingType = nextMeeting.isAnEvent ? "Event" : "Meeting";

  meetingInfo.innerHTML = `
    <h3>Next ${meetingType}</h3>
    <p><strong>Date:</strong> ${nextMeeting.date.toLocaleDateString()}</p>
    <p><strong>Time:</strong> ${nextMeeting.date.toLocaleTimeString()}</p>
    <p><strong>Location:</strong> ${nextMeeting.location}</p>
    <p><strong>Description:</strong> ${nextMeeting.description}</p>
  `;

  nextMeet.appendChild(meetingDiv);
} 
else {
  meetingInfo.innerHTML = `<p>No upcoming meetings found.</p>`;
  nextMeet.appendChild(meetingDiv);
  nextMeet.style.display = "flex";
  nextMeet.style.justifyContent = "center";
  meetingInfo.style.textAlign = "center";
}

var pastMeetingLog = document.getElementById("adminPastMeetings");
pastMeetingLog.innerHTML = "";
pastMeetings.forEach((pastMeeting) => {
  var pastMeetingDiv = document.createElement("div");
  var pastMeetingInfo = document.createElement("div");
  pastMeetingInfo.classList.add('meetingBox');
  pastMeetingDiv.classList.add('meetingDiv');

  var meetingType = "Meeting";
  if (pastMeeting.isAnEvent == true){
    meetingType = "Event";
  }

  console.log(pastMeeting);
  // Populate meeting details for past meetings
  pastMeetingInfo.innerHTML = `
    <p>Date: ${pastMeeting.date.toLocaleDateString()}</p>
    <p>Time: ${pastMeeting.date.toLocaleTimeString()}</p>

    <div class="infoContainer">
      <span>Location:</span>
      <span>${pastMeeting.location}</span>
    </div>
    
    <div class="infoContainer">
      <span>Attendance:</span>
      <span>${pastMeeting.attendance}</span>
    </div>

    <div class="infoContainer">
      <span>Type:</span>
      <span>${meetingType}</span>
    </div>
    
    <div class="infoContainer">
      <span>Meeting recap:</span>
      <span>${pastMeeting.description}</span>
    </div>
  `;

  // Append the meeting div to the "meetingLog" section
  pastMeetingDiv.appendChild(pastMeetingInfo); // This was missing
  pastMeetingLog.appendChild(pastMeetingDiv);
});
}

// ————— Helper Function for displeying the meeting info ————//
async function isClubInDanger(username) {
  const parentDocRef = doc(db, "clubs", username);
    const clubDoc = await getDoc(parentDocRef);

  const todaysDate = new Date();
  const twoMonthsAgo = new Date(todaysDate);
  twoMonthsAgo.setMonth(todaysDate.getMonth() - 2);
  console.log(twoMonthsAgo);

  const lastMeetingTimestamp = clubDoc.data().lastMeeting;
  const lastMeetingDate = lastMeetingTimestamp.toDate();
  console.log(lastMeetingDate);
  
  if (lastMeetingDate <= twoMonthsAgo) {
    console.log("true");
    return true;
  }

  console.log("False");
  return false;
}

// Helper function(s): 
function compareDates(meetingA, meetingB) {
  return new Date(meetingA.date) - new Date(meetingB.date);
}

function compareReverseDates(meetingA, meetingB) {
  return new Date(meetingB.date) - new Date(meetingA.date);
}
