import {getAllEntries} from "./mapbox-map-utils.js";


const editJournalBtn = document.getElementById('edit-journal-btn');

const usersEntries = () => {

    const userId = document.getElementById('all-images');
    const userEntries = document.createElement("div");
    userEntries.classList.add("modal");
    userEntries.setAttribute("id", "user-entries");



    userEntries.innerHTML = `
        <div class="modal-bg"></div>

        <div class="modal-content">

            <div class="modal-header">
                <h2 class="modal-title">Pick an Entry to edit</h2>
                <span class="modal-close">&times;</span>
            </div>
            <div id="user-entries-body" class="modal-body">
            </div>
        </div>
    `;

    const modalBody = userEntries.querySelector('.modal-body');

    getAllEntries(userId.value).then(function (response) {
        response.forEach((entry) => {

            modalBody.innerHTML += `
            <button class="entry-title" type="button">${entry.title}</button>
        `;
            let entryBtn = usersEntries.querySelector(".entry-title");

            entryBtn.forEach((btn) => {

                btn.addEventListener("click", () => {
                    //pull up edit modal
                });

            });

        });
    });

}

const editModalPopup = () => {

    const editJournalModal = document.createElement("div");
    editJournalModal.classList.add("modal");
    editJournalModal.setAttribute("id", "edit-journal-modal");

    editJournalModal.innerHTML =  `
    <div class="modal-bg"></div>

    <div class="modal-content">

        <div class="modal-header">
            <h2 class="modal-title">Edit your Journal</h2>
            <span class="modal-close">&times;</span>
        </div>
        <div id="edit-journal-body" class="modal-body">
            <div>
                <button id="create-journal-entry" class="button">Create an Entry</button>
            </div>

            <div>
                <button id="edit-journal-entry" class="button"> Edit an Entry</button>
            </div>

            <div>
                <button id="delete-journal-entry" class="button">Delete an Entry</button>
            </div>
        </div>
    </div>
`

    const modalClose = editJournalModal.querySelector(".modal-close");
    const modalBackground = editJournalModal.querySelector(".modal-bg");
    const createEntry = editJournalModal.querySelector("#create-journal-entry");
    const editEntry = editJournalModal.querySelector("#edit-journal-entry");
    const deleteEntry = editJournalModal.querySelector("#delete-journal-entry");

    //close modal
    modalClose.addEventListener("click", () => {
        editJournalModal.remove();
    });
    modalBackground.addEventListener("click", () => {
        editJournalModal.remove();
    });

    //redirect to create entries page
    createEntry.addEventListener("click", () => {
        window.location = '/create-entries';
    });

    //popup edit entry modal
    editEntry.addEventListener("click", () => {

    });

    //popup delete entry modal
    deleteEntry.addEventListener("click", () => {

    })


    document.body.appendChild(editJournalModal);

}

editJournalBtn.addEventListener('click', editModalPopup);