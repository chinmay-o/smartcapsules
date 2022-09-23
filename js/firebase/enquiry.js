
let enquiryRef = firebase.app("categoryDatabase").database().ref('enquiry-database');

document.getElementById('enquiry-form').addEventListener('submit', submitEnquiry);

function submitEnquiry(e) {

  e.preventDefault();

  var name = getInput('enquiryName');
  var email = getInput('enquiryEmail');
  var number = getInput('enquiryNumber');
  var message = getInput('enquiryMessage');

  saveEnquiry(name, email, number, message);
}

document.getElementById('enquiry-download-form').addEventListener('submit', submitDownloadEnquiry);

function submitDownloadEnquiry(e) {

  e.preventDefault();

  var name = getInput('enquiryNameD');
  var email = getInput('enquiryEmailD');
  var number = getInput('enquiryNumberD');
  var message = 'Catalogue Download';

  saveEnquiry(name, email, number, message);
}

document.getElementById('quote-form').addEventListener('submit', submitQuoteEnquiry);

function submitQuoteEnquiry(e) {

  e.preventDefault();

  var name = getInput('enquiryNameQ');
  var email = getInput('enquiryEmailQ');
  var number = getInput('enquiryNumberQ');
  var message = getInput('enquiryModelQ');

  saveEnquiry(name, email, number, message);
}

function saveEnquiry(name, email, number, message) {

  var enquiryData = enquiryRef.child(uuidv4());
  enquiryData.set({

      timestamp: moment().format('DD/MM/YYYY h:mm:ss a'),
      name: name,
      email: email,
      number: number,
      message: message,
    })
    .then(function() {

      console.log('Synchronization succeeded');
      $('#enquiry-form')[0].reset();
      $('#quote-form')[0].reset();
      $('#enquiry-download-form')[0].reset();
      $(".form-message").text("Form submitted successfully.")
      if (message == 'Catalogue Download') {

        var link = document.getElementById("brochureDownload");
        link.click();
      }

    })
    .catch(function(error) {

      console.log('Synchronization failed');
      $(".form-message").text("Form submission failed, try again.")
    });
}
