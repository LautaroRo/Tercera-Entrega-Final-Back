const a = document.getElementById("a");

a.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("hola");

    // Crear la cookie
    fetch("/giveNewChange", {
        method: "POST",
    })
    .then(() => {
        console.log("Se creó una nueva cookie 'LinkTwo'");
        // Redirigir al usuario a la página "/cambiarPassword"
        window.location.href = "/cambiarPassword";
    })
    .catch(error => {
        console.error("Hubo un problema al crear la nueva cookie:", error);
    });
});