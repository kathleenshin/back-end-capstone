import mongoose from 'mongoose';


const listSchema = mongoose.Schema({
    name: String,
    listId: String,
    //userId: String
    // restaurants: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'PostRestaurant'
    // }]
    
})


const PostList = mongoose.model('PostList', listSchema);

export default PostList;