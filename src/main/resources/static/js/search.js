let search = document.getElementById("search")
search.addEventListener("keyup", (event)=>{
    let result = document.getElementsByClassName("card-text")
    let input = document.getElementById("search").value
    input=input.toLowerCase()
    let noResults = true;
    for (let i = 0; i < result.length; i++) {
        if (!result[i].innerHTML.toLowerCase().includes(input)) {
            result[i].parentElement.parentElement.parentElement.style.display="none";
        }
        else {
            result[i].parentElement.parentElement.parentElement.style.display="block";
            noResults = false;
        }
    }
})