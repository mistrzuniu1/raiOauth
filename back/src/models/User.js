const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 3
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    stops: [{
        type: String,
        unique: true
    }]
});



userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
});

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id}, "SECRET_JWT");
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token
};

userSchema.statics.loadByEmailPassword = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error({error: 'Invalid login credentials'})
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error({error: 'Invalid login credentials'})
    }
    return user
};

userSchema.statics.loadByEmail = async (email) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error({error: 'Invalid login credentials'})
    }
    return user
};


const User = mongoose.model('User', userSchema);

module.exports = User;