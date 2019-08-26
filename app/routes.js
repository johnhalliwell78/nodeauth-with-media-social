module.exports = function (app, passport) {
    // homepage
    app.get('/', function (req, res) {
        res.render('index.ejs');
    });

    // login
    app.get('/login', function (req, res) {
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // post login
    app.post('/login', passport.authenticate("local-login", {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));


    // Sign Up
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    // post Signup
    // Xử lý thông tin khi có người đăng ký
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // chuyển hướng tới trang được bảo vệ
        failureRedirect: '/signup', // trở lại trang đăng ký nếu có lỗi
        failureFlash: true // allow flash messages
    }));


    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user // Lấy thông tin user trong session và truyền nó qua template
        });
    });
};


function isLoggedIn(req, res, next) {
    // Nếu một user đã xác thực, cho đi tiếp
    if (req.isAuthenticated())
        return next();
    // Nếu chưa, đưa về trang chủ
    res.redirect('/');
}