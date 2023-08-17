import mongoose from 'mongoose';


const categorySchema = mongoose.Schema({
    alias: String,
    title: String
});

const displayAddressSchema = mongoose.Schema({
    0: String,
    1: String
})

const restaurantSchema = mongoose.Schema({
    yelpId: String,
    name: String,
    categories: [categorySchema],
    display_phone: String,
    // address1: String,
    // address2: String,
    // address3: String,
    // city: String,
    // country: String,
    // display_address: String,
    // state: String,
    // zip_code: String,
    distance: Number,
    coordinates: {
        latitude: Number,
        longitude: Number,
    },
    location: {
        address1: String,
        address2: String,
        address3: String,
        city: String,
        country: String,
        display_address: [displayAddressSchema],
        state: String,
        zip_code: String,
    },
    price: String,
    listId: String,
    restaurantId: String,
    phone: String,
    rating: Number,
    transactions: [String],
    url: String,
    image_url: String,
})


const PostRestaurant = mongoose.model('PostRestaurant', restaurantSchema);

export default PostRestaurant;