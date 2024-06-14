const button = document.querySelector(".button")

button.addEventListener("click", (e) => {
    e.preventDefault()
    const id = button.id
    fetch("/api/products/deleteProduct", {
        method: "delete",
        body: JSON.stringify({ id: id }),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        if(!response.ok) return console.log("error")

        return response.json()

    }).catch((error) => {
        console.log(error)
    })
})