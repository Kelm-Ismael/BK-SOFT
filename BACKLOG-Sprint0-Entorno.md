# Backlog — Preparación del Entorno de Desarrollo

> Sprint 0 (previo a "Registrarse"). Cada bloque está listo para copiar como Issue en GitHub Projects con su título, descripción, criterios de aceptación y etiquetas.

---

### 1. Inicializar repositorio y estructura de carpetas
**Descripción:** Crear el repositorio en GitHub y establecer la estructura base separando las carpetas del backend y el frontend.

**Criterios de aceptación:**
- Repositorio creado en GitHub (privado o público según corresponda).
- Carpetas `backend/` y `front/` creadas en la raíz del proyecto.
- Primer commit con la estructura inicial pusheado a la rama principal (`main`).

* **Etiquetas:** `setup`, `infra`
* **Estimación:** 0.5 pt

---

### 2. Configurar `.gitignore` en backend y frontend
**Descripción:** Evitar la subida de carpetas de dependencias, variables de entorno, builds y archivos temporales al repositorio remoto.

**Criterios de aceptación:**
- Archivo `.gitignore` creado en `backend/` para ignorar `node_modules`, `.env`, `dist` y archivos temporales.
- Archivo `.gitignore` creado en `front/` para ignorar `node_modules`, `.env`, `dist` y `.vite`.
- Verificado mediante `git status` que no se listen archivos sensibles.

* **Etiquetas:** `setup`, `infra`
* **Estimación:** 0.5 pt

---

### 3. Inicializar proyecto backend (Node + TypeScript)
**Descripción:** Inicializar el proyecto de Node.js e instalar todas las dependencias necesarias de producción y desarrollo para trabajar con TypeScript y PostgreSQL nativo.

**Criterios de aceptación:**
- Archivo `package.json` generado mediante `npm init -y`.
- Dependencias de producción instaladas: `express`, `cors`, `pg`, `dotenv`.
- Dependencias de desarrollo instaladas: `typescript`, `tsx`, `@types/express`, `@types/cors`, `@types/node`, `@types/pg`.
- Archivo `tsconfig.json` generado con `npx tsc --init`.
- Script de desarrollo `"dev": "tsx watch src/server.ts"` configurado en el `package.json`.

* **Etiquetas:** `setup`, `backend`
* **Estimación:** 1 pt

---

### 4. Configurar conexión a la base de datos PostgreSQL
**Descripción:** Establecer el módulo de conexión a la base de datos utilizando el controlador nativo de Node.js (`pg`).

**Criterios de aceptación:**
- Base de datos creada localmente en PostgreSQL utilizando pgAdmin4.
- Variable `DATABASE_URL` configurada correctamente dentro del archivo `.env`.
- Módulo de conexión programado en `src/config/db.ts` utilizando un `Pool` de `pg`.
- Conexión verificada exitosamente al iniciar la aplicación.

* **Etiquetas:** `setup`, `backend`, `database`
* **Estimación:** 1 pt

---

### 5. Definir variables de entorno del proyecto
**Descripción:** Centralizar la configuración sensible de la aplicación y documentarla para el equipo de desarrollo.

**Criterios de aceptación:**
- Archivo `.env` creado en el `backend/` incluyendo: `DATABASE_URL`, `PORT`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`, `TOKEN_EXPIRATION_HOURS`, `FRONTEND_URL`.
- Archivo `.env.example` creado como plantilla versionada con valores genéricos.
- Confirmación de que el archivo real `.env` es ignorado por Git.

* **Etiquetas:** `setup`, `infra`
* **Estimación:** 0.5 pt

---

### 6. Estructurar carpetas del backend (Clean Architecture)
**Descripción:** Organizar el directorio de código fuente aplicando los principios de arquitectura limpia para separar responsabilidades.

**Criterios de aceptación:**
- Carpetas creadas: `src/domain/entities`, `src/domain/repositories`, `src/application/use-cases`, `src/infrastructure/repositories`, `src/interfaces/controllers`, `src/interfaces/routes`, `src/config`.
- Archivos base inicializados (`app.ts` y `server.ts`).

* **Etiquetas:** `setup`, `backend`, `architecture`
* **Estimación:** 0.5 pt

---

### 7. Levantar servidor Express básico
**Descripción:** Implementar un servidor mínimo para comprobar que el entorno de desarrollo funciona correctamente antes de escribir la lógica del negocio.

**Criterios de aceptación:**
- Archivos `src/server.ts` y `src/app.ts` configurados con Express escuchando en el puerto definido (`PORT`).
- Middlewares `cors` y `express.json()` activados globalmente.
- Endpoint de verificación `GET /health` respondiendo con estado `200 OK`.
- Comando `npm run dev` ejecutándose sin arrojar errores.

* **Etiquetas:** `setup`, `backend`
* **Estimación:** 0.5 pt

---

### 8. Configurar entorno de desarrollo frontend
**Descripción:** Habilitar un servidor local para visualizar y probar las interfaces estáticas de la aplicación web.

**Criterios de aceptación:**
- Herramienta `live-server` instalada de forma global o extensión equivalente de VS Code configurada.
- Prototipos de vistas (`registro.html`, `validar-token.html`) cargándose de forma local correctamente.
- Coincidencia de la variable `FRONTEND_URL` del backend con el puerto del servidor local del frontend.

* **Etiquetas:** `setup`, `frontend`
* **Estimación:** 0.5 pt

---

### 9. Registrar cuentas en servicios externos
**Descripción:** Dar de alta los servicios de mensajería y correo electrónico necesarios para las notificaciones del sistema.

**Criterios de aceptación:**
- Cuenta configurada en Resend y clave API generada.
- Dirección de correo o dominio de pruebas verificado en Resend.
- Cuenta creada en Twilio con el sandbox de WhatsApp activado.
- Credenciales cargadas de forma segura en el archivo `.env`.

* **Etiquetas:** `setup`, `infra`, `integraciones`
* **Estimación:** 1 pt

---

### 10. Documentar instrucciones de instalación en el README
**Descripción:** Proveer una guía clara para que cualquier integrante del equipo pueda clonar, instalar y poner en marcha el proyecto sin inconvenientes.

**Criterios de aceptación:**
- Archivo `README.md` redactado en la raíz con los requisitos previos y la guía paso a paso para el backend y frontend.
- Instrucciones detalladas sobre la creación manual de tablas en pgAdmin4 y el encendido de los servidores.
- Enlace o referencia explícita al archivo `.env.example` para configurar las variables de entorno.

* **Etiquetas:** `setup`, `docs`
* **Estimación:** 0.5 pt

---

### 11. Crear la primera tabla de base de datos (`clientes`)
**Descripción:** Validar que la conexión con pgAdmin4 y la ejecución de consultas SQL nativas operen de forma correcta antes de iniciar el desarrollo de los casos de uso.

**Criterios de aceptación:**
- Script SQL para la creación de la tabla `clientes` ejecutado correctamente desde la herramienta Query Tool de pgAdmin4.
- Estructura de la tabla verificada visualmente dentro del administrador de base de datos.

* **Etiquetas:** `setup`, `backend`, `database`
* **Estimación:** 1 pt

---

**Total estimado:** Alrededor de 7.5 puntos de esfuerzo para la fase inicial del proyecto sin dependencias de ORMs.