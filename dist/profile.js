"use strict";
const profilePageSection = document.getElementById("profile-section");
const profilePageButton = document.getElementById("profile-button");
const profilePageMenu = document.getElementById("profile-menu");
const profilePageName = document.getElementById("profile-name");
const profilePageFullName = document.getElementById("profile-full-name");
const profilePageEmail = document.getElementById("profile-email");
const profilePageLogoutButton = document.getElementById("logout-button");
const updateProfile = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!currentUser) {
        window.location.replace("./home.html?login=1");
        return;
    }
    profilePageSection.classList.remove("hidden");
    profilePageName.textContent = currentUser.name.split(" ")[0] ?? "";
    profilePageFullName.textContent = currentUser.name;
    profilePageEmail.textContent = currentUser.email;
};
profilePageButton.addEventListener("click", () => {
    profilePageMenu.classList.toggle("hidden");
});
document.addEventListener("click", (event) => {
    if (event.target instanceof Node && !profilePageSection.contains(event.target)) {
        profilePageMenu.classList.add("hidden");
    }
});
profilePageLogoutButton.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.replace("./home.html");
});
updateProfile();
