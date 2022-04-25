const express = require('express');
const bcrypt = require('bcryptjs')
//for routing use router class!
const router = express.Router();

//for files
const fs = require('fs');

//import Schemas
const UserModel = require('../models/user.js');
const LevelModel = require('../models/level.js');
const { application } = require('express');

//specify the routes!

//registration
router.post("/sign_up", async (request, response) =>{
  
  const userExist = await UserModel.findOne({
    username: request.body.username
  })
  const emailExist = await UserModel.findOne({
    email: request.body.email
  })
  
    try{
      const newPassword = await  bcrypt.hash(request.body.password,10)
      await UserModel.create({
        fName: request.body.fName,
        mName: request.body.mName,
        lName: request.body.lName,
        email: request.body.email,
        username: request.body.username,
        password: newPassword,
        //confirm_password: request.body.confirm_password,
        level: request.body.level,
        phase: request.body.phase,
        area: request.body.area,
        type: request.body.type,
      })
      response.json({status: 'ok'})
      
    }catch(err){
      if(userExist|| emailExist){
          let userMsg =""
          let emailMsg =""
          if(userExist){
             userMsg ="Username already exists."    
          }
          if(emailExist){
            emailMsg = "Email already exists."
          }
          response.status(409).json({message: userMsg + "_" + emailMsg})
        }
        // else if(request.body.password !== request.body.confirmPassword){
        //   response.status(409).json({message: 'passwords dont matches'})
        // }
        else{
          response.json({status: err, error:'something wrong'})
        }
      console.log(err)
      
    }
  
   
  })


//sign_in
  router.post("/sign_in", async (request, response) => {

    const user = await UserModel.findOne({
      username: request.body.username,
    })
  
    if(!user){
      return response.json({status:'user-not-found'})
    }
  
    const isPasswordCorrect = await bcrypt.compare(
      request.body.password,
      user.password
  
    )
  
    if (isPasswordCorrect){
          return response.json({status:'user-found'})
    }else{
          return response.json({status:'user-not-found'})
    }
  });


  //create level
  // should create the directory.
  // Shall be able to filter if the level is at its maximum.
  router.post('/create-level', async (request, response) => {

      LevelModel.find({}).then(data => 
        {
          let levelValue = 1
          for (let i = 0; i<data.length; i++){
              levelValue = data.length + 1
          }
          if(data.length<4){
            var dir = './files/'+request.body.level;

            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
      
                try{
                    LevelModel.create({
                    level: [],
                    value:  levelValue
                  },(err,doc)=>{
                    if(!err){
                      response.json({level: doc.id})
                    }
                  })

                }catch(err){
                  console.log(err)
                  response.json({status: err, error:'something wrong'})
                }
          
            }

          }else{
              response.json({level:'Maximum'})
          }
        }
      );

     

     

      // await LevelModel.findOneAndUpdate(
      //   { _id: '626072d5d97cb44ff44620d3'}, 
      //   { $push: {'level':[]}}
      // );
      
  });

  router.get('/load-levels', async (request, response) => {

      let newArr = []
      LevelModel.find({}).then(data => 
        {
          for(let i = 0; i < data.length; i++){
            newArr.push(data[i].id)
          }
          response.json({level: newArr})
        }
      );
    
  });

  router.get('/levels', async (request, response)=>{
    await LevelModel.find({})
     .then((data)=>{
       console.log('Data: ', data)
       response.json(data)
     })
     .catch((error)=>{
       console.log("Error: ", error)
     })
   })

  //create phase
  // should create the directory.
  router.post('/create-phase', async (request, response) => {

            var dir = './files/'+request.body.level+'/'+request.body.phase;

            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
                try{
                  LevelModel.find({}).then(async data => {
                    let newArr = []
                    for(let i = 0; i < data.length; i++){
                      newArr.push(data[i].id)
                    }
                      let levelId = newArr[request.body.level-1]
                      let doc = await LevelModel.findOneAndUpdate(
                        { _id: levelId}, 
                        { $push: {'level':[]}},
                        {new:true});

                      response.json({'phase':doc.level.length-1})

                      
                      let areaObj = {}
                      let phaseId = 'level.'+(doc.level.length-1);
                      areaObj[phaseId]=[]

                      for(i=0;i<10;i++){

                          var dir = './files/'+request.body.level+'/'+request.body.phase+'/'+(i+1);
                          if (!fs.existsSync(dir)){
                              fs.mkdirSync(dir);
                              await LevelModel.findOneAndUpdate(
                              { _id: levelId}, 
                              { $push: areaObj},
                              {new:true},);
                          }
                      }
                   
                    

                  })
                  
                 
                }catch(err){
                  console.log(err)
                  response.json({status: err, error:'something wrong'})
                }
          
          }

  })

  router.post('/load-phases', async (request, response) => {

    LevelModel.find({}).then(data => {
      let newArr = []
      for(let i = 0; i < data.length; i++){
        newArr.push(data[i].id)
      }
      let levelId = newArr[request.body.level-1];
      LevelModel.findOne({_id:levelId},function (err, doc){

            let newArr = []
            for(let i = 0; i < doc.level.length; i++){
              newArr.push(i)
            }
            response.json({phases: newArr})    

      })
    
    }) 

   
});


  //create param
  // should create the directory.
  router.post('/create-param', async (request, response) => {
    console.log(request.body.parameter);

    var dir = './files/'+request.body.level+'/'+request.body.phase+'/'+request.body.area+'/'+request.body.parameter;
    console.log(dir)
  
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        try{
          LevelModel.find({}).then(async data => {
            let newArr = []
            for(let i = 0; i < data.length; i++){
              newArr.push(data[i].id)
            }
            let levelId = newArr[request.body.level-1]


            let paramObj = {}
            let areaId = 'level.'+(request.body.phase-1)+'.'+(request.body.area-1);
            paramObj[areaId]='P-'+request.body.parameter

            let doc = await LevelModel.findOneAndUpdate(
            { _id: levelId}, 
            { $push: paramObj},
            {new:true});
            let parameter = doc.level[request.body.phase-1][request.body.area-1].length-1
            response.json({'parameter':parameter})

            
          })
          
         
        }catch(err){
          console.log(err)
          response.json({status: err, error:'something wrong'})
        }
  
  }

})


router.post('/load-params', async (request, response) => {

  LevelModel.find({}).then(data => {
    let newArr = []
    for(let i = 0; i < data.length; i++){
      newArr.push(data[i].id)
    }
    let levelId = newArr[request.body.level-1];
    
    LevelModel.findOne({_id:levelId},function (err, doc){
          response.json({parameter: doc.level[request.body.phase-1][request.body.area-1]})    
    })
  
  }) 

 
});

  module.exports = router;