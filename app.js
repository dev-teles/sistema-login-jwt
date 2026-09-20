require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors'); 

const app = express();

// configurar resposta JSON e CORS
app.use(express.json());
app.use(cors()); 

// usuario
const User = require('./models/User');

// abrir rota - rota publica
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bem-vindo à API de autenticação!' });
});

// rota privada
app.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  //checkagem se o usuário existe
  const user = await User.findById(id, '-password');

  if (!user){
    return res.status(404).json({msg: 'Usuário não encontrado'});
  }

  res.status(200).json({user});
});

// função checkToken
function checkToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({msg: 'Acesso negado!'});
  }
  
  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();
  } catch(error) {
    res.status(400).json({msg: 'Token inválido!'});
  }
}

// registrar usuário
app.post('/auth/register', async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  // validações
  if (!name || !email || !password || !confirmpassword) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
  }

  if (password !== confirmpassword) {
    return res.status(400).json({ message: 'As senhas não coincidem!' });
  }

  // checagem se o usuário existe
  const userExists = await User.findOne({ email: email });
  if (userExists) {
    return res.status(422).json({ message: 'Por favor, utilize outro e-mail!' });
  }

  // criar senha (hash)
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // criar usuário
  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  // Salvar usuario
  try {
    await user.save();
    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: "Ocorreu um erro ao criar o usuário." });
  }
});

// usuario login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // validação
  if(!email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
  }

  // checar se o usuario existe
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(422).json({ message: 'Usuário não encontrado!' });
  }

  // checar se a senha confere
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ message: 'Senha inválida!' });
  }

  try {
    const secret = process.env.SECRET;
    const token = jwt.sign(
      { id: user._id },
      secret
    );
    res.status(200).json({ message: "Autenticação realizada com sucesso", token, name: user.name });
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: "Aconteceu um erro no servidor" });
  }
});

// credenciais
const dbURI = process.env.DB_URI;

if (!dbURI) {
  console.error("ERRO CRÍTICO: A variável DB_URI não foi encontrada no arquivo .env!");
  process.exit(1);
}

mongoose
.connect(dbURI)
.then(() => {
  app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000 e conectado ao Banco de Dados!');
  });
})
.catch((error) => {
  console.error('Erro ao conectar ao banco de dados:', error.message);
});