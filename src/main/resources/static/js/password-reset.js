const newPassword = document.getElementById("password");
const newPasswordConfirm = document.getElementById("confirm");
let passwordValidation = document.getElementById("password-validation");

const form = document.getElementById("password-reset-form");
const submitBtn = document.getElementById("submit-btn");

let validated = false;

newPasswordConfirm.addEventListener("focus", ()=> {
    if (newPasswordConfirm.value === newPassword.value) {

       passwordValidation.innerText = "Passwords match!"

      validated = true;
    }
});


