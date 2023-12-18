import {
    onMapLoad, openUpdateModal, displayImages, uploadAvatar
} from "./mapbox-map-utils.js";


const openUpdateModalButton = document.getElementById("open-update-modal");
const firstTime = document.getElementById("first-time").value;



(async function () {


await onMapLoad();

uploadAvatar();

displayImages();

openUpdateModalButton.addEventListener("click", openUpdateModal);

// if first time, show tutorial
if (firstTime === "true") {
    let seenTutorial = false;
    const driver = window.driver.js.driver;

    const driverObj = driver({
        showProgress: true,
        steps: [
            {element: '#some-element', popover: {title: 'Welcome to Map-Share!', description: 'Welcome to our interactive travel experience! As you embark on your journey, use this tutorial to learn how to mark countries you\'ve visited on the map and share your memories by uploading photos from your trips.', position: 'bottom'}},
            {element: '.user-details', popover: {title: 'Check you stats!', description: 'Keep track of your stats while you document your travels.', side: 'right', align: 'center'}},
            {element: '#map', popover: {title: 'Map', description: 'Begin by exploring the map. Click or tap on any country you\'ve visited. Once selected, the country will be filled with a vibrant color, indicating your travel adventure.', side: 'left', align: 'center'}},
            {element: '#search-input', popover: {title: 'Search', description: 'Not good with geography? Try searching for a country by name and let us help you find it!', position: 'bottom'}},
            {element: '#open-update-modal', popover: {title: 'We\'ve got style!', description: 'Click here to customize the look of your map. Choose what suits you best!', position: 'bottom'}},
            {element: '#share', popover: {title: 'Share with fiends!', description: "Now that you\'ve documented your travels, it\'s time to share your personalized travel map with friends and fellow adventurers. Click on the 'Share Map' button to spread the joy of your globetrotting experiences on social media.", position: 'bottom'}},
            {element: '#some-element', popover: {title: "That's all for now!", description: 'Congratulations! You\'re ready to start documenting your travels to create a visual diary of your adventures. Explore more countries, upload more photos, and let your travel map tell the story of your journey.\n' +
                        '\n' +
                        'Happy exploring! 🌍✈️', position: 'bottom'}},

        ]
    });

    // start the tutorial but only show it once
    if (!seenTutorial) {
        driverObj.drive()
        seenTutorial = true;
    }

}




})();
