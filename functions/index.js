const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);

const app = express();


// Create a new item in the museum: takes a title and a path to an image.
var db = firebase.firestore();
var itemsRef = db.collection('items');

app.post('/api/items', async (req, res) => {
    try {
        let querySnapshot = await itemsRef.get();
        let index = parseInt(querySnapshot.docs.length);
        let numRecords = parseInt(querySnapshot.docs[index-1].id);
        let item = {
            id: numRecords + 1,
            title: req.body.title,
            path: req.body.path
        };
        console.log("item: ", item);
        itemsRef.doc(item.id.toString()).set(item);
        res.send(item);
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
});
exports.app = functions.https.onRequest(app);

// Get a list of all of the items in the museum.
app.get('/api/items', async (req, res) => {
    try{
        let querySnapshot = await itemsRef.get();
        res.send(querySnapshot.docs.map(doc => doc.data()));
    }catch(err){
        res.sendStatus(500);
    }
});

app.delete('/api/items/:id', async(req, res) => {
    console.log(req.params.id);
    try{
        await itemsRef.doc(req.params.id).delete();
        res.send(true);
    } catch(err)
    {
        console.log("Failed to delete");
        console.log(err);
        res.sendStatus(500);
    }
});

app.put('/api/items/:id', async(req, res) => {
    try{
        console.log("got called");
        console.log("params", req.params);
        console.log("req.body: ", req.body);
        itemsRef.doc(req.params.id).update({"title": req.body.item.title})
        res.send(true);
    } catch(err)
    {
        res.sendStatus(500);
    }
});