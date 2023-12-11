import {
    onMapLoad, openUpdateModal, displayImages, uploadAvatar
} from "./mapbox-map-utils.js";


const openUpdateModalButton = document.getElementById("open-update-modal");



(async function () {


await onMapLoad();

uploadAvatar();

displayImages();

openUpdateModalButton.addEventListener("click", openUpdateModal);


})();
