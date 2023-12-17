let urlpattern = `${window.location.protocol}//${window.location.host}`
const mapId = document.getElementById("map-id").value;
const badgeContainer = document.querySelector(".badges");



const getBadgesByMapId = async (id) => {
    const url = `${urlpattern}/api/badges/${id}`;
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



async function getBadges(mapId) {
    const badges = await getBadgesByMapId(mapId);
    console.log(badges)
    badges.forEach((badge) => {
        const badgeDiv = document.createElement("div");
        badgeDiv.classList.add("badge-wrapper");
        badgeDiv.innerHTML = `
        <img class="rounded-circle badge-img" value="${badge.url}" src="${badge.url}" alt="badge"/>
        <p hidden="hidden" id="badge${badge.id}"></p>
        <p hidden="hidden" class="badge-name">${badge.name}</p>
        <p hidden="hidden"class="badge-description">${badge.description}</p>
    </p>`;

        const thisBadge = badgeDiv.querySelector(".badge-img");
        thisBadge.addEventListener("click", function () {
            const badgeModal = document.createElement("div");
            badgeModal.classList.add("modal");
            badgeModal.innerHTML = `
            <div class="modal-bg"></div>
                <div class="modal-content">
                <div class="modal-header">
                <h2 class="modal-title text-center">${badge.name}</h2>
                 <span class="modal-close">&times;</span>
                </div>
                <div class="modal-body justify-content-center">
                    <img class="rounded-circle badge-img" src="${badge.url}" alt="badge"/>
                    <p class="text-center fs-5">${badge.description}</p>
                </div>
                </div>
            `;
            const modalClose = badgeModal.querySelector(".modal-close");
            modalClose.addEventListener("click", function () {
                badgeModal.remove();
            });

            const modalBg = badgeModal.querySelector(".modal-bg");
            modalBg.addEventListener("click", function () {
                badgeModal.remove();
            });

            document.body.appendChild(badgeModal);
        });


        badgeContainer.appendChild(badgeDiv);
    });
}

getBadges(mapId).then(() => {
    console.log("Badges loaded");
});




