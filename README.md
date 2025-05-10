# Websocket-SisCol
"This project is designed to be used in Visual Studio Code. It can be executed and run in any web browser to simulate communication between multiple users."
# Proyecto WebSocket Server

Este proyecto es un servidor WebSocket en Node.js que permite la comunicación en tiempo real. Sigue los pasos a continuación para instalarlo y ejecutarlo correctamente.

## 🚀 Requisitos previos
Antes de comenzar, asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) en tu sistema.

## 📥 Instalación
1. **Descargar el proyecto**: Clona o descarga todos los archivos en tu computadora.
2. **Abrir la carpeta**: Usa [Visual Studio Code](https://code.visualstudio.com/) y abre la carpeta que contiene los archivos.
3. **Instalar dependencias**: Abre una terminal en VS Code y ejecuta:
    npm install
    (Esto instalará todas las librerías necesarias, incluyendo WebSocket.)
   
## ▶️ Ejecución
1. Abre la terminal en Visual Studio Code.
2. Ejecuta el siguiente comando para iniciar el servidor:
    node server.js
3. Una vez iniciado, podrás ver el mensaje de confirmación en la terminal indicando que el servidor está corriendo.
4. 
## 🖥 Acceso al servidor
Si todo está configurado correctamente, podrás acceder a tu servidor desde:

- **Localhost:** [localhost:3000](http://localhost:3000)

## 🛠 Instrucciones de prueba del ejecutable
Para probar el funcionamiento del servidor WebSocket, sigue estos pasos:
1. **Abrir múltiples instancias:**  
   - Accede a [localhost:3000](http://localhost:3000) desde al menos **dos** páginas diferentes.  
   - Cada página representará a un usuario distinto.
2. **Comprobar el envío de mensajes:**  
   - Envía un mensaje desde cualquier usuario y verifica que **aparece inmediatamente en el chat** de todas las instancias abiertas.
3. **Verificar la conexión de usuarios:**  
   - Cada usuario que se conecte debe ser anunciado en el chat con su nombre de usuario por defecto.
4. **Cambiar el nombre de usuario:**  
   - Modifica el nombre de usuario en una página y confirma que el cambio **se refleja en el chat**.
