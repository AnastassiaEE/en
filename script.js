let allowSlidePrev = false;
let allowSlideNext = false;
let isBegginingReached = false;
let isEndReached = false;
let arePiesFilled = false;
let areProgressBarsFilled = false;
const accentColor = '#D1335B';
const piesPercentages = [50, 20, 80, 60];
const progressCirclesNumber = [12, 8, 8];
const letters = ['W', 'e', 'b', ' ', 'd', 'e', 'v', 'e', 'l', 'o', 'p', 'e', 'r'];
const slideChangeSpeed = 300;
var resizeTimer;

// Slides

const changeSlideOnClick = (menuItems, menuItem, swiper) => {
    swiper.slideTo(menuItems.indexOf(menuItem), slideChangeSpeed);
}

const centerLongSlidesContent = (swiper) => {
    $(swiper.slides).each((_, slide) => {
        if ($(slide).find('.swiper-scrollbar').hasClass('swiper-scrollbar-lock')) {
            $(slide).find('.swiper-wrapper').addClass('justify-content-center');
        } else {
            $(slide).find('.swiper-wrapper').removeClass('justify-content-center');
        }
    }) 
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
            $('.main-section__subtitle').html(text);
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
            $('.main-section__subtitle').html(text);
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

    const menuItems = $('.menu__item').get();
    const mobileMenuItems = $('.mobile-menu__item').get();
    const pies = $('.pie').get();
    const progressBars = $('.section__progress-bar').get();
    
    const swiper = new Swiper('.swiper-container', {
        direction: 'horizontal',
        slidesPerView: 1,
        mousewheel: true,
        simulateTouch: false,
        observer: true,
        observeParents: true,
        updateOnWindowResize: true,
        breakpoints: {
            992: {
                direction: 'vertical',
            } 
        }
    })

    const scrollableSwiper = new Swiper('.swiper-scrollbar-container', {
        direction: 'vertical',
        slidesPerView: 'auto',
        mousewheel: true,
        simulateTouch: false,
        freeMode: true,
        nested: true,
        scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true
        }
    })

    centerLongSlidesContent(swiper);
    animateText();
    
    $(scrollableSwiper).each((_, sw) => {
        sw.on('reachBeginning', () => {
        swiper.allowSlidePrev = false;
        isBegginingReached = true;
        })
    })

    $(scrollableSwiper).each((_, sw) => {
        sw.on('reachEnd', () => {
            swiper.allowSlideNext = false;
            isEndReached = true;
        })
    })

    $(scrollableSwiper).each((_, sw) => {
        sw.on('scroll touchMove', () => {
            if (isBegginingReached) {
                if (allowSlidePrev) {
                    swiper.allowSlidePrev = true;
                    allowSlidePrev = false; 
                    isBegginingReached = false;
                    return;
                }
                allowSlidePrev = true;
            }
            if (isEndReached) {
                if (allowSlideNext) {
                    swiper.allowSlideNext = true;
                    allowSlideNext = false; 
                    isEndReached = false;
                    return;
                } 
                allowSlideNext = true;
            }
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
        if ($(activeSlide).find('.section__pies').length) fillPies(pies, piesPercentages);
        if ($(activeSlide).find('.section__progress-bars').length) fillProgressBars(progressBars, progressCirclesNumber);
    })

    $(window).on('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            centerLongSlidesContent(swiper);           
        }, 100)
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