const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// x483NiSHL6LX49i4

// middleware
app.use(cors());
app.use(express.json());

// Connenting MOngoDB
const uri = process.env.URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        const database = client.db("tripNtour");
        const serviceCollection = database.collection("tourService");
        const orderCollection = database.collection("orders");

        //GET Tour Services API
        app.get("/services", async (req, res) => {
            const cursor = await serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // SINGLE USER ORDER API
        app.get("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const query = { email: id };
            const singleTour = await orderCollection.find(query).toArray();
            // console.log('load user with id: ', id);
            res.send(singleTour);
        });

        // lOAD SINLE TOUR PACKAGE WITH ID
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleTour = await serviceCollection.findOne(query);
            // console.log('load user with id: ', id);
            res.send(singleTour);
        });

        // POST Single Service API
        app.post("/services", async (req, res) => {
            const service = req.body;

            const result = await serviceCollection.insertOne(service);
            res.json(result);
        });

        // Add Orders API
        app.post("/orders", async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            console.log(result);
            res.json(result);
        });

        // GET Orders API
        app.get("/orders", async (req, res) => {
            const cursor = await orderCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        });


        //UPDATE API
        // app.put("/ordersData/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const updatedUser = req.body;

        //     const filter = { _id: ObjectId(id) };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: {
        //             Name: updatedUser.Name,
        //             Address: updatedUser.Address,
        //             title: updatedUser.title,
        //             id: updatedUser.id,
        //             _id: updatedUser._id,
        //             price: updatedUser.price,
        //             status: updatedUser.status,
        //         },
        //     };
        //     const result = await serviceCollection.updateOne(
        //         filter,
        //         updateDoc,
        //         options
        //     );
        //     console.log("updating", id);
        //     res.json(result);
        // });

        // DELETE SERVICE API

        app.delete("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);

            console.log("deleting user with id ", result);

            res.json(result);
        });

    }
    finally {

    }
}

run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Trip N Tour is Running");
});


app.listen(port, () => {
    console.log("TnT Server Is Running at port", port);
});