import {MAP_BOX_TOKEN} from "./keys.js";
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
        "data": "../../data/world.geojson"
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
                <button>Choose Photos</button>
            </div>
        </div>
    `;
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
        console.log(id)
    });
};



export {
    onMapLoad
};