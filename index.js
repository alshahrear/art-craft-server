const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = "mongodb://localhost:27017";

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
    await client.connect();

    const craftCollection = client.db('craftDB').collection('craft');

    app.get('/craft', async(req, res) => {
        const cursor = craftCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/craft/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await craftCollection.findOne(query);
      res.send(result);
    })

    app.post('/craft', async(req, res) => {
        const addCraft = req.body;
        console.log(addCraft);
        const result = await craftCollection.insertOne(addCraft);
        res.send(result);
    })

    app.delete('/craft/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await craftCollection.deleteOne(query);
      res.send(result);
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



app.get('/', (req, res) => {
    res.send('Art craft server is running')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })