var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    ho: {
        type: String,
        default: 'No Name'
    },
    ten: {
        type: String,
        default: 'No Name'
    },
    email: {
        type: String,
        default: 'No Type'
    },
    SDT: {
        type: String,
        default: 'No Type'
    },
    ngaysinh: {
        type: String,
        default: 'No Type'
    },
    gioitinh: {
        type: String,
        default: 'No Type'
    },
    matkhau: {
        type: String,
        default: 'No Type'
    },
    avatar: {
        type: String,
        default: 'No Type'
    }

});

module.exports = mongoose.model('user', userSchema, 'user');