require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bem-vindo à API de autenticação!' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});