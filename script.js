const swiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    slidesPerView: 1,
    mousewheel: {
        enabled: true,
    },
    simulateTouch: false,
    createElements: true,
    breakpoints: {
        992: {
            direction: 'vertical',
        } 
    },
    speed: 500
})

const scrollableSwiper = new Swiper('.swiper-scrollbar-container', {
    direction: 'vertical',
    slidesPerView: 'auto',
    mousewheel: {
        enabled: true,
    },
    simulateTouch: true,
    freeMode: {
        enabled: true, 
        //momentumRatio: 0.2,
        //minimumVelocity: 0.1,
        
        momentum: false,
    },
    nested: true,
    createElements: true,
    autoHeight: true,
    scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
        snapOnRelease: false
    },
})

let arePiesFilled = false;
let areProgressBarsFilled = false;
const accentColor = '#4d81b3';
const piesPercentages = [100, 80, 60, 50, 50, 40];
const progressCirclesNumber = [12, 7, 8];
const lettersEn = [
    ['W', 'e', 'b', ' ', 'D', 'e', 'v', 'e', 'l', 'o', 'p', 'e', 'r'],
    ['T', 'e', 'a', 'c', 'h', 'e', 'r']
];
const lettersEt = [
    ['V', 'e', 'e', 'b', 'i', 'a', 'r', 'e', 'n', 'd', 'a', 'j', 'a'],
    ['Õ', 'p', 'e', 't', 'a', 'j', 'a']
];
const lettersRu = [
    ['В', 'е', 'б', ' ', 'р', 'а', 'з', 'р', 'а', 'б', 'о', 'т', 'ч', 'и', 'к'],
    ['П', 'р', 'е', 'п', 'о', 'д', 'а', 'в', 'а', 'т', 'е', 'л', 'ь']
];
let lettersIndex = 0;

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

const getLettersByLang = () => {
    const pageLang = $('html').attr('lang');
    let letters;
    if (pageLang === 'en') {
        letters = lettersEn;
    } else if (pageLang === 'et') {
        letters = lettersEt;
    } else {
        letters = lettersRu;
    }
    return letters;
}

const addLetter = () => {
    return new Promise((resolve, reject) => {
        let text = '';
        let letterIndex = 0;
        let letters = getLettersByLang()[lettersIndex];
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
        let letters = getLettersByLang()[lettersIndex];
        let text = letters.join('');
        let timer = setInterval(() => {
            text = text.slice(0, text.length - 1);
            $('.subtitle--animated').html(text);
            if (text.length == 0) {
                if (lettersIndex === getLettersByLang().length - 1) {
                    lettersIndex = 0;
                } else {
                    lettersIndex += 1;
                }
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
        sw.on('toEdge', () => {
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


    $(window).on('mousewheel DOMMouseScroll', (e) => {
        var e = window.event || e; // old IE support
        var delta = e.wheelDelta || -e.detail;
        console.log(delta);
    });

   
    
})