const profilePageSection = document.getElementById("profile-section") as HTMLDivElement;
const profilePageButton = document.getElementById("profile-button") as HTMLButtonElement;
const profilePageMenu = document.getElementById("profile-menu") as HTMLDivElement;

const profilePageName = document.getElementById("profile-name") as HTMLElement;
const profilePageFullName = document.getElementById("profile-full-name") as HTMLElement;
const profilePageEmail = document.getElementById("profile-email") as HTMLElement;
const profilePageLogoutButton = document.getElementById("logout-button") as HTMLButtonElement;

const updateProfile = (): void => {
    const currentUser: CurrentUser | null = JSON.parse(
        localStorage.getItem("currentUser") || "null"
    );

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

document.addEventListener("click", (event: MouseEvent) => {
    if (event.target instanceof Node && !profilePageSection.contains(event.target)) {
        profilePageMenu.classList.add("hidden");
    }
});

profilePageLogoutButton.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.replace("./home.html");
});

updateProfile();
