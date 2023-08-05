import mongoose from 'mongoose';

const listSchema = mongoose.Schema({
    listId: String,
    name: String
})


export default mongoose.model('List', listSchema);