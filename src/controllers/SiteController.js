var express = require('express');
const session = require('express-session');
var router = express.Router();
var user = require('../model/User');
var friend = require('../model/Friend');
require('dotenv').config()

const avatarController = require('./avata.controller')
    /**
     * Gửi mail
     */
var formidable = require('formidable');
var nodemailer = require('nodemailer');
/**
     * Chuyển đổi model
 */
var styleDisplay;
/**
     * FindUser
     */
var findUser;
/**
 * Đăng nhập
 */

router.get('/', (req, res) => {
    const message = { 'MessageError': String, 'TrangThai': String };
    var mess = Object.create(message);
    mess.MessageError = "Ban Nhap Sai SDT hoac pass";
    mess.TrangThai = "hidden";
    res.render('Dangnhap.ejs', { mess: mess });
});



/**
 * Trang Login
 *  */
router.get('/login', (req, res) => {
    const message = { 'MessageError': String, 'TrangThai': String };
    var mess = Object.create(message);
    mess.MessageError = "Ban Nhap Sai SDT hoac pass";
    mess.TrangThai = "hidden";
    res.render('DangNhap', { mess: mess });
});

/**
 * Thuc Hien Login
 *  */
router.post('/login', (req, res) => {

    user.findOne({ email: req.body.email }, function(err, myuser) {
        if (err) throw err;
        var verifypass = req.body.matkhau;
        const message = { 'MessageError': String, 'TrangThai': String };
        var mess = Object.create(message);
        mess.MessageError = "Bạn nhap sai mật khẩu hoặc tên";
        mess.TrangThai = "";
        if (myuser != null) {
            if (myuser.matkhau === verifypass) {
                if (myuser.email == "admin@gmail.com" || myuser.SDT == "0000") {
                    user.find({})
                        .then(users => {
                            res.render('danhsachnguoidung.ejs', { users: users })
                        })
                        .catch(err => {
                            console.log('Error: ', err);
                            throw err;
                        })
                } else {
                    findUser = new user({
                        ho: " ",
                        ten: " ",
                        email: " ",
                        SDT: " ",
                        ngaysinh: " ",
                        gioitinh: " ",
                        matkhau: " "
                    });
                    styleDisplay = { styleDisplay1: "none", styleDisplay2: "none" };
                            req.session.user = {
                                sdt: myuser.SDT,
                                styleDisplay1: "none",
                                styleDisplay2: "none"
                            }
                            res.redirect('/danhba');
                }
            } else {
                res.render('Dangnhap.ejs', { mess: mess });
            }
        } else {
            res.render('Dangnhap.ejs', { mess: mess });
        }
    })
});



/**
 * 
 * 
 * Home page: loading all User
 */
router.get('/danhsachnguoidung', (req, res) => {
    user.find({})
        .then(users => {
            res.render('danhsachnguoidung.ejs', { users: users })
        })
        .catch(err => {
            console.log('Error: ', err);
            throw err;
        })
});
/**
 * Đi đến trang đăng kí thông tin user
 */
router.get('/create-user', (req, res) => {
    res.render('dangki');
});


/**
 *  Gửi mãi otp qua mail được đăng kí
 */
var mail_nhan = null;
router.post('/guimail', (req, res) => {
    mail_nhan = req.body.email;
    Sent_otp_Mail(mail_nhan);
    const message = { 'MessageError': String, 'TrangThai': String };
    var mess = Object.create(message);
    mess.MessageError = "Sai mã otp";
    mess.TrangThai = "hidden";
    res.render('otp.ejs', { mess: mess });
});

/*
    Xác nhận mã otp nhập vào và mã otp đã gửi đi có giống nhau
*/
router.post('/acceptOTP', (req, res) => {
    var otp_nhan = req.body.otp;
    console.log(otpgui)
    console.log(otp_nhan)
    if (req.body.MaOTP == "XacNhan") {
        if (otp_nhan == otpgui) {
            res.render('thongtindangki.ejs', { mail: mail_nhan });
        } else {
            const message = { 'MessageError': String, 'TrangThai': String };
            var mess = Object.create(message);
            mess.MessageError = "Sai mã otp";
            mess.TrangThai = "";
            res.render('otp.ejs', { mess: mess });
        }
    } else {
        res.render('dangki');
    }
    /**
     * Chuyển qua sác nhận otp
     */
});

/**
 * Hiện trang admin sau đăng nhập, hiện danh sách người dùng được lưu trong hệ thống
 */
router.get('/danhsachnguoidung', (req, res) => {
    user.find({})
        .then(users => {
            res.render('danhsachnguoidung.ejs', { users: users })
        })
        .catch(err => {
            console.log('Error: ', err);
            throw err;
        })
});

/**
 * 
 * Random ra mã otp
 */
function between(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}
/**
 * 
 * otp dùng để gửi qua mail
 */
var otpgui = between(800, 900);

/**
 * 
 * Tạo mail gửi mã otp đi
 */
function Sent_otp_Mail(mail_nhan) {
    console.log(mail_nhan);
    var form = new formidable.IncomingForm();
    // mail server để gửi đi
    const option = {
        service: 'gmail',
        auth: {
            user: 'otp.tumblrz@gmail.com',
            pass: '12345678hihi'
        }
    };
    var transporter = nodemailer.createTransport(option);
    transporter.verify(function(error, success) {
        // Nếu có lỗi.
        if (error) {
            console.log(error);
        } else { //Nếu thành công.
            console.log('Kết nối thành công!');
            var mail = {
                from: 'hungffun.2@gmail.com', // Địa chỉ email của người gửi
                to: mail_nhan, // Địa chỉ email của người nhận
                subject: 'Thư được gửi bằng Sever Tumlrz', // Tiêu đề mail
                // text: 'Xác nhận địa chỉ email của bạn',
                html: " <h3>Xác nhận địa chỉ email của bạn</h3> </br> <p>Trước khi tạo tài khoản Tumblrz, bạn còn cần hoàn thành một bước nhỏ nữa. Hãy chắc chắn rằng đây là địa chỉ email chính xác của bạn  </p> </br> <p> — vui lòng xác nhận đây là địa chỉ chính xác để sử dụng cho tài khoản mới của bạn.</p> </br> <p>Vui lòng nhập mã xác nhận này để bắt đầu trên Tumblrz: </p> </br> <p> " + otpgui + "</p> </br> <p>Mã xác nhận hết hạn sau hai giờ.</p>  </br> <p>Xin cảm ơn</p>  </br> <p>Tumblrz</p>"
            };
            //Tiến hành gửi email
            transporter.sendMail(mail, function(error, info) {
                if (error) { // nếu có lỗi
                    console.log(error);
                } else { //nếu thành công
                    console.log('Email sent: ' + info.response);
                    // gọi sang giao diện otp
                    res.writeHead('200', { 'Content-Type': 'text/html' });
                    fs.readFile('otp', 'utf8', function(err, data) {
                        //nếu nỗi thì thông báo
                        if (err) throw err;
                        //không lỗi thì render data
                        res.end(data);
                    })
                }
            });
        }
    });
}

/**
 * Gọi đến trang nhập thông tin user
 */
router.get('/add-User', (req, res) => {
    res.render('themuser.ejs');
});

/**
 * Thêm user và lưu xuống data
 */

router.post('/themuser', async(req, res) => {
    // Lấy hình từ giao diện
    let files = req.files;
    let avatar = await files.avatarNew;
    // Thêm vào s3, lấy linh hình lưu vào avatar
    const uploadS3 = await avatarController.uploadAvatar(avatar);

    let newUser = new user({
        ho: req.body.ho,
        ten: req.body.ten,
        email: req.body.email,
        SDT: req.body.SDT,
        ngaysinh: req.body.ngaysinh,
        gioitinh: req.body.gioitinh,
        matkhau: req.body.matkhau,
        avatar: uploadS3
    });

    newUser.save()
        .then(doc => {
            res.redirect('/danhsachnguoidung')
        })
        .catch(err => {
            console.log('Error: ', err);
            throw err;
        })
});
/**
 * Gọi đến trang cập nhật user
 */
router.get('/updateUser/:id', (req, res) => {
    user.findById(req.params.id, (err, user) => {
        if (err) {
            console.log(err);
            throw err
        }
        res.render('updateUser.ejs', { user: user });
    })
});

/**
 * Xóa user 
 */
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    user.findByIdAndDelete(id, (err, doc) => {
        if (err) throw err;
        res.send(doc)
    })
});

/**
 * Nhận thông tin update, lưu lại vào data
 */
router.post('/updateUser/:id', async(req, res) => {
    let id = req.params.id;
    let files = req.files;
    let avatar = await files.avatarNew;
    const uploadS3 = await avatarController.uploadAvatar(avatar);
    user.findByIdAndUpdate({ _id: id }, {
            $set: {
                ho: req.body.ho,
                ten: req.body.ten,
                email: req.body.email,
                SDT: req.body.SDT,
                ngaysinh: req.body.ngaysinh,
                gioitinh: req.body.gioitinh,
                matkhau: req.body.matkhau,
                avatar: uploadS3
            }
        }, { useFindAndModify: false })
        .then(doc => {
            res.redirect('/danhsachnguoidung')
        })
});


/**
 * Trang danh ba
 *  */
router.get('/danhba', (req, res) => {
    var nguoidung = req.session.user.sdt;
    friend.find({ sdtNguoiGui: nguoidung }).then(listfriends => {
        friend.find({ sdtNguoiNhan: nguoidung }).then(listrequest => {
            user.findOne({ SDT: nguoidung }).then(myuser => {
                var useradd = { listfriends, findUser, styleDisplay, myuser, listrequest }
                res.render('danhba.ejs', { useradd: useradd });
            })
        })
    })
});
/**
 * Tim Kiem ban
 *  */
router.post('/timkiemban', (req, res) => {
    var nguoidung = req.session.user.sdt;
    if(nguoidung != req.body.sdtadd){
        user.findOne({ SDT: req.body.sdtadd }).then(findFriend => { 
            if (findUser == [] || findUser == null) {
                res.send("user khong ton tai");
            }
            else {
                findUser = findFriend;
                friend.findOne({ $and: [{ sdtNguoiGui: nguoidung }, { sdtNguoiNhan: req.body.sdtadd }] }).then (myfriend=>{
                    if(myfriend == [] || myfriend == null)
                    {
                        styleDisplay = { styleDisplay1: "block", styleDisplay2: "none" };
                        res.redirect('/danhba');
                    }
                    else{
                        styleDisplay = { styleDisplay1: "none", styleDisplay2: "block" };
                        res.redirect('/danhba');
                    }
                })
            }
            
        });
    }
    else{
        res.send("Thong tin ban than");
    }
});
/**
 * Gui Yeu Cau kết bạn
 *  */
router.post('/ketban', (req, res) => {
    var nguoidung = req.session.user.sdt;
    findUser = new user({
        ho: " ",
        ten: " ",
        email: " ",
        SDT: " ",
        ngaysinh: " ",
        gioitinh: " ",
        matkhau: " "
    });
    styleDisplay = { styleDisplay1: "none", styleDisplay2: "none" };
    user.findOne({ SDT: nguoidung }).then(myuser => {
        friend.findOne({$or:[{$and: [{ sdtNguoiGui:req.body.sdtuser}, { sdtNguoiNhan: nguoidung }]},
            { $and: [{ sdtNguoiGui:nguoidung}, { sdtNguoiNhan: req.body.sdtuser }]}]}).then (myfriend=>{
        if(myfriend == [] || myfriend == null){
            user.findOne({ SDT: req.body.sdtuser }).then(usersend => {
                var newfiend = new friend({
                    sdtNguoiGui: nguoidung,
                    tenNguoiGui: myuser.ho + " " + myuser.ten,
                    avatarNguoiGui: myuser.avatar,
                    tenNguoiNhan: usersend.ho + " " +usersend.ten,
                    sdtNguoiNhan: usersend.SDT,
                    avatarNguoiNhan: usersend.avatar,
                    emailNguoiNhan: usersend.email,
                    ngaysinhNguoiNhan: usersend.ngaysinh,
                    gioitinhNguoiNhan: usersend.gioitinh,
                    trangthaixacnhan: 'false',
                    ngayxacnhan: '',
                });
                newfiend.save();
            });
        }
        });
    });
    setTimeout(function() {
        res.redirect('/danhba');
    }, 400);
});
/**
 *xác Nhận yêu cầu kết bạn
 *  */
router.post('/xacyeucau', (req, res) => {
    var nguoidung = req.session.user.sdt;
    styleDisplay = { styleDisplay1: "none", styleDisplay2: "none" };
    var ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    var time = year + "-" + month + "-" + date;
    findUser = new user({
        ho: " ",
        ten: " ",
        email: " ",
        SDT: " ",
        ngaysinh: " ",
        gioitinh: " ",
        matkhau: " "
    });
    user.findOne({ SDT: nguoidung }).then(myuser => {
    if (req.body.xacnhan == "yes") {
        friend.findOneAndUpdate({ $and: [{ sdtNguoiGui: req.body.sdtreq }, { sdtNguoiNhan: nguoidung }] }, { $set: { trangthaixacnhan: 'true', ngayxacnhan: time + "" } })
            .then(requestfriend => {
                var newfiend = new friend({
                    sdtNguoiGui: requestfriend.sdtNguoiNhan,
                    tenNguoiGui: requestfriend.tenNguoiNhan,
                    avatarNguoiGui: requestfriend.avatarNguoiNhan,
                    tenNguoiNhan: requestfriend.tenNguoiGui,
                    sdtNguoiNhan: requestfriend.sdtNguoiGui,
                    avatarNguoiNhan: requestfriend.avatarNguoiGui,
                    emailNguoiNhan: myuser.email,
                    ngaysinhNguoiNhan: myuser.ngaysinh,
                    gioitinhNguoiNhan: myuser.gioitinh,
                    trangthaixacnhan: 'true',
                    ngayxacnhan: time + "",
                });
                newfiend.save();
            });
    } else if (req.body.xacnhan == "no") {
        friend.findOneAndDelete({ $and: [{ sdtNguoiGui: req.body.sdtreq }, { sdtNguoiNhan: nguoidung }] }).then(x => {
            console.log(x);
        });
    } else {
        res.send("user khong ton tai")
    }
    setTimeout(function() {
        res.redirect('/danhba');
    }, 400);
    });
});
/**
 * Xem thông tin bạn vừa tìm
 *  */
router.post('/thongtinban', (req, res) => {
    styleDisplay = { styleDisplay1: "none", styleDisplay2: "block" };
    user.findOne({ SDT: req.body.sdttimfriend }).then(findFriend => {
        if (findUser == [] || findUser == null) {
            res.send("user khong ton tai");
        }
        else{
            findUser = findFriend; 
        }
        res.redirect('/danhba');
    });
});
/**
 * Xoa bạn trong danh bạ bạn bè
 *  */
router.post('/xoaban', (req, res) => {
    nguoidung = req.session.user.sdt;
    findUser = new user({
        ho: " ",
        ten: " ",
        email: " ",
        SDT: " ",
        ngaysinh: " ",
        gioitinh: " ",
        matkhau: " "
    });
    styleDisplay = { styleDisplay1: "none", styleDisplay2: "none" };
    friend.findOneAndDelete({ $and: [{ sdtNguoiGui: req.body.sdtfriend }, { sdtNguoiNhan: nguoidung }] }).then(x => {
        console.log("x" + x);
    });
    friend.findOneAndDelete({ $and: [{ sdtNguoiGui: nguoidung }, { sdtNguoiNhan: req.body.sdtfriend }] }).then(y => {
        console.log("y" + y);
    });
    setTimeout(function() {
        res.redirect('/danhba');
    }, 400);
});

module.exports = router;