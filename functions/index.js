const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { getAllPosts, postAPost } = require('./handlers/posts');
const { signup, login } = require('./handlers/users');

//post routes
app.get('/posts', getAllPosts);
app.post('/posts', FBAuth, postAPost);
//users routes
app.post('/signup', signup);
app.post('/login', login);

exports.api = functions.https.onRequest(app);