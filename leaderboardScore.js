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

//The function
export const updatePoints = async function(clubUsername, oAttendance, nAttendance, oldEventBoolean, eventBoolean){
   //in Kate's code

   console.log(clubUsername);
   console.log(oAttendance);
   console.log(nAttendance);
   console.log(oldEventBoolean);
   console.log(eventBoolean);

    var username = clubUsername;
    //attendance from previous edit of meeting
    var oldAttendance = oAttendance;
    //attendance changed to now
    var newAttendance = nAttendance;
    //whether or not meeting was previously an event
    var oldEvent = oldEventBoolean;
    //previous points dedicated to whether meeting was an event or not
    var oldEventPoint = 0;
    //whether or not meeting is now an event
    var newEvent = eventBoolean;
    //ppints for event or not
    var newMeetingPoints = 0;
    //point total which is local until it updates in firebase at the very end One time.
    var localPointTotal = 0;

    const docRef = doc(db, "clubs", username);

    const docSnap = await getDoc(docRef);
    console.log("help");
    //getting pointTotal for club from firebase
    const pointTotal = docSnap.data().points;
    console.log("old total" + pointTotal);
    // const meetingsCollectionRef = collection(docRef, "all-meetings");
    // const databaseItem = doc(meetingsCollectionRef, meetingId);
    // const attendance = doc(databaseItem, "attendance");
    
    //number of members in club
    const memberCount = docSnap.data().memberCount;

    //calculating point for attendances
    var oldAttendancePoint = oldAttendance/memberCount;
    var newAttendancePoint = newAttendance/memberCount;
    console.log("oldattendance: " + oldAttendance);
    console.log("newattendance: " + newAttendance);
    console.log("oldattendancept: " + oldAttendancePoint);
    console.log("newattendancept: " + newAttendancePoint);

    //calculating previous points designated to meeting vs event
    if (oldEvent == true){
      oldEventPoint = 3;
    }
    else{
      oldEventPoint = 2;
    }

    console.log("og point total = " + pointTotal);

    //setting local point total to point total without any points related to this meeting. No duplicate points for one meeting.
    localPointTotal = pointTotal - oldAttendancePoint - oldEventPoint;

    console.log("reset point total = " + localPointTotal);


    // await updateDoc(doc(db, "clubs", username), {
    //     //resetting points to before prior edit:
    //     points: pointTotal - (oldAttendancePoint + oldEventPoint),
    //   }
    // );
    // // var refreshedPoints = pointTotal - (oldAttendancePoint + oldEventPoint);
    // console.log("is this what we want" + (pointTotal - oldAttendancePoint - oldEventPoint));

    //resetting point total:
    // const resetPointTotal = docSnap.data().points;
    // console.log("refreshed pt total, not inclduing thsi event: " + resetPointTotal);
    
    // calculate new points to add:
    //points for event vs. meeting
    console.log("before calc" + newEvent);
    if (newEvent == true){
      newMeetingPoints = newMeetingPoints + 3;
      console.log("is event")
    }
    else{
      newMeetingPoints = newMeetingPoints + 2;
    }

    console.log(newMeetingPoints);
    //adding new, updated points for meeting to meeting total
    localPointTotal = localPointTotal + newMeetingPoints + newAttendancePoint;

    console.log("end newTotal = " + localPointTotal);

    updateDoc(doc(db, "clubs", username), {
      //adding newly calculated pt total additions from this meeting
        points: localPointTotal,
    });

    console.log("did you make it?");

////comparing with leaderboards:::
    //getting leaderboard point totals (1st-3rd places for L2 and L3 clubs)
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
    console.log(type);


    //L2 - update 1st place if this club's total is now bigger
    if (type == "L2"){
      console.log("got to second part");
        if (localPointTotal > pointL2First){
          console.log("bigger point total")
          var oldFirstPlaceL2 = docSnapTwoFirst.data().points;
          var oldFirstPlaceL2Name = docSnapTwoFirst.data().clubName;

          var oldSecondPlaceL2 = docSnapTwoSecond.data().points;
          var oldSecondPlaceL2Name = docSnapTwoSecond.data().clubName;
          
          await updateDoc(doc(db, "metadata", "L2first"), {
            clubName: clubUsername,
            points: localPointTotal,
          });
          await updateDoc(doc(db, "metadata", "L2second"), {
            clubName: oldFirstPlaceL2Name,
            points: oldFirstPlaceL2,
          });
          await updateDoc(doc(db, "metadata", "L2third"), {
            clubName: oldSecondPlaceL2Name,
            points: oldSecondPlaceL2,
          });
        }
            //if they have the same total, put new club 1st and bumb current leader to second and second to third
        else if(localPointTotal == pointL2First){
          var oldFirstPlaceL2 = docSnapTwoFirst.data().points;
          var oldFirstPlaceL2Name = docSnapTwoFirst.data().clubName;

          var oldSecondPlaceL2 = docSnapTwoSecond.data().points;
          var oldSecondPlaceL2Name = docSnapTwoSecond.data().clubName;
          
          await updateDoc(doc(db, "metadata", "L2first"), {
            clubName: clubUsername,
            points: localPointTotal,
          });
          await updateDoc(doc(db, "metadata", "L2second"), {
            clubName: oldFirstPlaceL2Name,
            points: oldFirstPlaceL2,
          });
          await updateDoc(doc(db, "metadata", "L2third"), {
            clubName: oldSecondPlaceL2Name,
            points: oldSecondPlaceL2,
          });

        }
            //if bigger than second place, replace
        else if(localPointTotal > pointL2Second){
          var oldSecondPlaceL2 = docSnapTwoSecond.data().points;
          var oldSecondPlaceL2Name = docSnapTwoSecond.data().clubName;
          
          await updateDoc(doc(db, "metadata", "L2second"), {
            clubName: clubUsername,
            points: localPointTotal,
          });
          await updateDoc(doc(db, "metadata", "L2third"), {
            clubName: oldSecondPlaceL2Name,
            points: oldSecondPlaceL2,
          });
        }
        else if(localPointTotal == pointL2Second){
          var oldSecondPlaceL2 = docSnapTwoSecond.data().points;
          var oldSecondPlaceL2Name = docSnapTwoSecond.data().clubName;
          
          await updateDoc(doc(db, "metadata", "L2second"), {
            clubName: clubUsername,
            points: localPointTotal,
          });
          await updateDoc(doc(db, "metadata", "L2third"), {
            clubName: oldSecondPlaceL2Name,
            points: oldSecondPlaceL2,
          });
        }
        else if(localPointTotal >= pointL2Third){
          await updateDoc(doc(db, "metadata", "L2third"), {
            clubName: clubUsername,
            points: localPointTotal,
          });
        }
      }
     
      //L3
      if (type == "L3"){
        if (localPointTotal > pointL3First){
          var oldFirstPlaceL3 = docSnapThreeFirst.data().points;
          var oldFirstPlaceL3Name = docSnapThreeFirst.data().clubName;

          var oldSecondPlaceL3 = docSnapThreeSecond.data().points;
          var oldSecondPlaceL3Name = docSnapThreeSecond.data().clubName;
          
          await updateDoc(doc(db, "metadata", "L3first"), {
            clubName: clubUsername,
            points: localPointTotal,
          });
          await updateDoc(doc(db, "metadata", "L3second"), {
            clubName: oldFirstPlaceL3Name,
            points: oldFirstPlaceL3,
          });
          await updateDoc(doc(db, "metadata", "L3third"), {
            clubName: oldSecondPlaceL3Name,
            points: oldSecondPlaceL3,
          });
        }
        else if(localPointTotal == pointL3First){
          var oldFirstPlaceL3 = docSnapThreeFirst.data().points;
          var oldFirstPlaceL3Name = docSnapThreeFirst.data().clubName;

          var oldSecondPlaceL3 = docSnapThreeSecond.data().points;
          var oldSecondPlaceL3Name = docSnapThreeSecond.data().clubName;
          
          await updateDoc(doc(db, "metadata", "L3first"), {
            clubName: clubUsername,
            points: localPointTotal,
          });
          await updateDoc(doc(db, "metadata", "L3second"), {
            clubName: oldFirstPlaceL3Name,
            points: oldFirstPlaceL3,
          });
          await updateDoc(doc(db, "metadata", "L3third"), {
            clubName: oldSecondPlaceL3Name,
            points: oldSecondPlaceL3,
          });

        }
        else if(localPointTotal > pointL3Second){
          var oldSecondPlaceL3 = docSnapThreeSecond.data().points;
          var oldSecondPlaceL3Name = docSnapThreeSecond.data().clubName;
          
          await updateDoc(doc(db, "metadata", "L3second"), {
            clubName: clubUsername,
            points: localPointTotal,
          });
          await updateDoc(doc(db, "metadata", "L3third"), {
            clubName: oldSecondPlaceL3Name,
            points: oldSecondPlaceL3,
          });
        }
        else if(localPointTotal == pointL3Second){
          var oldSecondPlaceL3 = docSnapThreeSecond.data().points;
          var oldSecondPlaceL3Name = docSnapThreeSecond.data().clubName;
          
          await updateDoc(doc(db, "metadata", "L3second"), {
            clubName: clubUsername,
            points: localPointTotal,
          });
          await updateDoc(doc(db, "metadata", "L3third"), {
            clubName: oldSecondPlaceL3Name,
            points: oldSecondPlaceL3,
          });
        }
        else if(localPointTotal >= pointL3Third){
          await updateDoc(doc(db, "metadata", "L3third"), {
            clubName: clubUsername,
            points: localPointTotal,
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

//fucntion to add leaderboard to home page
    export const loadLeaderboard = async function(){
      //gets data
     const docRefTwoFirst = doc(db, "metadata", "L2first");
     const docSnapTwoFirst = await getDoc(docRefTwoFirst);
            
     const docRefTwoSecond = doc(db, "metadata", "L2second");
     const docSnapTwoSecond = await getDoc(docRefTwoSecond);
            
     const docRefTwoThree = doc(db, "metadata", "L2third");
     const docSnapTwoThird = await getDoc(docRefTwoThree);
        
     const docRefThreeFirst = doc(db, "metadata", "L3first");
     const docSnapThreeFirst = await getDoc(docRefThreeFirst);
        
     const docRefThreeSecond = doc(db, "metadata", "L3second");
     const docSnapThreeSecond = await getDoc(docRefThreeSecond);
            
     const docRefThreeThird = doc(db, "metadata", "L3third");
     const docSnapThreeThird = await getDoc(docRefThreeThird);

        //adds data to page
     var L2First = document.getElementById("firstLTwo");
     L2First.innerHTML = docSnapTwoFirst.data().clubName;
      
     var L2Second = document.getElementById("secondLTwo");
     L2Second.innerHTML = docSnapTwoSecond.data().clubName;

     var L2Third = document.getElementById("thirdLTwo");
     L2Third.innerHTML = docSnapTwoThird.data().clubName;

     var L2First = document.getElementById("firstLThree");
     L2First.innerHTML = docSnapThreeFirst.data().clubName;

     var L2First = document.getElementById("secondLThree");
     L2First.innerHTML = docSnapThreeSecond.data().clubName;

     var L2First = document.getElementById("thirdLThree");
     L2First.innerHTML = docSnapThreeThird.data().clubName;

    }
