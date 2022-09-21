
let categoryLinkRef = firebase.app("categoryDatabase").database().ref('category-database');

var categoryArrayLoad = false;
var categoryListArray = [];
categoryLinkRef.on("value", function(snapshot) {

  categoryListArray = [];
  for (let key in snapshot.val()) {

    categoryListArray.push({

      id: key,
      title: snapshot.val()[key].title,
      category: snapshot.val()[key].category
    });
  }
  categoryArrayLoad = true;

}, function(error) {
  console.log("Error: " + error.code);
});

function headerLisiting() {

  for (var i = 0; i < categoryListArray.length; i++) {

    if (categoryListArray[i].category == 'smart living') {

      document.getElementById('smart-living-list').innerHTML += '<li>'+
      '<a href="../smart-category.html?category_id='+ categoryListArray[i].id +'">'+
      '<span>'+ categoryListArray[i].title.capitalize() +'</span></a>'+
      '</li>';
      document.getElementById('smart-living-list-mobile').innerHTML += '<li>'+
      '<a href="../smart-category.html?category_id='+ categoryListArray[i].id +'">'+
      '<span>'+ categoryListArray[i].title.capitalize() +'</span></a>'+
      '</li>';
    }
    if (categoryListArray[i].category == 'smart vehicle') {

      document.getElementById('smart-vehicle-list').innerHTML += '<li>'+
      '<a href="../smart-category.html?category_id='+ categoryListArray[i].id +'">'+
      '<span>'+ categoryListArray[i].title.capitalize() +'</span></a>'+
      '</li>';
      document.getElementById('smart-vehicle-list-mobile').innerHTML += '<li>'+
      '<a href="../smart-category.html?category_id='+ categoryListArray[i].id +'">'+
      '<span>'+ categoryListArray[i].title.capitalize() +'</span></a>'+
      '</li>';
    }
  }
}

var linksLoad = setInterval(linkShowcase, 100);
function linkShowcase () {

  if (categoryArrayLoad) {

    headerLisiting();
    clearInterval(linksLoad);
  }
}
