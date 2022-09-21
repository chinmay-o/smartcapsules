let livingRef = firebase.app("livingDatabase").database().ref('living-database');
let livingImageRef = firebase.app("livingDatabase").database().ref('living-image-database');
let livingFeatureRef = firebase.app("livingDatabase").database().ref('living-feature-database');

// Category Upload
document.getElementById('smart-living-save').addEventListener('submit', submitlivingForm);

function submitlivingForm(e) {

  e.preventDefault();

  var categoryLiving = getInput('living-sub-categories');
  var titleLiving = getInput('living-title');
  var descriptionLiving = getInput('living-description');
  var modelLiving = getInput('living-model');
  var commissionedOn = getInput('manufacturing-date');
  var featuresLiving = featureFetch();

  var uniqueLivingID = uuidv4();
  livingImageUpload("#project-img-bundle", uniqueLivingID);
  chooseMultipleUpload("#project-img-bundle", titleLiving, categoryLiving, descriptionLiving, modelLiving, commissionedOn, featuresLiving, uniqueLivingID)
}

var livingImageURLarray = [];

function livingImageUpload(imgInputID, uniqueLivingID) {

  livingImageURLarray = [];
  const ref = firebase.app("livingDatabase").storage().ref(uniqueLivingID);
  const file = document.querySelector(imgInputID).files;
  for (var i = 0; i < file.length; i++) {

    const name = (+new Date()) + '-' + file[i].name;
    const metadata = {
      contentType: file[i].type
    };
    const task = ref.child(name).put(file[i], metadata);

    task.then(snapshot => snapshot.ref.getDownloadURL()).then((url) => {

        livingImageURLarray.push(url);
        console.log(url);
      })
      .catch(console.error);
  }
}

function chooseMultipleUpload(inputID, titleLiving, categoryLiving, descriptionLiving, modelLiving, commissionedOn, featuresLiving, uniqueLivingID) {

  var uploadProgress = setInterval(function() {

    if (document.querySelector(inputID).files.length == livingImageURLarray.length) {

      saveLiving(titleLiving, categoryLiving, descriptionLiving, modelLiving, commissionedOn, featuresLiving, uniqueLivingID);
      clearInterval(uploadProgress);
    }
  }, 10)
}

// title, category, description, model, commissioned, features
function saveLiving(title, category, description, model, commissioned, features, uniqueLivingID) {

  var livingDetails = livingRef.child(uniqueLivingID);
  livingDetails.set({

      timestamp: moment().format('DD/MM/YYYY h:mm:ss a'),
      title: title,
      category: category,
      description: description,
      model: model,
      commissioned: commissioned
    })
    .then(function() {

      console.log('Synchronization succeeded');
      $('#smart-living-save')[0].reset();

    })
    .catch(function(error) {

      console.log('Synchronization failed');
  });

  for (var x = 0; x < livingImageURLarray.length; x++) {

    var livingImages = livingImageRef.child(uniqueLivingID).push();
    livingImages.set({

      imageURL: livingImageURLarray[x],
    });
  }

  for (var i = 0; i < features.length; i++) {

    var livingFeature = livingFeatureRef.child(uniqueLivingID).push();
    livingFeature.set({

      title: features[i].featureName,
      detail: features[i].featureDetail,
    })
  }
  setTimeout(location.reload(), 1000);
}

function featureFetch() {

  var featureList = [];
  var featureClass = $("#product-features .feature-name-input");
  var featureDetailClass = $("#product-features .feature-detail-input");
  for (var i = 0; i < featureClass.length; i++) {
    featureList.push({

      featureName: featureClass[i].value,
      featureDetail: featureDetailClass[i].value,
    })
  }
  return featureList;
}

// Living Listing
var livingArrayLoad = false;
var livingListArray = [];
livingRef.on("value", function(snapshot) {

  livingListArray = [];
  for (let key in snapshot.val()) {

    livingListArray.push({

        key: key,
        title: snapshot.val()[key].title,
        category: snapshot.val()[key].category,
        model: snapshot.val()[key].model,
        commissioned: snapshot.val()[key].commissioned,
        description: snapshot.val()[key].description
    });
  }
  livingArrayLoad = true;
  livingListArray.reverse();

}, function(error) {
  console.log("Error: " + error.code);
});

var livingImageLoad = false;
var livingImageArray = [];
livingImageRef.on("value", function(snapshot) {

  livingImageArray = [];
  for (let key in snapshot.val()) {

    var imageSet = [];
    for (id in snapshot.val()[key]) {

      imageSet.push(snapshot.val()[key][id].imageURL)
    }

    livingImageArray.push({

      key: key,
      images: imageSet,
    })
  }
  livingImageLoad = true;
  livingImageArray.reverse();

}, function(error) {
  console.log("Error: " + error.code);
});

var livingFeatureLoad = false;
var livingFeatureArray = [];
livingFeatureRef.on("value", function(snapshot) {

  livingFeatureArray = [];
  for (let key in snapshot.val()) {

    var featureSet = [];
    for (id in snapshot.val()[key]) {

      featureSet.push(snapshot.val()[key][id])
    }

    livingFeatureArray.push({

      key: key,
      feature: featureSet,
    })
  }
  livingFeatureLoad = true;
  livingFeatureArray.reverse();

}, function(error) {
  console.log("Error: " + error.code);
});

document.getElementById('edit-living-details').addEventListener('submit', submitLivingEdit);

function submitLivingEdit(e) {

  e.preventDefault();
  // var newImgURL = document.querySelector("#categoryEditedImage").src;
  var newTitle = document.querySelector("#living-edit-title").value;
  var newDescription = document.querySelector("#living-edit-description").value;
  var detailUpdates = {

    title: newTitle,
    description: newDescription,
  }
  firebase.app("livingDatabase").database().ref('living-database/'+ livingIdSelected).update(detailUpdates).then(function() {

    if (document.querySelector("#edit-project-img-bundle").files.length != 0) {

      livingImageUpload("#edit-project-img-bundle", livingIdSelected);
      var uploadLivingEdit = setInterval(function() {

        if (livingImageURLarray.length != 0) {

          for (var x = 0; x < livingImageURLarray.length; x++) {

            var livingImages = livingImageRef.child(livingIdSelected).push();
            livingImages.set({

              imageURL: livingImageURLarray[x],
            });
          }
          clearInterval(uploadLivingEdit);
          console.log('Synchronization succeeded');
          location.reload();
        }
      }, 10)
    }
  })
  .catch(function(error) {

    console.log('Synchronization failed');
  });
}

function deleteFolder(path) {

  const ref = firebase.app("livingDatabase").storage().ref(path);
  firebase.app("livingDatabase").database().ref('living-image-database/'+ path).remove();
  firebase.app("livingDatabase").database().ref('living-feature-database/'+ path).remove();
  firebase.app("livingDatabase").database().ref('living-database/'+ path).remove();
  ref.listAll()
    .then(dir => {
      dir.items.forEach(fileRef => this.deleteFile(ref.fullPath, fileRef.name));
      dir.prefixes.forEach(folderRef => this.deleteFolder(folderRef.fullPath))
    })
    .catch(error => console.log(error));
}

function deleteFile(pathToFile, fileName) {

  const ref = firebase.app("livingDatabase").storage().ref(pathToFile);
  const childRef = ref.child(fileName);
  childRef.delete();
}

$("#projectDelete").click(function() {

  if (window.confirm("Data about the product will be deleted. Continue?")) {

    deleteFolder(livingIdSelected);
    console.log("Initiating");
    location.reload();
  }
})

var productLoad = setInterval(productsShowcase, 100);

function productsShowcase () {

  if (livingArrayLoad && livingImageLoad && livingFeatureLoad) {

    loginBranch();
    livingListHTML();
    clearInterval(productLoad);
  }
}

var livingIdSelected = '';

function livingListHTML() {

  for (var i = 0; i < livingListArray.length; i++) {

    document.getElementById('livingListing').innerHTML += '<div class="col-lg-4 col-md-4 col-sm-6 col-12">'+
        '<div id="'+ livingListArray[i].key +'" class="blog-grid blog-standard grid-simple">'+
            '<div class="post-thumb">'+
                '<a href="javascript:null();">'+
                    '<img src="'+ livingImageArray[i].images[livingImageArray[i].images.length-1] +'" alt="Product Category">'+
                '</a>'+
            '</div>'+
            '<div class="post-content text-center">'+
                '<div class="post-inner">'+
                    '<div class="post-meta">'+
                        '<div class="post-date">'+ livingSelectArray.find(entry => entry.id == livingListArray[i].category).title.capitalize() +'</div>'+
                    '</div>'+
                    '<h5 class="heading heading-h5">'+
                      '<a  href="javascript:null();">'+ livingListArray[i].title.capitalize() +'</a>'+
                    '</h5>'+
                '</div>'+
            '</div>'+
            '<button class="btn btn-primary edit-living-button my-2 mx-auto" data-toggle="modal" data-target="#exampleModal">Edit</button>'+
        '</div>'+
    '</div>';
  }

  $(".edit-living-button").click(function(){

    livingIdSelected = $(this).parent().attr("id");
    retrieveLivingData(livingIdSelected);
    $(".yu2fvl-overlay").removeClass("d-none");
    $(".edit-form-div").removeClass("d-none");
  });

  $(".modal-close").click(function(){

    $(".yu2fvl-overlay").addClass("d-none");
  });
}

function retrieveLivingData(livingKey) {

  $("#living-edit-title").attr("value", livingListArray.find(entry => entry.key == livingKey).title);
  $("#living-edit-description").val(livingListArray.find(entry => entry.key == livingKey).description);
}
