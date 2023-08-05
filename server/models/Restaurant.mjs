import mongoose from 'mongoose';

const restaurantSchema = mongoose.Schema({
    name: String,
    cuisine: String,
    phoneNumber: String,
    address: String,
    pricePoint: String
})


export default mongoose.model('Restaurant', restaurantSchema);