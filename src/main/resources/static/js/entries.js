const countryEntry = document.getElementsByClassName('country-entry');
const countryValue = document.getElementById('country-value');
const imageContainer = document.getElementById('image-container');
const countryId = document.getElementById('country-id');

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

//loops through dropdown button and shows the images assigned to that country
for (let entry of countryEntry) {

    entry.addEventListener('click', () => {

        imageContainer.innerHTML = "";

        getImagesByCountryId(entry.value).then(function (response) {

            response.forEach((image) => {
                imageContainer.innerHTML += `
                        <div class="country-image">
                            <img src="${image.imageUrl}" alt="country image">
                        </div>
                    `
            })

        })

        countryValue.innerHTML = entry.innerText;
        countryValue.value = entry.innerText;
        countryId.value = entry.value;


    })

}


