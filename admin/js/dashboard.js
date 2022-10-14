
let vehicleRef = firebase.app("vehicleDatabase").database().ref('vehicle-database');
let indexImageRef = firebase.app("categoryDatabase").database().ref('index-product-database');
let enquiryDashRef = firebase.app("categoryDatabase").database().ref('enquiry-database');

var indexImageIDs = [];

document.getElementById('add-index-form').addEventListener('submit', submitNewIndex);

function submitNewIndex(e) {

  e.preventDefault();
  indexImageIDs = [];

  for (var i = 0; i < $(".indexProduct input").length; i++) {

    indexImageIDs.push($(".indexProduct input")[i].value);
  }
  var updates = {

    index01: indexImageIDs[0],
    index02: indexImageIDs[1],
    index03: indexImageIDs[2],
    index04: indexImageIDs[3],
    index05: indexImageIDs[4],
    index06: indexImageIDs[5],
  }

  firebase.app("categoryDatabase").database().ref('index-product-database').update(updates).then(function() {

    console.log('Synchronization succeeded');
    location.reload();
    })
  .catch(function(error) {

    console.log('Synchronization failed');
  });
}

var vehicleArrayLoad = false;
var vehicleListArray = [];
vehicleRef.on("value", function(snapshot) {

  vehicleListArray = [];
  for (let key in snapshot.val()) {

    vehicleListArray.push({

        key: key,
        title: snapshot.val()[key].title,
    });
  }
  vehicleArrayLoad = true;
  vehicleListArray.reverse();

}, function(error) {
  console.log("Error: " + error.code);
});

var enquiryArrayLoad = false;
var enquiryListArray = [];
enquiryDashRef.on("value", function(snapshot) {

  enquiryListArray = [];
  for (let key in snapshot.val()) {

    enquiryListArray.push({

        key: key,
        date: moment(snapshot.val()[key].timestamp, 'DD-MM-YYYY h:mm:ss a'),
        name: snapshot.val()[key].name,
        email: snapshot.val()[key].email,
        mobile: snapshot.val()[key].number,
        message: snapshot.val()[key].message,
    });
  }
  enquiryArrayLoad = true;
  // enquiryListArray.reverse();
  sortByDate(enquiryListArray);

}, function(error) {
  console.log("Error: " + error.code);
});

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

function vehicleDataListHTML() {

  for (var i = 0; i < indexImageArray.length; i++) {

    $(".indexProduct input")[i].value = vehicleListArray.find(entry => entry.key == indexImageArray[i]).title.capitalize();
  }

  for (var i = 0; i < vehicleListArray.length; i++) {

    document.getElementById('product-List').innerHTML += '<option value="'+ vehicleListArray[i].key +'">'+ vehicleListArray[i].title +'</option>';
  }
}

function enquiryListHTML() {

  for (var i = 0; i < enquiryListArray.length; i++) {

    document.getElementById('enquiry-List').innerHTML += '<tr>'+
    '<td class="pro-price"><a href="#">'+ enquiryListArray[i].date._i +'</a></td>'+
    '<td class="pro-price"><a href="javascript:void()">'+ enquiryListArray[i].name.capitalize() +'</a></td>'+
    '<td class="pro-price"><a href="#">'+ enquiryListArray[i].mobile +'</a></td>'+
    '<td class="pro-price"><a href="#">'+ enquiryListArray[i].email +'</a></td>'+
    '<td class="pro-price"><a href="#">'+ enquiryListArray[i].message.capitalize() +'</a></td>'+
    '<tr>';
  }
}

var productLoad = setInterval(productsShowcase, 100);

function productsShowcase () {

  if (vehicleArrayLoad && arrayIndexLoad && enquiryArrayLoad) {

    loginBranch();
    vehicleDataListHTML();
    enquiryListHTML();
    clearInterval(productLoad);
  }
}

function sortByDate(arr) {

  arr.sort(function(a, b) {
    return Number(Number(new Date(b.date) - new Date(a.date)));
  });

  return arr;
}
