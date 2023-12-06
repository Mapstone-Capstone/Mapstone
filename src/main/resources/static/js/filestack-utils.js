import { FILE_STACK_TOKEN } from "./keys.js";

//initialize filestack with api key
const client = filestack.init(FILE_STACK_TOKEN);
client.picker().open();


//add event listener to file upload button, when a file is selected, upload it to filestack
// const renderFileStackPicker = (input, imageElement) => {
//     input.addEventListener("change", (e) => {
//         e.preventDefault();
//         //get the file that was selected
//         const file = e.target.files[0];
//         console.log(file);
//         client.upload(file).then((response) => {
//             console.log(response + "response from filestack");
//             const imageUrl = response.url;
//             imageElement.src = imageUrl;
//             imageElement.value = imageUrl;
//         }).catch((error) => {
//             console.log(error);
//         });
//     });
// }
//
// //initialize filestack with api key
// const client = filestack.init(fsKey);
//
// const image = document.getElementById("temp-pic");
// const fileUpload = document.getElementById("file-upload");
// const imageInput = document.getElementById("image-url");
//
// const form = document.getElementById("image-form");
//
// //add event listener to file upload button, when a file is selected, upload it to filestack
// fileUpload.addEventListener("change", (event) => {
//     event.preventDefault();
//     //get the file that was selected
//     const file = event.target.files[0];
//     console.log(file);
//     client.upload(file).then((response) => {
//         const imageUrl = response.url;
//         image.src = imageUrl;
//         imageInput.value = imageUrl;
//         form.submit();
//     }).catch((error) => {
//         console.log(error);
//     });



export { renderFileStackPicker };
