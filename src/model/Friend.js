var mongoose = require('mongoose');

var FriendSchema = mongoose.Schema({
    sdtNguoiGui:{
        type: String,
        default: 'No Name'
    },
    tenNguoiGui:{
        type: String,
        default: 'No Name'
    },
    avatarNguoiGui: {
        type: String,
        default: 'No Type'
    },
    tenNguoiNhan:{
        type: String,
        default: 'No Name'
    },
    sdtNguoiNhan:{
        type: String,
        default: 'No Name'
    },
    avatarNguoiNhan: {
        type: String,
        default: 'No Type'
    },
    emailNguoiNhan: {
        type: String,
        default: 'No Type'
    },
    ngaysinhNguoiNhan: {
        type: String,
        default: 'No Type'
    },
    gioitinhNguoiNhan: {
        type: String,
        default: 'No Type'
    },
    trangthaixacnhan:{
        type: String,
        default: 'No Name'
    },
    ngayxacnhan:{
        type: String,
        default: 'No Name'
    },
});

module.exports = mongoose.model('friend',FriendSchema, 'friend');