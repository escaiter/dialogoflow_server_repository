const express = require("express");
const bodyParser = require("body-parser");
const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware para procesar JSON
app.use(bodyParser.json());

// 1. Define el endpoint POST para /send antes de servir los archivos estáticos.
// Esto asegura que esta ruta sea la primera en ser evaluada.
app.post("/send", async (req, res) => {
  const message = req.body.message;
  console.log("📩 Mensaje recibido del cliente:", message);

  const sessionId = uuid.v4();
  const sessionPath = sessionClient.projectAgentSessionPath(
    "newagent-h9i9", // Tu Project ID de Dialogflow
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: "es",
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult.fulfillmentText;
    console.log("🤖 Respuesta de Dialogflow:", result);
    res.json({ reply: result });
  } catch (err) {
    console.error("❌ ERROR en Dialogflow:", err);
    res.json({ reply: "Error al conectar con el bot 😢" });
  }
});

// 2. Sirve el archivo index.html en la ruta principal (/).
// Esta es una ruta específica y no un middleware general.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 3. Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

// Cliente de Dialogflow con tus credenciales.
// Esta configuración no necesita estar antes de las rutas.
const sessionClient = new dialogflow.SessionsClient();

//actualización codigos aparte
console.log("Valor de la variable de entorno:");
console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
