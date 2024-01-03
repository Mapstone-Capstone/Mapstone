import {
    onMapLoad, openUpdateModal, uploadAvatar
} from "./mapbox-map-utils.js";


const openUpdateModalButton = document.getElementById("open-update-modal");
const firstTime = document.getElementById("first-time").value;



(async function () {


await onMapLoad();

uploadAvatar();

// displayImages();

openUpdateModalButton.addEventListener("click", openUpdateModal);

// if first time visiting profile (first log in), show tutorial
if (firstTime === "true") {
    let seenTutorial = false;
    const driver = window.driver.js.driver;

    const driverObj = driver({
        showProgress: true,
        allowClose: false,
        steps: [
            {element: '#some-element', popover: {title: 'Welcome to Map-Share!', description: "Welcome to our interactive travel experience! As you embark on your journey, use this tutorial to learn how to mark countries you've visited on the map and share your memories by uploading photos from your trips.", position: 'bottom'}},
            {element: '#map', popover: {title: 'Map', description: "Begin by exploring the map. Click or tap on any country you've visited. Once selected, the country will be filled with a vibrant color, indicating your travel adventure. You'll also be given the opportunity to upload images from your trip!", side: 'left', align: 'center'}},
            {element: '#search-input', popover: {title: 'Search', description: 'Not good with geography? Try searching for a country by name and let us help you find it!', position: 'bottom'}},
            {element: '#open-update-modal', popover: {title: "We've got style!", description: 'Click here to customize the look of your map. Choose what suits you best!', position: 'bottom'}},
            {element: '.user-details', popover: {title: 'Check you stats!', description: 'Keep track of your stats while you document your travels.', side: 'right', align: 'center'}},
            {element: '.badges', popover: {title: 'Unlock Achievements', description: "As you explore more countries, you'll unlock badges to celebrate your accomplishments. Keep exploring to unlock more!", side: 'right', align: 'center'}},
            {element: '#share', popover: {title: 'Share with fiends!', description: "Share your travel map with the world! Click here to share your map on social media.", position: 'bottom'}},
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
