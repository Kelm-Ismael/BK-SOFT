


// Archivo — lógica de la pantalla "Confirmá tu cuenta" (confirmar-cuenta.html)
import { postDatos } from "../core/api.js";
import { API_VERIFICAR_CUENTA, API_REENVIAR_CODIGO } from "../core/config.js";

const COOLDOWN_INICIAL_SEGUNDOS = 60;

// Si venís recién de registrarte, el email ya quedó guardado acá.
// Si entrás directo por el link "Activar cuenta", esto va a ser null
// y el campo de email queda vacío para que lo tipees vos.
const emailGuardado = sessionStorage.getItem("emailVerificacion");

const inputEmail = document.getElementById("email");
const casilleros = Array.from(document.querySelectorAll(".casillero"));
const formulario = document.getElementById("formConfirmar");
const mensaje = document.getElementById("mensaje");
const botonReenviar = document.getElementById("btnReenviar");
const textoCooldown = document.getElementById("cooldown");

let intervaloCooldown = null;

if (emailGuardado) {
    inputEmail.value = emailGuardado;
}

function obtenerEmail() {
    return inputEmail.value.trim();
}

// ── Casilleros de 6 dígitos: avanzar/retroceder foco automáticamente ──
casilleros.forEach((casillero, indice) => {

    casillero.addEventListener("input", () => {
        casillero.value = casillero.value.replace(/\D/g, "").slice(0, 1);

        if (casillero.value && indice < casilleros.length - 1) {
            casilleros[indice + 1].focus();
        }
    });

    casillero.addEventListener("keydown", (evento) => {
        if (evento.key === "Backspace" && !casillero.value && indice > 0) {
            casilleros[indice - 1].focus();
        }
    });

    casillero.addEventListener("paste", (evento) => {
        evento.preventDefault();
        const texto = (evento.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6);

        texto.split("").forEach((digito, i) => {
            if (casilleros[i]) casilleros[i].value = digito;
        });

        const siguiente = casilleros[Math.min(texto.length, casilleros.length - 1)];
        if (siguiente) siguiente.focus();
    });
});

function obtenerCodigo() {
    return casilleros.map((c) => c.value).join("");
}

function iniciarCooldown(segundos) {
    let restante = segundos;
    botonReenviar.disabled = true;
    textoCooldown.textContent = `Disponible en ${restante} seg`;

    clearInterval(intervaloCooldown);
    intervaloCooldown = setInterval(() => {
        restante--;

        if (restante <= 0) {
            clearInterval(intervaloCooldown);
            botonReenviar.disabled = false;
            textoCooldown.textContent = "";
            return;
        }

        textoCooldown.textContent = `Disponible en ${restante} seg`;
    }, 1000);
}

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    mensaje.textContent = "";
    mensaje.className = "mensaje";

    const email = obtenerEmail();
    const codigo = obtenerCodigo();

    if (codigo.length !== 6) {
        mensaje.textContent = "Completá los 6 dígitos del código.";
        mensaje.classList.add("error");
        return;
    }

    try {
        const respuesta = await postDatos(API_VERIFICAR_CUENTA, { email, codigo });
        const cuerpo = await respuesta.json();

        if (!respuesta.ok) {
            mensaje.textContent = cuerpo.message || "No se pudo verificar el código.";
            mensaje.classList.add("error");
            return;
        }

        // CU-01, paso 10: el sistema activa la cuenta e informa que fue
        // activada. El caso de uso termina acá (no hay pantalla de login),
        // así que vuelve al inicio.
        sessionStorage.removeItem("emailVerificacion");
        mensaje.textContent = "Cuenta activada.";
        mensaje.classList.add("exito");

        // Ya no queda nada por hacer en este formulario
        clearInterval(intervaloCooldown);
        textoCooldown.textContent = "";
        formulario.querySelectorAll("input, button").forEach((elemento) => (elemento.disabled = true));

        // Después de mostrar el mensaje, vuelve a la página de inicio
        setTimeout(() => {
            window.location.href = "../index.html";
        }, 2000);

    } catch (error) {
        console.error(error);
        mensaje.textContent = "No se pudo conectar con el servidor. Intentá de nuevo.";
        mensaje.classList.add("error");
    }
});

botonReenviar.addEventListener("click", async () => {
    mensaje.textContent = "";
    mensaje.className = "mensaje";

    const email = obtenerEmail();

    if (!email) {
        mensaje.textContent = "Ingresá tu email para poder reenviarte el código.";
        mensaje.classList.add("error");
        inputEmail.focus();
        return;
    }

    try {
        const respuesta = await postDatos(API_REENVIAR_CODIGO, { email });
        const cuerpo = await respuesta.json();

        if (!respuesta.ok) {
            mensaje.textContent = cuerpo.message || "No se pudo reenviar el código.";
            mensaje.classList.add("error");

            // Si el error es de cooldown (429), igual arrancamos la cuenta regresiva visual
            if (respuesta.status === 429) {
                iniciarCooldown(COOLDOWN_INICIAL_SEGUNDOS);
            }
            return;
        }

        mensaje.textContent = cuerpo.mensaje || "Te enviamos un nuevo código.";
        mensaje.classList.add("exito");
        casilleros.forEach((c) => (c.value = ""));
        casilleros[0].focus();
        iniciarCooldown(COOLDOWN_INICIAL_SEGUNDOS);

    } catch (error) {
        console.error(error);
        mensaje.textContent = "No se pudo conectar con el servidor. Intentá de nuevo.";
        mensaje.classList.add("error");
    }
});

// El cooldown solo arranca corriendo si venís recién de registrarte (ya se
// mandó un código automáticamente). Si entraste por "Activar cuenta" sin
// haber pasado por el registro recién, el botón "Reenviar" queda disponible
// de entrada para que puedas pedir el primer envío de esta sesión.
if (emailGuardado) {
    iniciarCooldown(COOLDOWN_INICIAL_SEGUNDOS);
}