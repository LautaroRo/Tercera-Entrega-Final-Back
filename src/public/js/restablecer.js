

const form = document.getElementById("formRestablecer")

form.addEventListener("submit", async(e) => {
    e.preventDefault()

    const data = new FormData(form)
    const email = {}
    data.forEach((data, key) => (email[key] = data))
    try {
        const response = await fetch("/searchEmail", {
            method: "POST",
            body: JSON.stringify(email),
            headers: {
                "Content-Type": "application/json",
            },
        })
        const info = await response.json()

        return info

    } catch (error) {
        return console.log(error)
    }

})