const socketto = require("socket.io");
const io = Socketio(server);

io.on("connection",(socket) => {
    console.log("New user connected");
})