/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
const openMenu = () => {
    document.querySelector('.dropback').className = 'dropback active';
    document.querySelector('aside').className = 'active';
};

const closeMenu = () => {
    document.querySelector('.dropback').className = 'dropback ';
    document.querySelector('aside').className = '';
};

document.getElementById('filterBtn').onclick = (e) => {
    e.preventDefault();
    openMenu();
};

// document.getElementById('canBtn').onclick = (e) => {
//     closeMenu();
// };

document.querySelector('aside button.close').onclick = (e) => {
    closeMenu();
};

document.querySelector('.dropback').onclick = (e) => {
    closeMenu();
};
