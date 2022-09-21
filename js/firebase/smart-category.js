
var categoryID = location.search.split("=")[1];
let categoryRef = firebase.app("categoryDatabase").database().ref('category-database');
let vehicleRef = firebase.app("vehicleDatabase").database().ref('vehicle-database');
let vehicleImageRef = firebase.app("vehicleDatabase").database().ref('vehicle-image-database');
let livingRef = firebase.app("livingDatabase").database().ref('living-database');
let livingImageRef = firebase.app("livingDatabase").database().ref('living-image-database');

function databaseQueryFinder() {

  var categoryData = categoryListArray.find(entry => entry.id == categoryID);
  htmlListing(categoryData);
}

function htmlListing(categoryData) {

  $("#vehicle-category-title").text(categoryData.title.capitalize());
  $("#vehicle-category-image").css("background-image", "url("+ categoryData.image +")");

  if (categoryData.category == 'smart vehicle') {

    for (var i = 0; i < vehicleListArray.length; i++) {

      document.getElementById('category-vehicle-lisitng').innerHTML += '<div class="col-lg-4 col-sm-12 col-12">' +
        '<a href="smart-vehicles/smart-vehicles-project.html?project_id='+ vehicleListArray[i].key +'">'+
        '<div id='+ vehicleListArray[i].key +' class="portfolio portfolio_style--1 mt--90 mt_lg--30 mt_md--30 mt_sm--30">' +
        '<div class="thumb">' +
        '<img src="'+ vehicleImageArray.find(entry => entry.key == vehicleListArray[i].key).images[0] +'" alt="Portfolio Images">' +
        '</div>' +
        '<div class="left-end-title">' +
        '<h3 class="post-overlay-title">' +
        vehicleListArray[i].title.capitalize() +
        '</h3>' +
        '</div>' +
        '</div>' +
        '</a>'+
        '</div>';
      }
  } else if (categoryData.category == 'smart living') {

    for (var i = 0; i < livingListArray.length; i++) {

      document.getElementById('category-vehicle-lisitng').innerHTML += '<div class="col-lg-4 col-sm-12 col-12">' +
        '<a href="smart-living/smart-living-project.html?project_id='+ livingListArray[i].key +'">'+
        '<div id='+ livingListArray[i].key +' class="portfolio portfolio_style--1 mt--90 mt_lg--30 mt_md--30 mt_sm--30">' +
        '<div class="thumb">' +
        '<img src="'+ livingImageArray.find(entry => entry.key == livingListArray[i].key).images[0] +'" alt="Portfolio Images">' +
        '</div>' +
        '<div class="left-end-title">' +
        '<h3 class="post-overlay-title">' +
        livingListArray[i].title.capitalize() +
        '</h3>' +
        '</div>' +
        '</div>' +
        '</a>'+
        '</div>';
      }
  }

    setTimeout(function() {

      $('body').addClass('loaded');
    }, 100);
}

// Category Listing
var arrayLoad = false;
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
  arrayLoad = true;
  categoryListArray.reverse();

}, function(error) {
  console.log("Error: " + error.code);
});

// Vehicle Listing
var vehicleArrayLoad = false;
var vehicleListArray = [];
vehicleRef.on("value", function(snapshot) {

  vehicleListArray = [];
  for (let key in snapshot.val()) {

    if (snapshot.val()[key].category == categoryID) {

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
      images: imageSet.reverse(),
    })
  }
  vehicleImageLoad = true;
  vehicleImageArray.reverse();

}, function(error) {
  console.log("Error: " + error.code);
});

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
      images: imageSet.reverse(),
    });
  }
  livingImageLoad = true;
  livingImageArray.reverse();

}, function(error) {
  console.log("Error: " + error.code);
});

var productLoad = setInterval(productsShowcase, 100);

function productsShowcase () {

  if (arrayLoad && vehicleArrayLoad && vehicleImageLoad && livingArrayLoad && livingImageLoad) {

    // categoryListHTML();
    databaseQueryFinder();
    clearInterval(productLoad);
  }
}
