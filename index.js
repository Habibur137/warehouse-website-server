const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "unathorized" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "fobiden" });
    }
    req.decoded = decoded;
    console.log("decoded", decoded);
  });
  next();
};

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
    // auth
    app.post("/login", async (req, res) => {
      const email = req.body;
      const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN, {
        expiresIn: "1d",
      });
      res.send({ accessToken });
    });
    app.get("/inventorys", verifyJWT, async (req, res) => {
      const query = req.query;
      const decodedEmail = req.decoded.email;
      console.log(query);
      if (query.email === decodedEmail) {
        const cursor = allInventoryItem.find(query);
        const result = await cursor.toArray();
        res.send(result);
      } else {
        res.status(401).send({ message: "fobiden access" });
      }
    });
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
    // post single data
    app.post("/inventory", async (req, res) => {
      const item = req.body;
      const result = await allInventoryItem.insertOne(item);
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
