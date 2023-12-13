
const userId = document.get


async function postUpdatedUser(id) {
    const csrfToken = document.querySelector("meta[name='_csrf']").content;
    const user =
        {
            name: name,
        };

    const backendEndpoint = "http://localhost:8080/api/map/layer/add";
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




// async function updateUser(mapId) {
//     // const badges = await getBadgesByMapId(mapId);
//     console.log(badges)
//     badges.forEach((badge) => {
//         const badgeDiv = document.createElement("div");
//         badgeDiv.classList.add("badge-wrapper");
//         badgeDiv.innerHTML = `
//         <img class="rounded-circle badge-img" value="${badge.url}" src="${badge.url}" alt="badge"/>
//         <p hidden="hidden" id="badge${badge.id}"></p>
//         <p hidden="hidden" class="badge-name">${badge.name}</p>
//         <p hidden="hidden"class="badge-description">${badge.description}</p>
//     </p>`;
//
//         const thisBadge = badgeDiv.querySelector(".badge-img");
//         thisBadge.addEventListener("click", function () {
//             const badgeModal = document.createElement("div");
//
//             badgeModal.classList.add("modal");
//             badgeModal.innerHTML = `
//             <div class="modal-bg"></div>
//                 <div class="modal-content d-flex justify-content-center align-items-center">
//                     <span class="modal-close">&times;</span>
//                     <h3>${badge.name}</h3>
//                     <img class="rounded-circle badge-img" src="${badge.url}" alt="badge"/>
//                     <p>${badge.description}</p>
//                 </div>
//             `;
//             const modalClose = badgeModal.querySelector(".modal-close");
//             modalClose.addEventListener("click", function () {
//                 badgeModal.remove();
//             });
//
//             const modalBg = badgeModal.querySelector(".modal-bg");
//             modalBg.addEventListener("click", function () {
//                 badgeModal.remove();
//             });
//
//
//         });
//
//     });
// }

getBadges(mapId).then(() => {
    console.log("Badges loaded");
});




