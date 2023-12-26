const newPassword = document.getElementById("password");
const newPasswordConfirm = document.getElementById("confirm");
let passwordValidation = document.getElementById("password-validation");

const form = document.getElementById("password-reset-form");
const submitBtn = document.getElementById("submit-btn");

let validated = false;

newPasswordConfirm.addEventListener("keyup", () => {
    if (newPassword.value !== newPasswordConfirm.value) {
        passwordValidation.innerHTML = "Passwords do not match";
        validated = false;
    } else {
        passwordValidation.innerHTML = "";
        validated = true;
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validated) {
        passwordValidation.innerHTML = "Passwords do not match";
    } else {

        form.submit();
    }
});


