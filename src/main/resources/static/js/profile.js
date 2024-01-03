
import {
    map, getUserMapDetails, generateUserMap, addUserLayers, getUserMapLayers, getImagesByCountryId, getImagesByCountryIdAndUserId, getAllImages, getAllEntries, getEntriesByCountryIdAndMapId, addMapMarkers, getSingleCountry
} from "./mapbox-map-utils.js";
import {geocode} from "./mapbox-geocoder-utils.js";
let urlpattern = `${window.location.protocol}//${window.location.host}`
let opacity = 0.8;
let id = document.getElementById("map-id").value;
let userId = document.getElementById("user-id").value;
let commentTextArea = document.querySelector(".comment-textarea");
let isLoggedIn = document.getElementById("isLoggedIn").value;
let countryName;










const filterJournalImagesByCountry = async () => {

    map.on("load", async function () {


        //displays the image and journal entries for the first country in the list
        displayImages();

    });


    //event to display images
    const displayImagesCopy = () => {
        const commentsContainer = document.querySelector(".comments-container");
        const viewImagesBtn = document.getElementById('view-images-btn');
        const countryImagesWrapper = document.getElementById('country-images-wrapper');

        viewImagesBtn.addEventListener('click', () => {

            //if the country images wrapper is hidden, display it and hide the comments container
            if (countryImagesWrapper.className === "hide-country-images-wrapper") {

                countryImagesWrapper.classList.remove("hide-country-images-wrapper");
                commentsContainer.classList.remove(("display-comments-container"));

                viewImagesBtn.innerHTML = `View Comments <i class="bi bi-chat"></i>`

                commentsContainer.classList.add("hide-comments-container");
                countryImagesWrapper.classList.add("display-country-images-wrapper");

                //if the country images wrapper is displayed, hide it and display the comments container
            } else if (countryImagesWrapper.className === "display-country-images-wrapper") {

                countryImagesWrapper.classList.remove("display-country-images-wrapper");
                commentsContainer.classList.remove("hide-comments-container");
                viewImagesBtn.innerHTML = `View Images <i class="bi bi-images"></i>`

                commentsContainer.classList.add("display-comments-container");
                countryImagesWrapper.classList.add("hide-country-images-wrapper");

            }

        })


        //filter images
        const viewAllImages = document.getElementById('all-images');
        const filterImageBtn = document.getElementsByClassName('image-filter-btn');
        const imageContainer = document.getElementById('image-container');
        const viewEntries = document.getElementById('view-entries');

        for (const btn of filterImageBtn) {

            btn.addEventListener('click', () => {

                imageContainer.innerHTML = "";
                viewEntries.innerHTML = "";
                //if the test layer exists, remove it from the map
                //this is the layer that highlights the country that the user is viewing images for
                if (map.getLayer("test")) {
                    map.removeLayer("test");
                }
                getSingleCountry(btn.value).then(function (response) {
                    //adds a line layer to the map, to highlight the country that the user is viewing images for
                    map.addLayer({
                        "id": "test",
                        "type": "line",
                        "source": "world",
                        "layout": {},
                        "paint": {
                            "line-color": "#fee900",
                            "line-width": 5
                        },
                        //where the name is equal to the country name on the highlighted layer,set the opacity and color
                        "filter": ["==", "NAME", response.name]

                    });
                    let mapLayers = map.getStyle().layers;
                    //loop through layers and find the layer where the id is equal to the response.name
                    //then fly to that country since the user is viewing images for that country
                    for (let i = 0; i < mapLayers.length; i++) {
                        if (mapLayers[i].id === response.name) {
                            geocode(response.name, MAP_BOX_TOKEN).then(function (results) {
                                map.flyTo({
                                    center: results,
                                    zoom: 2
                                });
                            });
                        }
                    }
                });
                getImagesByCountryIdAndUserId(btn.value, id).then(function (response) {
                    response.forEach((image) => {
                        imageContainer.innerHTML += `
                        <div class="country-image">
                            <img src="${image.imageUrl}" alt="country image">
                        </div>
                    `
                    })
                })

                getEntriesByCountryIdAndMapId(btn.value, id).then(function (response){

                    viewEntries.innerHTML = `<h3>Journal</h3>`

                    response.forEach((entry) => {

                        viewEntries.innerHTML += `
                            <div>
                                <h5>${entry.title}</h5>
                                <p>Date: ${entry.date}</p>
                                <p>${entry.description}</p>
                            </div>
                        `

                    })

                })

            })

        }

        viewAllImages.addEventListener('click', () => {

            imageContainer.innerHTML = "";
            viewEntries.innerHTML = "";

            getAllImages(viewAllImages.value).then(function(response) {

                response.forEach((image) => {

                    imageContainer.innerHTML += `
                        <div class="country-image">
                            <img src="${image.imageUrl}" alt="country image">
                        </div>
                    `
                })

            })

            getAllEntries(userId).then(function(response){

                viewEntries.innerHTML = `<h3>Journal</h3>`

                response.forEach((entry) => {

                    viewEntries.innerHTML += `
                            <div>
                                <h5>${entry.title}</h5>
                                <p>Date: ${entry.date}</p>
                                <p>${entry.description}</p>
                            </div>
                        `

                })

            })

        })
    }
};



export {
    filterJournalImagesByCountry
};