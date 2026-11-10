// Crear cuenta con Google
import { postDatos } from "../core/api.js";
import { API_REGISTRO_GOOGLE_VERIFICAR, GOOGLE_CLIENT_ID } from "../core/config.js";

const mensaje = document.getElementById("mensaje");
const contenedorBotonGoogle = document.getElementById("googleBtnContainer");

const manejarRespuestaGoogle = async (respuestaGoogle) => {
    if (mensaje) {
        mensaje.textContent = "";
        mensaje.className = "mensaje";
    }

    try {
        const respuesta = await postDatos(API_REGISTRO_GOOGLE_VERIFICAR, {
            idToken: respuestaGoogle.credential
        });
        const cuerpo = await respuesta.json();

        if (!respuesta.ok) {
            if (mensaje) {
                mensaje.textContent = cuerpo.message || "No se pudo continuar con Google.";
                mensaje.classList.add("error");
            }
            return;
        }

        
        sessionStorage.setItem("perfilGoogleRegistro", JSON.stringify(cuerpo.perfil));
        window.location.href = "completar-registro-google.html";

    } catch (error) {
        console.error(error);
        if (mensaje) {
            mensaje.textContent = "No se pudo conectar con el servidor. Intentá de nuevo.";
            mensaje.classList.add("error");
        }
    }
};

window.addEventListener("load", () => {
    if (!GOOGLE_CLIENT_ID) {
        console.warn(
            "Falta completar GOOGLE_CLIENT_ID en js/core/config.js — el botón de Google todavía no va a funcionar."
        );
        return;
    }

    if (!window.google || !contenedorBotonGoogle) {
        return;
    }

    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: manejarRespuestaGoogle
    });

    google.accounts.id.renderButton(contenedorBotonGoogle, {
        theme: "outline",
        size: "large",
        shape: "rectangular",
        text: "continue_with",
        width: 320
    });
});
