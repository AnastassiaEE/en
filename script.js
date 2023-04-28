const swiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    slidesPerView: 1,
    mousewheel: true,
    simulateTouch: false,
    createElements: true,
    breakpoints: {
        992: {
            direction: 'vertical',
        } 
    },
    longSwipesMs: 1000
   
})

const scrollableSwiper = new Swiper('.swiper-scrollbar-container', {
    longSwipesMs: 1000, 
    direction: 'vertical',
    slidesPerView: 'auto',
    mousewheel:  {
        enable: true,
    },
    simulateTouch: false,
    freeMode: {
        enabled: true,
    },
    nested: true,
    createElements: true,
    autoHeight: true,
    scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
        snapOnRelease: true
    },
  
    
})

let allowSlidePrev = false;
let allowSlideNext = false;
let isBegginingReached = false;
let isEndReached = false;
let arePiesFilled = false;
let areProgressBarsFilled = false;
const accentColor = '#4d81b3';
const piesPercentages = [100, 80, 60, 50, 50, 40];
const progressCirclesNumber = [12, 7, 7];
const letters = ['W', 'e', 'b', ' ', 'd', 'e', 'v', 'e', 'l', 'o', 'p', 'e', 'r'];
const slideChangeSpeed = 300;

// Slides

const changeSlideOnClick = (menuItems, menuItem, swiper) => {
    swiper.allowSlidePrev = true;
    swiper.allowSlideNext = true;
    swiper.slideTo(menuItems.indexOf(menuItem), slideChangeSpeed);
}

// Pies

const fillPie = (pie, percentage) => {
    let perc = 0;
    const timer = setInterval(() => {
        perc += 1;
        $(pie).css('background', 'conic-gradient(' + accentColor + ' ' + perc + '%, var(--elements-background-color) 0%)')
        if (perc === percentage) clearInterval(timer);
    }, 20)
}

const fillPies = (pies, percentages) => {
    if (arePiesFilled) return;
    pies.forEach((element, index) => {
        fillPie(element, percentages[index]);
        $(element).next().html(percentages[index] + '%');
    })
    arePiesFilled = true;
}

// Progress bars

const changeProgressCircleColor = (progressCircle) => {
    return new Promise((resolve, reject) => {
        let timer = setTimeout(() => {
            $(progressCircle).css('background-color', accentColor);
            clearInterval(timer);
            resolve();
        }, 100);
    })
}

const fillProgressBar = async(progressCircles, progressCirclesNumber) => {
    for (let i = 0; i < progressCirclesNumber; i++) {
        await changeProgressCircleColor(progressCircles[i]);
    }
}

const fillProgressBars = (progressBars, progressCirclesNumber) => {
    if(areProgressBarsFilled) return;
    progressBars.forEach((element, index) => {
        fillProgressBar($(element).find('.progress-bar__circle').get(), progressCirclesNumber[index]); 
    })
    areProgressBarsFilled = true;
}

// Animated text

const addLetter = () => {
    return new Promise((resolve, reject) => {
        let text = '';
        let letterIndex = 0;
        let timer = setInterval(() => {
            text += letters[letterIndex];
            letterIndex += 1;
            $('.subtitle--animated').html(text);
            if (text.length === letters.length) {
                clearTimeout(timer);
                resolve();
            }
        }, 200)
    })  
}

const removeLetter = () => {
    return new Promise((resolve, reject) => {
        let text = letters.join('');
        let timer = setInterval(() => {
            text = text.slice(0, text.length - 1);
            $('.subtitle--animated').html(text);
            if (text.length == 0) {
                clearInterval(timer);
                resolve();
            } 
        }, 100)
    })
}

const animateText = async() => {
    while (true) {
        await addLetter();
        await removeLetter();
    }
}

// Change active menu item

const disableMenuItems = (menuItems) => {
    if (menuItems !== undefined) {
        menuItems.forEach(element => {
            $(element).removeClass('menu__item--active');
        })
    } 
} 

const activateMenuItem = menuItem => {
    $(menuItem).addClass('menu__item--active');
}

// Open mobile menu 

const openMobileMenu = () => {
    $('.mobile-menu-burger').addClass('mobile-menu-burger--opened');
    $('.mobile-menu').addClass('mobile-menu--opened');
    $('.mobile-menu__item').get().forEach(element => {
        $(element).addClass('mobile-menu__item--opened');
    })
    $('.main').addClass('main--closed');
}

const closeMobileMenu = () => {
    $('.mobile-menu-burger').removeClass('mobile-menu-burger--opened');
    $('.mobile-menu').removeClass('mobile-menu--opened');
    $('.mobile-menu__item').get().forEach(element => {
        $(element).removeClass('mobile-menu__item--opened');
    })
    $('.main').removeClass('main--closed');
}

$(() => {

    let showScrollBarTimer = setTimeout(() => {
        $(scrollableSwiper).each((_, sw) => {
            sw.update();
        })
        clearTimeout(showScrollBarTimer);
    }, 150)

    animateText();

    const menuItems = $('.menu__item').get();
    const mobileMenuItems = $('.mobile-menu__item').get();
    const pies = $('.pie__circle').get();
    const progressBars = $('.progress-bar__circles').get();

    
    $(scrollableSwiper).each((_, sw) => {
        sw.on('reachBeginning reachEnd', () => {
            console.log('end');
            swiper.mousewheel.disable();
            let mousewheelTimer = setTimeout(() => {
                swiper.mousewheel.enable();
                clearTimeout(mousewheelTimer);
            }, 500);
        })
    })

    swiper.on('slideChange', () => {
        disableMenuItems(menuItems);
        disableMenuItems(mobileMenuItems);
        activateMenuItem(menuItems[swiper.activeIndex]);
        activateMenuItem(mobileMenuItems[swiper.activeIndex]);
    })

    swiper.on('transitionEnd', () => {
        const activeSlide = swiper.slides[swiper.activeIndex];
        if ($(activeSlide).find('.pie').length) fillPies(pies, piesPercentages);
        if ($(activeSlide).find('.progress-bar__circles').length) fillProgressBars(progressBars, progressCirclesNumber);
    })

    $('.menu__item').on('click', function() {
        changeSlideOnClick(menuItems, this, swiper);
        disableMenuItems(menuItems);
        activateMenuItem(this);
    })

    $('.mobile-menu__item').on('click', function() {
        changeSlideOnClick(mobileMenuItems, this, swiper);
        disableMenuItems(mobileMenuItems);
        activateMenuItem(this);
    })

    $('.mobile-menu-burger').on('click', function() {
        if ($('.mobile-menu').hasClass('mobile-menu--opened')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    })

    $('.main').on('click', () => {
        closeMobileMenu();
    })

    $('.scroll-button, .swipe-button').on('click', () => {
        swiper.slideNext();
    })
    
})