var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express();
    
mongoose.connect("mongodb://localhost/todoapp", {useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var todoSchema = new mongoose.Schema({
    name: String,
    desc: String,
    creator: String,
    duration: Number,
    createdAt: { type: Date, default: Date.now()}
});

var Todo = mongoose.model("Todo", todoSchema);

Todo.create({
    name: "Wake up",
    desc: "Meeting at 10",
    creator: "Div",
    duration: 0.8,
    createdAt: Date.now()
});
// Approach 2
// const getInfo = (h,m,s) => {
//     let a = h.toString()+'-'+m.toString()+'-'+s.toString();
//     let b = new Date();
//     let c = b.getHours().toString()+'-'+b.getMinutes().toString()+'-'+b.getSeconds().toString();
//     return [a,c]

//     let h = task.createdAt.getHours();
//     let m = task.createdAt.getMinutes();
//     let s = task.createdAt.getSeconds();
//     const t = (h*60)+m+(s/60)
//     while(true){
//         let a = new Date();
//         const nt = (a.getHours()*60)+a.getMinutes()+(a.getSeconds()/60);
//         if (nt-t >= task.duration){
//             console.log("db",getInfo(h,m,s))
//             Todo.deleteOne({duration: task.duration}, (err) => {if (err) console.log(err);});
//             break;
//         }
//         else{
//             continue;
//         }
//     }
// }

app.get('/', (req, res) => {
    res.redirect("/list");
});

app.get('/list', (req, res) => {
    Todo.find({}, (err, tasks) => {
        if (err){
            console.log(err);
        } else{
            res.render("show", {tasks: tasks});
            tasks.forEach((task) => {
                setTimeout(() => {
                    Todo.deleteOne({duration: task.duration}, (err) => {if (err) console.log(err);});
                }, task.duration*60*1000)
            });
        }
    });
});


app.route('/add')
    .get((req,res) => {
        res.render("add");
    })
    .post((req, res) => {
        Todo.create(req.body.task, (err) => {
            if (err){
                res.render("add");
            } else {
                res.redirect("/list");
            }
        })
    })

app.listen(4100, function(){
    console.log("Server has started!");
});