const jwt = require("jsonwebtoken");
const fs = require('fs');

//! A middleware function runs in the middle and checks/validates the incoming data and runs before the actual function and uses next() to move to the main logic function
const fetchuser = (req, res, next) => {
    //?Get the user from JWT Token and add ID to req obj
    const token = req.header("Auth-Token"); //Getting the value of Auth-Token header
    if (!token) {//Agar token hai hi nhi
        return res.status(404).json({ error: "Token Not Found" });
    }
    try {//agar hai toh verify karao using jwt
        // const publicKey = fs.readFileSync('public.pem', 'utf-8');
        const publicKey="valardohaeris";
        const data = jwt.verify(token, publicKey);
        // console.log(data); //Basically contains the payload data or id used to generate token
        req.user = data.user; //payload_data->user->id       { user: { id: '653bc5a61b052a97060e8af2' }, iat: 1698418473 }
        next();
    } catch (error) {
        return res.status(401).json({ error: "Please authenticate using valid token" });
    }
}

module.exports = fetchuser;