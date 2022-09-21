
let pressRef = firebase.app("categoryDatabase").database().ref('press-database');

// Category Upload
document.getElementById('add-press-form').addEventListener('submit', submitPressForm);

function submitPressForm(e) {

  e.preventDefault();

  saveUpcoming();
}

function saveUpcoming() {

  var upcomingData = pressRef.child(uuidv4());
  upcomingData.set({

      timestamp: moment().format('DD/MM/YYYY h:mm:ss a'),
      pressImageURL: document.querySelector('#pressImage').src,
    })
    .then(function() {

      console.log('Synchronization succeeded');
      $('#add-press-form')[0].reset();

      document.querySelector('#pressImage').src = 'http://flxtable.com/wp-content/plugins/pl-platform/engine/ui/images/image-preview.png';
    })
    .catch(function(error) {

      console.log('Synchronization failed');
    });
}

function imageUploadFirebase(imgInputID, imgID, submitBtn) {

  const ref = firebase.app("categoryDatabase").storage().ref();
  const file = document.querySelector(imgInputID).files[0];
  const name = (+new Date()) + '-' + file.name;

  const metadata = {

    contentType: file.type
  };
  const task = ref.child(name).put(file, metadata);

  task.then(snapshot => snapshot.ref.getDownloadURL()).then((url) => {

      document.querySelector(imgID).src = url;
      $(submitBtn).removeAttr("disabled");
    })
    .catch(console.error);
}

function chooseUpload() {

  var uploadProgress = setInterval(function() {

    if (document.querySelector('#press-clip-img').files[0] != null) {

      imageUploadFirebase("#press-clip-img", "#pressImage", "#pressSubmit");
      clearInterval(uploadProgress);
    }
  }, 200)
}

// Category Listing
var arrayLoad = false;
var pressListArray = [];

pressRef.on("value", function(snapshot) {

  pressListArray = [];
  for (let key in snapshot.val()) {

    pressListArray.push({

      id: key,
      image: snapshot.val()[key].pressImageURL,
    });
  }
  arrayLoad = true;
  pressListArray.reverse();

}, function(error) {
  console.log("Error: " + error.code);
});

// function deleteFolder(path) {
//
//   const ref = firebase.app("categoryDatabase").storage().ref();
//   firebase.app("categoryDatabase").database().ref('upcoming-database/'+ path).remove();
//
//   ref.listAll()
//     .then(dir => {
//       dir.items.forEach(fileRef => this.deleteFile(ref.fullPath, fileRef.name));
//       dir.prefixes.forEach(folderRef => this.deleteFolder(folderRef.fullPath))
//     })
//     .catch(error => console.log(error));
// }
//
// function deleteFile(pathToFile, fileName) {
//
//   const ref = firebase.app("categoryDatabase").storage().ref(pathToFile);
//   const childRef = ref.child(fileName);
//   childRef.delete();
// }
//
// $("#upcomingDelete").click(function() {
//
//   if (window.confirm("Data about the product will be deleted. Continue?")) {
//
//     deleteFolder(upcomingIdSelected);
//     console.log("Initiating");
//     location.reload();
//   }
// })

var upcomingLoad = setInterval(upcomingShowcase, 100);

function upcomingShowcase () {

  if (arrayLoad) {

    loginBranch();
    pressListHTML();
    clearInterval(upcomingLoad);
  }
}

var upcomingIdSelected = '';

function pressListHTML() {

  for (var i = 0; i < pressListArray.length; i++) {

    document.getElementById('pressListing').innerHTML += '<div class="col-lg-4 col-md-4 col-sm-6 col-12 mt--50">'+
        '<div id="'+ pressListArray[i].id +'" class="blog-grid blog-standard grid-simple">'+
            '<div class="post-thumb">'+
                '<a href="javascript:null();">'+
                    '<img src="'+ pressListArray[i].image +'" alt="Product Category">'+
                '</a>'+
            '</div>'+
            '<button class="btn btn-primary edit-category-button my-2 mx-auto" data-toggle="modal" data-target="#exampleModal">Edit</button>'+
        '</div>'+
    '</div>';
  }

  $(".edit-category-button").click(function(){

    upcomingIdSelected = $(this).parent().attr("id");
    $(".yu2fvl-overlay").removeClass("d-none");
    $(".edit-form-div").removeClass("d-none");
  });

  $(".modal-close").click(function(){

    $(".yu2fvl-overlay").addClass("d-none");
  });
}
