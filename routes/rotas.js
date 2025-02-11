const routes = require('express').Router();
const PDFDocument = require('pdfkit');
const laboratorio = require('../models/laboratorio');
const auth = require('../middleware/AuthToken');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const userModel = require('../models/user');
const user = require('../models/user');

const db_connect = 'mongodb+srv://pedrohenrique234322:pedrohenrique234322@cluster0.a3g2d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

routes.get("/", (req, res) => {
    res.json({
        message: "Bem-vindo à API de Gerenciamento de Laboratórios",
        rotas: {
            "/logar": "POST - Autenticação de usuário",
            "/caduser": "POST - Cadastro de novo usuário",
            "/laboratorio/novo": "POST - Cadastro de novo laboratório (requer autenticação)",
            "/laboratorio/relatorio": "GET - Gera um relatório em PDF com a lista de laboratórios"
        }
    });
});

routes.post("/logar", async function(req, res){
    let email = req.body.email;
    let senha = req.body.senha;
    try{
        await mongoose.connect('mongodb+srv://pedrohenrique234322:pedrohenrique234322@cluster0.a3g2d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        await user.findOne({$and:[{email: email, senha: senha}]}).then(function(user){
            console.log(user)
            if(email === user.email && senha === user.senha){
                let novoToken = jwt.sign({email}, "sdsdjshkgbvgz", {expiresIn: 9000})
                res.json({logado: true, token: novoToken})
            }else{
                res.json({logado: false, mensagem: "Dados incorretos"})
            }
        });
        
    }catch(err){
        console.log(err)
        res.json({logado: false, mensagem:err})
    }

})

routes.post("/caduser", async function(req, res){
    let email = req.body.email;
    let senha = req.body.senha;

    try{
        await mongoose.connect(db_connect)
        await user.create({email: email, senha: senha});
        res.json({message: "usuario cadastrado"})
    }catch(err){
        res.json({message: err})
    }
})

routes.post('/laboratorio/novo', auth, async function(req, res){
    try{
        let nome = req.body.nome;
        let desc = req.body.desc;
        let capacidade = req.body.capacidade;
        let foto = req.body.foto;

        await mongoose.connect('mongodb+srv://pedrohenrique234322:pedrohenrique234322@cluster0.a3g2d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        await laboratorio.create({nome:nome, desc: desc, capacidade: capacidade, foto: foto});
        res.json({mensagem:"Lab cadastrado com sucesso"});

    }catch(err){
        console.log(err)
        res.json({err: err});
    }
});

routes.get("/laboratorio/relatorio", async function(req, res) {
    try {
        await mongoose.connect(db_connect);
        const labs = await laboratorio.find();
        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="relatorio.pdf"');

    
        labs.forEach(lab => {
            doc.text(`Nome: ${lab.nome}`);
            doc.text(`Descrição: ${lab.desc}`);
            doc.text(`Capacidade: ${lab.capacidade}`);

            if (lab.foto) {
                try {
                    doc.image(lab.foto, { width: 150 }); 
                } catch (error) {
                    console.error(`Erro ao carregar imagem do laboratório "${lab.nome}": ${error.message}`);
                    doc.text('Imagem não disponível'); 
                }
            } else {
                doc.text('Imagem não disponível'); 
            }
            doc.text("\n");
        });

        doc.pipe(res);
        doc.end();
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao gerar relatório.");
    }
});


module.exports = routes;