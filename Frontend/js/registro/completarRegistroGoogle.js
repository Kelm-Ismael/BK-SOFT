// Registro con Google: completar datos faltantes
import { postDatos } from "../core/api.js";
import { API_REGISTRO_GOOGLE } from "../core/config.js";

const formulario = document.getElementById("formCompletarGoogle");
const mensaje = document.getElementById("mensaje");
const inputCelular = document.getElementById("celular");
const checkTerminos = document.getElementById("aceptaTerminos");

const perfilGuardado = sessionStorage.getItem("perfilGoogleRegistro");

if (!perfilGuardado) {

    window.location.href = "registro.html";
} else {
    const perfil = JSON.parse(perfilGuardado);
    document.getElementById("nombre").value = perfil.nombre || "";
    document.getElementById("apellido").value = perfil.apellido || "";
    document.getElementById("email").value = perfil.email || "";
}


inputCelular.addEventListener("input", () => {
    const soloDigitos = inputCelular.value.replace(/\D/g, "");
    inputCelular.value = "+" + soloDigitos;
});

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    mensaje.textContent = "";
    mensaje.className = "mensaje";

    const perfil = JSON.parse(sessionStorage.getItem("perfilGoogleRegistro") || "{}");

    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const fecha_nacimiento = document.getElementById("fecha_nacimiento").value;
    const celular = inputCelular.value.trim();
    const acepta_terminos = checkTerminos.checked;

    if (!acepta_terminos) {
        mensaje.textContent = "Tenés que aceptar los Términos y Condiciones y la Política de Privacidad.";
        mensaje.classList.add("error");
        return;
    }

    const datos = {
        googleId: perfil.googleId,
        email: perfil.email,
        nombre,
        apellido,
        fecha_nacimiento,
        celular,
        acepta_terminos
    };

    const botonSubmit = formulario.querySelector("button[type=submit]");
    botonSubmit.disabled = true;

    try {
        const respuesta = await postDatos(API_REGISTRO_GOOGLE, datos);
        const cuerpo = await respuesta.json();

        if (!respuesta.ok) {
            mensaje.textContent = cuerpo.message || "No se pudo completar el registro.";
            mensaje.classList.add("error");
            return;
        }

        // CUENTA ACTIVADA
        sessionStorage.removeItem("perfilGoogleRegistro");
        mensaje.textContent = "Cuenta activada.";
        mensaje.classList.add("exito");
        formulario.querySelectorAll("input, button").forEach((elemento) => (elemento.disabled = true));

        // Redirige a la página de inicio
        setTimeout(() => {
            window.location.href = "../index.html";
        }, 2000);

    } catch (error) {
        console.error(error);
        mensaje.textContent = "No se pudo conectar con el servidor. Intentá de nuevo.";
        mensaje.classList.add("error");
    } finally {
        // Si la cuenta ya quedó activada, el botón sigue deshabilitado
        botonSubmit.disabled = mensaje.classList.contains("exito");
    }
});
