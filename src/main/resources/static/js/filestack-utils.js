// import { FILE_STACK_TOKEN } from "./keys.js";

//initialize filestack with api key
// const client = filestack.init(FILE_STACK_TOKEN);
// client.picker().open();  //made corrections


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







