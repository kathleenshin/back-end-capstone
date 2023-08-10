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

// {
//     "alias": "momiji-seattle",
//     "name": "Momiji",
//     "image_url": "https://s3-media4.fl.yelpcdn.com/bphoto/rJRpgzdWFFjdCaPt6vKCWQ/o.jpg",
//     "categories"[0]: [
//         {
//             "alias": "japanese",
//             "title": "Japanese"
//         }
//     ],
//     "rating": 4,
//     "price": "$$",
//     "display_address": [
//         "1522 12th Ave",
//         "Seattle, WA 98122"
//         ]
//     },
//     "display_phone": "(206) 457-4068",
//     "distance": 1847.275584435568
// }

const PostRestaurant = mongoose.model('PostRestaurant', restaurantSchema);

export default PostRestaurant;