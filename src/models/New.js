import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    text: {
        type: String,
        require: true,
    },
    banner: {
        type: String,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(), // no campo 'createdAt' colocaremos a data em que esse dado foi inserido no banco
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    like: {
        type: Array,
        require: true,
    },
    comments: {
        type: Array,
        require: true,
    },

});

const News = mongoose.model("News", NewsSchema);

export default News;