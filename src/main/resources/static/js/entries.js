const entrySelect = document.getElementsByClassName('entry-select');
const entryValue = document.getElementById('entry-value');

//loops through dropdown button and display entry title to user
for (let entry of entrySelect) {

    entry.addEventListener('click', () => {

        entryValue.innerHTML = entry.innerText;
        entryValue.value = entry.innerText;

    })

}


// const getImagesByCountryId = async (id) => {
//     const url = `${urlpattern}/api/image/country/${id}`;
//     let options = {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//         },
//     };
//     let response = await fetch(url, options);
//     let images = await response.json();
//     return images;
// };