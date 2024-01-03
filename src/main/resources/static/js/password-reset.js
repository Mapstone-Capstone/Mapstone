const newPassword = document.getElementById("password");
const newPasswordConfirm = document.getElementById("confirm");
let passwordValidation = document.getElementById("password-validation");
const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;
const form = document.getElementById("password-reset-form");

let validated = false;
let passwordComplex = false;

//validate that the password meets the regex requirements as the user types AND that the password and password confirm fields match
newPassword.addEventListener("input", (e) => {
    e.preventDefault();
    if (newPassword.value.length < 8 || !regex.test(password.value)) {
        newPassword.classList.add("invalid");
        passwordComplex = false;
        passwordValidation.innerText = "Password must be at least 8 characters long, contain one uppercase, one number, and one special character.";
    } else {
        newPassword.classList.remove("invalid");
        passwordComplex = true;
        passwordValidation.innerText = "";
        checkPassword();
    }


});



const checkPassword = () => {
    newPasswordConfirm.addEventListener("keyup", () => {
        if (newPassword.value !== newPasswordConfirm.value) {
            passwordValidation.innerHTML = "Passwords do not match";
            validated = false;
        } else {
            passwordValidation.innerHTML = "";
            validated = true;
        }
    });
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validated && passwordComplex) {
        form.submit();
    }
});


