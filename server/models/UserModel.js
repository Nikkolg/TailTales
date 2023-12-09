const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
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
        enum: ['dog', 'cat', 'fish', 'bird', 'reptile', 'other'],
        default: 'other',
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
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
    }
})

module.exports = model('User', UserSchema)