import {
    onMapLoad, displayImages
} from "./viewprofile.js";


(async function () {

    await onMapLoad();
    displayImages();

})();