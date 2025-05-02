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