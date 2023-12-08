import {
    onMapLoad, openUpdateModal
} from "./mapbox-map-utils.js";


const openUpdateModalButton = document.getElementById("open-update-modal");



(async function () {

await onMapLoad();

openUpdateModalButton.addEventListener("click", openUpdateModal);


})();
