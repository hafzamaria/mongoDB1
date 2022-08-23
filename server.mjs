import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';
import mongoose from 'mongoose';

const port =process.env.PORT || 3000;
const app = express()

app.use(express.json());
app.use(cors());



///step01 (schema) stamp for making multile users//

const userSchema = new mongoose.Schema (
 {  
    firstName:{type:String},
    lastName:{type:String},
    email:{type:String , required:true},
    password:{type:String , required:true},
    age:{type:Number, min:17 , max:65},
    isMarried:{type:Boolean, default:false},
    CreatedOn:{type:Date , default:Date.now},
 }
);

/////step02(mongoose model)///
let dbURI = 'mongodb+srv://abcd:abcd@cluster0.0nsp7aq.mongodb.net/socialmrdiaBase?retryWrites=true&w=majority';
mongoose.connect(dbURI);
const userModel = mongoose.model ( 'user1', userSchema );

/////step03 (validations/Requirements for submission)////

app.post  ("/signup",(req,res) => {
  
    let body = req.body;

  if
    (!body.firstName
    ||!body.lastName
    ||!body.email
    ||!body.password)

    { res.status(400).send
    ('required field missing,request example',
    
       {"firstName":'Maria',
       "lastName":'Imran',
       "email":'abc@123.com',
       "password":'12345'}
       );
         return;
       }

       ////step04(check if user already exist)////
       let isFound = false;
       userModel.findOne ( {email:body.email},(err,data)  =>  {
       if(!err){
        
        console.log("data:", data);

        ////data already exist///
        if (data) {
            console.log("user already exist:", data);
            res.status(400).send({message:"user already exist,please try another email"});
            return;
            /////step05 (user not exist)Create newUser///
        }else{
            let newUser = new userModel
            ({
                firstName:body.firstName,
                lastName:body.lastName,
                email:body.email,
                password:body.password });

                ////step06(save newuser)///

                newUser.save( (err,result) => {
         if(!err){
            console.log("data saved:",result);
            res.status(201).send({message:"user is created"});
         }else{
            console.log("db error:" ,err);
            res.status(500).send({message:"internal server error"});
         }

           });

        }
        }  else{
            console.log("dberror:", err);
            res.status(500).send({message:'db error in query'});
       }
       });
      });




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () { //connected
    console.log("mongoose connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});


process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});

//////////////////////////////////////