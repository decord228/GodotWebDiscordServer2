// server.js
import express from "express";
import cors from "cors";
import { Client, GatewayIntentBits } from "discord.js";

const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://127.0.0.1:8000", // адрес твоей игры
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
}));

const BOT_TOKEN = process.env.BOT_TOKEN;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
  partials: ["CHANNEL"], // нужно для отправки DM
});

client.once("ready", () => {
  console.log(`✅ Бот вошёл как ${client.user.tag}`);
});

client.login(BOT_TOKEN);

app.post("/send_dm", async (req, res) => {
  const { user_id, text } = req.body;
  if (!user_id || !text) {
    return res.status(400).json({ ok: false, error: "user_id и text обязательны" });
  }

  try {
    const user = await client.users.fetch(user_id);
    await user.send(text);
    console.log(`📩 Отправлено DM пользователю ${user_id}`);
    res.json({ ok: true });
  } catch (err) {
    console.error("Ошибка:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(3000, () => console.log("🌐 Сервер запущен на порту 3000"));
