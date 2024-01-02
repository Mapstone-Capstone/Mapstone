import {geocode, reverseGeocode} from "./mapbox-geocoder-utils.js";
import {uploadImages} from "./images.js";

let urlpattern = `${window.location.protocol}//${window.location.host}`;
// let urlpattern = `http://localhost:8080`;
let countriesVisited = [];
let countryName;
let countryId;
let opacity = 0.8;
//get the map id of the map that belongs to the logged-in user from the hidden input field
let id = document.getElementById("map-id").value;

const getUserMapLayers = async () => {
    const url = `${urlpattern}/api/map/layers`;
    let options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    let response = await fetch(url, options);
    let layers = await response.json();
    return layers;
};

const getUserCountries = async () => {
    const url = `${urlpattern}/api/countries`;
    let options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    let response = await fetch(url, options);
    let countries = await response.json();
    return countries;
};

const getUserMapDetails = async (id) => {
    const url = `${urlpattern}/api/map/details/${id}`;
    let options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    let response = await fetch(url, options);
    let details = await response.json();
    return details;
};

//returns a map object with styling, zoom, projection, and color
const generateUserMap = async (mapDetails) => {
    //gets the map details from the database(styling, zoom, projection, color)
    //creates a map object with the styling, zoom, projection, and color
    mapboxgl.accessToken = MAP_BOX_TOKEN;
    let map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/" + mapDetails.style,
        center: [10.296718898844109, 8.174209724384902],
        zoom: mapDetails.zoom,
        projection: mapDetails.projection
    });

    map.addControl(new mapboxgl.NavigationControl());


    return map;
};


async function addDefaultLayers(map, mapDetails) {

    //adds the custom geojson source to the map
    map.addSource("world", {
        "type": "geojson",
        "data": "./data/world.geojson"
    });

    // adds the world layer to the map, makes the outline of each country black
    map.addLayer({
        "id": "world",
        "type": "line",
        "source": "world",
        "layout": {},
        "paint": {
            "line-color": "#030303",
            "line-width": 1
        }
    });
    // adds the highlighted layer to the map, to prepare for hover effect
    map.addLayer({
        "id": "highlighted",
        "type": "fill",
        "source": "world",
        "layout": {},
        "paint": {
            "fill-color": mapDetails.color,
            "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                0.3,
                0.0
            ]
        },
    });
};

async function addUserLayers(map, mapDetails) {
    // let userMapLayers = await getUserMapLayers(id);
    let userMapLayers = await getUserMapLayers();
    //if the user has not added any layers to their map, return
    if (userMapLayers === null || userMapLayers.length === 0) {
        return;
    } else {
        //loop through the layers that belong to users map, and all them to this map
        for (let i = 0; i < userMapLayers.length; i++) {
            map.addLayer({
                "id": `${userMapLayers[i].name}`,
                "type": "fill",
                "source": "world",
                "layout": {},
                "paint": {
                    "fill-color": mapDetails.color,
                    "fill-opacity": opacity
                },
                //where the name is equal to the country name on the highlighted layer, the opacity is set to 1
                "filter": ["==", "NAME", `${userMapLayers[i].name}`]
            });
        }

        //create a layer for the markers to be added to
        map.addSource("markers", {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: []
            }
        });

    }

}

function searchForCountry(map) {
    const searchForm = document.querySelector(".geocode-search");
    //get user search input and pass in through geocode function
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        let searchValue = searchInput.value;
        geocode(searchValue, MAP_BOX_TOKEN).then(function (results) {
            map.flyTo({
                center: results,
                zoom: 5
            });
        });
    });
};

function addMarker(map) {
    //user can add a marker to the map using the add marker button
    const addMarker = document.getElementById("add-marker");
    addMarker.addEventListener("click", function (e) {
        e.preventDefault();
        //creates a draggable marker
        let newMarker = new mapboxgl.Marker({
            draggable: true,
            color: "red",
        })
            .setLngLat([6.996193303998299, -13.522856295968037])
            .addTo(map);

        //gets the lngLat of the marker when it is dragged
        newMarker.on("dragend", function () {
            let lngLat = newMarker.getLngLat();

            reverseGeocode(lngLat, MAP_BOX_TOKEN).then(function (results) {
                // console.log(results);
            });
        });
    });
}

//Upload Images
const uploadImagesOnMap = (countryName) => {
    let country = countryName;
    const clickedCountry = document.querySelector("#clicked-country");
    const imgForm = document.querySelector("#img-form");
    const input = document.querySelector("#url-for-image");
    clickedCountry.value = country;

    // event for image upload
    uploadImages(FILE_STACK_TOKEN, input, imgForm);
};

//event to display images
const displayImages = () => {
    //filter images
    const viewAllImages = document.getElementById("all-images");
    const filterImageBtn = document.getElementsByClassName("image-filter-btn");
    const imageContainer = document.getElementById("image-container");
    const commentsContainer = document.querySelector(".comments-container");
    const viewImagesBtn = document.getElementById("view-images-btn");
    const countryImagesWrapper = document.getElementById("country-images-wrapper");

    viewImagesBtn.addEventListener("click", () => {

        //if the country images wrapper is hidden, display it and hide the comments container
        if (countryImagesWrapper.className === "hide-country-images-wrapper") {

            countryImagesWrapper.classList.remove("hide-country-images-wrapper");
            commentsContainer.classList.remove(("display-comments-container"));

            viewImagesBtn.innerHTML = `View Comments <i class="bi bi-chat"></i>`;

            commentsContainer.classList.add("hide-comments-container");
            countryImagesWrapper.classList.add("display-country-images-wrapper");

            //if the country images wrapper is displayed, hide it and display the comments container
        } else if (countryImagesWrapper.className === "display-country-images-wrapper") {

            countryImagesWrapper.classList.remove("display-country-images-wrapper");
            commentsContainer.classList.remove("hide-comments-container");
            viewImagesBtn.innerHTML = `View Images <i class="bi bi-images"></i>`;

            commentsContainer.classList.add("display-comments-container");
            countryImagesWrapper.classList.add("hide-country-images-wrapper");
        }

    });



    //filter images
    // const viewAllImages = document.getElementById("all-images");
    const filterOptions = document.getElementsByClassName('image-filter-btn');
    // const imageContainer = document.getElementById("image-container");

    const viewEntries = document.getElementById("view-entries");

    for (let btn of filterOptions) {
        btn.addEventListener('click', () => {

            imageContainer.innerHTML = "";
            viewEntries.innerHTML = "";

            getImagesByCountryId(btn.value).then(function (response) {
                response.forEach((image) => {

                    imageContainer.innerHTML += `
                   <div class="country-image">
                       <img src="${image.imageUrl}" alt="country image">
                   </div>
                `;
                });

            });


            getEntriesByCountry(btn.value).then(function (response) {

                viewEntries.innerHTML = `<h3>Journal</h3>`;

                response.forEach((entry) => {

                    viewEntries.innerHTML += `
                    <div>
                        <h5>${entry.title}</h5>
                        <p>Date: ${entry.date}</p>
                        <p>${entry.description}</p>
                    </div>
                `;
                });
            });

        })
    }


    //event listener for filtering images by country
    for (const btn of filterImageBtn) {
        btn.addEventListener("click", () => {
            console.log("got here");

            imageContainer.innerHTML = "";
            viewEntries.innerHTML = "";
            //if the test layer exists, remove it from the map
            //this is the layer that highlights the country that the user is viewing images for
            if (map.getLayer("test")) {
                map.removeLayer("test");
            }
            getSingleCountry(btn.value).then(function (response) {
                //adds a line layer to the map, to highlight the country that thr uer is viewing images for
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
                    createEntries.innerHTML = `<a href="/create-entries">Create Entries</a>`;
                    imageContainer.innerHTML += `
                        <div class="country-image">
                            <img src="${image.imageUrl}" alt="country image">
                        </div>
                    `;
                });
            });

            getEntriesByCountryIdAndMapId(btn.value, id).then(function (response) {

                viewEntries.innerHTML = `<h3>Journal</h3>`;

                response.forEach((entry) => {

                    viewEntries.innerHTML += `
                            <div>
                                <h5>${entry.title}</h5>
                                <p>Date: ${entry.date}</p>
                                <p>${entry.description}</p>
                            </div>
                        `;

                });

            });

        });

    }


    //filter images
    viewAllImages.addEventListener("click", () => {

        imageContainer.innerHTML = "";
        viewEntries.innerHTML = "";

        getAllImages(viewAllImages.value).then(function (response) {
            response.forEach((image) => {


                imageContainer.innerHTML += `
                   <div class="country-image">
                       <img src="${image.imageUrl}" alt="country image">
                   </div>
                `;
            });

        });


        getAllEntries(viewAllImages.value).then(function (response) {

            viewEntries.innerHTML = `<h3>Journal</h3>`;

            response.forEach((entry) => {

                viewEntries.innerHTML += `
                    <div>
                        <h5>${entry.title}</h5>
                        <p>Date: ${entry.date}</p>
                        <p>${entry.description}</p>
                    </div>
                `;
            });
        });

    });


};

//upload profile avatar
const uploadAvatar = () => {

    const uploadAvatarBtn = document.getElementById("upload-avatar-btn");
    const avatarUrl = document.getElementById("avatarUrl");
    const avatarForm = document.getElementById("upload-avatar-form");

    uploadAvatarBtn.addEventListener("click", () => {

        const client = filestack.init(FILE_STACK_TOKEN);
        const options = {
            accept: ["image/*"],
            maxFiles: 1,
            onUploadDone:
                function (response) {
                    console.log(response.filesUploaded[0].url);
                    avatarUrl.value = response.filesUploaded[0].url;
                    console.log(avatarUrl.value);
                    avatarForm.submit();
                }
        };
        client.picker(options).open();
    });

};

const onMapLoad = async () => {
    let mapDetails = await getUserMapDetails(id);
    //returns a map object with styling, zoom, projection, and color
    let map = await generateUserMap(mapDetails);

    map.on("load", async function () {
        //adds the default layers to the map
        await addDefaultLayers(map, mapDetails);
        await addUserLayers(map, mapDetails, id);
        let allLayers = map.getStyle().layers;

        //adds the markers to the map
        await addMapMarkers(map, id);


        //reveals the highlighted layer when the user hovers over a country
        let hoveredPolygonId = null;
        map.on("mousemove", "highlighted", (e) => {
            if (e.features.length > 0) {
                if (hoveredPolygonId !== null) {
                    map.setFeatureState(
                        {source: "world", id: hoveredPolygonId},
                        {hover: false}
                    );
                }
                hoveredPolygonId = e.features[0].id;
                map.setFeatureState(
                    {source: "world", id: hoveredPolygonId},
                    {hover: true}
                );
            }
        });

        //hides the highlighted layer when the user is not hovering over a country
        map.on("mouseleave", "highlighted", () => {
            if (hoveredPolygonId !== null) {
                map.setFeatureState(
                    {source: "world", id: hoveredPolygonId},
                    {hover: false}
                );
            }
            hoveredPolygonId = null;
        });

    });


    //when a country is clicked, fill the country with the color selected by the user
    map.on("click", function (e) {
        e.preventDefault();

        // Get features at the clicked point
        let features = map.queryRenderedFeatures(e.point);

        // Log the name of the clicked layer to the console
        if (features.length > 0) {
            countryName = features[0].properties.NAME;
            console.log(features[0]);
            //if the user clicks on the ocean
            if (countryName === undefined) {
                return;
            }

            //if th user clicks on a map marker

            countryId = features[0].id;
            let allLayers = map.getStyle().layers;
            for (let i = 0; i < allLayers.length; i++) {
                //if the country is already filled (already clicked), and the user clicks it again, remove the fill layer
                if (allLayers[i].id === countryName) {
                    renderImageUploadModal(countryName);
                    return;
                }
            }
            //otherwise, add the fill layer to the map
            sendLayersToBackend(countryName);
            sendCountriesToBackend(countryName);
            countriesVisited.push(countryName);

            map.addLayer({
                "id": countryName,
                "type": "fill",
                "source": "world",
                "layout": {},
                "paint": {
                    "fill-color": mapDetails.color,
                    "fill-opacity": opacity
                },
                //where the name is equal to the country name on the highlighted layer,set the opacity and color
                "filter": ["==", "NAME", countryName]

            });
        }


        renderImageUploadModal(countryName);
    });


    function renderImageUploadModal(countryName) {

        const imageUploadModal = document.createElement("div");
        imageUploadModal.classList.add("modal");
        imageUploadModal.innerHTML = `<div class="modal-bg"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title text-center">Would you like to upload images from your trip to ${countryName}?</h2>
                <span class="modal-close">&times;</span>
            </div> 
        <div class="modal-body">
            <p class="text-center">You can always upload images later by clicking on the country on your map.</p>
            <div class="modal-buttons">
            <button type="button" class="modal-button" id="yes">Upload Now</button>
            <button type="button" class="modal-button" id="no">Not Right Now</button>
            </div>
        </div>
      </div>`;

        //nodes from the modal for event listeners
        const modalClose = imageUploadModal.querySelector(".modal-close");
        const modalBackground = imageUploadModal.querySelector(".modal-bg");
        const yesButton = imageUploadModal.querySelector("#yes");
        const noButton = imageUploadModal.querySelector("#no");

        yesButton.addEventListener("click", () => {
            uploadImagesOnMap(countryName);
        });

        noButton.addEventListener("click", () => {
            imageUploadModal.remove();
        });

        modalBackground.addEventListener("click", () => {
            imageUploadModal.remove();
        });

        modalClose.addEventListener("click", () => {
            imageUploadModal.remove();
        });

        document.body.appendChild(imageUploadModal);

    }


    //filter images
    const filterImageBtn = document.getElementsByClassName("image-filter-btn");
    const imageContainer = document.getElementById("image-container");

    //event listener for filtering images by country
    for (const btn of filterImageBtn) {
        btn.addEventListener("click", () => {
            imageContainer.innerHTML = "";
            //if the test layer exists, remove it from the map
            //this is the layer that highlights the country that the user is viewing images for
            if (map.getLayer("test")) {
                map.removeLayer("test");
            }
            getSingleCountry(btn.value).then(function (response) {
                //adds a line layer to the map, to highlight the country that thr uer is viewing images for
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
                    console.log(response);
                    createEntries.innerHTML = `<a href="/create-entries">Create Entries</a>`;
                    imageContainer.innerHTML += `
                        <div class="country-image">
                            <img src="${image.imageUrl}" alt="country image">
                        </div>
                    `;
                });
            });

            getEntriesByCountryIdAndMapId(btn.value, id).then(function (response) {

                viewEntries.innerHTML = `<h3>Journal</h3>`;

                response.forEach((entry) => {

                    viewEntries.innerHTML += `
                            <div>
                                <h5>${entry.title}</h5>
                                <p>Date: ${entry.date}</p>
                                <p>${entry.description}</p>
                            </div>
                        `;

                });

            });

        });
    }


    // Are you sure you want to reset your map? This will delete all of your saved countries on the map.
    //event listener for the reset map button
    const resetMapForm = document.getElementById("reset-map-form");
    const resetMapButton = document.getElementById("reset-map-button");
    resetMapButton.addEventListener("click", async function (e) {
        e.preventDefault();
        const resetMapModal = document.createElement("div");
        resetMapModal.classList.add("modal");
        resetMapModal.innerHTML = `<div class="modal-bg"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Reset Map</h2>
                <span class="modal-close">&times;</span>
            </div> 
        <div class="modal-body">
            <p>Are you sure you want to reset your map? This will delete all of your saved countries on the map.</p>
            <div class="modal-buttons">
            <button type="button" class="modal-button" id="yes">Yes</button>
            <button type="button" class="modal-button" id="no">No</button>
            </div>
        </div>
        </div>`;
        //nodes from the modal for event listeners
        const modalClose = resetMapModal.querySelector(".modal-close");
        const modalBackground = resetMapModal.querySelector(".modal-bg");
        const yesButton = resetMapModal.querySelector("#yes");
        const noButton = resetMapModal.querySelector("#no");

        yesButton.addEventListener("click", async function (e) {
            e.preventDefault();
            resetMapForm.submit();
        });

        noButton.addEventListener("click", () => {
            resetMapModal.remove();
        });

        modalBackground.addEventListener("click", () => {
            resetMapModal.remove();
        });

        modalClose.addEventListener("click", () => {
            resetMapModal.remove();
        });

        document.body.appendChild(resetMapModal);
    });


    searchForCountry(map);
};

function openUpdateModal() {
    //get the existing values from the hidden input fields
    const mapStyle = document.getElementById("current-style");
    const mapColor = document.getElementById("current-color");
    const mapProjection = document.getElementById("current-projection");
    const mapZoom = document.getElementById("current-zoom");

    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `<div class="modal-bg"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Edit Map Style</h2>
                <span class="modal-close">&times;</span>
            </div> 
        <div class="modal-body">
              <div class="form-group">
                <label for="map-style-select">Style:</label>
                <select id="map-style-select">
                <option value="${mapStyle.value}" selected>${mapStyle.value}</option>
                  <option value="streets-v11">Streets</option>
                  <option value="dark-v11">Dark</option>
                  <option value="light-v11">Light</option>
                  <option value="outdoors-v12">Outdoors</option>
                  <option value="satellite-streets-v12">Satellite</option>
                </select>
              </div>
              <div class="form-group">
                <label for="map-color-select">Color:</label>
                <input type="color" id="map-color-select" value="${mapColor.value}">
              </div>
              <div class="form-group">
                <label for="map-projection-select">Projection:</label>
                <select id="map-projection-select">
                <option value="${mapProjection.value}">${mapProjection.value}</option>
                  <option value="globe">Globe</option>
                  <option value="equalEarth">Thematic Equal-area</option>
                  <option value="naturalEarth">Compromise</option>
                  <option value="albers">Conic Equal-area</option>
                  <option value="lambertConformalConic">Conformic</option>
                  <option value="equirectangular">Rectangular</option>
                  <option value="mercator">Mercador</option>
                </select>
              </div>

              <div class="form-group">
                <label for="map-zoom-select">Zoom:</label>
                <select id="map-zoom-select">
                <option value="${mapZoom.value}">${mapZoom.value}</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                </select>
              </div>
              <div class="modal-buttons">
            <button type="button" class="update-map" id="update-map">Update Map</button>
            </div>
        </div>
      </div>`;

    //nodes from the modal for event listeners
    const modalClose = modal.querySelector(".modal-close");
    const modalBackground = modal.querySelector(".modal-bg");
    const updateMapButton = modal.querySelector(".update-map");

    //event listener for update map button
    updateMapButton.addEventListener("click", async function (e) {
        e.preventDefault();

        const updateMapForm = document.getElementById("update-map-form");
        const mapId = document.getElementById("map-id");
        const updatedMapStyle = modal.querySelector("#map-style-select");
        const updatedMapColor = modal.querySelector("#map-color-select");
        const updatedMapProjection = modal.querySelector("#map-projection-select");
        const updatedMapZoom = modal.querySelector("#map-zoom-select");


        //if any fields are empty, don't submit the form
        if (updatedMapStyle.value === "" || updatedMapColor.value === "" || updatedMapProjection.value === "" || updatedMapZoom.value === "") {
            alert("Please fill out all fields.");
            return;
        }

        const mapToUpdate =
            {
                id: id,
                style: updatedMapStyle.value,
                color: updatedMapColor.value,
                projection: updatedMapProjection.value,
                zoom: updatedMapZoom.value
            };

        await updateMapStyle(mapToUpdate);

        //refresh the page to see the updated map
        window.location.reload();

    });
    // event listener for close button
    modalClose.addEventListener("click", () => {
        modal.remove();
    });
    // event listener for modal background, allows user to click anywhere on background to close modal
    modalBackground.addEventListener("click", () => {
        modal.remove();
    });

    document.body.appendChild(modal);
}

// Function to POST countries to the backend
async function sendCountriesToBackend(countryClicked) {
    const csrfToken = document.querySelector("meta[name='_csrf']").content;

    const country =
        {
            name: countryClicked,
        }
    ;
    const backendEndpoint = `${urlpattern}/api/country/add`;
    try {
        const response = await fetch(backendEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(country),
        });

        if (!response.ok) {
            throw new Error("Failed to send countries to the backend");
        }
        const responseData = await response.json();
        console.log("Countries successfully sent to the backend:", responseData);
    } catch (error) {
        console.error("Error sending countries to the backend:", error.message);
    }
}

// Function to POST countries to the backend
async function sendLayersToBackend(name) {
    const csrfToken = document.querySelector("meta[name='_csrf']").content;
    const layer =
        {
            name: name,
        };

    const backendEndpoint = `${urlpattern}/api/map/layer/add`;
    try {
        const response = await fetch(backendEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(layer),
        });

        if (!response.ok) {
            throw new Error("Failed to post layer to backend");
        }
        const responseData = await response.json();
        console.log("Layer successfully saved to backend :", responseData);
    } catch (error) {
        console.error("Error sending layer to the backend:", error.message);
    }
}

async function updateMapStyle(mapStyle) {
    const csrfToken = document.querySelector("meta[name='_csrf']").content;

    const backendEndpoint = `${urlpattern}/api/map/update`;
    try {
        const response = await fetch(backendEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(mapStyle),
        });

        if (!response.ok) {
            throw new Error("Failed to update map style");
        }
        const responseData = await response.json();
        console.log("Map style successfully saved :", responseData);
    } catch (error) {
        console.error("Error sending map style to db:", error.message);
    }
}

const getImagesByCountryId = async (id) => {
    const url = `${urlpattern}/api/image/country/${id}`;
    let options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    let response = await fetch(url, options);
    let images = await response.json();
    return images;
};

const getImagesByCountryIdAndUserId = async (countryId, userId) => {
    const url = `${urlpattern}/api/image/country/${countryId}/${userId}`;
    let options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    let response = await fetch(url, options);
    let images = await response.json();
    return images;
};

const getAllImages = async (id) => {
    const url = `${urlpattern}/api/images/country/${id}`;
    let options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    let response = await fetch(url, options);
    let images = await response.json();
    return images;
};

const getSingleCountry = async (id) => {
    const url = `${urlpattern}/api/country/${id}`;
    let options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    let response = await fetch(url, options);
    let country = await response.json();
    return country;
};

const getEntriesByCountryIdAndMapId = async (entryId, mapId) => {
    const url = `${urlpattern}/api/entry/country/${entryId}/${mapId}`;
    let options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    let response = await fetch(url, options);
    let entries = await response.json();
    return entries;
};

const getEntriesByCountry = async (id) => {
    const url = `${urlpattern}/api/entry/country/${id}`;
    let options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    let response = await fetch(url, options);
    let entries = await response.json();
    return entries;
};

const getAllEntries = async (id) => {
    const url = `${urlpattern}/api/entry/user/${id}`;
    let options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    let response = await fetch(url, options);
    let entries = await response.json();
    return entries;
};

const getImagesByMapId = async (id) => {
    const url = `${urlpattern}/api/images/map/${id}`;
    let options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    let response = await fetch(url, options);
    let images = await response.json();
    return images;
};

async function addMapMarkers(map, id) {
    //get all the images that belong to the logged-in user //uses the map id to get the images
    let userImages = await getImagesByMapId(id);
    //the response is a hashmap with the image url as the key, and the country name as the value
    //loops through the hashmap and passes the key through the geocode function to get the lngLat then creates a marker for each lngLat and a popup with the images for that country
    //initialize a geojson object
    const geojson = {
        "type": "FeatureCollection",
        "features": []
    };

    for (let [key, value] of Object.entries(userImages)) {
        geocode(key, MAP_BOX_TOKEN).then(function (results) {
            //create a feature for each image //the feature will be a marker
            let feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": results
                },
                "properties": {
                    "images": value,
                    "message": key,
                    "iconSize": [50, 50]
                }
            };
            //push the feature to the geojson object
            geojson.features.push(feature);
            //loop through the geojson features and add a marker for each feature
            for (const marker of geojson.features) {
                // Create a DOM element for each marker.
                let el = document.createElement("div");
                el.classList.add("img-marker");
                el.className = "marker";
                el.innerHTML = `<p style="text-align: center; color: white; background-color: var(--bright-blue); padding: 0; margin: 0; border-radius: 999px; position: relative; top: -10px; right: -25px; height: 30px; width: 30px; font-size: 15px">${marker.properties.images.length}</p>`;
                el.style.backgroundImage = `url(${marker.properties.images[0]})`;
                el.style.width = "50px";
                el.style.height = "50px";
                el.style.backgroundSize = "cover";
                el.style.borderRadius = "6px";
                el.style.border = "2px solid var(--white)";
                el.style.cursor = "pointer";
                el.style.zIndex = "9";

                // Add markers to the map.
                new mapboxgl.Marker(el)
                    .setLngLat(marker.geometry.coordinates)
                    .addTo(map);
            }
        });
    }
}

export {

    onMapLoad,
    openUpdateModal,
    getUserMapLayers,
    getUserCountries,
    getUserMapDetails,
    generateUserMap,
    addDefaultLayers,
    addUserLayers,
    searchForCountry,
    addMarker,
    uploadImagesOnMap,
    displayImages,
    uploadAvatar,
    getImagesByCountryId,
    getAllImages,
    getAllEntries,
    getEntriesByCountryIdAndMapId,
    getImagesByCountryIdAndUserId,
    addMapMarkers,
    getSingleCountry,

};

