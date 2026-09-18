require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// configurar resposta JSON
app.use(express.json());

// usuario
const User = require('./models/User');

// abrir rota - rota publica
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bem-vindo à API de autenticação!' });
});

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
});


// credenciais
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

mongoose
.connect(`mongodb://${dbUser}:${dbPassword}@ac-u6sgwod-shard-00-00.9k535bm.mongodb.net:27017,ac-u6sgwod-shard-00-01.9k535bm.mongodb.net:27017,ac-u6sgwod-shard-00-02.9k535bm.mongodb.net:27017/?ssl=true&replicaSet=atlas-32umwf-shard-0&authSource=admin&appName=Cluster0`)
.then(() => {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
})
.catch((error) => {
  console.error('Erro ao conectar ao banco de dados:', error);
});