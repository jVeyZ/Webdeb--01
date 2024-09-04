const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');
const content = document.querySelector('.content');

hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    hamburger.classList.toggle('active');
    content.classList.toggle('active');
});
