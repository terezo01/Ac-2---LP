const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = 3001;

const artigosPath = path.join(__dirname, 'artigos.json');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

let artigosData = fs.readFileSync(artigosPath, 'utf-8');
let artigos = JSON.parse(artigosData);

function salvarDados(){
    fs.writeFileSync(artigosPath, JSON.stringify(artigos, null, 2));
}

app.get('/index', (req, res) =>{
    res.sendFile(path.join(__dirname, '/html/index.html'));
}) 

app.get('/adicionar-artigo', (req, res) =>{
    res.sendFile(path.join(__dirname, '/html/adicionar-artigo.html'));
}) 

app.post('/adicionar-artigo', (req, res) => {
    const novoArtigo = req.body;

    if (artigos.find(artigo => artigo.nomeArtigo.toLowerCase() === novoArtigo.nomeArtigo.toLowerCase())) {
        res.send('<h1> Esse nome de artigo já existe. Não é possivel adicionar duplicatas. </h1>');
        return;
    }

    artigos.push(novoArtigo);

    salvarDados();

    res.send('<h1> Artigo adicionado com sucesso! </h1>');
});

function buscarArtigoPorNome(nome) {

    return artigos.find(artigo => artigo.nomeArtigo.toLowerCase() === nome.toLowerCase());
}

app.get('/buscar-artigo', (req, res) =>{
    res.sendFile(path.join(__dirname, '/html/buscar-artigo.html'));
}) 

app.post('/buscar-artigo', (req, res) => {
    const nomeArtigoBuscado = req.body.nomeArtigo

    const artigoEncontrado = buscarArtigoPorNome(nomeArtigoBuscado);

    if (artigoEncontrado) {
        res.send(`<h1>Artigo encontrado:</h1> <pre>
        ${JSON.stringify(artigoEncontrado, null, 2)}</pre>`);
    } else {
        res.send('<h1>Artigo não encontrado.</h1>');
    }
});

categoriasArtigos = ""

function buscarArtigoPorCategoria(nome) {

    return artigos.forEach(artigo => {
        if(artigo.categoria.toLowerCase() === nome.toLowerCase()){
            categoriasArtigos += `${JSON.stringify(artigoEncontrado, null, 2)} <br>`
        }
    });
}

app.get('/categoria-artigo', (req, res) =>{
    res.sendFile(path.join(__dirname, '/html/categoria-artigo.html'));
}) 

app.post('/categoria-artigo', (req, res) => {
    
    const nomeCategoriaBuscada = req.body.categoria

    buscarArtigoPorCategoria(nomeCategoriaBuscada);

    if (categoriasArtigos !== "") {
        res.send(`<h1>Artigo encontrado:</h1> <pre> ${categoriasArtigos} </pre>`);
    } else {
        res.send('<h1>Artigo não encontrado.</h1>');
    }
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/index`);
});