const express = require('express');

const server = express();

server.use(express.json());

//Variável de projetos
const projects = [];

//verifica a existência do id do projeto. Esta checagem não é para post
function checkProjectExists(req, res, next){
    const { id } = req.params;

    const project = projects.find(p => p.id == id);

    if (!project) {
        return res.status(400).json({ error: 'Projeto não encontrado. '});
    }

    return next();
}

//verifica a existência do id do projeto. Esta checagem é para o post
function checkProjectExiststoPost(req, res, next){
    const { id } = req.params;

    const project = projects.find(p => p.id == id);

    if (project) {
        return res.status(400).json({ error: 'Projeto encontrado. '});
    }

    return next();
}

server.use((req, res, next) => {
    console.log(`Método: ${req.method}; URL: ${req.url}`);

    next();
});

server.post('/projects', checkProjectExiststoPost, (req, res) => {
    const { id, title } = req.body;

    const project = {
        id,
        title,
        tasks: []
    };

    projects.push(project);

    return res.json(project);
});

server.get('/projects', (req, res) => {
    return res.json(projects);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;

    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.title = title;

    return res.json(project);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;

    const projectIndex = projects.findIndex(p => p.id == id);

    projects.splice(projectIndex, 1);

    return res.send();
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
    const { id } = req.params;

    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.tasks.push(title);

    return res.json(project);
});

server.listen(3000);