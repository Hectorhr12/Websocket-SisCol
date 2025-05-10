// DOM Elements
const chatMessages = document.getElementById("chat-messages")
const messageInput = document.getElementById("message-input")
const sendButton = document.getElementById("send-button")
const usernameElement = document.getElementById("username")
const changeUsernameButton = document.getElementById("change-username")
const statusIndicator = document.getElementById("status-indicator")
const connectionStatus = document.getElementById("connection-status")

// Variables
let socket
let username = ""
let reconnectAttempts = 0
const maxReconnectAttempts = 5
const reconnectDelay = 3000

// Conectar al servidor websocket.
function connectWebSocket() {
  // Usar el host actual para la coneccion a la base de datos
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
  const host = window.location.host
  const wsUrl = `${protocol}//${host}`
  console.log(`Intentado coneccion al websocket en: ${wsUrl}`)
  updateConnectionStatus("connecting", "Conectando...")
  socket = new WebSocket(wsUrl)
  // Coneccoin abierta
  socket.addEventListener("open", () => {
    console.log("Conectadndo al servidor websocket")
    updateConnectionStatus("connected", "Conectado")
    enableChat()
    reconnectAttempts = 0
  })
  // Escuchar los mensajes
  socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data)
    handleMessage(data)
  })
  // Cerrar la coneccion
  socket.addEventListener("close", () => {
    console.log("Desconectado del servidor Websocket")
    updateConnectionStatus("disconnected", "Desconectado")
    disableChat()
    // Attempt to reconnect
    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++
      const delay = reconnectDelay * reconnectAttempts
      updateConnectionStatus("connecting", `Reconectando en ${delay / 1000}s...`)
      setTimeout(() => {
        connectWebSocket()
      }, delay)
    } else {
      updateConnectionStatus("disconnected", "No se pudo reconectar")
      addNotification("No se pudo reconectar al servidor. Por favor, recarga la página.")
    }
  })

  // Connection error
  socket.addEventListener("error", (error) => {
    console.error("WebSocket error:", error)
    updateConnectionStatus("disconnected", "Error de conexión")
  })
}

// Handle incoming messages
function handleMessage(data) {
  switch (data.type) {
    case "welcome":
      username = data.username
      usernameElement.textContent = username
      addNotification(data.message)
      break
    case "chat":
      addChatMessage(data)
      break
    case "notification":
      addNotification(data.message)
      break
    default:
      console.log("Unknown message type:", data)
  }
}

//  Añadir mensajes al chat a UI
function addChatMessage(data) {
  const isCurrentUser = data.username === username
  const messageElement = document.createElement("div")
  messageElement.className = `message ${isCurrentUser ? "user-message" : "other-message"}`
  const timestamp = new Date(data.timestamp)
  const formattedTime = timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  messageElement.innerHTML = `
    <div class="header">
      ${isCurrentUser ? "Tú" : data.username}
      <span class="time">${formattedTime}</span>
    </div>
    <div class="content">${escapeHtml(data.message)}</div>
  `
  chatMessages.appendChild(messageElement)
  scrollToBottom()
}
// Añadir notificciones a la UI
function addNotification(message) {
  const notificationElement = document.createElement("div")
  notificationElement.className = "notification"
  notificationElement.textContent = message
  chatMessages.appendChild(notificationElement)
  scrollToBottom()
}

// Mandar mensajes
function sendMessage() {
  const message = messageInput.value.trim()
  if (message && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type: "chat",
        message,
      }),
    )
    messageInput.value = ""
  }
}

// Cambiar nombre del usuario
function changeUsername() {
  const newUsername = prompt("Ingresa tu nuevo nombre de usuario:", username)
  if (newUsername && newUsername.trim() && newUsername !== username) {
    // Update UI immediately for better user experience
    const oldUsername = username
    username = newUsername.trim()
    usernameElement.textContent = username
    socket.send(
      JSON.stringify({
        type: "rename",
        oldUsername: oldUsername,
        username: newUsername.trim(),
      }),
    )
  }
}

// Subir estado de la coneccion
function updateConnectionStatus(status, message) {
  statusIndicator.className = status
  connectionStatus.textContent = message
}

// Desabilitar el UI
function enableChat() {
  messageInput.disabled = false
  sendButton.disabled = false
  messageInput.focus()
}

// Desanilitar el UI del chat
function disableChat() {
  messageInput.disabled = true
  sendButton.disabled = true
}

// Boton de scroll
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight
}

// Escape HTML to prevent XSS
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
// Event Listeners
sendButton.addEventListener("click", sendMessage)
messageInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    sendMessage()
  }
})
changeUsernameButton.addEventListener("click", changeUsername)
//Inicia la coneccion
connectWebSocket()
