import mongoose from 'mongoose';

const restaurantSchema = mongoose.Schema({
    restaurantName: String,
    cuisine: String,
    phoneNumber: String,
    address: String,
    pricePoint: String,
    listId: String,
    restaurantId: String
})


const PostRestaurant = mongoose.model('PostRestaurant', restaurantSchema);

export default PostRestaurant;