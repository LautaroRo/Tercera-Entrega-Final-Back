const button = document.querySelector(".button");

button.addEventListener("click", (e) => {
    e.preventDefault();

    const value = button.id;

    fetch("http://localhost:3030/changeRole", {
        method: "POST",
        body: JSON.stringify({ value }),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((response) => {
        if (!response.ok) {
            console.log("Error");
        } else {
            return response.json();
        }
    })
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.error(error);
    });
});
