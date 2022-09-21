

function swapSlideGallery() {

  $(".custom-carousal-option").click(function(e) {

    var bgImg = $(e.target).css('background-image');
    var parentImgID = $(e.target).parent().parent().parent().parent().attr('id');
    var primaryImg = $("#"+ parentImgID + " .custom-carousal-primary").css('background-image');
    $("#"+ parentImgID + " .custom-carousal-primary").css('background-image', bgImg);
    $(e.target).css('background-image', primaryImg);
  });
}
