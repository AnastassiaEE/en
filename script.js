const accentColor = '#D1335B';
const elementsBackgroundColor = 'rgba(255, 255, 255, 0.2)';
let arePiesFilled = false;
let areProgressBarsFilled = false;
const piesPercentages = [50, 20, 80, 60];
const progressCirclesNumber = [12, 8, 8];
const letters = ['W', 'e', 'b', ' ', 'd', 'e', 'v', 'e', 'l', 'o', 'p', 'e', 'r']
const scrollSpeed = 600;

const heightToScroll = (slide) => {
    const { scrollHeight, clientHeight } = slide;
    return scrollHeight - clientHeight;
}

const allowScroll = (swiper) => {
    const activeSlide = swiper.slides[swiper.activeIndex];
    const scrollHeight = heightToScroll(activeSlide);
    if (scrollHeight > 0) {
        const findScroll = (e) => {
            const scrollUp = e.deltaY < 0;
            if ((scrollUp || e.type === "touchmove") && activeSlide.scrollTop <= 0) {
                swiper.mousewheel.enable();
                swiper.allowTouchMove = true;
                activeSlide.removeEventListener("wheel", findScroll);
                activeSlide.removeEventListener("touchmove", findScroll);
            } else if ((!scrollUp || e.type === "touchmove") && Math.ceil(activeSlide.scrollTop) >= scrollHeight) {
                swiper.mousewheel.enable();
                swiper.allowTouchMove = true;
                activeSlide.removeEventListener("wheel", findScroll);
                activeSlide.removeEventListener("touchmove", findScroll);
            }
        };
        activeSlide.addEventListener("wheel", findScroll);
        activeSlide.addEventListener("touchmove", findScroll);
        swiper.mousewheel.disable();
        swiper.allowTouchMove = false;
    }
};

// Align content center

const disableFlex = (slide) => {
    $(slide).removeClass('d-flex');
}

const enableFlex = (slide) => {
    $(slide).addClass('d-flex');
}

const alignContentCenter = (slide) => {
    if (heightToScroll(slide) > 0) {
        disableFlex(slide);
    } else {
        enableFlex(slide);
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

const enableMenuItem = (menuItems, index) => {
    $(menuItems[index]).addClass('menu__item--active');
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
    pies.forEach((element, index) => {
        fillPie(element, percentages[index]);
        $(element).next().html(percentages[index] + '%');
    });
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
    progressBars.forEach((element, index) => {
        fillProgressBar($(element).find('.progress-bar__circle').get(), progressCirclesNumber[index]); 
    })
    areProgressBarsFilled = true;
}

// Viewport

const isInViewport = element => {
    const elementTop = $(element).offset().top;
    //const elementBottom = elementTop + $(element).height();
    const windowHeight = $(window).height();
    return elementTop < windowHeight;
};

// Fill pies/progress bars basing on device

const fillPiesBasingOnViewport = (pies, piesPercentages) => {
    if (!arePiesFilled && isInViewport($('.section__pies')[0])) {
        fillPies(pies, piesPercentages);
    }
}

const fillProgressBarsBasingOnViewport = (progressBars, progressCirclesNumber) => {
    if (!areProgressBarsFilled && isInViewport($('.section__progress-bars')[0])) {
        fillProgressBars(progressBars, progressCirclesNumber);
    }
}

// Animated text

const addLetter = () => {
    return new Promise((resolve, reject) => {
        let text = '';
        let letterIndex = 0;
        let timer = setInterval(() => {
            text += letters[letterIndex];
            letterIndex += 1;
            $('.main-section__text').html(text);
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
            $('.main-section__text').html(text);
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

// Open mobile menu 

const openBurger = (burger) => {
    burger.addClass('mobile-menu-burger--opened');
}

const closeBurger = (burger) => {
    burger.removeClass('mobile-menu-burger--opened');
}

const openMobileMenu = () => {
    $('.mobile-menu').addClass('mobile-menu--opened');
    $('.mobile-menu__item').get().forEach(element => {
        $(element).addClass('mobile-menu__item--opened');
    })
    $('.main').addClass('main--closed');
}

const closeMobileMenu = () => {
    $('.mobile-menu').removeClass('mobile-menu--opened');
    $('.mobile-menu__item').get().forEach(element => {
        $(element).removeClass('mobile-menu__item--opened');
    })
    $('.main').removeClass('main--closed');
}

$(() => {

    const pies = $('.pie').get();
    const menuItems = $('.menu__item').get();
    const progressBars = $('.section__progress-bar').get();

    const swiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        slidesPerView: 1,
        mousewheel: true,
        speed: scrollSpeed,
        //noSwiping: true,
        //noSwipingClass: 'swiper-slide'
    });

    swiper.on("slideChangeTransitionEnd", () => {
        //allowScroll(swiper);
        fillPiesBasingOnViewport(pies, piesPercentages);
        fillProgressBarsBasingOnViewport(progressBars, progressCirclesNumber);
    })

    swiper.on('slideChange', () => {
        alignContentCenter(swiper.slides[swiper.activeIndex]);
        disableMenuItems(menuItems);
        enableMenuItem(menuItems, swiper.activeIndex);
    
        
    })
    
    $('.menu__item').on('click', function()  {
        swiper.slideTo(menuItems.indexOf(this), scrollSpeed);
    })

    $('.section').on('wheel', () => {
        fillPiesBasingOnViewport(pies, piesPercentages);
        fillProgressBarsBasingOnViewport(progressBars, progressCirclesNumber);
    })

    $(window).resize(() => {
        alignContentCenter(swiper.slides[swiper.activeIndex]);
    })

    $('.mobile-menu-burger').click(function() {
        const burger = $(this);
        if (burger.hasClass('mobile-menu-burger--opened')) {
            closeBurger(burger);
            closeMobileMenu();
        } else {
            openBurger(burger);
            openMobileMenu();
        }
        
    })

    $('.main--closed').click(() => {
        console.log('test');
        closeMobileMenu();
    })
    
    animateText();

    
})
