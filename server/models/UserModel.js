const {Schema, model} = require('mongoose')

const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    visibility: {
        type: String,
        enum: ['Friends', 'Others'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    dislikes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
});

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    animalType: {
        type: String,
        required: true,
        enum: ['Dog', 'Cat', 'Fish', 'Bird', 'Reptile', 'Other'],
        default: 'Other',
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    avatar: {
        type: String,
        default: function() {
            switch(this.animalType) {
                case 'dog':
                    return 'dog-avatar.jpg';
                case 'cat':
                    return 'cat-avatar.jpg';
                case 'fish':
                    return 'fish-avatar.jpg';
                case 'bird':
                    return 'bird-avatar.jpg';
                case 'reptile':
                    return 'reptile-avatar.jpg';
                default:
                    return 'default-avatar.jpg';
            }
        }
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    posts: [PostSchema],
})

module.exports = model('User', UserSchema)