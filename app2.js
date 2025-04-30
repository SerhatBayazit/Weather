

let currentIndex = 0;
const icons = document.querySelector(".icons");
const iconarr = [
    '<i class="fa-regular fa-sun"></i>',
    '<i class="fa-solid fa-cloud-rain"></i>',
    '<i class="fa-regular fa-snowflake"></i>'

];

runEventListener()
function runEventListener() {
    icons.addEventListener("click", changeİcon)
}

function changeİcon() {
    currentIndex = (currentIndex + 1) % iconarr.length;
    icons.innerHTML = iconarr[currentIndex]
}

document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".mobile-menu");

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });

    const menuLinks = mobileMenu.querySelectorAll("a");
    menuLinks.forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("active");
        });
    });

    const links = document.querySelectorAll(".nav-list ul li a");
    const currentPage = window.location.pathname.split("/").pop();

    links.forEach(link => {
        const linkPage = link.getAttribute("href");
        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });
});
