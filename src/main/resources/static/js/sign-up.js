const registerButton = document.getElementById("register-button");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("password-confirm");
const passwordError = document.getElementById("password-error");
const registerForm = document.getElementById("register-form");
//regex for password that must be at least 8 characters long, contain one uppercase, one number, and one special character
// const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;
// const isValid = regex.test(password.value);
const username = document.getElementById("username");
const firstName = document.getElementById("firstname");
const lastName = document.getElementById("lastname");
const email = document.getElementById("email");

// ERROR FIELDS
const usernameError = document.getElementById("username-error");
const firstNameError = document.getElementById("firstName-error");
const lastNameError = document.getElementById("lastName-error");
const emailError = document.getElementById("email-error");


registerButton.addEventListener("click", (e)=> {
    e.preventDefault();
    passwordError.innerText = "";
    usernameError.innerText = "";
    firstNameError.innerText = "";
    lastNameError.innerText = "";
    emailError.innerText = "";

    //if any of the fields are blank, do not submit but keep the value of other fields
    if (username.value === "") {
        usernameError.innerText = "Username cannot be blank.";
        return;
    }

    if (firstName.value === "") {
        firstNameError.innerText = "First Name cannot be blank.";
        return;
    }

    if (lastName.value === "") {
        lastNameError.innerText = "Last Name cannot be blank.";
        return;
    }

    if (email.value === "") {
        emailError.innerText = "Email cannot be blank.";
        return;
    }

    //if email id not valid, do not submit but keep the value of other fields
    if (!email.value.includes("@")) {
        emailError.innerText = "Email must be valid.";
        return;
    }


    //if the password in blank or if it does not match the password confirm or if it does not meet the password requirments, dont dubmit the form, otherwise, submit the form
    if (password.value === "") {
        passwordError.innerText = "Password cannot be blank.";
        return;
    }

    if (passwordConfirm.value === "") {
        passwordError.innerText = "You must confirm your password.";
        return;
    }

    if (passwordConfirm.value !== password.value)  {
        passwordError.innerText = "Passwords do not match";
        return;
    }

    // if (!isValid) {
    //     passwordError.innerText = "Password must be between 8 - 15 characters long and contain at least one uppercase letter, one lowercase letter, and one number and on special character";
    //     return;
    // }

    registerForm.submit();


})


