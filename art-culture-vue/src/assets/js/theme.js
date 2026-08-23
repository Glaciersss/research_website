(function($) {
    'use strict';


$('.testi_list1').owlCarousel({
    autoplay: false,
    loop:true,
    margin:10,
    dots:true,
    center:true,
    nav:false,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:1
        },
        992:{
            items:1
        },
        1000:{
            items:1
        },
        1920:{
            items:1
        }

    }
})
$('.testi_list2').owlCarousel({
    autoplay: false,
    loop:true,
    margin:10,
    dots:true,
    center:true,
    nav:false,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:1
        },
        992:{
            items:2
        },
        1000:{
            items:3
        },
        1400:{
            items:3
        },
        1920:{
            items:3
        }

    }
})


	
$('.slider_list').owlCarousel({
    autoplay: false,
    loop:true,
    margin:10,
    dots:false,
    center:true,
    nav:false,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:1
        },
        992:{
            items:1
        },
        1000:{
            items:1
        },
         1920:{
            items:1
        }
    }
})

$('.brand_list').owlCarousel({
    autoplay: false,
    loop:true,
    margin:10,
    dots:false,
    center:true,
    nav:false,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:2
        },
        992:{
            items:2
        },
        1000:{
            items:3
        }
    }
})


$('.portfolio-list').owlCarousel({
    autoplay:true,
    loop:true,
    dots:true,
    center:true,
    nav:false,
    responsive:{
        0:{
            items:3
        },
        600:{
            items:3
        },
        992:{
            items:3
        },
        1000:{
            items:4
        },
         1365:{
            items:4
        },
         1920:{
            items:4
        }
    }
})

$('.testi-list').owlCarousel({
    autoplay: false,
    loop:true,
    margin:10,
    dots:true,
    center:true,
    nav:false,
    responsive:{
        0:{
            items:1
        },
        768:{
            items:1
        },
        992:{
            items:1
        },
        1000:{
            items:1
        },
         1500:{
            items:1
        },
         1920:{
            items:1
        }
    }
})

$('.testi-list4').owlCarousel({
    autoplay: false,
    loop:true,
    margin:10,
    dots:true,
    center:true,
    nav:false,
    responsive:{
        0:{
            items:1
        },
        768:{
            items:1
        },
        992:{
            items:2
        },
        1000:{
            items:2
        },
         1500:{
            items:1
        },
         1920:{
            items:1
        }
    }
})


// Loder 
    $(function () {
      $('body').addClass('loaded');
    });


// counterUp

    $('.counterup h1').counterUp({
        delay: 10,
        time: 5000,
    });



    $(function () {
  $.scrollUp({
    scrollName: 'scrollUp', // Element ID
    topDistance: '300', // Distance from top before showing element (px)
    topSpeed: 300, // Speed back to top (ms)
    animation: 'fade', // Fade, slide, none
    animationInSpeed: 200, // Animation in speed (ms)
    animationOutSpeed: 200, // Animation out speed (ms)
    scrollText: '<i class="fas fa-angle-up"></i>', // Text for element
    activeOverlay: false, // Set CSS color to display scrollUp active point, e.g '#00FFFF'
  });
});
    
// sticky
    var wind = $(window);
    var sticky = $('#sticky-header');
    wind.on('scroll', function () {
        var scroll = wind.scrollTop();
        if (scroll < 100) {
            sticky.removeClass('sticky-nav');
        } else {
            sticky.addClass('sticky-nav');
        }
    });

     //======< scrollcue js >======
    $(function(){
          scrollCue.init({
          duration : 1500,
          interval : -0.7,
          percentage : 0.90,
          smartSpeed: 500 
          
        })
    });





})(jQuery);