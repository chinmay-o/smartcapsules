

function swapSlideGallery() {

  $(".custom-carousal-option").click(function(e) {

    var bgImg = $(e.target).css('background-image');
    var parentImgID = $(e.target).parent().parent().parent().parent().attr('id');
    var primaryImg = $("#"+ parentImgID + " .custom-carousal-primary").css('background-image');
    $("#"+ parentImgID + " .custom-carousal-primary").css('background-image', bgImg);
    $(e.target).css('background-image', primaryImg);
  });
}

// $("#get-a-quote").click(function () {
//
//   console.log("in");
//   $(".yu2fvl-overlay").css("display", "block");
// })

setTimeout(function () {

  $(".yu2fvl-iframe").attr("src", "https://www.youtube.com/embed/pVnjx25VO08");
}, 2000)
