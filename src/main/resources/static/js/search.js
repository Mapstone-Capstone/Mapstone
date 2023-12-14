let search = document.getElementById("search")
search.addEventListener("keyup", (event)=>{
    let result = document.getElementsByClassName("text")
    let input = document.getElementById("search").value
    input=input.toLowerCase()
    let noResults = true;
    for (let i = 0; i < result.length; i++) {
        if (!result[i].innerHTML.toLowerCase().includes(input)) {
            result[i].parentElement.parentElement.style.display="none";
            console.log(result[i].innerHTML + "is gone")
        }
        else {
            result[i].parentElement.parentElement.style.display="flex";
            noResults = false;
            console.log(result[i].innerHTML + "is here")
        }
    }
})