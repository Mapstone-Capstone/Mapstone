

let urlpattern = `${window.location.protocol}//${window.location.host}`

const badgeContainer = document.querySelector(".badge-container");



const getAllBadges = async (id) => {
    const url = `${urlpattern}/api/badges`;
    let options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    let response = await fetch(url, options);
    let badges = await response.json();
    return badges;
};



async function getAllObtainableBadges() {
    const badges = await getAllBadges();
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

getAllObtainableBadges().then(() => {
    console.log("Badges loaded");
});




