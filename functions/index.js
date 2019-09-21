const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { db } = require('./util/admin');

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
    getAuthenticatedUser,
    getUserDetails,
    markNotificationsRead
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
app.get('/users/:handle', getUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions
    .firestore
    .document('/likes/{id}')
    .onCreate((snapshot) =>{
        db.doc(`/posts/${snapshot.data().postId}`).get()
            .then(doc => {
                if(doc.exists){
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'like',
                        read: false,
                        screamId: doc.id
                    });
                }
            })
            .then(() => {
                return;
            })
            .catch(err => {
                console.error(err);
                return;
            });
    });

exports.deleteNotificationOnUnlike = functions
    .firestore
    .document('likes/{id}')
    .onDelete(snapshot => {
        db
        .doc(`/notifications/${snapshot.id}`)
        .delete()
        .then(() => {
            return;
        })
        .catch(err => {
            console.error(err);
            return;
        })
    })

exports.createNotificationOnComment = functions.firestore.document('comments/{id}')
    .onCreate((snapshot) =>{
        db.doc(`/posts/${snapshot.data().postId}`).get()
            .then(doc => {
                if(doc.exists){
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'comment',
                        read: false,
                        screamId: doc.id
                    });
                }
            })
        .then(() => {
            return;
        })
        .catch(err => {
            console.error(err);
            return;
        });
});
    