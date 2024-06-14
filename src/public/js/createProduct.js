const form = document.getElementById("product-form")


form.addEventListener("submit", (e) => {
    e.preventDefault()
    const data = new FormData(form)

    const obj = {}

    data.forEach((value,key) => obj[key] = value )

    fetch("/api/products/addProduct", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        if(response.ok){
            return response.json()
        }else{
            return console.log("error")
        }
    }).catch((error) => {
        console.log(error)
    })
})