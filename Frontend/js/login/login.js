// Archivo — lógica de la pantalla "Iniciar sesión" (login.html)
// Todavía no existe un endpoint de login en el backend (ese caso de uso
// no forma parte de este sprint). Por ahora, con email + contraseña
// completos (el HTML ya los exige con "required"), se pasa directo al
// panel de clientes. Cuando se implemente el login real en el backend,
// hay que reemplazar el redirect por el fetch real (mismo patrón que
// registro.js con API_REGISTRO) y solo redirigir si la respuesta es ok.

const formulario = document.getElementById("formLogin");
const togglePassword = document.getElementById("togglePassword");
const inputPassword = document.getElementById("password");

togglePassword.addEventListener("click", () => {
    const esPassword = inputPassword.type === "password";
    inputPassword.type = esPassword ? "text" : "password";
    togglePassword.textContent = esPassword ? "🙈" : "👁️";
});

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    // Por ahora no hay validación real contra el backend — cualquier
    // email + contraseña completos entra al panel de clientes.
    window.location.href = "clientes.html";
});
