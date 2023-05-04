const express = require('express');
const app = require('./app');

const port = 3333;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Aplicação ativa na porta ${port}`);
});
