// build-index.js
// Ejecuta con: node build-index.js
// Genera search-index.json leyendo todos los archivos de /posts/

const fs   = require("fs");
const path = require("path");

const POSTS_DIR  = "./posts";
const OUTPUT     = "./search-index.json";

function extractFirst(html, re) {
    const m = html.match(re);
    return m ? m[1].replace(/<[^>]+>/g, "").trim() : "";
}

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".html"));
const index = [];

for (const file of files) {
    const html = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");

    const title   = extractFirst(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const date    = extractFirst(html, /<span[^>]*class="dateart"[^>]*>([\s\S]*?)<\/span>/i);
    const image   = (html.match(/<div[^>]*class="article-header"[^>]*>[\s\S]*?<img[^>]*src="([^"]+)"/i) || [])[1] || "";
    const body    = extractFirst(html, /<div[^>]*class="article-body"[^>]*>([\s\S]*?)<\/div>\s*<\/article>/i)
                    || extractFirst(html, /<div[^>]*class="article-body"[^>]*>([\s\S]*?)<\/div>/i);
    const excerpt = body.slice(0, 200).trim() + (body.length > 200 ? "…" : "");
    const url     = `posts/${file}`;

    index.push({ title, date, image, excerpt, body, url });
}

// Ordena por fecha descendente (formato DD.MM.YYYY)
index.sort((a, b) => {
    const parse = d => d.split(".").reverse().join("-"); // → YYYY-MM-DD
    return parse(a.date) < parse(b.date) ? 1 : -1;
});

fs.writeFileSync(OUTPUT, JSON.stringify(index, null, 2), "utf-8");
console.log(`✅ ${index.length} artículo(s) indexado(s) → ${OUTPUT}`);
