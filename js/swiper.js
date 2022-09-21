const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  // loop: true,
  slidesPerView: 2,
  spaceBetween: 10,
  speed: 300,
  autoplay: true,
  centeredSlides: true,
  centeredSlidesBounds: true,
  centerInsufficientSlides: true,
  autoplay: {

    delay: 5000,
  },
  draggable: true,
  breakpoints: {
    // when window width is >= 480px
    600: {
      slidesPerView: 3,
      spaceBetween: 10
    },
    // when window width is >= 640px
    800: {
      slidesPerView: 6,
      spaceBetween: 10
    }
  },
  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});

const swiperGallery = new Swiper('.swiper-gallery', {
  // Optional parameters
  direction: 'horizontal',
  // loop: true,
  slidesPerView: 1,
  spaceBetween: 200,
  // slidesPerGroup: 1,
  // slidesPerGroupSkip: 1,
  speed: 300,
  autoplay: true,
  // centeredSlides: true,
  // centeredSlidesBounds: true,
  // centerInsufficientSlides: true,
  autoplay: {

    delay: 5000,
  },
  draggable: true,
  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});
