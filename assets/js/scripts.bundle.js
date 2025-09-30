"use strict"

const GS = gsap;
GS.registerPlugin(ScrollTrigger);

const active = 'active';
const show = 'show';

const $body = $('body');
const $header = $('#header');
const $submenuHandler = $('.sub-menu-handler');

const LENIS = new Lenis({
    duration: 1.2,
    easing: function(t){return (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))},
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
});


const Bundle = function() {

    const svgInjection = () => {
        const SVGs = document.querySelectorAll('img.svg');
        SVGInjector(SVGs);
    }

    const scrollbar = () => {
        LENIS.on("scroll", ScrollTrigger.update);
        GS.ticker.add((time) => LENIS.raf(time * 1000));
        GS.ticker.lagSmoothing(0)
    }

    const loader = () => {
        setTimeout(() => {
            $('#loader').fadeOut(250);
            GS.to($header, {y: 0});

            const charEl = document.querySelectorAll('#intro .char');
            const introCharTL = GS.timeline();
            introCharTL.to(charEl, { 
                autoAlpha: 1, 
                stagger: 0.05,
                y: 0,
                duration: 0.5,
            }).to('.illustration', { 
                autoAlpha: 1, 
                duration: 1,
                onCompleted: () => {
                    animate();
                    hero();
                }
            });
        }, 1000);
    }

    const menu = () => {
        $('#hamburger').on("click", function() {
            $(this).toggleClass(active);
            $header.toggleClass('open');
            $submenuHandler.removeClass(active);
            $('#menu').slideToggle();
            $('.sub-menu').slideUp();
        });

        $('#scroll_top').on("click", function (e) {
            e.preventDefault();
            $('html, body').animate({ scrollTop: 0 }, 600);
        });
    }

    const hero = () => {
        const hero = document.getElementById('hero');
        if (!hero) return;

        if (window.innerWidth > 1279) {
            const hand1 = hero.querySelector('.hand1');
            const hand2 = hero.querySelector('.hand2');
            const binocular = hero.querySelector('.binocular');

            window.addEventListener("mousemove", (e) => {
                const screenHeight = window.innerHeight;
                const mouseY = e.clientY;
                // Map mouseY to a value between -X and +X using centered formula
                const hand1Rotation = ((mouseY - screenHeight / 2) / (screenHeight / 2)) * 5; // -5 to +6
                const hand2Rotation = ((mouseY - screenHeight / 2) / (screenHeight / 2)) * 8; // -8 to +8
                const binocularRotation = ((mouseY - screenHeight / 2) / (screenHeight / 2)) * 9; // -9 to +9

                // Apply rotation to the SVG
                hand1.style.transform = `rotate(${hand1Rotation}deg)`;
                hand2.style.transform = `rotate(${hand2Rotation}deg)`;
                binocular.style.transform = `rotate(${binocularRotation}deg)`;
            });
        } else {
            hero.classList.add('hero--animation');
        }   
        
        const screen = document.getElementById('screen');
        const rocket = document.getElementById('rocket');
        const option = document.getElementById('option');
        const rocketImage = rocket.querySelector('.rocket-img');
        const screenHero = document.getElementById('screen_hero');
        const screenArrow = document.getElementById('screen_arrow');
        const screenBtn = document.getElementById('screen_btn');
        const arrowLine = screenArrow.querySelector('.arrow-line');
        const lineLength = arrowLine.getTotalLength();
        const lines = 20;

        // Set up the stroke style
        arrowLine.style.strokeDasharray = lineLength;
        arrowLine.style.strokeDashoffset = lineLength;        
        if (!screenHero) return;

        for (let i = 0; i <= lines; i++) {
            let star = document.createElement("i");
            let x = Math.floor(Math.random() * window.innerWidth);
            let duration = Math.random() * 1;
            let h = Math.random() * 100;
            star.style.left = x + "px";
            star.style.width = 1 + "px";
            star.style.height = h + "px";
            star.style.animationDuration = duration + "s";
            rocket.appendChild(star);
        }

        const screenHeroTL = GS.timeline({
            scrollTrigger: {
                trigger: screen,
                start: "top 40%",
                end: "bottom bottom-=10%",
                scrub: true,
            },
            onComplete: () => {
                screenBtn.classList.add('show');
            }
        });

        screenHeroTL.to(screenHero, {
            scale: 1,
            duration: 1
        })
        .to(screenArrow.querySelector('.arrow-line'), { strokeDashoffset: 0 })
        .to(screenArrow.querySelector('.arrow-shape'), { autoAlpha: 1, y: 0 })
        .to(screenBtn, { autoAlpha: 1 }, "<");

        $('#screen_btn .btn').on('click', function() {
            GS.to('#intro_section', { 
                y: -200, 
                autoAlpha: 0, 
                visibility: 'hidden',
                onComplete: () => {
                    $('#intro_section').addClass('hide');
                    GS.to(rocket, { autoAlpha: 1, duration: 1, y: 0 });
                    setTimeout(() => {
                        GS.timeline()
                        .to(rocketImage, { yPercent: 200, duration: 1 })
                        .to(option, { y: 0, autoAlpha: 1, position: 'relative', duration: 1 }, "<")
                        .to(rocket, { autoAlpha: 0 });
                    }, 1500);
                }
            });
        });
    }

    const animate = () => {
        const titleEl = GS.utils.toArray('.title');
        const animateEl = document.querySelectorAll('[data-animate]');

        const animate = (item) => {
            item.classList.add(item.dataset.animate);
            // Set animation delay using the data-animate-delay attribute of the item
            if (item.dataset.animateDelay) {
                item.style.setProperty('--animation-delay', item.dataset.animateDelay + 'ms');
            }
        }

        animateEl.forEach(item => {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                        animate(item);    
                        // Stop observing the item once it has been animated
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            // Immediately animate elements that are already in the viewport on page load
            if (item.getBoundingClientRect().top < window.innerHeight) {
                animate(item);
            } else {
                // Observe elements that are not yet in the viewport
                observer.observe(item);
            }
        });

        titleEl.forEach(item => {
            const tl = GS.timeline({
                scrollTrigger: {
                    trigger: item,
                    start: "top 80%",
                    end: "bottom center",
                    scrub: 0.5,
                    duration: 1.5
                }
            })
            .to(item.querySelectorAll('.char'), 
                { 
                    autoAlpha: 1, 
                    stagger: 0.1,
                    y: 0
                }
            )
        })
    }

    const innerHero = () => {
        const hero = document.getElementById('inner_hero');
        if (!hero) return;

        const parallax = GS.fromTo(hero.querySelector('img'), 
            { yPercent: -20 }, 
            { yPercent: 20, duration: 1, ease: Linear.easeNone }
        );
        ScrollTrigger.create({
            trigger: hero,
            start: "top+=20% 100%",
            end: () => `+=${hero.offsetHeight + window.innerHeight}`,
            animation: parallax,
            scrub: true,
        });
    }

    const testimonials = () => {
        const testimonials = document.getElementById('testimonials');
        if (!testimonials) return;
        
        new Swiper(testimonials.querySelector('.swiper'), {
            grabCursor: true,
            speed: 800,
            effect: "cards",
            
            navigation: {
                prevEl: testimonials.querySelector('.swiper-button-prev'),
                nextEl: testimonials.querySelector('.swiper-button-next')
            }
        });
    }

    const cashback = () => {
        $(document).on('input', '#cashback_cal input[type="text"]', function () {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value) {
                $('#cashback_cal .form-error').removeClass(show);
            }
        });

        $('#cashback_cal input[type="button"]').on('click', function () {
            const amount = parseInt($('#cashback_cal input[type="text"]').val(), 10);
            if (!amount) {
                $('#cashback_cal .form-error').addClass(show);
                return false;
            }
            $('#cashback_cal .form-error').removeClass(show);

            const result = (amount * 5) / 100;
            $('#cashback_rupee').text(result.toFixed(2));
            $('#cashback').addClass(show);
            $('#cashback_cal').addClass('hide');
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        });

        $('#cashback input[type="button"]').on('click', function () {
            $('#cashback').removeClass(show);
            $('#cashback_cal').removeClass('hide');
            $('#cashback_cal input[type="text"]').val('');
        });
    }

    const initSelect = () => {
        const $selectControl = $('.select-control');

        $selectControl.each(function() {
            const $this = $(this);
            const options = $this.children('option');

            $this.wrap('<div class="select-box"></div>');
            $this.after('<div class="form-control select-box__control"></div>');

            const $select = $this.next('div.form-control.select-box__control');

            $select.text($this.children('option:selected').text());
            if ($this.attr('id')) {
                $select.attr('id', $this.attr('id'));
            }

            const $list = $('<ul />', {
                'class': 'select-box__options'
            }).insertAfter($select);

            options.each(function (_, option) {
                const $option = $(option);
                if (!$option.attr('disabled') && !$option.attr('hidden')) {
                    $('<li />', {
                        text: $option.text(),
                        rel: $option.val()
                    }).appendTo($list);
                }
            });                
        });

        const $selectBox = $('.select-box__control');
        const $selectMenu = $('.select-box__options');
        const $selectList = $selectMenu.children('li');

        $selectBox.on('click', function (event) {
            const _this = $(this);
            event.stopPropagation();
            
            if (_this.hasClass(active)) {
                _this.removeClass(active);
                _this.next().removeClass(show);
            } else {
                $selectBox.removeClass(active);
                $selectMenu.removeClass(show);

                _this.addClass(active);
                _this.next().addClass(show);
            }
        });

        $selectList.on('click', function() {
            const _this = $(this);
            _this.parent().parent().find('select').val(_this.attr('rel'));
            _this.parent().prev().text(_this.text());
        });
        
        $('body').on('click', function() {
            $selectBox.removeClass(active);
            $selectMenu.removeClass(show);
        });
    }

    const propertyHero = () => {
        const propertyThumb = new Swiper('#property_thumb', {
            spaceBetween: 16,
            slidesPerView: 4,
            freeMode: true,
            watchSlidesProgress: true,
        });
        new Swiper('#property_hero', {
            spaceBetween: 32,
            thumbs: {
                swiper: propertyThumb,
            },
        });
    }

    return {
        init() { 
            Splitting();
            svgInjection();
            scrollbar();
            loader();
            menu();
            innerHero();
            testimonials();
            cashback();
            initSelect();
            propertyHero();

            const dateControl = document.querySelectorAll('.form-control--date');
            if (dateControl.length) {
                datepicker('.form-control--date');                
            }
            

            this.onScroll();
            this.onResize();
        },

        onResize() {
            // Check click event to sub-menu handler
            // const events = $._data($submenuHandler[0], "events");
            // if (window.innerWidth < 992 && !events?.click) {
            //     $submenuHandler.on("click", function() {
            //         const $this = $(this);
            //         $this.toggleClass(active);
            //         $this.next().slideToggle();
            //     });
            // }
        },

        onScroll() {
            $header.toggleClass('fixed-header', $(window).scrollTop() >= 50);
        },
    }
    
}();

jQuery(window).on('load', Bundle.init());
jQuery(window).on('scroll', Bundle.onScroll);