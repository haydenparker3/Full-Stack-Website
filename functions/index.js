const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
admin.initializeApp();

const firebaseConfig = {
    apiKey: "AIzaSyCZPkDPyS515jqVRQT3kfXklbI6jVSwrjU",
    authDomain: "social-media-app-520ee.firebaseapp.com",
    databaseURL: "https://social-media-app-520ee.firebaseio.com",
    projectId: "social-media-app-520ee",
    storageBucket: "social-media-app-520ee.appspot.com",
    messagingSenderId: "326771546571",
    appId: "1:326771546571:web:20a65b5bdf4e272d2b7e4e"
  };

const firebase = require ('firebase');
firebase.initializeApp(firebaseConfig)

const db = admin.firestore();

app.get('/posts', (req, res) => {
    db
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .get()
        .then((data) => {
            let posts = [];
            data.forEach((doc) => {
                posts.push({
                    postID: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt:  doc.data().createdAt
                });
            });
            return res.json(posts);
        })
        .catch((err) => console.error(err));
});

app.post('/posts', (req, res) => {
    const newPost = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };

    db
        .collection('posts')
        .add(newPost)
        .then((doc) => {
            res.json({ message: `document ${doc.id} created successfully`});
        })
        .catch((err) => {
            res.status(500).json({ error: 'something went wrong'});
            console.error(err);
        });
});

app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if(doc.exists){
                return res.status(400).json({ handle: 'this handle is already taken'})
            }
            else{
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        })
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.status(201).json({ token });
        })
        .catch(err =>  {
            console.error(err);
            if(err.code === 'auth/email-already-in-use'){
                return res.status(400).json({ email: 'Email is already in use'});
            }
            else{
                return res.status(500).json({ error: err.code});
            }
        });
});

exports.api = functions.https.onRequest(app);