var express = require("express");
var app = express();
var mysql = require("mysql2");
var fileuploader = require("express-fileupload");
var nodemailer = require('nodemailer');

app.get("/dash-admin",function(req,resp)
{
      resp.sendFile(process.cwd()+"/public/dash-admin.html");
})

app.listen(2004, function () {
    console.log("server start");

});

var transport =nodemailer.createTransport(
    {
        host: "smtp.forwardemail.net",
        port: 465,
        secure: true,
        service :'gmail',
        auth : {
            user : 'mehakpreets117@gmail.com',
            pass : 'iahzhgrvpgfsahri'
        }
    }
)

  
app.use(express.static("public"));
app.use(fileuploader());
app.get("/", function (req, resp) {
    resp.sendFile(process.cwd() + "/public/index.html");
})
app.use(express.urlencoded(true));
var dbConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "@mehakpreet2004",
    database: "users",
    dateStrings: true,


}

var dbcon = mysql.createConnection(dbConfig);
dbcon.connect(function (jasoos) {
    if (jasoos == null)
        console.log("connected successfully")
    else
        console.log(jasoos);
})
//===========signup================

app.get("/check-data", function (req, resp) {
    var email = req.query.kuchemail;
    var pwd = req.query.pwd;
    var type = req.query.aType;

    
    dbcon.query("insert into users1 values(?,?,?,current_date(),1)", [email, pwd, type], function (errk) {
        if (errk == null)
          { 
            
             resp.send("record saved");

        }
        else
            resp.send(errk);


                         //send nodemailer mail
var mailoptions = {
    from :'mehakpreets117@gmail.com',
    to : email,
    subject :'hello this is my learning',
    text :'so how it is going today i am doing gmail sending'
}

transport.sendMail(mailoptions,function(error,info){

    if(error)
    {
        console.log(error);
    }
    else
    {
        console.log("email sent"+info.response)
    }
})
    });
});
app.get("/check-email", function (req, resp) {
    dbcon.query("select * from users1 where email=?", [req.query.kuchemail], function (err, resulttable) {
        if (err == null) {
            if (resulttable.length == 1)
                resp.send("Alreadytaken");
            else
                resp.send("Availabe");

        }
        else

            resp.send(err);
    })
});
//===========login============
app.get("/check-login", function (req, resp) {
    dbcon.query("select type,status from users1 where email=?  and pwd=? ", [req.query.kuchemail, req.query.kuchpwd], function (err, resulttable) {
        if (err == null) {
            if (resulttable.length == 1) {
                if (resulttable[0].status == 1)

                    resp.send(resulttable[0].type);
                else
                    resp.send("U r blocked");


            }
            else
                resp.send("invalid")
        }


        else

            resp.send(err);

    })
})
//=============profile donor=================

app.post("/profile-donor-save", function (req, resp) {
    var filename = "no-pic";
    if (req.files != null) {
        filename = req.files.idpic.name;
        var path = process.cwd() + "/public/uploads/" + filename;
        req.files.idpic.mv(path);
    }
    var emailid = req.body.txtemail;
    var name = req.body.txtname;
    var address = req.body.txtaddress;
    var city = req.body.txtcity;
    var contact = req.body.txtcontact;
    var idproof = req.body.txtidproof;
    var hours = "";


    var hours = req.body.amhour + "-";
    var hours = hours + req.body.pmhour;




    dbcon.query("insert into donors (emailid,name,mobile,address,city,proof,pic,ahours) values(?,?,?,?,?,?,?,?)", [emailid, name, contact, address, city, idproof, filename, hours], function (err) {
        if (err == null)
            resp.send("Donor profile saved");
        else
            resp.send(err);
    })



})

app.post("/profile-donor-update", function (req, resp) {

    var emailid = req.body.txtemail;
    var name = req.body.txtname;
    var address = req.body.txtaddress;
    var city = req.body.txtcity;
    var contact = req.body.txtcontact;
    var idproof = req.body.txtidproof;
    var hours = "";


    var hours = req.body.amhour + "-";
    var hours = hours + req.body.pmhour;



    var filename;
    if (req.files != null) {
        filename = req.files.idpic.name;
        var path = process.cwd() + "/public/uploads/" + filename;
        req.files.idpic.mv(path);

    }


    else {
        filename = req.body.hdn;

    }


    dbcon.query("update donors set name=?,mobile=?,address=?,city=?,proof=?,pic=?,ahours=? where emailid=?", [name, contact, address, city, idproof, filename, hours, emailid], function (err) {
        if (err == null)
            resp.send("Updated successfullyyy");
        else
            resp.send(err);

    })

})
app.get("/search-donor-record", function (req, resp) {
    dbcon.query("select * from donors where emailid=?", [req.query.kuchemail], function (err, resulttablejson) {
        if (err == null)
            resp.send(resulttablejson);
        else
            resp.send(err);

    })
})

//=================avail med=====================
app.get("/avail-med", function (req, resp) {
    dbcon.query("insert into medsavailable (email,med,expdate,packing,qty)values (?,?,?,?,?)", [req.query.kemail, req.query.kmedname, req.query.kexpdate, req.query.kpacking, req.query.kqty], function (err) {
        if (err == null)
            resp.send("record saved");
        else
            resp.send(err);
    });
});


//==================================update password======================================================//

   app.get("/update-pwd", function(req , resp){
    var email=req.query.aemail;
    var oldp=req.query.oldpwd;
    var newpwd=req.query.npwd;
    var confirmP=req.query.aconfirmp;

    if (oldp == newpwd) {
        resp.send("Old and new password are same");
      }
      if(newpwd!=confirmP) {
        resp.send("new and confirm password are different");
      }
    dbcon.query("update users1 set pwd=? where email=? and pwd=? ",[newpwd,email,oldp],function(err,result){
        if(err)
        // resp.send("updated successfully")
    
    {    resp.send(err)}


        if(result.affectedRows==0)
                 
        { 
            resp.send("Incorrect old password or email");
        
        }
        else
        resp.send("password updated successfully");
        
      
    });



   })


//=============profile needy================

app.post("/profile-needy-save", function (req, resp) {
    var filename = "no-pic";
    if (req.files != null) {
        filename = req.files.idpic.name;
        var path = process.cwd() + "/public/uploads/" + filename;
        req.files.idpic.mv(path);
    }
    var emailid = req.body.txtemail;
    var name = req.body.txtname;
    var address = req.body.txtaddress;
    var city = req.body.txtcity;
    var contact = req.body.txtcontact;
    var gender = req.body.txtgender;
    var dob = req.body.txtdob;
    dbcon.query("insert into needy (emailid,name,mobile,address,city,gender,dob,pic) values(?,?,?,?,?,?,?,?)", [emailid, name, contact, address, city, gender, dob, filename], function (err) {
        if (err == null)
            resp.send("Needy profile saved");
        else
            resp.send(err);
    })
})

app.post("/profile-needy-update", function (req, resp) {
    var filename;
    if (req.files != null) {
        filename = req.files.idpic.name;
        var path = process.cwd() + "/public/uploads/" + filename;
        req.files.idpic.mv(path);

    }


    else {
        filename = req.body.hdn;

    }
    var emailid = req.body.txtemail;
    var name = req.body.txtname;
    var address = req.body.txtaddress;
    var city = req.body.txtcity;
    var contact = req.body.txtcontact;
    var gender = req.body.txtgender;
    var dob = req.body.txtdob;
    dbcon.query("update needy set name=?,mobile=?,address=?,city=?,gender=?,dob=?,pic=? where emailid=?", [name, contact, address, city, gender, dob, filename, emailid], function (err) {
        if (err == null)
            resp.send("Updated successfullyyy");
        else
            resp.send(err);

    })

})
app.get("/fetch-needy-record", function (req, resp) {
    dbcon.query("select * from needy where emailid=?", [req.query.kuchemail], function (err, resulttablejson) {
        if (err == null)
            resp.send(resulttablejson);
        else
            resp.send(err);

    })
})
//================users record=============================

app.get("/get-users-records",function(req,resp){
    dbcon.query("select email,dos,type,status from users1",function(err,resulttable){
        if(err==null)
        resp.send(resulttable);
        else
        resp.send(err);
    })
})        
app.get("/block-user",function(req,resp){
    var email = req.query.kuchemail;

dbcon.query("update users1 set status=0 where email=?", [email], function (err) {
    if (err == null)
        resp.send("User Blocked");
    else
        resp.send(err);

})
})        
app.get("/resume-user",function(req,resp){
    var email = req.query.kuchemail;
    
dbcon.query("update users1 set status=1 where email=?", [email], function (err) {
    if (err == null)
        resp.send("User Unblocked");
    else
        resp.send(err);

})
})        
//=================donor-record==============
app.get("/get-donors-records",function(req,resp){
    dbcon.query("select * from donors",function(err,resulttable){
        if(err==null)
        resp.send(resulttable);
        else
        resp.send(err);
    })
})        
//===========================needy-record============================
app.get("/get-needy-records",function(req,resp){
    dbcon.query("select * from needy",function(err,resulttable){
        if(err==null)
        resp.send(resulttable);
        else
        resp.send(err);
    })
})        

app.get("/get-cities",function(req,resp){
    dbcon.query("select distinct city from donors",function(err,resulttable){
        if(err==null)
        resp.send(resulttable);
        else
        resp.send(err);
    })
})        

app.get("/get-med",function(req,resp){
    dbcon.query("select distinct med from medsavailable",function(err,resulttable){
        if(err==null)
        resp.send(resulttable);
        else
        resp.send(err);
    })
})        


app.get("/do-delete",function(req,resp)
{
    
        dbcon.query("delete from medsavailable where srno=?",[req.query.srnokuch],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("nkjnkn");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})

app.get("/get-med-records",function(req,resp){
    var email=req.query.emailk;
    dbcon.query("select * from  medsavailable where email=?",[email],function(err,resulttable){
        if(err==null)
        resp.send(resulttable);
        else
        resp.send(err);
    })
})        
app.get("/fetch-donors",function(req,resp)
{
  console.log(req.query);
  var med=req.query.medKuch;
  var city=req.query.cityKuch;

  var query="select donors.city,donors.address,donors.emailid,donors.pic,donors.name,donors.mobile,donors.ahours,medsavailable.med from donors  inner join medsavailable on donors.emailid= medsavailable.email where medsavailable.med=? and donors.city=?";
  

  dbcon.query(query,[med,city],function(err,resultTable)
  {
    console.log(resultTable+"      "+err);
  if(err==null)
    resp.send(resultTable);
  else
    resp.send(err);
  })
})