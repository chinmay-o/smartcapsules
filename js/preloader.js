/* ========================
    35. Preloadder
===========================*/

$(window).load(function () {
    setTimeout(function () {
        $('body').addClass('loaded');
    }, 2000);
})
