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
};


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
            console.log(lngLat);
            reverseGeocode(lngLat, MAP_BOX_TOKEN).then(function (results) {
                console.log(results);
            });
        });
    });
};

//Thymeleaf will not work with dynamically created html
const renderModal = () => {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
        <div class="modal-bg"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title"</h2>
            </div>
            <div class="modal-body">
                    <button id="later-button">Not Right Now</button>
                    <button id="upload-button">Upload Photos</button>
                <form id="img-form" action="@{/url-images}" method="POST">
<!--                    <button id="confirm">Confirm Photo</button>-->
<!--                    <input id="user-id"  type="hidden"/>-->
<!--                    <input id = "country-id"  type="hidden"/>-->
                    <input id="image-url" name="image-url" value="" type="hidden"/>
                    <button type="submit">Confirm Photo</button>
                </form>
            </div>
        </div>
    `;

    const laterButton = modal.querySelector("#later-button");
    // event listener for close button
    laterButton.addEventListener("click", () => {
        modal.remove();
    });

    const confirmBtn = modal.querySelector('#confirm');
    const uploadBtn = modal.querySelector('#upload-button');
    const imgForm = modal.querySelector('#img-form');
    const input = modal.querySelector('#image-url');

    uploadBtn.addEventListener("click", (e) => {

        e.preventDefault();

        const client = filestack.init(FILE_STACK_TOKEN);
        const options = {
            onUploadDone:
                function (response){
                    input.value = response.filesUploaded[0].url;
                }
        }

        client.picker(options).open();
    })
    document.body.appendChild(modal);
};

const onMapLoad = async () => {
    let mapDetails = await getUserMapDetails(id);
    //returns a map object with styling, zoom, projection, and color
    let map = await generateUserMap(mapDetails);
    //returns user map details so we can access the color

    map.on("load", async function () {
        //adds the default layers to the map
        await addDefaultLayers(map, mapDetails);


        await addUserLayers(map, mapDetails, id);
        let allLayers = map.getStyle().layers;
        console.log(allLayers);

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

        // Get features at the clicked point
        let features = map.queryRenderedFeatures(e.point);

        // Log the name of the clicked layer to the console
        if (features.length > 0) {
            console.log("Clicked Layer Name:", features[0].layer.id);
            countryName = features[0].properties.NAME;
            countryId = features[0].id;
            console.log("Clicked Country Name:", countryName);
            console.log("Clicked area info:", countryId);
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

            //pushes the clicked country name to the countryLayers array so that it can be used to create the merged layer
            // countryLayers.push(countryName);

        }
        renderModal();
    });


    const updateMap = document.getElementById("update-map");
    //when update button is clicked, the countryLayers array is merged into one layer
    updateMap.addEventListener("click", async function (e) {
        e.preventDefault();

        //get all the map layers, including default layers
        let allLayers = map.getStyle().layers;
        // gets only the layers that belong to the user
        //if the layer already exists, dont try to add it again
        //REFACTORED: THIS IS THE GOOD CODE: MAKING NOTE IN CASE OF MERGE CONFLICT
        let userLayers = [];
        allLayers.forEach((layer) => {
            if (layer.source === "world" && layer.id !== "world" && layer.id !== "highlighted") {
                userLayers.push(layer);
            }
        });


        //stringify the layers so that it can be parsed and stored in the database
        let stringifiedLayers = JSON.stringify(userLayers);

        let mapId = document.getElementById("map-id");

        mapId.value = id;

        let updatedMapData = document.getElementById("updated-data");
        updatedMapData.value = stringifiedLayers;
        const updateMapForm = document.getElementById("update-map-form");
        const mapStyle = document.getElementById("map-style-select");
        const mapColor = document.getElementById("map-color-select");
        const mapProjection = document.getElementById("map-projection-select");
        const mapZoom = document.getElementById("map-zoom-select");
        //if any fields are empty, don't submit the form
        if (mapStyle.value === "" || mapColor.value === "" || mapProjection.value === "" || mapZoom.value === "") {
            alert("Please fill out all fields.");
            return;
        }

        //add the countries clicked on to the user_countries table by making a post request to /countries
        // countriesVisited.forEach((country) => {
        //     console.log(country);
        //     postCountry(country);
        // });


        updateMapForm.submit();

    });

    searchForCountry(map);

    addMarker(map);

};


//TODO: GET A 403 ERROR WHEN MAKING A POST REQUEST TO THIS ENDPOINT, WHY???
function postCountry(country) {
    const url = `http://localhost:8080/api/country/add`;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(country),
    };
    fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        });
}

export {
    onMapLoad
};