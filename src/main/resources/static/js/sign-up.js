const registerButton = document.getElementById("register-button");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("password-confirm");
const passwordError = document.getElementById("password-error");
const registerForm = document.getElementById("register-form");
const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const isValid = regex.test(password.value);

registerButton.addEventListener("click", (e)=> {
    e.preventDefault();
    passwordError.innerText = "";
    if (passwordConfirm.value !== password.value) {
        passwordError.innerText = "Passwords do not match";
    } else if (!isValid) {
        passwordError.innerText = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number";
    } else {
        passwordError.innerText = "";
        registerForm.submit();
    }
})


// document.addEventListener("DOMContentLoaded", function() {
//     let passwordInput = document.getElementById('password');
//     let confirmPasswordInput = document.getElementById('password-confirm');
//     let registerButton = document.getElementById('register-button');
//     let alertMessage = document.getElementById('alert');
//
//     function validatePasswords() {
//         if (passwordInput.value === confirmPasswordInput.value) {
//             registerButton.disabled = false;
//             alertMessage.style.visibility = 'hidden';
//         } else {
//             registerButton.disabled = true;
//             alertMessage.style.visibility = 'visible';
//         }
//     }
//
//     passwordInput.addEventListener('input', validatePasswords);
//     confirmPasswordInput.addEventListener('input', validatePasswords);
//
//     document.getElementById('register-form').addEventListener('submit', function(event) {
//         if (passwordInput.value !== confirmPasswordInput.value) {
//             event.preventDefault();
//             alertMessage.style.visibility = 'visible';
//         }
//     });
// });
