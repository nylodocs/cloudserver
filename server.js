const express = require("express");
const cors = require('cors');
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// URL do servidor local (IP fixo ou Dynamic DNS)
const LOCAL_SERVER_URL = "http://persan-homeserver.ddns.net:8080";

app.use(express.json());
app.use(cors());

async function verificarMaquinaLigada() {
  try {
    const response = await axios.get(`${LOCAL_SERVER_URL}/status`);
    return response.data.status === "online";
  } catch (error) {
    return false;
  }
}

app.post("/executar", async (req, res) => {
  const maquinaLigada = await verificarMaquinaLigada();

  if (!maquinaLigada) {
    return res.status(400).json({
      error: "Máquina não está ligada ou servidor local não está rodando (nuvem).",
    });
  }

  const { endpoint, token, dados } = req.body; // Recebe os dados do frontend

  if (!endpoint) {
    return res
      .status(400)
      .json({ error: "Endpoint do servidor local não especificado." });
  }

  try {
    const response = await axios.post(
      `${LOCAL_SERVER_URL}/${endpoint}`,
      dados,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Erro ao chamar o servidor local.",
        details: error.message,
      });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor online rodando na porta ${PORT}`);
});
