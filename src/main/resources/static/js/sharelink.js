let Sharelink = document.getElementById("share")
let id = document.getElementById("share").value
let text = document.getElementById("link")
let modal = document.getElementById("sharelinkmodal")
let close = document.getElementsByClassName("close")[0]

Sharelink.addEventListener("click", async (event)=>{
    modal.style.display="block";
    let link = "localhost:8080/viewprofile/" + id;
    // copies info to the clipboard HOWEVER IT WILL BE A PROMISE
    await navigator.clipboard.writeText(link)
    text.value=link;
    // alert("Share link copied: "+ link)
})

close.addEventListener("click", (event)=>{
    modal.style.display="none";
})
