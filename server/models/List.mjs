import mongoose from 'mongoose';

const listSchema = mongoose.Schema({
    listId: String,
    name: String
})


const PostList = mongoose.model('PostList', listSchema);

export default PostList;