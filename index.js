const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 6001;
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
require('dotenv').config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// middleware
app.use(cors());
app.use(express.json());
const corsOptions = {
  origin: 'https://restaurant-order-system-d8gbrnrs5-ritik7970s-projects.vercel.app/',  // Your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
// mongoose
//   .connect(
//     //`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@domo-foodi-client.eqs1v9d.mongodb.net/demo-foodi-client?retryWrites=true&w=majority`
//     `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@demo-foodi-cluster.tpp3vtu.mongodb.net/?retryWrites=true&w=majority&appName=demo-foodi-cluster`
//   )   
//   .then(
//     console.log("MongoDB Connected Successfully!")
//   )
//   .catch((error) => console.log("Error connecting to MongoDB", error));

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const client = "mongodb+srv://Ritikraj:rrks2527@demo-foodi-cluster.tpp3vtu.mongodb.net/?retryWrites=true&w=majority&appName=demo-foodi-cluster";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://Ritikraj:rrks2527@demo-foodi-cluster.tpp3vtu.mongodb.net/?retryWrites=true&w=majority&appName=demo-foodi-cluster";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     //const menuCollections=client.db("demo-foodi-client").collection("menus");
//     //const cartCollections=client.db("demo-foodi-client").collection("cartItems")
//     app.get('/menu',async(req,res)=>{
//       const result=await menuCollections.find().toArray();
//       res.send(result)
//     })
// //     //mai add kiya
// //     app.post('/carts',async(req,res)=>{
// //       const cartItems=req.body;
// //       const result=await cartCollections.insertOne(cartItem);
// //       res.send(result)
// //     })
//      await client.db("admin").command({ ping: 1 });
//      console.log("Pinged your deployment. You successfully connected to MongoDB!");
//      } finally {
// //     // Ensures that the client will close when you finish/error
//     //await client.close(); ye jabardasti hain
//   }
//  }
// run().catch(console.dir);

// mongodb configuration using mongoose

//`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@domo-foodi-client.eqs1v9d.mongodb.net/demo-foodi-client?retryWrites=true&w=majority`
 mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@demo-foodi-cluster.tpp3vtu.mongodb.net/?retryWrites=true&w=majority&appName=demo-foodi-cluster`
  )
  .then(
    console.log("MongoDB Connected Successfully!")
  )
  .catch((error) => console.log("Error connecting to MongoDB", error));

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://rrks2527:Soni@12345@foodi-database.3yekk22.mongodb.net/?retryWrites=true&w=majority&appName=foodi-database";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);


  // jwt authentication
  app.post('/jwt', async(req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1hr'
    })
    res.send({token});
  })

//baad me jarurat hain iska
  //import routes here
const menuRoutes = require('./api/routes/menuRoutes');
const cartRoutes = require('./api/routes/cartRoutes');
const userRoutes = require('./api/routes/userRoutes')
const paymentRoutes=require('./api/routes/paymentRoutes')
app.use('/menu', menuRoutes)
app.use('/carts', cartRoutes);
app.use('/users', userRoutes);
app.use('/payments',paymentRoutes)
//stripe payment routes
app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  const amount=price*100;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    
    payment_method_types: ["card"
    ],
   
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});



app.get("/", (req, res) => {
  res.send("Hello Foodi Client Server!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
