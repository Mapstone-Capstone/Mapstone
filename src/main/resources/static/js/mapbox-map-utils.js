import {FILE_STACK_TOKEN, MAP_BOX_TOKEN} from "./keys.js";
import {geocode, reverseGeocode} from "./mapbox-geocoder-utils.js";

let countriesVisited = [];
let countryName;
let countryId;
let opacity = 0.8;
let id = document.getElementById("map-id").value;
//get the map id of the map that belongs to the logged-in user from the hidden input field


const getUserMapLayers = async (id) => {
    const url = `http://localhost:8080/api/map/${id}`;
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

const getUserMapDetails = async (id) => {
    const url = `http://localhost:8080/api/map/details/${id}`;
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
        center: [-97.5, 37],
        zoom: mapDetails.zoom,
        projection: mapDetails.projection
    });

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

async function addUserLayers(map, mapDetails, id) {
    let userMapLayers = await getUserMapLayers(id);
    if (userMapLayers === null || userMapLayers.length === 0 || userMapLayers === "") {
        return;
    } else {
        //loop through the layers that belong to users map, and all them to this map
        for (let i = 0; i < userMapLayers.length; i++) {
            map.addLayer({
                "id": `${userMapLayers[i].id}`,
                "type": "fill",
                "source": "world",
                "layout": {},
                "paint": {
                    "fill-color": mapDetails.color,
                    "fill-opacity": opacity
                },
                //where the name is equal to the country name on the highlighted layer, the opacity is set to 1
                "filter": ["==", "NAME", `${userMapLayers[i].id}`]
            });
        }
    }
}


function searchForCountry(map) {

    //get user search input and pass in through geocode function
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    searchButton.addEventListener("click", function (e) {
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
            .setLngLat([-98.30651848969364, 29.50652020966919])
            .addTo(map);

        //gets the lngLat of the marker when it is dragged
        newMarker.on("dragend", function () {
            let lngLat = newMarker.getLngLat();

            reverseGeocode(lngLat, MAP_BOX_TOKEN).then(function (results) {
                console.log(results);
            });
        });
    });
}

const renderModal = (countryName) => {
    let country = countryName;

    const clickedCountry = document.querySelector("#clicked-country");
    clickedCountry.value = country;

    const imgForm = document.querySelector("#img-form");
    const input = document.querySelector("#url-for-image");


    // event for image upload
    const client = filestack.init(FILE_STACK_TOKEN);
    const options = {
        maxFiles: 10,
        onUploadDone:
            function (response) {

                let listOfImages = response.filesUploaded;
                let arrayOfImages = [];
                listOfImages.forEach( (image) => {
                    arrayOfImages.push(image.url);
                })
                input.value = arrayOfImages;
                imgForm.submit();
            }
    };
    client.picker(options).open();

};

//event to display images
const displayImages = () => {

    const viewImagesBtn = document.getElementById('view-images-btn');
    const countryImagesWrapper = document.getElementsByClassName('country-images-wrapper');

    viewImagesBtn.addEventListener("click", () => {

        console.log("hello im here in the event listener")
        countryImagesWrapper.style.display = 'flex';

    })

}

//upload profile pic

const uploadAvatar = () => {

    const uploadAvatarBtn = document.getElementById('upload-avatar-btn');

}


const onMapLoad = async () => {
    let mapDetails = await getUserMapDetails(id);
    //returns a map object with styling, zoom, projection, and color
    let map = await generateUserMap(mapDetails);

    map.on("load", async function () {
        //adds the default layers to the map
        await addDefaultLayers(map, mapDetails);
        await addUserLayers(map, mapDetails, id);
        let allLayers = map.getStyle().layers;

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
            countryId = features[0].id;
            //pushes the clicked country name to the countriesVisited array so that it can be used to add the country to the user_countries table
            countriesVisited.push(countryName);
            let allLayers = map.getStyle().layers;
            for (let i = 0; i < allLayers.length; i++) {
                //if the country is already filled (already clicked), and the user clicks it again, remove the fill layer
                if (allLayers[i].id === countryName) {
                    map.removeLayer(countryName);
                    //remove the country from the countriesVisited array
                    countriesVisited.splice(countriesVisited.indexOf(countryName), 1);
                    return;
                }
            }
            map.addLayer({
                "id": countryName,
                "type": "fill",
                "source": "world",
                "layout": {},
                "paint": {
                    // "fill-color": "#" + mapDetails.color,
                    "fill-color": mapDetails.color,
                    "fill-opacity": opacity
                },
                //where the name is equal to the country name on the highlighted layer,set the opacity and color
                "filter": ["==", "NAME", countryName]

            });

        }
        renderModal(countryName);
    });

    const saveChanges = document.querySelector("#save-changes");
    saveChanges.addEventListener("click", function (e) {
        e.preventDefault();
        const saveChangesForm = document.getElementById("save-changes-form");
        // get all the map layers, including default layers
        let allLayers = map.getStyle().layers;
        // gets only the layers that belong to the user
        //if the layer already exists, dont try to add it again
        let userLayers = [];
        allLayers.forEach((layer) => {
            if (layer.source === "world" && layer.id !== "world" && layer.id !== "highlighted") {
                userLayers.push(layer);
            }
        });
        //stringify the layers so that it can be parsed and stored in the database
        let stringifiedLayers = JSON.stringify(userLayers);
        let mapId = document.getElementById("mapId");
        let updatedMapData = document.getElementById("updated-data");
            updatedMapData.value = stringifiedLayers;
        mapId.value = id;
        // send the countriesVisited array to the backend
        countriesVisited.forEach((country) => {
            sendCountriesToBackend(country);
        });

        saveChangesForm.submit();

    });


    // const updateMap = document.getElementById("update-map");
    // //when update button is clicked, the countryLayers array is merged into one layer
    // updateMap.addEventListener("click", async function (e) {
    //     e.preventDefault();
    //
    //     //get all the map layers, including default layers
    //     let allLayers = map.getStyle().layers;
    //     // gets only the layers that belong to the user
    //     //if the layer already exists, dont try to add it again
    //     let userLayers = [];
    //     allLayers.forEach((layer) => {
    //         if (layer.source === "world" && layer.id !== "world" && layer.id !== "highlighted") {
    //             userLayers.push(layer);
    //         }
    //     });
    //
    //     //stringify the layers so that it can be parsed and stored in the database
    //     let stringifiedLayers = JSON.stringify(userLayers);
    //
    //     let mapId = document.getElementById("map-id");
    //
    //     mapId.value = id;
    //
    //     let updatedMapData = document.getElementById("updated-data");
    //     updatedMapData.value = stringifiedLayers;
    //     const updateMapForm = document.getElementById("update-map-form");
    //     const mapStyle = document.getElementById("map-style-select");
    //     const mapColor = document.getElementById("map-color-select");
    //     const mapProjection = document.getElementById("map-projection-select");
    //     const mapZoom = document.getElementById("map-zoom-select");
    //     //if any fields are empty, don't submit the form
    //     if (mapStyle.value === "" || mapColor.value === "" || mapProjection.value === "" || mapZoom.value === "") {
    //         alert("Please fill out all fields.");
    //         return;
    //     }
    //
    //     updateMapForm.submit();
    //
    // });

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
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="6">6</option>
                  <option value="8">8</option>
                  <option value="10">10</option>
                  <option value="12">12</option>
                  <option value="15">15</option>
                </select>
              </div>
            <button type="button" id="update-map">Update Map</button>
        </div>
      </div>`;

    //nodes from the modal for event listeners
    const modalClose = modal.querySelector(".modal-close");
    const modalBackground = modal.querySelector(".modal-bg");
    const updateMapButton = modal.querySelector("#update-map");




    //event listener for update map button
    updateMapButton.addEventListener("click", function (e) {
        e.preventDefault();

        const updateMapForm = document.getElementById("update-map-form");
        const uppdatedMapStyle = document.getElementById("map-style-select");
        const updatedMapColor = document.getElementById("map-color-select");
        const updatedMapProjection = document.getElementById("map-projection-select");
        const updatedMapZoom = document.getElementById("map-zoom-select");
        const mapId = document.getElementById("map-id");

        //if any fields are empty, don't submit the form
        if (uppdatedMapStyle.value === "" || updatedMapColor.value === "" || updatedMapProjection.value === "" || updatedMapZoom.value === "") {
            alert("Please fill out all fields.");
            return;
        }

        mapStyle.value = uppdatedMapStyle.value;
        mapColor.value = updatedMapColor.value;
        mapProjection.value = updatedMapProjection.value;
        mapZoom.value = updatedMapZoom.value;
        mapId.value = id;

        updateMapForm.submit();
    });

    // event listener for close button
    modalClose.addEventListener("click", () => {
        modal.remove();
    });

    //event listener for modal background, allows user to click anywhere on background to close modal
    modalBackground.addEventListener("click", () => {
        modal.remove();
    });

    document.body.appendChild(modal);
}


// Function to POST countries to the backend
async function sendCountriesToBackend(countryClicked) {
    const csrfToken = document.querySelector("meta[name='_csrf']").content;
    console.log("CSRF token:", csrfToken);

    const country =
        {
            name: countryClicked,
        }
    ;
    const backendEndpoint = "http://localhost:8080/api/country/add";
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


export {
    onMapLoad, openUpdateModal, displayImages
};