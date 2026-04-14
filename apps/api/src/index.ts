import express from "express"
import { createServer } from "http"
import { Server as SocketServer } from "socket.io"
import cors from "cors"
import { techRouter } from "./routes/tech"
import { tributeRouter } from "./routes/tribute"
import { eulogyRouter } from "./routes/eulogy"

const app = express()
const httpServer = createServer(app)
const io = new SocketServer(httpServer, { cors: { origin: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000" } })

app.use(cors({ origin: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000" }))
app.use(express.json())
app.use("/api/tech", techRouter)
app.use("/api/tributes", tributeRouter)
app.use("/api/eulogy", eulogyRouter)
app.get("/api/health", (_req, res) => res.json({ status: "alive" }))

io.on("connection", (socket) => {
  socket.on("tribute:add", (data) => io.emit("tribute:new", data))
  socket.on("tech:submit", (data) => io.emit("tech:new", data))
})

httpServer.listen(process.env.PORT ?? 4000, () => console.log(`Requiem API running`))
