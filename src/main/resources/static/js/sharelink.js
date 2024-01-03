let Sharelink = document.getElementById("share")
let id = document.getElementById("share").value
let text = document.getElementById("link")
let modal = document.getElementById("sharelinkmodal")
let close = document.getElementsByClassName("modal-close")[0]
let backdrop = document.getElementsByClassName("modal-bg")[0]
let facebook = document.getElementById("facebook")
let linkedin = document.getElementById("linkedin")
let twiiter = document.getElementById("twitter")
Sharelink.addEventListener("click", async (event)=>{
    modal.style.display="flex";
    let link = "https://www.map-share.net/viewprofile/" + id;
    // copies info to the clipboard HOWEVER IT WILL BE A PROMISE
    await navigator.clipboard.writeText(link)
    let attribute= "window.open('https://www.facebook.com/share.php?u="+link+"','popup','width=600,height=600'); return false;"
    let attribute2 = "window.open('https://www.linkedin.com/sharing/share-offsite/?url="+link+"','popup','width=600,height=600'); return false;"
    let attribute3 = "window.open('https://twitter.com/intent/tweet?url="+link+"','popup','width=600,height=600'); return false;"
    text.value=link;
    facebook.setAttribute("onclick",attribute)
    linkedin.setAttribute("onclick",attribute2)
    twiiter.setAttribute("onclick",attribute3)
    // alert("Share link copied: "+ link)
})
close.addEventListener("click", (event)=>{
    modal.style.display="none";
})

backdrop.addEventListener("click", (event)=>{
    modal.style.display="none";
});