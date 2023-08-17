import mongoose from 'mongoose';

const restaurantSchema = mongoose.Schema({
    yelpId: String,
    name: String,
    categories: String,
    display_phone: String,
    address1: String,
    address2: String,
    address3: String,
    city: String,
    country: String,
    display_address: String,
    state: String,
    zip_code: String,
    price: String,
    listId: String,
    restaurantId: String
})


const PostRestaurant = mongoose.model('PostRestaurant', restaurantSchema);

export default PostRestaurant;