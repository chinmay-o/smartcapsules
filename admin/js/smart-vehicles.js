let vehicleRef = firebase.app("vehicleDatabase").database().ref('vehicle-database');
let vehicleImageRef = firebase.app("vehicleDatabase").database().ref('vehicle-image-database');
let vehicleFeatureRef = firebase.app("vehicleDatabase").database().ref('vehicle-feature-database');

// Category Upload
document.getElementById('smart-vehicles-save').addEventListener('submit', submitVehicleForm);

function submitVehicleForm(e) {

  e.preventDefault();

  var categoryVehicle = getInput('vehicle-sub-categories');
  var titleVehicle = getInput('vehicle-title');
  var descriptionVehicle = getInput('vehicle-description');
  var modelVehicle = getInput('vehicle-model');
  var commissionedOn = getInput('manufacturing-date');
  var featuresVehicle = featureFetch();

  var uniqueVehicleID = uuidv4();
  vehicleImageUpload("#project-img-bundle", uniqueVehicleID);
  chooseMultipleUpload("#project-img-bundle", titleVehicle, categoryVehicle, descriptionVehicle, modelVehicle, commissionedOn, featuresVehicle, uniqueVehicleID)
}

var vehicleImageURLarray = [];

function vehicleImageUpload(imgInputID, uniqueVehicleID) {

  vehicleImageURLarray = [];
  const ref = firebase.app("vehicleDatabase").storage().ref(uniqueVehicleID);
  const file = document.querySelector(imgInputID).files;
  for (var i = 0; i < file.length; i++) {

    const name = (+new Date()) + '-' + file[i].name;
    const metadata = {
      contentType: file[i].type
    };
    const task = ref.child(name).put(file[i], metadata);

    task.then(snapshot => snapshot.ref.getDownloadURL()).then((url) => {

        vehicleImageURLarray.push(url);
      })
      .catch(console.error);
  }
}

function chooseMultipleUpload(inputID, titleVehicle, categoryVehicle, descriptionVehicle, modelVehicle, commissionedOn, featuresVehicle, uniqueVehicleID) {

  var uploadProgress = setInterval(function() {

    if (document.querySelector(inputID).files.length == vehicleImageURLarray.length) {

      saveVehicle(titleVehicle, categoryVehicle, descriptionVehicle, modelVehicle, commissionedOn, featuresVehicle, uniqueVehicleID);
      clearInterval(uploadProgress);
    }
  }, 10)
}

// title, category, description, model, commissioned, features
function saveVehicle(title, category, description, model, commissioned, features, uniqueVehicleID) {

  var vehicleDetails = vehicleRef.child(uniqueVehicleID);
  vehicleDetails.set({

      timestamp: moment().format('DD/MM/YYYY h:mm:ss a'),
      title: title,
      category: category,
      description: description,
      model: model,
      commissioned: commissioned
    })
    .then(function() {

      console.log('Synchronization succeeded');
      $('#smart-vehicles-save')[0].reset();
    })
    .catch(function(error) {

      console.log('Synchronization failed');
  });

  for (var x = 0; x < vehicleImageURLarray.length; x++) {

    var vehicleImages = vehicleImageRef.child(uniqueVehicleID).push();
    vehicleImages.set({

      imageURL: vehicleImageURLarray[x],
    });
  }

  for (var i = 0; i < features.length; i++) {

    var vehicleFeature = vehicleFeatureRef.child(uniqueVehicleID).push();
    vehicleFeature.set({

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

// Vehicle Listing
var vehicleArrayLoad = false;
var vehicleListArray = [];
vehicleRef.on("value", function(snapshot) {

  vehicleListArray = [];
  for (let key in snapshot.val()) {

    vehicleListArray.push({

        key: key,
        title: snapshot.val()[key].title,
        category: snapshot.val()[key].category,
        model: snapshot.val()[key].model,
        commissioned: snapshot.val()[key].commissioned,
        description: snapshot.val()[key].description
    });
  }
  vehicleArrayLoad = true;
  vehicleListArray.reverse();

}, function(error) {
  console.log("Error: " + error.code);
});

var vehicleImageLoad = false;
var vehicleImageArray = [];
vehicleImageRef.on("value", function(snapshot) {

  vehicleImageArray = [];
  for (let key in snapshot.val()) {

    var imageSet = [];
    for (id in snapshot.val()[key]) {

      imageSet.push(snapshot.val()[key][id].imageURL)
    }

    vehicleImageArray.push({

      key: key,
      images: imageSet,
    })
  }
  vehicleImageLoad = true;
  vehicleImageArray.reverse();

}, function(error) {
  console.log("Error: " + error.code);
});

var vehicleFeatureLoad = false;
var vehicleFeatureArray = [];
vehicleFeatureRef.on("value", function(snapshot) {

  vehicleFeatureArray = [];
  for (let key in snapshot.val()) {

    var featureSet = [];
    for (id in snapshot.val()[key]) {

      featureSet.push(snapshot.val()[key][id])
    }

    vehicleFeatureArray.push({

      key: key,
      feature: featureSet,
    })
  }
  vehicleFeatureLoad = true;
  vehicleFeatureArray.reverse();

}, function(error) {
  console.log("Error: " + error.code);
});

document.getElementById('edit-vehicle-details').addEventListener('submit', submitVehicleEdit);

function submitVehicleEdit(e) {

  e.preventDefault();
  var newTitle = document.querySelector("#vehicle-edit-title").value;
  var newDescription = document.querySelector("#vehicle-edit-description").value;
  var detailUpdates = {

    title: newTitle,
    description: newDescription,
  }
  firebase.app("vehicleDatabase").database().ref('vehicle-database/'+ vehicleIdSelected).update(detailUpdates).then(function() {

    if (document.querySelector("#edit-project-img-bundle").files.length != 0) {

      vehicleImageUpload("#edit-project-img-bundle", vehicleIdSelected);
      var uploadVehicleEdit = setInterval(function() {

        if (vehicleImageURLarray.length != 0) {

          for (var x = 0; x < vehicleImageURLarray.length; x++) {

            var vehicleImages = vehicleImageRef.child(vehicleIdSelected).push();
            vehicleImages.set({

              imageURL: vehicleImageURLarray[x],
            });
          }
          clearInterval(uploadVehicleEdit);
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

  const ref = firebase.app("vehicleDatabase").storage().ref(path);
  firebase.app("vehicleDatabase").database().ref('vehicle-image-database/'+ path).remove();
  firebase.app("vehicleDatabase").database().ref('vehicle-feature-database/'+ path).remove();
  firebase.app("vehicleDatabase").database().ref('vehicle-database/'+ path).remove();
  ref.listAll()
    .then(dir => {
      dir.items.forEach(fileRef => this.deleteFile(ref.fullPath, fileRef.name));
      dir.prefixes.forEach(folderRef => this.deleteFolder(folderRef.fullPath))
    })
    .catch(error => console.log(error));
}

function deleteFile(pathToFile, fileName) {

  const ref = firebase.app("vehicleDatabase").storage().ref(pathToFile);
  const childRef = ref.child(fileName);
  childRef.delete();
}

$("#projectDelete").click(function() {

  if (window.confirm("Data about the vehicle will be deleted. Continue?")) {

    deleteFolder(vehicleIdSelected);
    console.log("Initiating");
    location.reload();
  }
})

var productLoad = setInterval(productsShowcase, 100);

function productsShowcase () {

  if (vehicleArrayLoad && vehicleImageLoad && vehicleFeatureLoad) {

    loginBranch();
    vehicleListHTML();
    clearInterval(productLoad);
  }
}

var vehicleIdSelected = '';

function vehicleListHTML() {

  for (var i = 0; i < vehicleListArray.length; i++) {

    document.getElementById('vehicleListing').innerHTML += '<div class="col-lg-4 col-md-4 col-sm-6 col-12">'+
        '<div id="'+ vehicleListArray[i].key +'" class="blog-grid blog-standard grid-simple">'+
            '<div class="post-thumb">'+
                '<a href="javascript:null();">'+
                    '<img src="'+ vehicleImageArray[i].images[vehicleImageArray[i].images.length-1] +'" alt="Product Category">'+
                '</a>'+
            '</div>'+
            '<div class="post-content text-center">'+
                '<div class="post-inner">'+
                    '<div class="post-meta">'+
                        '<div class="post-date">'+ vehicleSelectArray.find(entry => entry.id == vehicleListArray[i].category).title.capitalize() +'</div>'+
                    '</div>'+
                    '<h5 class="heading heading-h5">'+
                      '<a  href="javascript:null();">'+ vehicleListArray[i].title.capitalize() +'</a>'+
                    '</h5>'+
                '</div>'+
            '</div>'+
            '<button class="btn btn-primary edit-vehicle-button my-2 mx-auto" data-toggle="modal" data-target="#exampleModal">Edit</button>'+
        '</div>'+
    '</div>';
  }

  $(".edit-vehicle-button").click(function(){

    vehicleIdSelected = $(this).parent().attr("id");
    retrieveVehicleData(vehicleIdSelected);
    $(".yu2fvl-overlay").removeClass("d-none");
    $(".edit-form-div").removeClass("d-none");
  });

  $(".modal-close").click(function(){

    $(".yu2fvl-overlay").addClass("d-none");
  });
}

function retrieveVehicleData(vehicleKey) {

  $("#vehicle-edit-title").attr("value", vehicleListArray.find(entry => entry.key == vehicleKey).title);
  $("#vehicle-edit-description").val(vehicleListArray.find(entry => entry.key == vehicleKey).description);
}
