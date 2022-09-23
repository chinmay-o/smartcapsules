
var vehicleID = location.search.split("=")[1];
let categoryRef = firebase.app("categoryDatabase").database().ref('category-database');
let vehicleRef = firebase.app("vehicleDatabase").database().ref('vehicle-database');
let vehicleImageRef = firebase.app("vehicleDatabase").database().ref('vehicle-image-database');
let vehicleFeatureRef = firebase.app("vehicleDatabase").database().ref('vehicle-feature-database');

function htmlLisiting() {

  document.getElementById('vehicle-title-img').innerHTML += '<img class="d-block m-auto" src="'+
  vehicleImageArray[0].images[0] +'" alt="'+ vehicleListArray[0].title.capitalize() +'">';
  $("#vehicle-title").text(vehicleListArray[0].title.capitalize());
  $("#vehicle-description").text(vehicleListArray[0].description.capitalize());

  for (var i = 1; i < vehicleImageArray[0].images.length; i++) {
    document.getElementById('vehicle-slide-images').innerHTML += '<div class="swiper-slide">'+
      '<img class="vehicle-image-swap" src="'+ vehicleImageArray[0].images[i] +'" alt="">'+
    '</div>';
  }

  document.getElementById('vehicle-features').innerHTML += '<div class="details-list">'+
    '<span>Category</span>'+
    '<label>'+
    '<a href="../smart-category.html?category_id='+ vehicleListArray[0].category +'">'+
    categoryListArray.find(entry => entry.id == vehicleListArray[0].category).title.capitalize()+
    '</a>'+
    '</label>'+

    '</div>';

  for (var x = 0; x < vehicleFeatureArray[0].feature.length; x++) {

    document.getElementById('vehicle-features').innerHTML += '<div class="details-list">'+
      '<span>'+ vehicleFeatureArray[0].feature[x].title +'</span>'+
      '<label>'+ vehicleFeatureArray[0].feature[x].detail +'</label>'+
    '</div>';
  }

  setTimeout(function() {

    $('body').addClass('loaded');
  }, 1000);

  $(".vehicle-image-swap").click(function () {

    var titleImage = $('#vehicle-title-img').children('img').attr("src");
    var iconImage = $(this).attr("src");
    $(this).attr("src", titleImage);
    $('#vehicle-title-img').children('img').attr("src", iconImage);
  })
}

var productLoad = setInterval(productsShowcase, 100);

function productsShowcase () {

  if (vehicleArrayLoad && vehicleImageLoad && vehicleFeatureLoad) {

    htmlLisiting();
    clearInterval(productLoad);
  }
}

// Vehicle Listing
var vehicleArrayLoad = false;
var vehicleListArray = [];
vehicleRef.on("value", function(snapshot) {

  vehicleListArray = [];
  for (let key in snapshot.val()) {

    if (key == vehicleID) {

      vehicleListArray.push({

          key: key,
          title: snapshot.val()[key].title,
          category: snapshot.val()[key].category,
          model: snapshot.val()[key].model,
          commissioned: snapshot.val()[key].commissioned,
          description: snapshot.val()[key].description
      });
    }
  }
  vehicleArrayLoad = true;

}, function(error) {
  console.log("Error: " + error.code);
});


var vehicleImageLoad = false;
var vehicleImageArray = [];
vehicleImageRef.on("value", function(snapshot) {

  vehicleImageArray = [];
  for (let key in snapshot.val()) {

    if (key == vehicleID) {

      var imageSet = [];
      for (id in snapshot.val()[key]) {

        imageSet.push(snapshot.val()[key][id].imageURL)
      }

      vehicleImageArray.push({

        key: key,
        images: imageSet.reverse(),
      });
    }
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

    if (key == vehicleID) {

      var featureSet = [];
      for (id in snapshot.val()[key]) {

        featureSet.push(snapshot.val()[key][id])
      }

      vehicleFeatureArray.push({

        key: key,
        feature: featureSet,
      });
    }
  }
  vehicleFeatureLoad = true;
  vehicleFeatureArray.reverse();

}, function(error) {
  console.log("Error: " + error.code);
});

var categoryArrayLoad = false;
var categoryListArray = [];
categoryRef.on("value", function(snapshot) {

  categoryListArray = [];
  for (let key in snapshot.val()) {

    categoryListArray.push({

      id: key,
      title: snapshot.val()[key].title,
      category: snapshot.val()[key].category,
      image: snapshot.val()[key].categoryImageURL,
    });
  }
  categoryArrayLoad = true;
  categoryListArray.reverse();

}, function(error) {
  console.log("Error: " + error.code);
});
