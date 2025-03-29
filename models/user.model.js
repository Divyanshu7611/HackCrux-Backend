const { firestore } = require('firebase-admin')
const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    firebaseId:{
        type: String,
        required: true,
        unique: true
    },
    tasks: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Task',
        default: []
    }
})

module.exports = mongoose.model('User', userSchema)