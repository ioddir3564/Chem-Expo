const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const ejs = require('ejs')
var session = require('client-sessions')
const flash = require('connect-flash');

const app = express()

app.use(express.static("public"))
app.use('/views', express.static(__dirname + '/views'))
app.use(bodyParser.urlencoded({extended: true}))

app.use(session({
    cookieName: 'session',
    // secret: 'random_string_goes_here',
    secret: "hey",
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  }));
app.use(flash())

app.set('view engine', 'ejs')

const adminSchema = new mongoose.Schema({
    email: String,
    password: String
})

const postSchema = new mongoose.Schema({
    author: String,
    title: String,
    date: String,
    content: String
})

const Admin = new mongoose.model("Admin", adminSchema)
const Post = new mongoose.model("Post", postSchema)

const URI = "mongodb+srv://Irfaz:Iz012789@cluster0.tyfbo.mongodb.net/chem?retryWrites=true&w=majority"

const connectDB = async() => {
    await mongoose.connect(URI, {useUnifiedTopology: true, useNewUrlParser: true})
    console.log("db connected!")
}

connectDB()

app.get('/', function(req, res){
    var arr = []
    Post.find({}, function(err, postArr){
        if (err){
            console.log(err)
        }
        else{
            arr = postArr
            res.render('index', {arr: arr});
        }
    })
    
})

app.get('/history', function(req, res){
    res.render("history")
})

app.get('/admin', function(req,res){
    res.render('admin')
})

app.get('/mission-control', function(req, res){
    if (req.session.user){
        res.render('mission-control')
    }
    else{
        res.redirect("/admin")
    }
})

app.post('/admin', function(req, res){
    const email = req.body.email;
    const password = req.body.password;
    
    Admin.findOne({email: email}, function(err, foundAdmin){
        if (err){
            console.log(err);
        }
        else{
            if (foundAdmin){
                console.log(foundAdmin);
                if (foundAdmin.password === password)
                {
                    req.session.user = foundAdmin
                    console.log(req.session.user.email);
                    res.redirect("/mission-control")
                }
                else{
                    req.flash('message', 'Password is incorrect')
                    res.redirect('/admin')
                }
            }
            else{
                req.flash('message', "Doesn't look like a user with this email exists")
                res.redirect('/admin')
            }
        }
    })
})

app.post("/createPost", function(req,res){
    const author = req.body.author
    const title = req.body.title
    const date = req.body.date
    const content = req.body.content

    const newPost = new Post({
        author: author,
        title: title,
        date: date,
        content: content
    })

    newPost.save(function(err){
        if (err){
            console.log(err);
        }
        else{
            res.redirect("/")
        }
    })
})


app.listen(8000, function(){
    console.log("server is on 8000");
})


