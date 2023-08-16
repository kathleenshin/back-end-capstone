import mongoose from 'mongoose';


const favoritesSchema = mongoose.Schema({
    name: {
        type: String,
        default: "Favorites"
    },
    listId: String,
    //userId: String
    
})


const PostFavoritesList = mongoose.model('PostFavoritesList', favoritesSchema);

export default PostFavoritesList;