
var livingID = location.search.split("=")[1];
let categoryRef = firebase.app("categoryDatabase").database().ref('category-database');
let livingRef = firebase.app("livingDatabase").database().ref('living-database');
let livingImageRef = firebase.app("livingDatabase").database().ref('living-image-database');
let livingFeatureRef = firebase.app("livingDatabase").database().ref('living-feature-database');


function htmlLisiting() {

  document.getElementById('living-title-img').innerHTML += '<img class="d-block m-auto" src="'+
  livingImageArray[0].images[0] +'" alt="'+ livingListArray[0].title.capitalize() +'">';
  $("#living-title").text(livingListArray[0].title.capitalize());
  $("#living-description").text(livingListArray[0].description.capitalize());

  for (var i = 1; i < livingImageArray[0].images.length; i++) {
    document.getElementById('living-slide-images').innerHTML += '<div class="swiper-slide">'+
      '<img class="living-image-swap" src="'+ livingImageArray[0].images[i] +'" alt="">'+
    '</div>';
  }

  document.getElementById('living-features').innerHTML += '<div class="details-list">'+
    '<span>Category</span>'+
    '<label>'+
    '<a href="../smart-category.html?category_id='+ livingListArray[0].category +'">'+
    categoryListArray.find(entry => entry.id == livingListArray[0].category).title.capitalize()+
    '</a>'+
    '</label>'+

    '</div>';

  for (var x = 0; x < livingFeatureArray[0].feature.length; x++) {

    document.getElementById('living-features').innerHTML += '<div class="details-list">'+
      '<span>'+ livingFeatureArray[0].feature[x].title +'</span>'+
      '<label>'+ livingFeatureArray[0].feature[x].detail +'</label>'+
    '</div>';
  }

  setTimeout(function() {

    $('body').addClass('loaded');
  }, 1000);

  $(".living-image-swap").click(function () {

    var titleImage = $('#living-title-img').children('img').attr("src");
    var iconImage = $(this).attr("src");
    $(this).attr("src", titleImage);
    $('#living-title-img').children('img').attr("src", iconImage);
  })
}

var productLoad = setInterval(productsShowcase, 100);

function productsShowcase () {

  if (livingArrayLoad && livingImageLoad && livingFeatureLoad) {

    htmlLisiting();
    clearInterval(productLoad);
  }
}

// living Listing
var livingArrayLoad = false;
var livingListArray = [];
livingRef.on("value", function(snapshot) {

  livingListArray = [];
  for (let key in snapshot.val()) {

    if (key == livingID) {

      livingListArray.push({

          key: key,
          title: snapshot.val()[key].title,
          category: snapshot.val()[key].category,
          model: snapshot.val()[key].model,
          commissioned: snapshot.val()[key].commissioned,
          description: snapshot.val()[key].description
      });
    }
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

    if (key == livingID) {

      var imageSet = [];
      for (id in snapshot.val()[key]) {

        imageSet.push(snapshot.val()[key][id].imageURL)
      }

      livingImageArray.push({

        key: key,
        images: imageSet.reverse(),
      });
    }
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

    if (key == livingID) {

      var featureSet = [];
      for (id in snapshot.val()[key]) {

        featureSet.push(snapshot.val()[key][id])
      }

      livingFeatureArray.push({

        key: key,
        feature: featureSet,
      });
    }
  }
  livingFeatureLoad = true;
  livingFeatureArray.reverse();

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
