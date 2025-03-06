const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// URL do servidor local (IP fixo ou Dynamic DNS)
const LOCAL_SERVER_URL = "http://persan-homeserver.ddns.net:8080";

app.use(express.json());

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
      error: "Máquina não está ligada ou servidor local não está rodando.",
    });
  } else {
    return res
      .status(200)
      .json({ message: "Máquina ligada e servidor local rodando." });
  }

  //   const { script } = req.body;

  // try {
  //     const response = await axios.post(`${LOCAL_SERVER_URL}/executar-script`, { script });
  //     res.json(response.data);
  // } catch (error) {
  //     res.status(500).json({ error: "Erro ao executar script." });
  // }
});

app.listen(PORT, () => {
  console.log(`Servidor online rodando na porta ${PORT}`);
});
