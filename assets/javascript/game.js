 // Initialize Firebase
 var config = {
  apiKey: "AIzaSyBbeOfRzwsqhArdosORDieuVvJ4tJ_TKJw",
  authDomain: "train-scheduler-aa411.firebaseapp.com",
  databaseURL: "https://train-scheduler-aa411.firebaseio.com",
  projectId: "train-scheduler-aa411",
  storageBucket: "",
  messagingSenderId: "296599220177"
};

firebase.initializeApp(config);

var database = firebase.database();

// Button for adding trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  //grabs user input 
  var trainName = $("#train-name-input").val().trim();
  var trainDest = $("#destination-input").val().trim();
  var trainStart = moment($("#start-input").val().trim(), "HH:mm").format("hh:mm a");
  var trainRate = $("#rate-input").val().trim();

  //temp object for holding data
  var newTrain = {
    name: trainName,
    destination: trainDest,
    start: trainStart,
    rate: trainRate
  };

  //upload train data to database
  database.ref().push(newTrain);

  //logs to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.start);
  console.log(newTrain.rate);

  //clears textboxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#rate-input").val("");

});

//Firebase event for adding trains to database and row in HTML
database.ref().on("child_added", function(childSnapshot, prevChildKey){

  console.log(childSnapshot.val());

  //store data in variable
  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().destination;
  var trainStart = childSnapshot.val().start;
  var trainRate = childSnapshot.val().rate;

  //Train info
  console.log(trainName);
  console.log(trainDest);
  console.log(trainStart);
  console.log(trainRate);

  //Time converter
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(trainStart, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + currentTime.format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % trainRate;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = trainRate - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
  trainRate + "</td><td>" + moment(nextTrain).format("hh:mm a") + "</td><td>" +tMinutesTillTrain + "</td></tr>");

})
