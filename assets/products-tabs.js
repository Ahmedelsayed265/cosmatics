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
            const config = (window.__productsTabsConfig && window.__productsTabsConfig[sectionId]) || {};
            const tabs = section.querySelectorAll('.products-tabs-tab');
            const panels = section.querySelectorAll('.products-tabs-panel');
            const swipers = {};

            function getSwiperOptions(panel) {
                const options = {
                    slidesPerView: 2.2,
                    spaceBetween: 10,
                    loop: config.sliderLoop === true,
                    rtl: document.documentElement.dir === 'rtl',
                    watchOverflow: true,
                    observer: true,
                    observeParents: true,
                    breakpoints: {
                        320: { slidesPerView: 2.2, spaceBetween: 10 },
                        640: { slidesPerView: 2.5, spaceBetween: 12 },
                        768: { slidesPerView: 4, spaceBetween: 16 },
                        1024: { slidesPerView: 5.5, spaceBetween: 20 },
                    }
                };

                if (config.sliderArrows === true) {
                    options.navigation = {
                        nextEl: panel.querySelector('.swiper-button-next'),
                        prevEl: panel.querySelector('.swiper-button-prev'),
                    };
                } else {
                    const nextEl = panel.querySelector('.swiper-button-next');
                    const prevEl = panel.querySelector('.swiper-button-prev');
                    if (nextEl) nextEl.style.display = 'none';
                    if (prevEl) prevEl.style.display = 'none';
                }

                if (config.sliderPagination !== false) { // Default to showing pagination if not explicitly disabled
                    options.pagination = {
                        el: panel.querySelector('.swiper-pagination'),
                        clickable: true,
                        dynamicBullets: true,
                    };
                }

                return options;
            }

            function initSwiper(panel) {
                if (!panel) return;
                const panelId = panel.id;
                const sliderEl = panel.querySelector('.swiper');
                if (!sliderEl) return;

                // Destroy existing instance for this panel if it exists
                if (swipers[panelId] && typeof swipers[panelId].destroy === 'function') {
                    swipers[panelId].destroy(true, true);
                    delete swipers[panelId];
                }

                // Initialize Swiper
                if (window.Swiper) {
                    swipers[panelId] = new Swiper(sliderEl, getSwiperOptions(panel));
                }
            }

            function switchTab(clickedTab) {
                if (clickedTab.classList.contains('products-tabs-tab--active')) return;

                const targetPanelId = clickedTab.getAttribute('aria-controls');
                const targetPanel = section.querySelector(`#${targetPanelId}`);

                // Update tabs state
                tabs.forEach((t) => {
                    t.classList.remove('products-tabs-tab--active');
                    t.setAttribute('aria-selected', 'false');
                    t.setAttribute('tabindex', '-1');
                });
                clickedTab.classList.add('products-tabs-tab--active');
                clickedTab.setAttribute('aria-selected', 'true');
                clickedTab.setAttribute('tabindex', '0');

                // Update panels state
                panels.forEach((p) => {
                    p.setAttribute('hidden', '');
                });

                if (targetPanel) {
                    targetPanel.removeAttribute('hidden');
                    
                    // Small delay to ensure display: block is applied before Swiper calculation
                    setTimeout(() => {
                        initSwiper(targetPanel);
                    }, 50);
                }
            }

            // Bind click events
            tabs.forEach((tab) => {
                tab.addEventListener('click', (e) => {
                    e.preventDefault();
                    switchTab(tab);
                });
            });

            // Initial initialization for the active panel
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

    // Initialize on DOMContentLoaded or immediately if already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProductsTabs);
    } else {
        initProductsTabs();
    }
})();
