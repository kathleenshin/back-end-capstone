import mongoose from 'mongoose';


const listSchema = mongoose.Schema({
    name: String,
    listId: String
    
})


const PostList = mongoose.model('PostList', listSchema);

export default PostList;