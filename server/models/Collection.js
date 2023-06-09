import { Schema, model } from "mongoose";
const schemaCollection = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        brand: {
            type: String,
            required: false
        },
        series: {
            type: String,
            required: false
        },
        model: {
            type: String,
            required: false
        },
        produced: {
            type: String,
            required: false
        },
        color: {
            type: String,
            required: false
        },
        price: {
            type: Number,
            required: true
        },
        likecount: {
            type: Number,
            required: false
        },
        slug: {
            type: String,
            required: true,
            unique: true
        },
        detail: {
            type: Object,
            required: true
        },
        photo: {
            type: String,
            required: false
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        tags: {
            type: [String]
        },

        categories: [
            String
        ],
    }, { timestamps: true, toJSON: { virtuals: true } }

);


const Collection = model("Collection", schemaCollection);
export default Collection;