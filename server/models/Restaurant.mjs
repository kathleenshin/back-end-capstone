import mongoose from 'mongoose';

const restaurantSchema = mongoose.Schema({
    name: String,
    cuisine: String,
    phoneNumber: String,
    address: String,
    pricePoint: String
})


const PostRestaurant = mongoose.model('PostRestaurant', restaurantSchema);

export default PostRestaurant;