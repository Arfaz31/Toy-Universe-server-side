const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nfzb9rp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    const photoCollection = client.db('toyUniverse').collection('photos')
    const addToyCollection = client.db('toyUniverse').collection('addToys')

    app.get('/photos', async(req, res) =>{
        const cursor = photoCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })



    // create add toys
    app.post('/addToys', async(req, res) =>{
        const addToy = req.body;
        console.log(addToy)
        const result = await addToyCollection.insertOne(addToy)
        res.send(result)
    })

    //receive add toys data from mongodb
    app.get('/addToys', async(req, res) =>{
      const cursor = addToyCollection.find()
      const result = await cursor.toArray()
      res.send(result)
  })

  app.get('/addToys/:id', async(req, res) =>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await addToyCollection.findOne(query)
    res.send(result)
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) =>{
    res.send('toy universe is running')
})

app.listen(port, () =>{
    console.log(`toy universe is running on port ${port}`)
})