// Carregando as dependências necessárias
const cors = require("cors");
const express = require("express");

// Carregando as variáveis de ambiente do arquivo .env
require("dotenv").config();

// Criando uma instância do express
const app = express();


// Middleware é uma função que tem acesso ao objeto de requisição (req), ao objeto de resposta (res) e à próxima função middleware na pilha de middlewares do Express.
// O middleware pode executar qualquer código, fazer alterações na requisição e na resposta, encerrar a requisição ou chamar a próxima função middleware na pilha.

// next() é uma função que passa o controle para o próximo middleware na pilha de middlewares do Express (passa a requisição para a proxima função ou linha).

//  Habilitando interpretação de corpo de requisições como JSON.
app.use(express.json());
// Habilitando interpretação de corpo de requisições como URL-encoded.
app.use(express.urlencoded({ extended: true }));

// Configurando o CORS
class CORS {
  // Construtor da classe CORS
  constructor(
    allowedOrigins = ["http://localhost:5173"],
    allowedMethods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders = ["Content-Type", "Authorization", "X-Requested-With"]
  ) {
    this.allowedOrigins = allowedOrigins;
    this.allowedMethods = allowedMethods;
    this.allowedHeaders = allowedHeaders;
  }

  // Método para configurar o CORS
  configure() {
    // Middleware para lidar com CORS
    return (req, res, next) => {
      // Verifica se o cabeçalho Origin está presente na requisição
      const origin = req.get("Origin");

      // Se o cabeçalho Origin estiver presente, verifica se ele está na lista de origens permitidas
      if (this.allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
      } else {
        // Se a origem não estiver na lista de permitidas, retorna um erro 403
        res.status(403).send("Origem não permitida.");
        return;
      }

      // Configura os cabeçalhos de resposta para CORS
      res.setHeader(
        "Access-Control-Allow-Methods",
        this.allowedMethods.join(", ")
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        this.allowedHeaders.join(", ")
      );

      // Configurando preflight requests (Requisição feita antes da requisição principal)
      if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Origin", req.get("Origin"));
        res.setHeader(
          "Access-Control-Allow-Methods",
          this.allowedMethods.join(", ")
        );
        res.setHeader(
          "Access-Control-Allow-Headers",
          this.allowedHeaders.join(", ")
        );
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.status(204).send();
      } else {
        // Se não for uma requisição preflight, continua com o processamento normal
        next();
      }
    };
  }
}

// Instanciando a classe CORS e aplicando o middleware ao aplicativo Express
const cors = new CORS();
app.use(cors.configure());

// Importando as rotas
const routes = require("./routes");

// Passando o middleware de rotas para o aplicativo Express
app.use("/api", routes);

// Configurando o servidor para escutar em uma porta específica
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
