
import {
    getUserMapDetails, generateUserMap, addUserLayers, getUserMapLayers, getImagesByCountryId, getImagesByCountryIdAndUserId, getAllImages, getAllEntries, getEntriesByCountryIdAndMapId
} from "./mapbox-map-utils.js";
import {geocode} from "./mapbox-geocoder-utils.js";
let urlpattern = `${window.location.protocol}//${window.location.host}`
let opacity = 0.8;
let id = document.getElementById("map-id").value;
let userId = document.getElementById("user-id").value;
let countryName;
//get the map id of the map that belongs to the logged-in user from the hidden input field

const getViewOnlyUserMapLayers = async (id) => {
    const url = `${urlpattern}/api/map/layers/${id}`;
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
    //if the user has no layers, return
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


    //event to display images
    const displayImages = () => {

        const viewImagesBtn = document.getElementById('view-images-btn');
        const countryImagesWrapper = document.getElementById('country-images-wrapper');

        viewImagesBtn.addEventListener('click', () => {

            if (countryImagesWrapper.className === "hide-country-images-wrapper") {

                countryImagesWrapper.classList.remove("hide-country-images-wrapper");
                countryImagesWrapper.classList.add("display-country-images-wrapper");

            } else if (countryImagesWrapper.className === "display-country-images-wrapper") {

                countryImagesWrapper.classList.remove("display-country-images-wrapper");
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
                        "type": "fill",
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
    onMapLoad
};