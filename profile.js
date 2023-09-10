var express = require("express");
var app=express();
var fileuploader=require("express-fileupload");
var mysql=require("mysql2");
app.listen(2005,function(){
    console.log("server start");

});
app.use(express.static("public"));
app.use(fileuploader());
app.get("/profileindex",function(req,resp){
    resp.sendFile(process.cwd()+"/public/profile1index.html");
})
app.get("/profile-form",function(req,resp){
    resp.sendFile(process.cwd()+"/public/profile1.html");
})
app.use(express.urlencoded(true));
var dbConfig={
    host:"127.0.0.1",
    user:"root",
    password:"@mehakpreet2004",
    database:"profile",
}
var dbCon=mysql.createConnection(dbConfig);
dbCon.connect(function(jasoos){
    if(jasoos==null)
    console.log("connected successfully");
    else
    console.log(jasoos);
})
app.post("/profile-form-process",function(req,resp){
    var filename="no-pic";
    if(req.files!=null)
    {
       filename=req.files.idpic.name;
        var path=process.cwd()+"/public/uploads/"+filename;
        req.files.idpic.mv(path);
    }
        var emailid=req.body.txtemail;
        var name=req.body.txtname;
        var dob=req.body.txtdob;
        var address=req.body.txtaddress;
        var city=req.body.txtcity;
        var contact=req.body.txtcontact;
        var idproof=req.body.txtidproof;
        var gender=req.body.txtgender;
        dbCon.query("insert into profile values(?,?,?,?,?,?,?,?,?)",[emailid,name,contact,address,city,dob,gender,idproof,filename],function(err){
            if(err==null)
            resp.send("Account created");
            else
            resp.send(err);
        })
    
    

})
app.post("/update-profile-form",function(req,resp)
{ var email=req.body.txtemail;
       dbCon.query("delete from profile where emailid=?",[email],function(err,result)
       { if(err==null)
              {
                     if(result.affectedRows==1)
                     resp.send("account removed successfully");
                     else
                     resp.send("invalid email");
              }
                     else
                     resp.send(err);
              

       })

})

 