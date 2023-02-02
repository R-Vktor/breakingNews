const express = require("express");
const useRoute = require("./src/routes/user.route")

const app = express();

app.use("/soma", useRoute)

const port = "localhost:3000"
app.listen(3000, () => {
    console.log(`Servidor rodando em ${port}`)
});