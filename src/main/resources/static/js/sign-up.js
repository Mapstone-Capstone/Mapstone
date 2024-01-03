const registerButton = document.getElementById("register-button");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("password-confirm");
const passwordError = document.getElementById("password-error");
const registerForm = document.getElementById("register-form");
//regex for password that must be at least 8 characters long, contain one uppercase, one number, and one special character
const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;
const isValid = regex.test(password.value);
const username = document.getElementById("username");
const firstName = document.getElementById("firstname");
const lastName = document.getElementById("lastname");
const email = document.getElementById("email");

// ERROR FIELDS
const usernameError = document.getElementById("username-error");
const firstNameError = document.getElementById("firstName-error");
const lastNameError = document.getElementById("lastName-error");
const emailError = document.getElementById("email-error");


let usernameValid = false;
let firstNameValid = false;
let lastNameValid = false;
let emailValid = false;
let passwordValid = false;
let passwordComplex = false;

//validate thr username as the user types, username must be at least 3 characters long
username.addEventListener("input", (e) => {
    e.preventDefault();
    if (username.value.length < 3) {
        username.classList.add("invalid");
        usernameValid = false;
        usernameError.innerText = "Username must be at least 3 characters long.";
    } else {
        username.classList.remove("invalid");
        usernameValid = true;
        usernameError.innerText = "";
    }
});

//validate the first name as the user types, first name must be at least 2 characters long
firstName.addEventListener("input", (e) => {
    e.preventDefault();
    if (firstName.value.length < 2) {
        firstName.classList.add("invalid");
        firstNameValid = false;
        firstNameError.innerText = "First Name must be at least 2 characters long.";
    } else {
        firstName.classList.remove("invalid");
        firstNameValid = true;
        firstNameError.innerText = "";
    }
});


//validate the last name as the user types, last name must be at least 2 characters long
lastName.addEventListener("input", (e) => {
    e.preventDefault();
    if (lastName.value.length < 2) {
        lastName.classList.add("invalid");
        lastNameValid = false;
        lastNameError.innerText = "Last Name must be at least 2 characters long.";
    } else {
        lastName.classList.remove("invalid");
        lastNameValid = true;
        lastNameError.innerText = "";
    }
});

//validate the email as the user types, email must be at least 5 characters long and contain an @ symbol
email.addEventListener("input", (e) => {
    e.preventDefault();
    if (email.value.length < 5 || !email.value.includes("@")) {
        email.classList.add("invalid");
        emailValid = false;
        emailError.innerText = "Email must be at least 5 characters long and contain an @ symbol.";
    } else {
        email.classList.remove("invalid");
        emailValid = true;
        emailError.innerText = "";
    }
});

//validate that the password meets the regex requirements as the user types AND that the password and password confirm fields match
password.addEventListener("input", (e) => {
    e.preventDefault();
    if (password.value.length < 8 || !regex.test(password.value)) {
        password.classList.add("invalid");
        passwordComplex = false;
        passwordError.innerText = "Password must be at least 8 characters long, contain one uppercase, one number, and one special character.";
    } else {
        password.classList.remove("invalid");
        passwordComplex = true;
        passwordError.innerText = "";
        checkPassword();
    }


});

const checkPassword = () => {
    passwordConfirm.addEventListener("input", (e) => {
        e.preventDefault();
        if (password.value !== passwordConfirm.value) {
            passwordConfirm.classList.add("invalid");
            passwordValid = false;
            passwordError.innerText = "Passwords must match.";
        } else {
            passwordConfirm.classList.remove("invalid");
            passwordValid = true;
            passwordError.innerText = "";
        }
    });
}




//validate the form on submit
registerButton.addEventListener("click", (e) => {
    console.log("click");

//if all fields are valid, submit the form
    if (usernameValid && firstNameValid && lastNameValid && emailValid  && passwordComplex && passwordValid) {
        registerForm.submit();
    }


});
