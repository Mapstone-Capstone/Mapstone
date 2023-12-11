import {
    onMapLoad, openUpdateModal, displayImages
} from "./mapbox-map-utils.js";


const openUpdateModalButton = document.getElementById("open-update-modal");



(async function () {


await onMapLoad();

displayImages();

openUpdateModalButton.addEventListener("click", openUpdateModal);


})();
