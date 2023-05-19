require("dotenv").config()
const express = require("express")
const app = express();
const conn = require("./connection/conn")
const path = require("path")


const vpath = path.join(__dirname, "./views")
const spath = path.join(__dirname, "../public")

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static(spath))
app.set("view engine", "ejs")
app.set("views", vpath)


app.get("/", (req, res) => {
    res.render("login")
})

app.get("/home", (req, res) => {
    res.render("newhome")
})

app.get("/fightsdetail", (req, res) => {
    conn.connect(function (err) {
        if (err) console.log(err)
        const sql = "select * from flight natural join follows natural join schedule"
        conn.query(sql, function (e, resl) {
            if (e) console.log(e)
            res.render("flight_details", { data: resl })
        })
    })
})

app.get("/passenger_input", (req, res) => {
    res.render("passenger_input")
})

app.post("/passenger_input", (req, res) => {
    const P_ID = req.body.P_ID;
    const sql = "insert into passengers(P_ID,PName,gender,seat_number,age,class_type,F_ID) values (?,?,?,?,?,?,?)";
    conn.query(sql, [req.body.P_ID, req.body.PName, req.body.gender, req.body.seat_number, req.body.age, req.body.class_type, req.body.F_ID], function (e, resl) {
        if (e) console.log(e)
    })
    const sql1 = "select * from passengers natural join flight natural join follows natural join schedule where P_ID=?"
    const sql2 = "select * from passengers natural join flight natural join moves_on natural join air_space natural join airport where P_ID=?"
    var d1;
    var d2;
    conn.query(sql1, [P_ID], function (e, resl) {
        if (e)
            console.log(e);
        d1 = resl;
    })
    conn.query(sql2, [req.body.P_ID], function (e, resl) {
        if (e)
            console.log(e);
        d2 = resl
        res.render("fullpassdetails", { data1: d1, data2: d2 })
    })
})

app.get("/passenger_output", (req, res) => {
    const sql = "select * from passengers natural join flight"
    conn.query(sql, function (e, resl) {
        if (e) console.log(e)
        res.render("passenger_output", { data: resl })
    })
})

app.get("/deletepassenger", (req, res) => {
    const sql = "delete from passengers where P_ID=?"
    conn.query(sql, [req.query.id], function (e, resl) {
        if (e) console.log(e)
        res.redirect("/passenger_output")
    })
})

app.get("/updatepassenger", (req, res) => {
    const sql = "select * from passengers natural join flight where P_ID=?"
    conn.query(sql, [req.query.id], function (e, resl) {
        if (e) console.log(e)
        res.render("update_passenger", { data: resl })
    })
})

app.post("/updatepassenger", (req, res) => {
    const sql = "update passengers set PName=?,gender=?,seat_number=?,age=?,class_type=?,F_ID=? where P_ID=?"
    conn.query(sql, [req.body.PName, req.body.gender, req.body.seat_number, req.body.age, req.body.class_type, req.body.F_ID, req.body.P_ID], function (e, resl) {
        if (e) console.log(e)
        res.redirect("/passenger_output")
    })
})

app.get("/getfullpassengerdetail", (req, res) => {
    const sql1 = "select * from passengers natural join flight natural join follows natural join schedule where P_ID=?"
    const sql2 = "select * from passengers natural join flight natural join moves_on natural join air_space natural join airport where P_ID=?"
    var d1
    var d2
    conn.query(sql1, [req.query.id], function (e, resl) {
        if (e)
            console.log(e);
        d1 = resl;
        // console.log(resl);
    })
    conn.query(sql2, [req.query.id], function (e, resl) {
        if (e)
            console.log(e);
        d2 = resl
        // console.log(resl);
        res.render("fullpassdetails", { data1: d1, data2: d2 })
    })

})

app.get("/searchbyall", (req, res) => {
    const sql = "select * from passengers natural join flight"
    conn.query(sql, function (e, resl) {
        if (e) console.log(e)
        res.render("searchbyall", { data: resl })
    })

})

app.post("/searchbyall", (req, res) => {
    const sql = "select * from passengers natural join flight where P_ID like '%" + req.body.pid + "%' and PName like '%" + req.body.name + "%' and F_ID like '%" + req.body.fid + "%'";
    conn.query(sql, function (e, resl) {
        res.render("searchbyall", { data: resl })
    })
})

app.get("/login",(req,res)=>{
    try {
        res.render("login")
    } catch (e) {
        console.log(e)
        res.send(e)
    }
})

app.post("/login",(req,res)=>{
    if (req.body.uid===process.env.LOGINID){
        if(req.body.password===process.env.PASSWORD){
            res.render("newhome")
        }
        else{
            res.send("INVALID CREDENTIALS")
        }
    }
    else{
        res.send("INVALID CREDENTIALS")
    }
})

app.get("/airroutes",(req,res)=>{
    try {
        const sql = "select * from air_space"
        conn.query(sql,function(e,resl){
            if (e) console.log(e)
            res.render("airroutes",{data:resl})
        })
    } catch (e) {
        console.log(e)
        res.send(e)
    }
})

app.get("/logout",(req,res)=>{
    res.redirect("/")
})

app.listen(4000, () => {
    console.log("listening to the port 4000")
})