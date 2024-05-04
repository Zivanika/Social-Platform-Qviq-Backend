const mongoose = require('mongoose');
// const mongoURI = "mongodb+srv://zethyst:akshat2002@cluster0.wdelwkx.mongodb.net/Social";
const mongoURI="mongodb+srv://harshitabarnwal:Harshita@cluster1.sludnrg.mongodb.net/Social";
// const connectToMongo = () => {
//     mongoose.connect(mongoURI, () => {
//         console.log("[+] Connected to MongoDB Successfully");
//     })
// }
const connectToMongo = async () => {
    try {
       await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
     });
        console.log("[+] Connected to MongoDB Successfully");
    }
    catch (error) {
        console.error(error);
    }
}
module.exports = connectToMongo;