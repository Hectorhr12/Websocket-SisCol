const WebSocket = require("ws")
const http = require("http")
const fs = require("fs")
const path = require("path")

// Create HTTP server to serve the client files
const server = http.createServer((req, res) => {
  let filePath = "." + req.url
  if (filePath === "./") {
    filePath = "./index.html"
  }

  const extname = path.extname(filePath)
  let contentType = "text/html"

  switch (extname) {
    case ".js":
      contentType = "text/javascript"
      break
    case ".css":
      contentType = "text/css"
      break
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        res.writeHead(404)
        res.end("File not found")
      } else {
        res.writeHead(500)
        res.end("Server Error: " + error.code)
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType })
      res.end(content, "utf-8")
    }
  })
})

// Crea el websocket
const wss = new WebSocket.Server({ server })

// Store connected clients
const clients = new Map()
let userCounter = 0

// Transmision de mesajes a todos los usuario conectados
function broadcast(message) {
  const messageStr = JSON.stringify(message)
  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(messageStr)
    }
  })
}

// Realiza la coneccion al servidor websocket
wss.on("connection", (ws) => {
  // Generate temporary username
  const userId = Date.now()
  const username = `Usuario_${++userCounter}`
  // Store client information
  clients.set(userId, {
    ws,
    username,
  })

  console.log(`New connection: ${username}`)

  // Mensaje de bienvenida a los nuenos usuarios
  ws.send(
    JSON.stringify({
      type: "welcome",
      username,
      message: `Bienvenido al chat: , ${username}!`,
    }),
  )

  // Notify all clients about the new user
  broadcast({
    type: "notification",
    message: `${username} se a unido al chat`,
  })

  // Gestion de los mensajes
  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data)
      // Gestiona cambio de nombre de los usuarios
      if (message.type === "rename") {
        const oldUsername = clients.get(userId).username
        clients.get(userId).username = message.username
        broadcast({
          type: "notification",
          message: `${oldUsername} es conocido ahora como: ${message.username}`,
        })
        return
      }
      // Gestiona los menasjes del chat
      if (message.type === "chat") {
        broadcast({
          type: "chat",
          username: clients.get(userId).username,
          message: message.message,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error("Error processing message:", error)
    }
  })

  // Realizar la desconeccion 
  ws.on("close", () => {
    const username = clients.get(userId)?.username
    clients.delete(userId)

    if (username) {
      console.log(`Disconnected: ${username}`)
      broadcast({
        type: "notification",
        message: `${username} ha salido del chat`,
      })
    }
  })
})

// Inicio del servidor
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`El servidor está corriendo en: \x1b[34m${url}\x1b[0m`);
  console.log(`El servidor WebSocket está listo para aceptar conexiones`);
});
