
function addFeature() {

  document.getElementById("product-features").insertAdjacentHTML("beforeend",
  '<div class="input-group my-3 flex-nowrap">'+
  '<input class="feature-name-input" type="text" placeholder="Feature Name">'+
  '<input class="feature-detail-input" type="text" placeholder="Feature">'+
  '<span class="input-group-text feature-remove-button">-</span>'+
  '</div>');
  removeFeature();
}

$(".feature-add-button").click(function() {

    addFeature();
});

function removeFeature() {

  $(".feature-remove-button").click(function() {

      var classrem = $(this).closest('div').remove();
  });
}

function checkFileNull(imageInputID, uploadedImageID) {

  $("#"+ uploadedImageID).empty();
  const checkFiles = setInterval(function() {

    if(document.querySelector('#'+imageInputID).files.length != 0) {

      uploadedImagePreview(imageInputID, uploadedImageID);
      clearInterval(checkFiles);
    }
  }, 100);
}

function uploadedImagePreview(imageInputID, uploadedImageID) {

  var imageInput = document.querySelector('#'+ imageInputID).files;
  for (var i = 0; i < imageInput.length; i++) {

    document.getElementById(uploadedImageID).insertAdjacentHTML("beforeend",
    '<div class="col-lg-3">'+
      '<div class="mb-2 uploaded-img">'+
        '<img src="'+ URL.createObjectURL(imageInput[i]) +'" alt="">'+
      '</div>'+
    '</div>');
  }
}

// $(".feature-detail-input")[i].value;
// $(".feature-name-input")[i].value;
// document.querySelector('#project-img-bundle').files
// firebase.app("categoryDatabase").database().ref('category-database/-NB8TgnoMrywOTEhIs0K').update(updates);

// function deleteFolder(path) {
//   const ref = firebase.app("vehicleDatabase").storage().ref(path);
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
//   const ref = firebase.app("vehicleDatabase").storage().ref(pathToFile);
//   const childRef = ref.child(fileName);
//   childRef.delete();
// }

// vehicleListArray.find(entry => entry.key == "b2eeea8e-9ca0-60e42")
