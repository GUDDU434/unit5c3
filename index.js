//  Voting system----->

// import all-->
const express = require("express");
const { v4: uuid } = require("uuid");
const { readFile, writeFile } = require("fs");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to My voting system");
});

// create the user data---->
app.post("/user/create", (req, res) => {
  if (req.body.id && req.body.name && req.body.age && req.body.role){
    readFile("./db.json", "utf-8", (err, data) => {
      const parsed = JSON.parse(data);
      if(req.body.role=="voter"){
        parsed.user = [...parsed.user, {...req.body,username:req.body.name,password:req.body.name}];    
    }else{
        parsed.user = [...parsed.user, {...req.body,votes:0,party:req.body.party}];
    }
      writeFile("./db.json",JSON.stringify(parsed), "utf-8", () => {
          res.status(201).send("User created sucessfully");
        }
      );
    });
  } else {
    res.status(402).send("Please provide all the mendetory details");
  }
});


// Login user-->
app.post("/user/login", (req, res) => {
    if (req.body.username && req.body.password){
      readFile("./db.json", "utf-8", (err, data) => {
        const parsed = JSON.parse(data);
        parsed.user = parsed.user.map((el) =>{
            if(el.username == req.body.username && el.password == req.body.password){
                {req.body.token = uuid()}
         }
        }
        );
        writeFile("./db.json",JSON.stringify(parsed), "utf-8", () => {
            res.status(201).send(`Login sucessfully ${req.body.token}`);
          }
        );
      });
    } else {
      res.status(400).send("please provide username and password");
    }
  });

// Logout a user -->
  app.post("/user/logout",(req,res)=>{
    if (req.query.token){
        readFile("./db.json", "utf-8", (err, data) => {
          const parsed = JSON.parse(data);
          parsed.user = parsed.user.map((el) =>el.token == req.query.token && {...el,token:null}
          );
          writeFile("./db.json",JSON.stringify(parsed), "utf-8", () => {
              res.status(201).send(`Login sucessfully ${req.body.token}`);
            }
          );
        });
      } else {
        res.status(400).send("please provide username and password");
      }
  });

//   List of candidates-->
  app.get("/votes/party/:party",(req,res)=>{

    const {party} = req.params;
    readFile("./db.json", "utf-8", (err, data) => {
        const parsed = JSON.parse(data);
        parsed.user = parsed.user.filter((elem) => elem.party == party)

        let list = JSON.stringify(parsed);
        console.log(list)
        res.status(200).send("candidate list is get"+list )
      });


  });

//   list of voters:-->
  app.get("/votes/voters",(req,res)=>{

    readFile("./db.json", "utf-8", (err, data) => {
        const parsed = JSON.parse(data);
        parsed.user = parsed.user.filter((elem) => elem.voters == voters)

        let list = JSON.stringify(parsed);
        console.log(list)
        res.status(200).send("candidate list is get"+list )
      });


  });
  
  //votes of an user
  app.patch("/votes/vote/:user",(req,res)=>{

    const {user} = req.params;

    readFile("./db.json", "utf-8", (err, data) => {
        const parsed = JSON.parse(data);
        parsed.user = parsed.user.map((elem) => elem.name == user ? {...elem, vote:vote++} :elem);
        writeFile("./db.json",JSON.stringify(parsed), "utf-8", () => {
             return res.status(201).send(`Vote added sucessfully`);
          })
      });
      res.status(401).send(`Vote not counted`);
  });



app.get("/votes/count/:user",(req,res)=>{

    const {user} = req.params;
    console.log(user)
    readFile("./db.json", "utf-8", (err, data) => {
        const parsed = JSON.parse(data);
        parsed.user = parsed.user.filter((elem) => elem.name == user);
        console.log(parsed.user[0].votes)
        res.status(200).send(`Total Votes of${user} ${parsed.user[0].votes}`)
      });


  });

  app.get("/db",(req,res)=>{
    readFile("./db.json", "utf-8", (err, data) => {
        const parsed = JSON.parse(data);
        console.log(parsed.user)
        res.status(200).send(`db data ${parsed.user}`)
      });
  });

  app.post("/db",(req,res)=>{
    if (req.body.id && req.body.name && req.body.age && req.body.role){
        readFile("./db.json", "utf-8", (err, data) => {
          const parsed = JSON.parse(data);
          if(req.body.role=="voter"){
            parsed.user = [...parsed.user, {...req.body,username:req.body.name,password:req.body.name}];    
        }else{
            parsed.user = [...parsed.user, {...req.body,votes:0,party:req.body.party}];
        }
          writeFile("./db.json",JSON.stringify(parsed), "utf-8", () => {
              res.status(201).send("User created sucessfully");
            }
          );
        });
      } else {
        res.status(402).send("Please provide all the mendetory details");
      }
  });


const PORT = process.env.PORT || 8080

app.listen(PORT);


