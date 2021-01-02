const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const ejs = require('ejs')
var session = require('client-sessions')
const flash = require('connect-flash');
const e = require('express')
require("dotenv").config()


const app = express()

app.use(express.static("public"))
app.use('/views', express.static(__dirname + '/views'))
app.use(bodyParser.urlencoded({extended: true}))

app.use(session({
    cookieName: 'session',
    // secret: 'random_string_goes_here',
    secret: "hey",
    duration: 7200000,
    activeDuration: 7200000,
  }));
app.use(flash())

app.set('view engine', 'ejs')

const adminSchema = new mongoose.Schema({
    email: String,
    password: String,
    bio: String,
    links: Array
})

const postSchema = new mongoose.Schema({
    email: String,
    mainImg: String,
    author: String,
    title: String,
    date: String,
    content: String
})

const Admin = new mongoose.model("Admin", adminSchema)
const Post = new mongoose.model("Post", postSchema)

const URI = process.env.API_KEY

const connectDB = async() => {
    await mongoose.connect(URI, {useUnifiedTopology: true, useNewUrlParser: true})
    console.log("db connected!")
}

connectDB()

// io.on('connection', socket => {
//     socket.on("")
// })


app.get('/', function(req, res){
    var arr = []
    Post.find({}, function(err, postArr){
        if (err){
            console.log(err)
        }
        else{
            arr = postArr
            var fNameArr = []
            arr.forEach(element => {
                var first = ""
                var i = 0
                while (element.author[i] != " "){
                    if (i == element.author.length-1){
                        first += element.author[i]
                        break
                    }
                    first += element.author[i]
                    i++
                }
                first = first.toLowerCase()
                console.log(first);
                fNameArr.push(first)
            });
            res.render('index', {arr: arr, fNameArr: fNameArr});
        }
    })
    
})

app.get('/external', function(req, res){
    const id = req.query.ID
    Post.findOne({_id : id}, function(err, foundPost){
        if (err){
            console.log(err);
        }
        else{
            if (foundPost){
                const post = foundPost
                
                var first = ""
                var i = 0
                while (post.author[i] != " "){
                    if (i == post.author.length-1){
                        first += post.author[i]
                        break
                    }
                    first += post.author[i]
                    i++
                }
                first = first.toLowerCase()
                console.log(first);
                var fNameObj = {
                    name: first
                }
                res.render("external", {post: post, fNameObj: fNameObj})
            }
        }
    })
})


app.get('/resources', function(req, res){
    res.render("resources")
})

app.get('/about', function(req, res){
    res.render("about")
})

app.get('/courses', function(req, res){
    res.render("courses")
})

app.get('/admin', function(req,res){
    res.render('admin')
})

app.get('/mission-control', function(req, res){
    if (req.session.user){
        Post.find({email: req.session.user.email}, function(err, foundPosts){
            if (err){
                console.log(err);
            }
            else{
                // console.log(foundPosts);
                res.render('mission-control', {posts : foundPosts})
            }
        })
    }
    else{
        res.redirect("/admin")
    }
})

app.get('/profile', (req, res)=> {
    var email = req.query.ID;    // /irfaz_oddir
    // for (var i = 0; i < username.length; i++){
    //     if (username[i] == "_"){
    //         username[i] = " "
    //     }
    // }
    var author = []
    Post.find({email: email}, (err, posts)=>{
        if (err){
            console.log(err);
        }
        else{
            author = posts[0].author
            var first = ""
            var i = 0
            while (author[i] != " "){
                if (i == author.length-1){
                    first += author[i]
                    break
                }
                first += author[i]
                i++
            }
            first = first.toLowerCase()
            Admin.findOne({email: email}, (err, foundUser)=>{
                if (err){
                    console.log(err);
                }
                else{
                    console.log(foundUser);
                    res.render('profile', {arr: posts, fName: first, person: foundUser})
                }
            })
        }
    })
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

app.post("/delete", function(req, res){
    const postID = req.body.postID
    Post.deleteOne({_id: postID}, function(err){
        if (err){
            console.log(err);
        }
        else{
            console.log("delete successful");
            res.redirect('/mission-control')
        }
    })
})

app.post("/createPost", function(req,res){
    const author = req.body.author
    const mainImg = req.body.mainImg
    const title = req.body.title
    const date = req.body.date
    const content = req.body.content

    const newPost = new Post({
        email: req.session.user.email,
        mainImg: mainImg,
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
            res.redirect("/mission-control")
        }
    })
})

app.post("/save", function(req, res){
    const updatedContent = req.body.updatedContent
    const title = req.body.title
    const author = req.body.author
    const date = req.body.date
    const postID = req.body.postID
    console.log(postID);

    Post.findOne({_id: postID}, function(err, foundPost){
        if (err) {
            console.log(err);
        }
        else{
            if (foundPost) {
                console.log("working");
                console.log(foundPost);
                foundPost.content = updatedContent;
                foundPost.title = title;
                foundPost.author = author;
                foundPost.date = date;
                foundPost.save()
                res.redirect("/mission-control")
            }
            else{
                console.log("not found");
                res.redirect("/mission-control")
            }
        }
    })
    
})



app.listen(process.env.PORT, function(){
    console.log("server is on 8000");
})


