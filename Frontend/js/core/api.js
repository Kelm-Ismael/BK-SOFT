// Archivo NUEVO — helpers de fetch compartidos por todos los módulos del frontend.

export async function getDatos(url) {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
        throw new Error(`Error al obtener datos de ${url} (status ${respuesta.status})`);
    }

    return respuesta.json();
}

// Devuelve la Response cruda: quien llama decide qué hacer con .ok y llama a .json().
export async function postDatos(url, datos) {
    return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });
}