
let authRef = firebase.app("categoryDatabase").database().ref('user-login');

var authArrayLoad = false;
var authArray = [];
authRef.on("value", function(snapshot) {

  authArray = [];
  for (let key in snapshot.val()) {

    authArray.push({

      key: key,
      id: snapshot.val()[key].log,
    });
  }
  authArrayLoad = true;
  authArray.reverse();

}, function(error) {
  console.log("Error: " + error.code);
});

var provider = new firebase.auth.GoogleAuthProvider();

function login() {

  firebase.app("categoryDatabase").auth().signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;

      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      window.location.href = "/admin/dashboard.html";
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
  });
}

function loginBranch() {

  if (firebase.app("categoryDatabase").auth().currentUser != null) {

    if (firebase.app("vehicleDatabase").auth().currentUser == null) {

      firebase.app("vehicleDatabase").auth().signInWithEmailAndPassword(authArray[0].id, authArray[0].key)
        .then((userCredential) => {

        })
        .catch((error) => {

          var errorCode = error.code;
          var errorMessage = error.message;
        });
    }

    if (firebase.app("livingDatabase").auth().currentUser == null) {

      firebase.app("livingDatabase").auth().signInWithEmailAndPassword(authArray[0].id, authArray[0].key)
        .then((userCredential) => {

        })
        .catch((error) => {

          var errorCode = error.code;
          var errorMessage = error.message;
        });
    }
  } else {

    window.location.href = "/admin/login.html";
  }
}

function signOut() {

  var authID = ['vehicleDatabase', 'livingDatabase']
  for (var i = 0; i < authID.length; i++) {

    firebase.app(authID[i]).auth().signOut();
  }
  firebase.app('categoryDatabase').auth().signOut().then(() => {

    window.location.href = "/admin/login.html";
  }).catch((error) => {

    console.log('Signing Out Failed')
  });
}
