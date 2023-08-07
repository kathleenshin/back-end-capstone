import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String
})


const PostUser = mongoose.model('PostUser', userSchema);

export default PostUser;