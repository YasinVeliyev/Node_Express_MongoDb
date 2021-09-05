import "regenerator-runtime/runtime";
// import "@babel/polyfill";
import { login, logout } from "./login";
import { displayMap } from "./mapbox";
import { updateData } from "./updateSetings";
import { bookTour } from "./stripe";

const map = document.getElementById("map");
const form = document.querySelector("#login");
const logoutBtn = document.querySelector(".el--logout");
const updateForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const bookBtn = document.getElementById("book-tour");

if (map) {
    const locations = JSON.parse(map.dataset.locations);
    console.log(locations);
    displayMap(locations);
}

if (form) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        login(email, password);
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}

if (updateForm) {
    updateForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(updateForm);
        updateData(formData, "data");
    });
}

if (userPasswordForm) {
    userPasswordForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const password = document.getElementById("password").value;
        const passwordCurrent = document.getElementById("password-current").value;
        const passwordConfirm = document.getElementById("password-confirm").value;
        updateData({ password, passwordCurrent, passwordConfirm }, "password");
    });
}

if (bookBtn) {
    bookBtn.addEventListener("click", (event) => {
        event.target.textContent = "Processing";
        const tourId = event.target.dataset.tourId;
        bookTour(tourId);
    });
}
