type User = {
    name: string;
    email: string;
    password: string;
};

type CurrentUser = {
    name: string;
    email: string;
}

const loginBtn = document.getElementById("login-button") as HTMLButtonElement;
const signupBtn = document.getElementById("signup-button") as HTMLButtonElement;

const signupBox = document.getElementById("signup-box") as HTMLElement;
const closeSignup = document.getElementById("close-signup") as HTMLButtonElement;

const openSignup = () => {
    signupBox.classList.remove("hidden");
    signupBox.classList.add("flex");
};

const hideSignup = () => {
    signupBox.classList.remove("flex");
    signupBox.classList.add("hidden");
};

signupBtn.addEventListener("click", openSignup);
closeSignup.addEventListener("click", hideSignup);

signupBox.addEventListener("click", (event: MouseEvent) => {
    if (event.target === signupBox) {
        hideSignup();
    }
})

const signupForm = document.getElementById("signup-form") as HTMLFormElement;
const signupName = document.getElementById("signup-name") as HTMLInputElement;
const signupEmail = document.getElementById("signup-email") as HTMLInputElement;
const signupPassword = document.getElementById("signup-password") as HTMLInputElement;
const signupConfirmPassword = document.getElementById("signup-confirm-password") as HTMLInputElement;
const signupMessage = document.getElementById("signup-message") as HTMLElement;

signupForm.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault();

    const name = signupName.value.trim();
    const email = signupEmail.value.trim().toLowerCase();
    const password = signupPassword.value;
    const confirmPassword = signupConfirmPassword.value;

    if (password != confirmPassword) {
        signupMessage.textContent = "password do not match.";
        signupMessage.className = "text-sm mb-4 text-red-600";
        return;
    }

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

    const existingUsers = users.find(user => user.email === email);

    if (existingUsers) {
        signupMessage.textContent = "This email is already registered.";
        signupMessage.className = "text-sm mb-4 text-red-600";
        return;
    }

    const newUser: User = {
        name: name,
        email: email,
        password: password
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));
    signupMessage.textContent = "Account created successfully!";
    signupMessage.className = "text-sm mb-4 text-green-700";

    signupForm.reset();

    hideSignup();
    loginBox.classList.remove("hidden");
    loginBox.classList.add("flex");

    loginEmail.value = email;
    loginMessage.textContent = "Account created! Please log in.";
    loginMessage.className = "text-sm mb-4 text-green-700";

    console.log("Demo account created:", {
        name: newUser.name,
        email: newUser.email
    });

})

const loginBox = document.getElementById("login-box") as HTMLElement;
const closeLogin = document.getElementById("close-login") as HTMLButtonElement;
const loginForm = document.getElementById("login-form") as HTMLFormElement;

const loginEmail = document.getElementById("login-email") as HTMLInputElement;
const loginPassword = document.getElementById("login-password") as HTMLInputElement;
const loginMessage = document.getElementById("login-message") as HTMLElement;

const switchToLogin = document.getElementById("switch-to-login") as HTMLButtonElement;
const switchToSignup = document.getElementById("switch-to-signup") as HTMLButtonElement;

const openLogin = () => {
    hideSignup();
    loginBox.classList.remove("hidden");
    loginBox.classList.add("flex")
};

loginBtn.addEventListener("click", openLogin);

const hideLogin = () => {
    loginBox.classList.add("hidden");
    loginBox.classList.remove("flex");
};

closeLogin.addEventListener("click", hideLogin);

loginBox.addEventListener("click", (event: MouseEvent) => {
    if (event.target === loginBox) {
        hideLogin();
    }
});

switchToLogin.addEventListener("click", () => {
    hideSignup();
    openLogin();
});

switchToSignup.addEventListener("click", () => {
    hideLogin();
    openSignup();
});

loginForm.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault();

    const email = loginEmail.value.trim().toLowerCase();
    const password = loginPassword.value;

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

    const user = users.find((user) => user.email === email && user.password === password);

    if (!user) {
        loginMessage.textContent = "Invalid email or password."
        loginMessage.className = "text-sm mb-4 text-red-600";
        return;
    }

    const currentUser: CurrentUser = {
        name: user.name,
        email: user.email
    }

    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    loginMessage.textContent = "Login successful!";
    loginMessage.className = "text-sm mb-4 text-green-700";

    loginForm.reset();

    setTimeout(() => {
        hideLogin();
        updateAuthUI();
    }, 500);

})


const authButtons = document.getElementById("auth-buttons") as HTMLElement;
const profileSection = document.getElementById("profile-section") as HTMLElement;
const profileButton = document.getElementById("profile-button") as HTMLButtonElement;
const profileMenu = document.getElementById("profile-menu") as HTMLElement;

const profileName = document.getElementById("profile-name") as HTMLElement;
const profileFullName = document.getElementById("profile-full-name") as HTMLElement;
const profileEmail = document.getElementById("profile-email") as HTMLElement;

const logoutButton = document.getElementById("logout-button") as HTMLButtonElement;

const updateAuthUI = () => {
    const currentUser: CurrentUser | null = JSON.parse(localStorage.getItem("currentUser") || "null");;

    if (currentUser) {
        authButtons.classList.add("hidden");
        profileSection.classList.remove("hidden");

        profileName.textContent = currentUser.name.split(" ")[0] ?? "";
        profileFullName.textContent = currentUser.name;
        profileEmail.textContent = currentUser.email;
    } else {
        authButtons.classList.remove("hidden");
        profileSection.classList.add("hidden");
        profileMenu.classList.add("hidden");
    }
};

profileButton.addEventListener("click", () => {
    profileMenu.classList.toggle("hidden");
});

document.addEventListener("click", (event: MouseEvent) => {
    if (
        event.target instanceof Node &&
        !profileSection.contains(event.target)
    ) {
        profileMenu.classList.add("hidden");
    }
});

logoutButton.addEventListener("click", () => {
    localStorage.removeItem("currentUser");

    profileMenu.classList.add("hidden");
    updateAuthUI();

    alert("You have logged out successfully.");
})

updateAuthUI();

const params = new URLSearchParams(window.location.search);

if (
    params.get("login") === "1" &&
    !localStorage.getItem("currentUser")
) {
    openLogin();
    window.history.replaceState(
        {},
        document.title,
        window.location.pathname
    );
}
