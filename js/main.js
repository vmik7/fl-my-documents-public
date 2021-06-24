/* eslint-disable spaced-comment */

// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

/* eslint-disable */
function DynamicAdapt(type) {
    this.type = type;
}

DynamicAdapt.prototype.init = function () {
    const _this = this;
    // массив объектов
    this.оbjects = [];
    this.daClassname = '_dynamic_adapt_';
    // массив DOM-элементов
    this.nodes = document.querySelectorAll('[data-da]');

    // наполнение оbjects объктами
    for (let i = 0; i < this.nodes.length; i++) {
        const node = this.nodes[i];
        const data = node.dataset.da.trim();
        const dataArray = data.split(',');
        const оbject = {};
        оbject.element = node;
        оbject.parent = node.parentNode;
        оbject.destination = document.querySelector(dataArray[0].trim());
        оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
        оbject.place = dataArray[2] ? dataArray[2].trim() : 'last';
        оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.оbjects.push(оbject);
    }

    this.arraySort(this.оbjects);

    // массив уникальных медиа-запросов
    this.mediaQueries = Array.prototype.map.call(
        this.оbjects,
        function (item) {
            return `(${this.type}-width: ${item.breakpoint}px),${item.breakpoint}`;
        },
        this,
    );
    this.mediaQueries = Array.prototype.filter.call(
        this.mediaQueries,
        (item, index, self) => {
            return Array.prototype.indexOf.call(self, item) === index;
        },
    );

    // навешивание слушателя на медиа-запрос
    // и вызов обработчика при первом запуске
    for (let i = 0; i < this.mediaQueries.length; i++) {
        const media = this.mediaQueries[i];
        const mediaSplit = String.prototype.split.call(media, ',');
        const matchMedia = window.matchMedia(mediaSplit[0]);
        const mediaBreakpoint = mediaSplit[1];

        // массив объектов с подходящим брейкпоинтом
        const оbjectsFilter = Array.prototype.filter.call(
            this.оbjects,
            (item) => {
                return item.breakpoint === mediaBreakpoint;
            },
        );
        matchMedia.addListener(() => {
            _this.mediaHandler(matchMedia, оbjectsFilter);
        });
        this.mediaHandler(matchMedia, оbjectsFilter);
    }
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
    if (matchMedia.matches) {
        for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination);
        }
    } else {
        for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            if (оbject.element.classList.contains(this.daClassname)) {
                this.moveBack(оbject.parent, оbject.element, оbject.index);
            }
        }
    }
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
    element.classList.add(this.daClassname);
    if (place === 'last' || place >= destination.children.length) {
        destination.insertAdjacentElement('beforeend', element);
        return;
    }
    if (place === 'first') {
        destination.insertAdjacentElement('afterbegin', element);
        return;
    }
    destination.children[place].insertAdjacentElement('beforebegin', element);
};

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== undefined) {
        parent.children[index].insertAdjacentElement('beforebegin', element);
    } else {
        parent.insertAdjacentElement('beforeend', element);
    }
};

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
    const array = Array.prototype.slice.call(parent.children);
    return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
    if (this.type === 'min') {
        Array.prototype.sort.call(arr, (a, b) => {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) {
                    return 0;
                }

                if (a.place === 'first' || b.place === 'last') {
                    return -1;
                }

                if (a.place === 'last' || b.place === 'first') {
                    return 1;
                }

                return a.place - b.place;
            }

            return a.breakpoint - b.breakpoint;
        });
    } else {
        Array.prototype.sort.call(arr, (a, b) => {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) {
                    return 0;
                }

                if (a.place === 'first' || b.place === 'last') {
                    return 1;
                }

                if (a.place === 'last' || b.place === 'first') {
                    return -1;
                }

                return b.place - a.place;
            }

            return b.breakpoint - a.breakpoint;
        });
    }
};

const da = new DynamicAdapt('max');
da.init();

const sliders = document.querySelectorAll('._swiper');

for (let i = 0; i < sliders.length; i++) {
    const slider = sliders[i];

    if (!slider.classList.contains('_swiper_builded')) {
        slider.classList.toggle('swiper-container');

        const slides = slider.children;
        for (let j = 0; j < slides.length; j++) {
            slides[j].classList.toggle('swiper-slide', true);
        }

        const sliderWrapper = document.createElement('div');
        sliderWrapper.classList.add('swiper-wrapper');

        sliderWrapper.innerHTML = slider.innerHTML;
        slider.innerHTML = '';

        slider.appendChild(sliderWrapper);
        slider.classList.toggle('_swiper_builded', true);
    }
}

class Spoller {
    constructor(element) {
        this.spoller = element;
        this.oneExpanded = this.spoller.classList.contains(
            '_spoller_one-expanded',
        );

        if (this.oneExpanded) {
            this.openedSpoller = null;
        }

        this.spollerItems = this.spoller.querySelectorAll('._spoller__item');

        for (let j = 0; j < this.spollerItems.length; j++) {
            const item = this.spollerItems[j];
            item.classList.toggle('_spoller__item_expanded', false);

            const controller = item.querySelector('._spoller__controller');
            if (controller) {
                controller.addEventListener('click', (e) => {
                    if (item.classList.contains('_spoller__item_expanded')) {
                        item.classList.toggle('_spoller__item_expanded', false);
                        if (this.oneExpanded) {
                            this.openedSpoller = null;
                        }
                    } else {
                        item.classList.toggle('_spoller__item_expanded', true);
                        if (this.oneExpanded) {
                            if (this.openedSpoller !== null) {
                                this.openedSpoller.classList.toggle(
                                    '_spoller__item_expanded',
                                    false,
                                );
                            }
                            this.openedSpoller = item;
                        }
                    }
                });
            }
        }
    }
}

const spollers = document.querySelectorAll('._spoller');
const spollersArray = [];
for (let i = 0; i < spollers.length; i++) {
    spollersArray.push(new Spoller(spollers[i]));
}


/* eslint-enable spaced-comment */

const page = document.querySelector('.page');
const menu = document.querySelector('.menu');
const menuBurger = document.querySelector('.menu__burger');
const menuCloseButton = document.querySelector('.menu__close');
const menuBody = document.querySelector('.menu__body');
const searchInput = document.querySelector('.search__input');
const searchShowButton = document.querySelector('.menu__show-search');
const heroSliderBody = document.querySelector('.hero-slider__body');
const topBar = document.querySelector('.top-bar');
const header = document.querySelector('.header');

function setPageMargin() {
    const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0,
    );
    if (vw <= 991) {
        page.style.marginTop = `${topBar.clientHeight}px`;
    } else {
        page.style.marginTop = '0px';
    }
}
setPageMargin();
window.addEventListener('resize', setPageMargin);

let scrollTop = window.pageYOffset;
function controlTopBar() {
    const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0,
    );
    if (vw <= 991) {
        const top = window.pageYOffset;
        if (top > scrollTop) {
            header.style.top = `-${topBar.clientHeight}px`;
        } else {
            header.style.top = '0px';
        }
        scrollTop = top;
    }
}
controlTopBar();
window.addEventListener('scroll', controlTopBar);

searchInput.addEventListener('focus', () => {
    menu.classList.toggle('menu_state_search', true);
    page.classList.toggle('page_locked', true);
});
searchInput.addEventListener('blur', () => {
    menu.classList.toggle('menu_state_search', false);
    page.classList.toggle('page_locked', false);
});
searchShowButton.addEventListener('click', () => {
    searchInput.focus();
});

menuBurger.addEventListener('click', () => {
    menu.classList.toggle('menu_expanded', true);
    page.classList.toggle('page_locked', true);
});
menuCloseButton.addEventListener('click', () => {
    menu.classList.toggle('menu_expanded', false);
    page.classList.toggle('page_locked', false);
});
menuBody.addEventListener('click', (e) => {
    if (e.target === menuBody) {
        menu.classList.toggle('menu_expanded', false);
        page.classList.toggle('page_locked', false);
    }
});

if (heroSliderBody) {
    /* eslint-disable-next-line no-undef */
    const swiper = new Swiper(heroSliderBody, {
        // speed: 400,
        // spaceBetween: 100,
        // loop: true,
        effect: 'fade',
        navigation: {
            nextEl: '.hero-slider__next',
            prevEl: '.hero-slider__prev',
        },
    });
}
