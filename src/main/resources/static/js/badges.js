const badge1 = document.getElementById("badge1");
const badge2 = document.getElementById("badge2");
const badge3 = document.getElementById("badge3");
const badge4 = document.getElementById("badge4");
const badge5 = document.getElementById("badge5");


// when badge is clicked, open modal explaining badge
badge1.addEventListener("click", function () {
    const badgeModal = document.createElement("div");
    const badgeName = badgeModal.querySelector(".badge-name");
    const badgeDescription = badgeModal.querySelector(".badge-description");
    console.log(badgeName.value);
    badgeModal.classList.add("modal");
    badgeModal.innerHTML = `
    <div class="modal-bg"></div>
        <div class="modal-content">
            <span class="close">&times;</span>
            <h3>${badgeName.value}</h3>
            <p>${badgeDescription.value}</p>
        </div>
    `;
    const span = badgeModal.querySelector(".close");
    span.addEventListener("click", function () {
        badgeModal.remove();
    });

    document.body.appendChild(badgeModal);
});