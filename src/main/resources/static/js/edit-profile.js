
let urlpattern = `${window.location.protocol}//${window.location.host}`

const userId = document.getElementById("userId").value;
const editProfileButton = document.getElementById("edit-profile-button");


async function postUpdatedUser(user) {
    const csrfToken = document.querySelector("meta[name='_csrf']").content;


    const backendEndpoint = `${urlpattern}/api/user/edit`;
    try {
        const response = await fetch(backendEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error("Failed to post user to backend");
        }
        const responseData = await response.json();
        console.log("Successfully posted user :", responseData);
    } catch (error) {
        console.error("Error posting user:", error.message);
    }
}



function editUserModal() {
    //get the existing values from the hidden input fields
    const userName = document.getElementById("username").value;
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const email = document.getElementById("user-email").value;

    const editUserModal = document.createElement("div");
    editUserModal.classList.add("modal");
    editUserModal.setAttribute("id", "edit-user-modal");
    editUserModal.innerHTML = `<div class="modal-bg"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Update Your Information</h2>
                <span class="modal-close">&times;</span>
            </div> 
            <div class="modal-body"> 
                <div class="form-inputs">
                    <label for="username">Username:</label>
                    <input type="text" id="username" value="${userName}" />
                </div>
                <div class="form-inputs">
                    <label for="firstName">First Name:</label>
                    <input type="text" id="firstName" value="${firstName}" />
                </div>
                <div class="form-inputs">
                    <label for="lastName">Last Name:</label>
                    <input type="text" id="lastName" value="${lastName}" />
                </div>
                <div class="form-inputs">
                    <label for="email">Email:</label>
                    <input type="email" id="email" value="${email}" />
                </div> 
             <div class="modal-buttons">
                <button class="update-user-button" type="submit">Update Profile</button>
                <button class="delete-btn" type="submit">Delete Profile</button>
                </div>
            </div>
        </div>`;

    //nodes from the modal for event listeners
    const modalClose = editUserModal.querySelector(".modal-close");
    const modalBackground = editUserModal.querySelector(".modal-bg");
    const updateUserButton = editUserModal.querySelector(".update-user-button");
    const deleteUserButton = editUserModal.querySelector(".delete-btn");
    const deleteForm = document.getElementById("delete-user-form");


    //event listener for update map button
    updateUserButton.addEventListener("click", async function (e) {
        e.preventDefault();
        const updatedUserName = editUserModal.querySelector("#username").value;
        const updatedFirstName = editUserModal.querySelector("#firstName").value;
        const updatedLastName = editUserModal.querySelector("#lastName").value;
        const updatedEmail = editUserModal.querySelector("#email").value;
        //if any fields are empty, don't submit the form
        if (!updatedUserName || !updatedFirstName || !updatedLastName || !updatedEmail) {
            alert("Please fill out all fields");
            return;
        }
        //if all fields are filled out, submit the form
        const userToUpdate =
            {
                id: userId,
                username: updatedUserName,
                firstName: updatedFirstName,
                lastName: updatedLastName,
                email: updatedEmail,
            };
        await postUpdatedUser(userToUpdate);

        //refresh the page to see the updated map
        window.location.reload();

    });

    //event listener for delete profile button
    deleteUserButton.addEventListener("click", function (e) {
        e.preventDefault();
        editUserModal.remove();
        const deleteModal = document.createElement("div");
        deleteModal.classList.add("modal");
        deleteModal.setAttribute("id", "delete-modal");
        deleteModal.innerHTML = `<div class="modal-bg"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Update Your Information</h2>
                <span class="modal-close">&times;</span>
            </div> 
            <div class="modal-body"> 
              <p>Are you sure you want to delete your profile?</p>
             <div class="modal-buttons">
                <button id="yes" type="submit">Yes</button>
                <button id="cancel" type="submit">Cancel</button>
                </div>
            </div>
        </div>`;
        const modalClose = deleteModal.querySelector(".modal-close");
        const modalBackground = deleteModal.querySelector(".modal-bg");
        const yesButton = deleteModal.querySelector("#yes");
        const cancelButton = deleteModal.querySelector("#cancel");
        //event listener for yes button
        yesButton.addEventListener("click", function (e) {
            e.preventDefault();
            deleteForm.submit();
        });
        //event listener for cancel button
        cancelButton.addEventListener("click", function (e) {
            e.preventDefault();
            deleteModal.remove();
        });
        //event listener for close button
        modalClose.addEventListener("click", function (e) {
            e.preventDefault();
            deleteModal.remove();
        });
        //event listener for modal background, allows user to click anywhere on background to close modal
        modalBackground.addEventListener("click", function (e) {
            e.preventDefault();
            deleteModal.remove();
        });
        document.body.appendChild(deleteModal);




    });

    // event listener for close button
    modalClose.addEventListener("click", () => {
        editUserModal.remove();
    });

    // event listener for modal background, allows user to click anywhere on background to close modal
    modalBackground.addEventListener("click", () => {
        editUserModal.remove();
    });

    document.body.appendChild(editUserModal);
}


editProfileButton.addEventListener("click", editUserModal);
