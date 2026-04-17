const pokeContainer = document.getElementById("pokemon-container");
const fetchBtn = document.getElementById("findPoke");
const inputPoke = document.getElementById("pokename");

fetchBtn.addEventListener("click", () => {
    const pokemonName = inputPoke.value.toLowerCase().trim();

    if (!pokemonName) return;

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then(res => {
            if (!res.ok) throw new Error("ไม่พบชื่อนี้");
            return res.json();
        })
        .then(data => {
            const card = document.createElement("div");
            card.className = "poke-card";

            card.innerHTML = `
                <button class="delete-btn">✕</button>
                <img src="${data.sprites.front_default}" alt="${data.name}">
                <h3>${data.name}</h3>
                <small>Type: ${data.types[0].type.name}</small>
            `;

            card.querySelector(".delete-btn").addEventListener("click", () => {
                card.remove();
            });

            pokeContainer.prepend(card); 
            inputPoke.value = "";
        })
        .catch(err => alert(err.message));
});