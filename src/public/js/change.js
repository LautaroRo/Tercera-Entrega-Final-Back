const form = document.getElementById("formPassword")

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const data = new FormData(form)
    const obj = {}
    data.forEach((value, key) => (obj[key] = value))

    await fetch("/cambiarPasswordForm", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {

        if (response.ok) {
            const info = response.json();
            console.log("Contraseña cambiada exitosamente");
            window.location.href = "http://localhost:3030/login";
            return info;
        }
        }
        
    )


})