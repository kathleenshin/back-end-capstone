import mongoose from 'mongoose';


const categorySchema = mongoose.Schema({
    alias: String,
    title: String
});

// const displayAddressSchema = mongoose.Schema({
//     0: String,
//     1: String
// })
// 
// const displayAddressSchema = mongoose.Schema({
//     address1: String,
//     address2: String,
//     address3: String,
//     city: String,
//     country: String,
//     state: String,
//     zip_code: String
// });

const restaurantSchema = mongoose.Schema({
    // yelpId: String,
    id: String,
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
    // location: {
    //     address1: String,
    //     address2: String,
    //     address3: String,
    //     city: String,
    //     country: String,
    //     display_address: [String],
    //     state: String,
    //     zip_code: String,
    // },
    location: {
        address1: {
            type: String,
            required: true
        },
        address2: String,
        address3: String,
        city: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zip_code: {
            type: String,
            required: true
        },
        display_address: [{
            type: String,
            required: true
        }]
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