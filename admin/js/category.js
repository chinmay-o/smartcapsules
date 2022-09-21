

let categoryRef = firebase.app("categoryDatabase").database().ref('category-database');


// Category Upload
document.getElementById('add-category-form').addEventListener('submit', submitForm);

function submitForm(e) {

  e.preventDefault();

  var title = getInput('categoryName');
  var category = getInput('mainCategory');

  saveCategory(title, category);
}

function saveCategory(title, category) {

  var categoryData = categoryRef.child(uuidv4());
  categoryData.set({

      timestamp: moment().format('DD/MM/YYYY h:mm:ss a'),
      title: title,
      category: category,
      categoryImageURL: document.querySelector('#categoryImage').src,
    })
    .then(function() {

      console.log('Synchronization succeeded');
      $('#add-category-form')[0].reset();

      document.querySelector('#categoryImage').src = 'http://flxtable.com/wp-content/plugins/pl-platform/engine/ui/images/image-preview.png';
    })
    .catch(function(error) {

      console.log('Synchronization failed');
    });
}

function imageUploadFirebase(imgInputID, imgID, submitBtn) {

  const ref = firebase.app("categoryDatabase").storage().ref();
  const file = document.querySelector(imgInputID).files[0];
  const name = (+new Date()) + '-' + file.name;
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

    if (document.querySelector('#category-title-img').files[0] != null) {

      imageUploadFirebase("#category-title-img", "#categoryImage", "#categorySubmit");
      clearInterval(uploadProgress);
    }
  }, 200)
}

document.getElementById('edit-category-img').addEventListener('submit', submitFormEdit);

function submitFormEdit(e) {

  e.preventDefault();
  var newImgURL = document.querySelector("#categoryEditedImage").src;
  var updates = {

    categoryImageURL: newImgURL,
  }
  firebase.app("categoryDatabase").database().ref('category-database/'+ categoryIdSelected).update(updates).then(function() {

    console.log('Synchronization succeeded');
    location.reload();
    })
  .catch(function(error) {

    console.log('Synchronization failed');
  });
}

function newCategoryTitleImg() {

  var uploadProgress = setInterval(function() {

    if (document.querySelector('#category-edit-title-img').files[0] != null) {

      imageUploadFirebase("#category-edit-title-img", "#categoryEditedImage", "#categoryEditedSubmit");
      clearInterval(uploadProgress);
    }
  }, 200)
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

var productLoad = setInterval(productsShowcase, 100);

function productsShowcase () {

  if (arrayLoad) {

    loginBranch();
    categoryListHTML();
    clearInterval(productLoad);
  }
}

var categoryIdSelected = '';

function categoryListHTML() {

  for (var i = 0; i < categoryListArray.length; i++) {

    document.getElementById('categoryListing').innerHTML += '<div class="col-lg-4 col-md-4 col-sm-6 col-12 mt--50">'+
        '<div id="'+ categoryListArray[i].id +'" class="blog-grid blog-standard grid-simple">'+
            '<div class="post-thumb">'+
                '<a href="javascript:null();">'+
                    '<img src="'+ categoryListArray[i].image +'" alt="Product Category">'+
                '</a>'+
            '</div>'+
            '<div class="post-content text-center">'+
                '<div class="post-inner">'+
                    '<div class="post-meta">'+
                        '<div class="post-date">'+ categoryListArray[i].category.capitalize() +'</div>'+
                    '</div>'+
                    '<h5 class="heading heading-h5">'+
                      '<a  href="javascript:null();">'+ categoryListArray[i].title.capitalize() +'</a>'+
                    '</h5>'+
                '</div>'+
            '</div>'+
            '<button class="btn btn-primary edit-category-button my-2 mx-auto" data-toggle="modal" data-target="#exampleModal">Edit</button>'+
        '</div>'+
    '</div>';
  }

  $(".edit-category-button").click(function(){

    categoryIdSelected = $(this).parent().attr("id");
    $(".yu2fvl-overlay").removeClass("d-none");
    $(".edit-form-div").removeClass("d-none");
  });

  $(".modal-close").click(function(){

    $(".yu2fvl-overlay").addClass("d-none");
  });
}
