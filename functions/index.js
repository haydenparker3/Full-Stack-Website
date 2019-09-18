const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { 
    getAllPosts, 
    postAPost, 
    getPost, 
    commentOnPost, 
    likePost, 
    unlikePost,
    deletePost
} = require('./handlers/posts');
const { 
    signup, 
    login, 
    uploadImage, 
    addUserDetails, 
    getAuthenticatedUser 
} = require('./handlers/users');

//post routes
app.get('/posts', getAllPosts);
app.post('/posts', FBAuth, postAPost);
app.delete('/posts/:postId', FBAuth, deletePost)
app.get('/posts/:postId', getPost);
app.post('/posts/:postId/comment', FBAuth, commentOnPost);
app.get('/posts/:postId/like', FBAuth, likePost);
app.get('/posts/:postId/unlike', FBAuth, unlikePost);
//users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/users/image', FBAuth, uploadImage)
app.post('/users', FBAuth, addUserDetails);
app.get('/users', FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);