/**
 * Product Tabs Section JS
 * Handles Tab Switching and Swiper Slider initialization
 */

(function () {
    'use strict';

    function initProductsTabs() {
        const sections = document.querySelectorAll('[data-products-tabs]');
        
        sections.forEach((section) => {
            const sectionId = section.getAttribute('section-id');
            const tabs = section.querySelectorAll('.products-tabs-tab');
            const panels = section.querySelectorAll('.products-tabs-panel');
            const swipers = {};

            // Read settings from data attributes
            const isAutoplay = section.getAttribute('data-autoplay') === 'true';
            const autoplayDelay = parseInt(section.getAttribute('data-delay')) || 3000;
            const showArrows = section.getAttribute('data-arrows') === 'true';
            const showPagination = section.getAttribute('data-pagination') === 'true';

            function getSwiperOptions(panel) {
                const options = {
                    slidesPerView: 1.5,
                    spaceBetween: 10,
                    loop: false,
                    rtl: document.documentElement.dir === 'rtl',
                    watchOverflow: true,
                    observer: true,
                    observeParents: true,
                    autoplay: isAutoplay ? { delay: autoplayDelay, disableOnInteraction: false } : false,
                    breakpoints: {
                        320: { slidesPerView: 1.5, spaceBetween: 10 },
                        640: { slidesPerView: 1.5, spaceBetween: 12 },
                        768: { slidesPerView: 4, spaceBetween: 16 },
                        1024: { slidesPerView: 5.5, spaceBetween: 20 },
                    }
                };

                if (showArrows) {
                    options.navigation = {
                        nextEl: panel.querySelector('.swiper-button-next'),
                        prevEl: panel.querySelector('.swiper-button-prev'),
                    };
                }

                if (showPagination) {
                    options.pagination = {
                        el: panel.querySelector('.swiper-pagination'),
                        clickable: true,
                    };
                }

                return options;
            }

            function initSwiper(panel) {
                if (!panel) return;
                const panelId = panel.id;
                const sliderEl = panel.querySelector('.swiper');
                if (!sliderEl) return;

                if (swipers[panelId] && typeof swipers[panelId].destroy === 'function') {
                    swipers[panelId].destroy(true, true);
                    delete swipers[panelId];
                }

                if (window.Swiper) {
                    swipers[panelId] = new Swiper(sliderEl, getSwiperOptions(panel));
                }
            }

            function switchTab(clickedTab) {
                if (clickedTab.classList.contains('products-tabs-tab--active')) return;

                const targetPanelId = clickedTab.getAttribute('aria-controls');
                const targetPanel = section.querySelector(`#${targetPanelId}`);

                tabs.forEach((t) => {
                    t.classList.remove('products-tabs-tab--active');
                    t.setAttribute('aria-selected', 'false');
                    t.setAttribute('tabindex', '-1');
                });
                clickedTab.classList.add('products-tabs-tab--active');
                clickedTab.setAttribute('aria-selected', 'true');
                clickedTab.setAttribute('tabindex', '0');

                panels.forEach((p) => {
                    p.setAttribute('hidden', '');
                });

                if (targetPanel) {
                    targetPanel.removeAttribute('hidden');
                    setTimeout(() => {
                        initSwiper(targetPanel);
                    }, 50);
                }
            }

            tabs.forEach((tab) => {
                tab.addEventListener('click', (e) => {
                    e.preventDefault();
                    switchTab(tab);
                });
            });

            const initialTab = section.querySelector('.products-tabs-tab--active');
            if (initialTab) {
                const initialPanelId = initialTab.getAttribute('aria-controls');
                const initialPanel = section.querySelector(`#${initialPanelId}`);
                if (initialPanel) {
                    initSwiper(initialPanel);
                }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProductsTabs);
    } else {
        initProductsTabs();
    }
})();
