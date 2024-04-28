const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let movies = [];

// Chargement des données de films depuis movies.json
fs.readFile('movies.json', 'utf8', (err, data) => {
    if (err) {
        console.error('erreur de chargement des films', err);
        return;
    }
    movies = JSON.parse(data);
    console.log('Les films ont été chargés avec succès.');
});

// Route pour récupérer tous les films
app.get('/movies', (req, res) => {
    res.json(movies);
});

// Route pour récupérer un film par son ID
app.get('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const movie = movies.find(movie => movie.id === id);
    if (movie) {
        res.json(movie);
    } else {
        res.status(404).send('Film non trouvé');
    }
});

// Route pour ajouter un nouveau film
app.post('/movies', (req, res) => {
    const newMovie = req.body;
    newMovie.id = generateId(); // Générer un nouvel ID
    movies.push(newMovie);
    res.status(201).json(newMovie);
});

// Route pour supprimer un film par son ID
app.delete('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = movies.findIndex(movie => movie.id === id);
    if (index !== -1) {
        movies.splice(index, 1);
        res.status(200).send('Film supprimé avec succès');
    } else {
        res.status(404).send('Film non trouvé');
    }
});

// Route pour mettre à jour un film par son ID
app.put('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = movies.findIndex(movie => movie.id === id);
    if (index !== -1) {
        movies[index] = req.body;
        movies[index].id = id;
        res.status(200).json(movies[index]);
    } else {
        res.status(404).send('Film non trouvé');
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
