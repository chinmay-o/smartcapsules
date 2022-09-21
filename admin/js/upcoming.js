

let upcomingRef = firebase.app("categoryDatabase").database().ref('upcoming-database');
var fileNameUID = "";

// Category Upload
document.getElementById('add-upcoming-form').addEventListener('submit', submitUpcomingForm);

function submitUpcomingForm(e) {

  e.preventDefault();

  var category = getInput('upcomingCategory');
  var title = getInput('upcomingTitle');
  var description = getInput('upcomingDesciption');

  saveUpcoming(category, title, description);
}

function saveUpcoming(title, category, description) {

  var upcomingData = upcomingRef.child(fileNameUID);
  upcomingData.set({

      timestamp: moment().format('DD/MM/YYYY h:mm:ss a'),
      title: title,
      category: category,
      description: description,
      upcomingImageURL: document.querySelector('#upcomingImage').src,
    })
    .then(function() {

      console.log('Synchronization succeeded');
      $('#add-upcoming-form')[0].reset();

      document.querySelector('#upcomingImage').src = 'http://flxtable.com/wp-content/plugins/pl-platform/engine/ui/images/image-preview.png';
    })
    .catch(function(error) {

      console.log('Synchronization failed');
    });
}

function imageUploadFirebase(imgInputID, imgID, submitBtn) {

  const ref = firebase.app("categoryDatabase").storage().ref();
  const file = document.querySelector(imgInputID).files[0];
  // const name = (+new Date()) + '-' + file.name;
  fileNameUID = uuidv4();
  const name = fileNameUID;

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

    if (document.querySelector('#upcoming-product-img').files[0] != null) {

      imageUploadFirebase("#upcoming-product-img", "#upcomingImage", "#upcomingSubmit");
      clearInterval(uploadProgress);
    }
  }, 200)
}

document.getElementById('edit-upcoming-img').addEventListener('submit', submitFormEdit);

function submitFormEdit(e) {

  e.preventDefault();
  var newImgURL = document.querySelector("#upcomingEditedImage").src;
  var updates = {

    upcomingImageURL: newImgURL,
  }
  firebase.app("categoryDatabase").database().ref('upcoming-database/'+ categoryIdSelected).update(updates).then(function() {

    console.log('Synchronization succeeded');
    location.reload();
    })
  .catch(function(error) {

    console.log('Synchronization failed');
  });
}

function newUpcomingTitleImg() {

  var uploadProgress = setInterval(function() {

    if (document.querySelector('#upcoming-edit-title-img').files[0] != null) {

      imageUploadFirebase("#upcoming-edit-title-img", "#upcomingEditedImage", "#upcomingEditedSubmit");
      clearInterval(uploadProgress);
    }
  }, 200)
}

// Category Listing
var arrayLoad = false;
var upcomingListArray = [];

upcomingRef.on("value", function(snapshot) {

  upcomingListArray = [];
  for (let key in snapshot.val()) {

    upcomingListArray.push({

      id: key,
      title: snapshot.val()[key].title,
      category: snapshot.val()[key].category,
      description: snapshot.val()[key].description,
      image: snapshot.val()[key].upcomingImageURL,
    });
  }
  arrayLoad = true;
  upcomingListArray.reverse();

}, function(error) {
  console.log("Error: " + error.code);
});

function deleteFolder(path) {

  const ref = firebase.app("categoryDatabase").storage().ref();
  firebase.app("categoryDatabase").database().ref('upcoming-database/'+ path).remove();

  ref.listAll()
    .then(dir => {
      dir.items.forEach(fileRef => this.deleteFile(ref.fullPath, fileRef.name));
      dir.prefixes.forEach(folderRef => this.deleteFolder(folderRef.fullPath))
    })
    .catch(error => console.log(error));
}

function deleteFile(pathToFile, fileName) {

  const ref = firebase.app("categoryDatabase").storage().ref(pathToFile);
  const childRef = ref.child(fileName);
  childRef.delete();
}

$("#upcomingDelete").click(function() {

  if (window.confirm("Data about the product will be deleted. Continue?")) {

    deleteFolder(upcomingIdSelected);
    console.log("Initiating");
    location.reload();
  }
})

var upcomingLoad = setInterval(upcomingShowcase, 100);

function upcomingShowcase () {

  if (arrayLoad) {

    loginBranch();
    upcomingListHTML();
    clearInterval(upcomingLoad);
  }
}

var upcomingIdSelected = '';

function upcomingListHTML() {

  for (var i = 0; i < upcomingListArray.length; i++) {

    document.getElementById('upcomingListing').innerHTML += '<div class="col-lg-4 col-md-4 col-sm-6 col-12 mt--50">'+
        '<div id="'+ upcomingListArray[i].id +'" class="blog-grid blog-standard grid-simple">'+
            '<div class="post-thumb">'+
                '<a href="javascript:null();">'+
                    '<img src="'+ upcomingListArray[i].image +'" alt="Product Category">'+
                '</a>'+
            '</div>'+
            '<div class="post-content text-center">'+
                '<div class="post-inner">'+
                    '<div class="post-meta">'+
                        '<a  href="javascript:null();">'+ upcomingListArray[i].title.capitalize() +'</a>'+
                    '</div>'+
                    '<h5 class="heading heading-h5">'+
                      '<div class="post-date">'+ upcomingListArray[i].category.capitalize() +'</div>'+
                    '</h5>'+
                '</div>'+
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
