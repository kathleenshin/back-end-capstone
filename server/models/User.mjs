import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
   subId: String,
})


const User = mongoose.model('PostUser', userSchema);

export default User;