import {MAP_BOX_TOKEN} from "./keys.js";
import {
    getUserMapDetails, generateUserMap, addUserLayers, getUserMapLayers
} from "./mapbox-map-utils.js";

let opacity = 0.8;
let id = document.getElementById("map-id").value;
let userId = document.getElementById("user-id").value;
//get the map id of the map that belongs to the logged-in user from the hidden input field

const getViewOnlyUserMapLayers = async (id) => {
    const url = `http://localhost:8080/api/map/layers/${id}`;
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

async function addViewOnlyUserLayers(map, mapDetails) {
    // let userMapLayers = await getUserMapLayers(id);
    let userMapLayers = await getViewOnlyUserMapLayers(userId);
    console.log(userMapLayers);
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
    }

}




async function addDefaultLayers(map, mapDetails) {

    //adds the custom geojson source to the map
    map.addSource("world", {
        "type": "geojson",
        "data": "../../data/world.geojson",
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





const onMapLoad = async () => {
    let mapDetails = await getUserMapDetails(id);
    //returns a map object with styling, zoom, projection, and color
    let map = await generateUserMap(mapDetails);
    //returns user map details so we can access the color

    map.on("load", async function () {
        //adds the default layers to the map
        await addDefaultLayers(map, mapDetails);

        await addViewOnlyUserLayers(map, mapDetails);
        let allLayers = map.getStyle().layers;
        console.log(allLayers);
        console.log(id)
    });
};



export {
    onMapLoad
};