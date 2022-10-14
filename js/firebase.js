

const firebaseConfigCategory = {
  apiKey: "AIzaSyBJfTD04RxgU5Z-gHaJjNR-8YfaiR_67Lo",
  authDomain: "smart-capsule-website.firebaseapp.com",
  projectId: "smart-capsule-website",
  databaseURL: "https://smart-capsule-website-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "smart-capsule-website.appspot.com",
  messagingSenderId: "989610270484",
  appId: "1:989610270484:web:fbd7ece76a83bbaacd6c01",
  measurementId: "G-13K3T4WP8M"
};

const firebaseConfigVehicle = {
  apiKey: "AIzaSyBigzK6v0Ia3QC6P5-246HPWqpFwdPVLTc",
  authDomain: "capsules-vehicles.firebaseapp.com",
  databaseURL: "https://capsules-vehicles-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "capsules-vehicles",
  storageBucket: "capsules-vehicles.appspot.com",
  messagingSenderId: "1071924838424",
  appId: "1:1071924838424:web:cfb7cbc9dfa1a281b4036d",
  measurementId: "G-3VL1BLJPN4"
};

const firebaseConfigLiving = {
  apiKey: "AIzaSyClH1iUeF82WHHHpJCKL2L4bKBpYbxjbVA",
  authDomain: "capsule-living.firebaseapp.com",
  databaseURL: "https://capsule-living-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "capsule-living",
  storageBucket: "capsule-living.appspot.com",
  messagingSenderId: "922230372839",
  appId: "1:922230372839:web:ce064f8049eff00eb2a542",
  measurementId: "G-KB4R52KH44"
};

firebase.initializeApp(firebaseConfigCategory, "categoryDatabase");
firebase.initializeApp(firebaseConfigVehicle, "vehicleDatabase");
firebase.initializeApp(firebaseConfigLiving, "livingDatabase");

function uuidv4() {

  return ([1e7]+-1e3+-6e4).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 14 >> c / 4).toString(16)
  );
}

Object.defineProperty(String.prototype, 'capitalize', {

  value: function() {

    var words = (this).split(" ");
    var finalText = "";
    for (var i = 0; i < words.length; i++) {

      finalText += words[i].charAt(0).toUpperCase() + words[i].slice(1) + " ";
    }
    return finalText.slice(0, (finalText.length)-1);
  },
  enumerable: false
});

function getInput(id) {

  return document.getElementById(id).value.toLowerCase();
}

// $(".edit-category-buttton").removeClass("d-none")
