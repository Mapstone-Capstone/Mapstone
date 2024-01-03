let urlpattern = `${window.location.protocol}//${window.location.host}`
const entrySelect = document.getElementsByClassName('entry-select');
const entryValue = document.getElementById('entry-value');
const inputContainer = document.getElementById('input-container');
const entryDeleteForm = document.getElementById('delete-entry-form');
const entryId = document.getElementById('entry-id');

const mapId = document.getElementById('map-id').value;

const countryId = document.getElementById('country-id');
const countryEntry = document.querySelectorAll('.country-entry');
const countryValue = document.getElementById('country-value');
const imageContainer = document.getElementById('image-container');

//loops through dropdown button and display edit entry title to user
for (let entry of entrySelect) {

    entry.addEventListener('click', () => {

        entryValue.innerHTML = entry.innerText;
        entryValue.value = entry.innerText;

        getEntryById(entry.value).then(function(response){
            inputContainer.innerHTML = `
                <input type="hidden" name="entry-id" value="${response.id}">
                
                <label for="entry-date"><strong>Date: </strong>
                    <input name="entry-date" id="entry-date" type="date" value="${response.date}" />
                </label>
                
                <label for="entry-title"><strong>Title: </strong>
                    <input name="entry-title" id="entry-title" value="${response.title}" />
                </label>
                
                <label for="entry-description"><strong>Description: </strong>
                    <textarea name="entry-description" id="entry-description"></textarea>
                </label>
               
                <button class="entry-buttons" type="submit"><strong>Save Changes</strong></button>
                
            `

            const entryDescription = document.getElementById('entry-description');

            entryDescription.innerText = response.description;

            entryId.value = response.id;
            entryDeleteForm.classList.remove('delete-btn-hide');
            entryDeleteForm.classList.add('delete-entry-display');

        })

    })

}



countryEntry.forEach((country) => {

   country.addEventListener('click', () => {

       imageContainer.innerHTML = "";
       imageContainer.innerHTML = `<h1>Images of your trip</h1>`;

       getImagesByCountryAndMapId(country.value, mapId).then((response) => {

           response.forEach((imageObject) => {

               imageContainer.innerHTML += `
                <img class="country-image" src="${imageObject.imageUrl}" alt="country image">
               `
           })
       })

       imageContainer.classList.remove("image-container-hide");
       imageContainer.classList.add("image-container-display");

       countryValue.innerHTML = country.innerText;
       countryId.value = country.value;

   });

});


const getImagesByCountryAndMapId = async (countryId, mapId) => {
    const url = `${urlpattern}/api/image/country/${countryId}/${mapId}`;
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

const getEntryById = async (id) => {

    const url =    `${urlpattern}/api/entry/${id}`;
    let options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    let response = await fetch(url, options);
    let entry = await response.json();
    return entry;

}