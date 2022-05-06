const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const res = require("express/lib/response");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mdpo3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const allInventoryItem = client
      .db("sunriseMotors")
      .collection("inventoryItem");
    // get all data from db
    app.get("/inventory", async (req, res) => {
      const query = req.query;
      const cursor = allInventoryItem.find(query);
      if (query.releaseYear) {
        const result = await cursor.toArray();
        res.send(result);
      } else {
        const result = await cursor.toArray();
        res.send(result);
      }
    });
    // get single item
    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await allInventoryItem.findOne(query);
      res.send(result);
    });
    // delete single item
    app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await allInventoryItem.deleteOne(query);
      res.send(result);
    });
    // upate single data
    app.put("/inventory/:id", async (req, res) => {
      const updateQuantity = req.body;
      const id = req.params.id;
      const options = { upsert: true };
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          quantity: updateQuantity.quantity,
        },
      };
      const result = await allInventoryItem.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    console.log("connect mongo");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/days", (req, res) => {
  res.send("few days later start working");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// If2v3L4FeNcslPAh
