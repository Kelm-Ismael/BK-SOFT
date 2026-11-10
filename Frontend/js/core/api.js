// Fetch con backend

// POST
export async function postDatos(url, datos) {
    return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });
}