const express = require("express");
const app = express();

class CORS {
  constructor(
    allowedOrigins = ["http://localhost:5173"],
    allowedMethods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders = ["Content-Type", "Authorization", "X-Requested-With"]
  ) {
    this.allowedOrigins = allowedOrigins;
    this.allowedMethods = allowedMethods;
    this.allowedHeaders = allowedHeaders;
  }

  configure() {
    return (req, res, next) => {
      const origin = req.get("Origin");

      if (this.allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
      } else {
        res.status(403).send("Origem não permitida.");
        return;
      }

      res.setHeader(
        "Access-Control-Allow-Methods",
        this.allowedMethods.join(", ")
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        this.allowedHeaders.join(", ")
      );

      if (req.method === "OPTIONS") {
        res.setHeader('Access-Control-Allow-Origin', req.get('Origin'));
        res.setHeader('Access-Control-Allow-Methods', this.allowedMethods.join(', '));
        res.setHeader('Access-Control-Allow-Headers', this.allowedHeaders.join(', '));
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.status(204).send();
      } else {
        next();
      }
    };
  }
}

const cors = new CORS();
app.use(cors.configure());

app.get("/", (req, res) => {
  res.send("opa! Tudo certo por aqui!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
