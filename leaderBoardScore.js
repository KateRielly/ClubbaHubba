import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
// TODO: import libraries for Cloud Firestore Database
// https://firebase.google.com/docs/firestore
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAH3oWF9S-ePd0352Ca-TdE5cu6oinzlXo",
    authDomain: "softwareengineering-94854.firebaseapp.com",
    projectId: "softwareengineering-94854",
    storageBucket: "softwareengineering-94854.appspot.com",
    messagingSenderId: "565847408909",
    appId: "1:565847408909:web:9e116dae6ede6b965bb044"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//on function start from kate's code when new meeting edited, triggers new pt total and then checkcs against leaderboard

// export async function clubList(){
//     // gets the documents from this query(if a field matches a given criteria)
//     const allClubs = await getDocs(collection(db, "clubs"));    
//     //loops through each club in firebase  
//     allClubs.forEach((clubs) => {
//          var pointTotal = 0;
//          var meetingCount = //need to access meetings and count that....
//     });
// }

//add pts to firebase; checka gainst top 3 (where am I storing top 3??);

// const parentDoc = doc(db, "clubs", username.id);
// const meetingCollection = collection(clubs, "all-meetings");
//update firebase on button click

export const updatePoints = async function(clubUsername, oAttendance, nAttendance, oldEventBoolean, eventBoolean){
   //in Kate's code
    var username = clubUsername;
    var oldAttendance = oAttendance;
    var newAttendance = nAttendance;
    var oldEvent = oldEventBoolean;
    var oldEventPoint = 0;
    var newEvent = eventBoolean;
    var newMeetingPoints = 1;

    const docRef = doc(db, "clubs", username);

    const docSnap = await getDoc(docRef);
    console.log("help");
    const pointTotal = docSnap.data().points;
    console.log(pointTotal);
    // const meetingsCollectionRef = collection(docRef, "all-meetings");
    // const databaseItem = doc(meetingsCollectionRef, meetingId);
    // const attendance = doc(databaseItem, "attendance");
    const memberCount = docSnap.data().memberCount;
    var oldAttendancePoint = oldAttendance/memberCount;
    var newAttendancePoint = newAttendance/memberCount;

    if (oldEvent == true){
      oldEventPoint = 3;
    }
    else{
      oldEventPoint = 2;
    }

    await updateDoc(doc(db, "clubs", username), {
        //resetting points to before prior edit:
        points: pointTotal - oldAttendancePoint - oldEventPoint,
      }
    );

    //resetting point total:
    const resetPointTotal = docSnap.data().points;

    //now calculate new points to add:
    if (newEvent == true){
      newMeetingPoints = newMeetingPoints + 3;
    }
    else{
      newMeetingPoints = newMeetingPoints + 2;
    }

    const newTotal = resetPointTotal + newMeetingPoints + newAttendancePoint;

    await updateDoc(doc(db, "clubs", username), {
      //adding newly calculated pt total additions from this meeting
        points: newTotal,
    });

////comparing with leaderboards:::
    const docRefTwoFirst = doc(db, "metadata", "L2first");
    const docSnapTwoFirst = await getDoc(docRefTwoFirst);
    const pointL2First = docSnapTwoFirst.data().points;
    
    const docRefTwoSecond = doc(db, "metadata", "L2second");
    const docSnapTwoSecond = await getDoc(docRefTwoSecond);
    const pointL2Second = docSnapTwoSecond.data().points;
    
    const docRefTwoThree = doc(db, "metadata", "L2third");
    const docSnapTwoThird = await getDoc(docRefTwoThree);
    const pointL2Third = docSnapTwoThird.data().points;

    const docRefThreeFirst = doc(db, "metadata", "L3first");
    const docSnapThreeFirst = await getDoc(docRefThreeFirst);
    const pointL3First = docSnapThreeFirst.data().points;

    const docRefThreeSecond = doc(db, "metadata", "L3second");
    const docSnapThreeSecond = await getDoc(docRefThreeSecond);
    const pointL3Second = docSnapThreeSecond.data().points;
    
    const docRefThreeThird = doc(db, "metadata", "L3third");
    const docSnapThreeThird = await getDoc(docRefThreeThird);
    const pointL3Third = docSnapThreeThird.data().points;

    const type = docSnap.data().type;

    //L2
    if (type == "L2"){
        if (newTotal > pointL2First){
          await updateDoc(doc(db, "clubs", "L2first"), {
            clubName: clubUsername,
            points: newTotal,
          });
        }
        else if(newTotal == pointL2First){
          var oldFirstPlaceL2 = docSnapTwoFirst.data().points;
          var oldFirstPlaceL2Name = docSnapTwoFirst.data().clubName;

          var oldSecondPlaceL2 = docSnapTwoSecond.data().points;
          var oldSecondPlaceL2Name = docSnapTwoSecond.data().clubName;
          
          await updateDoc(doc(db, "clubs", "L2first"), {
            clubName: clubUsername,
            points: newTotal,
          });
          await updateDoc(doc(db, "clubs", "L2second"), {
            clubName: oldFirstPlaceL2Name,
            points: oldFirstPlaceL2,
          });
          await updateDoc(doc(db, "clubs", "L2third"), {
            clubName: oldSecondPlaceL2Name,
            points: oldSecondPlaceL2,
          });

        }
        else if(newTotal > pointL2Second){
          await updateDoc(doc(db, "clubs", "L2second"), {
            clubName: clubUsername,
            points: newTotal,
          });
        }
        else if(newTotal == pointL2Second){
          var oldSecondPlaceL2 = docSnapTwoSecond.data().points;
          var oldSecondPlaceL2Name = docSnapTwoSecond.data().clubName;
          
          await updateDoc(doc(db, "clubs", "L2second"), {
            clubName: clubUsername,
            points: newTotal,
          });
          await updateDoc(doc(db, "clubs", "L2third"), {
            clubName: oldSecondPlaceL2Name,
            points: oldSecondPlaceL2,
          });
        }
        else if(newTotal >= pointL2Third){
          await updateDoc(doc(db, "clubs", "L2third"), {
            clubName: clubUsername,
            points: newTotal,
          });
        }
      }
     
      //L3
      if (type == "L3"){
        if (newTotal > pointL3First){
          await updateDoc(doc(db, "clubs", "L3first"), {
            clubName: clubUsername,
            points: newTotal,
          });
        }
        else if(newTotal == pointL3First){
          var oldFirstPlaceL3 = docSnapThreeFirst.data().points;
          var oldFirstPlaceL3Name = docSnapThreeFirst.data().clubName;

          var oldSecondPlaceL3 = docSnapThreeSecond.data().points;
          var oldSecondPlaceL3Name = docSnapThreeSecond.data().clubName;
          
          await updateDoc(doc(db, "clubs", "L3first"), {
            clubName: clubUsername,
            points: newTotal,
          });
          await updateDoc(doc(db, "clubs", "L3second"), {
            clubName: oldFirstPlaceL3Name,
            points: oldFirstPlaceL3,
          });
          await updateDoc(doc(db, "clubs", "L3third"), {
            clubName: oldSecondPlaceL3Name,
            points: oldSecondPlaceL3,
          });

        }
        else if(newTotal > pointL3Second){
          await updateDoc(doc(db, "clubs", "L3second"), {
            clubName: clubUsername,
            points: newTotal,
          });
        }
        else if(newTotal == pointL3Second){
          var oldSecondPlaceL3 = docSnapThreeSecond.data().points;
          var oldSecondPlaceL3Name = docSnapThreeSecond.data().clubName;
          
          await updateDoc(doc(db, "clubs", "L3second"), {
            clubName: clubUsername,
            points: newTotal,
          });
          await updateDoc(doc(db, "clubs", "L3third"), {
            clubName: oldSecondPlaceL3Name,
            points: oldSecondPlaceL3,
          });
        }
        else if(newTotal >= pointL3Third){
          await updateDoc(doc(db, "clubs", "L3third"), {
            clubName: clubUsername,
            points: newTotal,
          });
        }
      }
    }
      


//meeting (1 point)
//percentage of ppl @ meeting (percentage of a pt)
//beyond general membership (2 points)

//Each club needs pt total; on meeting fillout, trigger meeting count, which triggers pointUpdate; point update adds a pt for having a meeting, percentage of pt, and wokrs iwth any tag values; then will need to update leaderboard depending

// var meetingCount = 0;
// var

// //called in kate's code when form filled out
// function meetingCount(){
//   meetingCount ++;
//   updatePoints();
// }

// function updatePoints(){

// }

// Meetings (array)
// 	0 (map)
// 		attendance (number)
// 		date (timestamp)
// 		description (string)



      // //appending to leaderboard - L2
      // //code building homepage (script.js)
      // var L2First = document.getElementById("firstLTwo");
      // L2First.innerHTMl = docSnapTwoFirst.data().clubName;
      
      // var L2Second = document.getElementById("secondLTwo");
      // L2Second.innerHTMl = docSnapTwoSecond.data().clubName;

      // var L2Third = document.getElementById("thirdLTwo");
      // L2Third.innerHTMl = docSnapTwoFirst.data().clubName;

      // var L2First = document.getElementById("firstLTwo");
      // L2First.innerHTMl = docSnapTwoFirst.data().clubName;

      // var L2First = document.getElementById("firstLTwo");
      // L2First.innerHTMl = docSnapTwoFirst.data().clubName;

      // var L2First = document.getElementById("firstLTwo");
      // L2First.innerHTMl = docSnapTwoFirst.data().clubName;


    export const loadLeaderboard = async function(){
      //appending to leaderboard - L2
     const docRefTwoFirst = doc(db, "metadata", "L2first");
     const docSnapTwoFirst = await getDocs(docRefTwoFirst);
            
     const docRefTwoSecond = doc(db, "metadata", "L2second");
     const docSnapTwoSecond = await getDocs(docRefTwoSecond);
            
     const docRefTwoThree = doc(db, "metadata", "L2third");
     const docSnapTwoThird = await getDocs(docRefTwoThree);
        
     const docRefThreeFirst = doc(db, "metadata", "L3first");
     const docSnapThreeFirst = await getDocs(docRefThreeFirst);
        
     const docRefThreeSecond = doc(db, "metadata", "L3second");
     const docSnapThreeSecond = await getDocs(docRefThreeSecond);
            
     const docRefThreeThird = doc(db, "metadata", "L3third");
     const docSnapThreeThird = await getDocs(docRefThreeThird);
       
     var L2First = document.getElementById("firstLTwo");
     L2First.innerHTMl = docSnapTwoFirst.data().clubName;
      
     var L2Second = document.getElementById("secondLTwo");
     L2Second.innerHTMl = docSnapTwoSecond.data().clubName;

     var L2Third = document.getElementById("thirdLTwo");
     L2Third.innerHTMl = docSnapTwoThird.data().clubName;

     var L2First = document.getElementById("firstLTwo");
     L2First.innerHTMl = docSnapThreeFirst.data().clubName;

     var L2First = document.getElementById("firstLTwo");
     L2First.innerHTMl = docSnapThreeSecond.data().clubName;

     var L2First = document.getElementById("firstLTwo");
     L2First.innerHTMl = docSnapThreeThird.data().clubName;

    }
