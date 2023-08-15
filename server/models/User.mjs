import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
   subId: String,
   name: String,
   givenName: String,
   email: String,
   picture: String
})


const User = mongoose.model('PostUser', userSchema);

export default User;