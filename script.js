import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
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
}

export const displayClubsInDanger = async function() {
  console.log("THIS IS BEING CALLED!!!!")
  var clubsInDangerDiv = document.getElementById("clubsInDangerDiv");
  console.log(clubsInDangerDiv);
  const databaseItems = await getDocs(collection(db, "clubs"));

  
  const todaysDate = new Date();
  // Calculate the date for two months ago
  const twoMonthsAgo = new Date(todaysDate);
  twoMonthsAgo.setMonth(todaysDate.getMonth() - 2);
  console.log(twoMonthsAgo);
  
  const clubsInDanger = [];
  
  // Loop through database items to find clubs that haven't met in the last two months
  databaseItems.forEach(club => {
    const lastMeetingDate = club.data().lastMeeting; // Ensure this is a Date object
    if (lastMeetingDate <= twoMonthsAgo) {
      clubsInDanger.push(club);
      console.log("eyooo");
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
      location.replace("clubDash.html");
      sessionStorage.setItem("club", club.data().username);
      //This does something when the club tile is clicked
      }
    clubsInDangerDiv.appendChild(clubInDanger);
  });
}
