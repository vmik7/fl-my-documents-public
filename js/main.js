const menu = document.querySelector('.menu');
const menuBurger = document.querySelector('.menu__burger');
const menuCloseButton = document.querySelector('.menu__close');
const menuBody = document.querySelector('.menu__body');
const searchInput = document.querySelector('.search__input');
const searchShowButton = document.querySelector('.menu__show-search');

searchInput.addEventListener('focus', () => {
    menu.classList.toggle('menu_state_search', true);
});
searchInput.addEventListener('blur', () => {
    menu.classList.toggle('menu_state_search', false);
});
searchShowButton.addEventListener('click', () => {
    searchInput.focus();
});

menuBurger.addEventListener('click', () => {
    menu.classList.toggle('menu_expanded', true);
});
menuCloseButton.addEventListener('click', () => {
    menu.classList.toggle('menu_expanded', false);
});
menuBody.addEventListener('click', (e) => {
    if (e.target === menuBody) {
        menu.classList.toggle('menu_expanded', false);
    }
});
