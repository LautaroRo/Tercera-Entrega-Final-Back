const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("paso por aca")
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));


    try {
        const response = await fetch("/api/sessions/register", {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const jsonResponse = await response.json(); 


        return jsonResponse
    } catch (error) {
        console.error("Error:", error);
    }

});
