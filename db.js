const mongoose=require("mongoose");
// define the mongodb connection url
const mongoURL = "mongodb://localhost:27017/hotels";
//const mongoURL="mongodb+srv://singh123aparnasa:<QWERTY12345>@cluster0.4epnihq.mongodb.net/"
mongoose.connect(mongoURL,
    {
        useNewUrlParser: true

    }
)
const db=mongoose.connection;
db.on("connected", ()=>{
    console.log("Connected to mongodb server.")
})
db.on("error", (err)=>{
    console.log("Mongodb connection error.",err)
})
db.on("disconnected", ()=>{
    console.log("Disconnected")
})
module.exports=db;