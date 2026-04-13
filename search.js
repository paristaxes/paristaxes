// search.js

async function runSearch() {
    const params   = new URLSearchParams(window.location.search);
    const query    = (params.get("q") || "").trim().toLowerCase();
    const resultsEl = document.getElementById("results");

    if (!query) {
        resultsEl.innerHTML = "<p>Escribe algo para buscar.</p>";
        return;
    }

    let posts;
    try {
        const res = await fetch("search-index.json");
        posts = await res.json();
    } catch (e) {
        resultsEl.innerHTML = "<p>Error cargando el índice de búsqueda.</p>";
        return;
    }

    const words    = query.split(/\s+/);
    const filtered = posts.filter(post =>
        words.every(word =>
            post.body.toLowerCase().includes(word) ||
            post.title.toLowerCase().includes(word)
        )
    );

    if (filtered.length === 0) {
        resultsEl.innerHTML = "<p>No se encontraron resultados.</p>";
        return;
    }

    resultsEl.innerHTML = filtered.map(post => `
        <div class="post-card">
            <a href="${post.url}">
                <img src="${post.image}" alt="${post.title}">
                <h2>${post.title}</h2>
                <p class="date">${post.date}</p>
            </a>
        </div>
    `).join("");
}

runSearch();
