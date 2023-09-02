const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Username cannot be blank"],
    },

    email: {
      type: String,
      required: [true, "email cannot be blank"],
      unique: true,
      index: true,
      validate: [isEmail, "Inavlid email"],
    },

    password: {
      type: String,
      password: [true, "Password cannot be blank"],
    },
    picture: {
      type: String,
    },
    newMessages: {
      type: Object,
      default: {},
    },

    status: {
      type: String,
      default: "online",
    },
  },
  { minimize: false }
);


userSchema.pre('save' , function(next){

    const user = this;
    if(!user.isModified('password')) return next();


    bcrypt.genSalt(10, function(err,salt){

        if(err) return next(err);

        bcrypt.hash(user.password, salt , function(err, hash){
            if(err) return next(err)

            user.password = hash
            next();
        })
    })
})


userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

userSchema.statics.findByCredentials = async function (email,password){

    const user = await User.findOne({email});
    if(!user) throw new Error("Invalid email or password");

    const ismatch = await bcrypt.compare(password,user.password);

    if(!ismatch) throw new Error("Invalid email or password");
    return user;
}

const User = mongoose.model("User", userSchema);

module.exports = User;
