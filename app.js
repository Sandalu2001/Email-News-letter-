const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

//https://vast-stream-74233.herokuapp.com

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})



app.post("/",function(req,res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    const email = req.body.email;



    //Store user data as a object to send to the mailchimp server
    var data = {
        members: [
            {
                email_address:email,
                status:"subscribed",
                merge_feilds:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    //We have to convert that object into json format
    var jsonData = JSON.stringify(data);

 /*-------------------Make the post request(Post data to external resource--------------*/   

    const url = "https://us21.api.mailchimp.com/3.0/lists/6ea6e3afa6";

    const options = {
        method :"POST",
        auth :"dndalu:4126b68529f600169e4e5a7a992d315c-us21"
    }
    
    
    const request = https.request(url,options,function(response){   //using the callout funtion we can get a respose from mailchimp server
        response.on("data",function(data){
            console.log(JSON.parse(data));   //We get the data that we send before 
        }); 

        if(response.statusCode == 200){
            res.sendFile(__dirname+"/success.html")
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
    });

    request.setHeader('Content-Type', 'text/html');

    request.write(jsonData);

    request.end();
});



app.post("/failure",function(req,res){
    res.redirect("/");
})



app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000");
})
