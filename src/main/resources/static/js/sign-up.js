const registerButton = document.getElementById("register-button");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("password-confirm");
const passwordError = document.getElementById("password-error");
const registerForm = document.getElementById("register-form");



registerButton.addEventListener("click", (e)=> {
    e.preventDefault();
    passwordError.innerText = "";
    if (passwordConfirm.value !== password.value) {

        passwordError.innerText = "Passwords do not match";
    } else {
        registerForm.submit();
    }
})


// document.addEventListener("DOMContentLoaded", function () {
//     const passwordInput = document.getElementById("password");
//     const confirmPasswordInput = document.getElementById("password-confirm");
//     const passwordError = document.getElementById("password-error");
//     const registerForm = document.getElementById("register-form");
//
//     registerForm.addEventListener("submit", function (event) {
//         if (!isPasswordValid()) {
//             event.preventDefault();
//             passwordError.textContent = "Password must contain at least 1 uppercase letter, 1 number, 1 special character, and be at least 4 characters long";
//             return false;
//         }
//         if (passwordInput.value !== confirmPasswordInput.value) {
//             event.preventDefault();
//             passwordError.textContent = "Passwords do not match";
//             return false;
//         }
//         return true;
//     });
//
//     function isPasswordValid() {
//         const password = passwordInput.value;
//         // Password pattern requiring at least 1 uppercase letter, 1 number, 1 special character, and minimum 4 characters
//         const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;
//
//         return passwordPattern.test(password);
//     }
// });
