var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
// load  user model
var User = require('../app/models/user');
var configAuth = require('./auth');
module.exports = function (passport) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session
    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
            // mặc định local strategy sử dụng username và password,
            // chúng ta cần cấu hình lại
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // cho phép chúng ta gửi reqest lại hàm callback
        },
        function (req, email, password, done) {
            // asynchronous
            // Hàm callback của nextTick chỉ được thực hiện khi hàm trên nó trong stack (LIFO) được thực hiện
            // User.findOne sẽ không được gọi cho tới khi dữ liệu được gửi lại
            process.nextTick(function () {
                // Tìm một user theo email
                // chúng ta kiểm tra xem user đã tồn tại hay không
                User.findOne({'local.email': email}, function (err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        // Nếu chưa user nào sử dụng email này
                        // tạo mới user
                        var newUser = new User();
                        // lưu thông tin cho tài khoản local
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        // lưu user
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));
    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) { // callback với email và password từ html form
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            // tìm một user với email
            // chúng ta sẽ kiểm tra xem user có thể đăng nhập không
            User.findOne({'local.email': email}, function (err, user) {
                if (err)
                    return done(err);
                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // thông báo lỗi chỉ này chỉ dùng khi dev
                // all is well, return successful user
                return done(null, user);
            });
        })
    );

    // FACEBOOK

    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'middle_name']
        // Facebook send token and user information back to user
    }, function (token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function () {
            // find user id by facebook id
            User.findOne({'facebook_id': profile.id}, function (err, user) {
                if (err) return done(err);

                if (user) {
                    return done(null, user);
                } else {
                    console.log('pass ne'+ profile);
                    var newUser = new User();

                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = token;
                    newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // bạn có thể log đối tượng profile để xem cấu trúc
                    newUser.facebook.email = profile.emails[0].value;


                    newUser.save(function (err) {
                        if (err) throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
};