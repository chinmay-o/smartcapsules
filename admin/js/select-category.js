

let categoryRef = firebase.app("categoryDatabase").database().ref('category-database');

var SubCategoryArrayLoad = false;
var vehicleSelectArray = [];
var livingSelectArray = [];

categoryRef.on("value", function(snapshot) {

  vehicleSelectArray = [];
  for (let key in snapshot.val()) {

    if (snapshot.val()[key].category == 'smart vehicle') {

      vehicleSelectArray.push({

        id: key,
        title: snapshot.val()[key].title,
        category: snapshot.val()[key].category,
        image: snapshot.val()[key].categoryImageURL,
      });
    }
    if (snapshot.val()[key].category == 'smart living') {

      livingSelectArray.push({

        id: key,
        title: snapshot.val()[key].title,
        category: snapshot.val()[key].category,
        image: snapshot.val()[key].categoryImageURL,
      });
    }
  }
  SubCategoryArrayLoad = true;
  vehicleSelectArray.reverse();
  livingSelectArray.reverse();

}, function(error) {
  console.log("Error: " + error.code);
});

var vehicleCategoryLoad = setInterval(vehicleCategoryShowcase, 100);
function vehicleCategoryShowcase () {

  if (SubCategoryArrayLoad) {

    vehicleCategoryList();
    clearInterval(vehicleCategoryLoad);
  }
}

var livingCategoryLoad = setInterval(livingCategoryShowcase, 100);
function livingCategoryShowcase () {

  if (SubCategoryArrayLoad) {

    loginBranch();
    livingCategoryList();
    clearInterval(livingCategoryLoad);
  }
}

function vehicleCategoryList() {

  if (location.pathname == '/admin/smart-vehicle.html') {

    document.getElementById('vehicle-sub-categories').innerHTML = '<option selected>Select Category</option>';
    for (var i = 0; i < vehicleSelectArray.length; i++) {

      document.getElementById('vehicle-sub-categories').innerHTML += '<option value="'+ vehicleSelectArray[i].id +
      '">'+ vehicleSelectArray[i].title.capitalize() +'</option>';
    }
  }
}

function livingCategoryList() {

  if (location.pathname == '/admin/smart-living.html') {

    document.getElementById('living-sub-categories').innerHTML = '<option selected>Select Category</option>';
    for (var i = 0; i < livingSelectArray.length; i++) {

      document.getElementById('living-sub-categories').innerHTML += '<option value="'+ livingSelectArray[i].id +
      '">'+ livingSelectArray[i].title.capitalize() +'</option>';
    }
  }
}
