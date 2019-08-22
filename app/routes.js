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
    // app.post('/login',);

    // Sign Up
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    // post Signup
    // app.post('/signup', )

    // PROFILE SECTION
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user
        });
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });


};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next;
    res.redirect('/');
}