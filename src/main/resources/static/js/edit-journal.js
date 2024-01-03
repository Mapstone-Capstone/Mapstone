

const editJournalBtn = document.getElementById('edit-journal-btn');


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
            
        </div>
    </div>
`

    const modalClose = editJournalModal.querySelector(".modal-close");
    const modalBackground = editJournalModal.querySelector(".modal-bg");
    const createEntry = editJournalModal.querySelector("#create-journal-entry");
    const editEntry = editJournalModal.querySelector("#edit-journal-entry");

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
        window.location = '/edit-entries';
    });


    document.body.appendChild(editJournalModal);



}

editJournalBtn.addEventListener('click', editModalPopup);



