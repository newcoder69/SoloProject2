import mongoose, { SchemaTypes } from 'mongoose';
const{Schema, model} = mongoose;

const blogPostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: false
    },
    likes: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        default: () => Date.now,
        immutable: true
    },

    url:{
        type: String,
        required: false,
    },

    author: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
    },

    comments:[{
        user:{
            type: SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        content: String,
        likes: Number,
    }]
    



});

const blogModel = new model('blogModel', blogPostSchema);

export default blogModel;