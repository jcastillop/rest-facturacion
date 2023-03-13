const mongoose = require('mongoose');
//import mongoose from 'mongoose'

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CN)
        console.log("Base de datos ONLINE")
    } catch (error) {
        throw new Error("Error al conectarse BD");
        
    }
}

export default dbConnection;