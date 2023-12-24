const newPassword = document.getElementById("password").value;
const newPasswordConfirm = document.getElementById("confirm");
let passwordValidation = document.getElementById("password-validation");

const form = document.getElementById("password-reset-form");
const submitBtn = document.getElementById("submit-btn");

let validated = false;

newPasswordConfirm.addEventListener("", (e)=> {
    if (newPasswordConfirm.value === newPassword) {

       passwordValidation.innerText = "Passwords match!"

      validated = true;
    }
});

submitBtn.addEventListener("click", (e)=> {
    e.preventDefault();
    if (!validated) {
        passwordValidation.innerText = "Passwords do not match!";
    } else {
        console.log("click");
    }
})