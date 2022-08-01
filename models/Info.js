import mongoose from "mongoose"

const InfoSchema = new mongoose.Schema({
    postsLength: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
})

export default mongoose.model('Info', InfoSchema)