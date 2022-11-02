let indexImageRef = firebase.app("categoryDatabase").database().ref('index-product-database');

let vehicleRef = firebase.app("vehicleDatabase").database().ref('vehicle-database');
let vehicleImageRef = firebase.app("vehicleDatabase").database().ref('vehicle-image-database');

let livingImageRef = firebase.app("livingDatabase").database().ref('living-image-database');

let upcomingRef = firebase.app("livingDatabase").database().ref('upcoming-database');

var arrayIndexLoad = false;
var indexImageArray = [];
indexImageRef.on("value", function(snapshot) {

  indexImageArray = [];
  for (let key in snapshot.val()) {

    indexImageArray.push(snapshot.val()[key]);
  }
  arrayIndexLoad = true;

}, function(error) {

  console.log("Error: " + error.code);
});

var vehicleArrayLoad = false;
var vehicleListArray = [];
vehicleRef.on("value", function(snapshot) {

  vehicleListArray = [];
  for (var i = 0; i < indexImageArray.length; i++) {

    for (let key in snapshot.val()) {

      if (indexImageArray[i] == key) {

        vehicleListArray.push({

            key: key,
            title: snapshot.val()[key].title,
            category: snapshot.val()[key].category,
            model: snapshot.val()[key].model,
        });
      }
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
  for (var i = 0; i < indexImageArray.length; i++) {

    for (let key in snapshot.val()) {

      if (indexImageArray[i] == key) {

        var imageSet = [];
        for (id in snapshot.val()[key]) {

          imageSet.push(snapshot.val()[key][id].imageURL);
        }

        vehicleImageArray.push({

          key: key,
          images: imageSet,
        });

        galleryImageArray.push({

          key: key,
          images: imageSet.reverse(),
        })
      }
    }
  }
  vehicleImageLoad = true;

}, function(error) {
  console.log("Error: " + error.code);
});

var livingImageLoad = false;
var galleryImageArray = [];
livingImageRef.on("value", function(snapshot) {

  for (let key in snapshot.val()) {

    var imageSet = [];
    for (id in snapshot.val()[key]) {

      imageSet.push(snapshot.val()[key][id].imageURL)
    }

    galleryImageArray.push({

      key: key,
      images: imageSet.reverse(),
    })
  }
  livingImageLoad = true;
  galleryImageArray.reverse();

}, function(error) {
  console.log("Error: " + error.code);
});

var upcomingArrayLoad = false;
var upcomingListArray = [];
upcomingRef.on("value", function(snapshot) {

  upcomingListArray = [];
  for (let key in snapshot.val()) {

    upcomingListArray.push({

        key: key,
        title: snapshot.val()[key].title,
        description: snapshot.val()[key].description,
        image: snapshot.val()[key].upcomingImageURL,
    })
  }
  upcomingArrayLoad = true;

}, function(error) {

  console.log("Error: " + error.code);
});

function indexListing() {

  for (var x = 0; x < vehicleListArray.length; x++) {

    document.getElementById('indexImagePublish').innerHTML += '<div class="col-lg-4 col-md-6 col-sm-12"><div class="portfolio-33-33 cat--3 cat--4">'+
        '<div class="portfolio with-caption">'+
            '<div class="thumb titleIndexImage">'+
                '<a href="smart-vehicles/smart-vehicles-project.html?project_id='+ vehicleListArray[x].key +'">'+
                    '<img src="'+ vehicleImageArray.find(entry => entry.key == vehicleListArray[x].key).images[0] +'" alt="portfolio images">'+
                '</a>'+
            '</div>'+
            '<div class="caption-bottom text-center">'+
                '<div class="info">'+
                    '<h5 class="heading heading-h5">'+
                      '<a href="#">'+ vehicleListArray[x].title.capitalize() +'</a>'+
                    '</h5>'+
                    '<p class="bk_pra">'+
                      '<span>Base Model: '+ vehicleListArray[x].model.capitalize() +'</span>'+
                    '</p>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div></div>';
  }
  setTimeout(function() {

    $('body').addClass('loaded');
  }, 200);
}

function indexGallery() {

  for (var i = 0; i < galleryImageArray.length; i++) {

    document.getElementById('imageGallery').innerHTML += '<div class="flexale-image swiper-slide">'+
      '<div class="thumb">'+
        '<div id="custom-slide0'+ i +'" class="row gx-0 test-slider-carousel">'+
          '<div class="col-lg-8 col-md-12">'+
            '<div class="custom-carousal-primary" style="background-image: url(\''+ galleryImageArray[i].images[0] +'\')"></div>'+
          '</div>'+
          '<div class="col-lg-4 col-md-12">'+
            '<div id="option-area0' + i +'" class="row gx-0 option-area">'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>';
  }
  for (var j = 0; j < galleryImageArray.length; j++) {

    for (var x = 1; x < 5; x++) {
      document.getElementById('option-area0' + j).innerHTML += '<div class="col-6">'+
        '<div class="custom-carousal-option" style="background-image: url(\''+ galleryImageArray[j].images[x] +'\')"></div>'+
      '</div>';
    }
  }
  swapSlideGallery();
}

function upcomingListing() {

  for (var i = 0; i < upcomingListArray.length; i++) {

    console.log(upcomingListArray[i]);
  }
}

var indexLoad = setInterval(indexShowcase, 100);

function indexShowcase () {

  if (arrayIndexLoad && vehicleArrayLoad && indexImageArray && livingImageLoad) {

    indexListing();
    indexGallery();
    upcomingListing();
    clearInterval(indexLoad);
  }
}
