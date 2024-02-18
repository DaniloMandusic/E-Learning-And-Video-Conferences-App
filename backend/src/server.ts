// src/server.ts
import express from 'express';
import connectToDatabase from './db';
import UserModel from './models/user';
import fs from 'fs/promises'; // Import the fs.promises module for reading the JSON file
import ClassModel from './models/class';
import TutionModel from './models/tution';
//import { Request, Response } from 'express';
const multer = require('multer');

const app = express();
const port = 3000;

// Middleware to parse JSON in the request body
app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  //res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Example route to list all users
app.post('/users/addUser', upload.single('file') , async (req, res) => {
  try {
    // Connect to the database
    console.log("got in post addUser")
    await connectToDatabase();

    // if (!req.file) {
    //   console.log("no file uploaded")
    //   return res.status(400).json({ error: 'No file uploaded' });
    // }

    //const { userDict } = req.body;
    let file = null
    if(req.file){
      file = req.file.buffer;
    }

    //const file = req.file.buffer; // Access the uploaded file through req.file
    console.log(file)
    const username = req.body.username; // Access the username string
    const password = req.body.password;
    const securityQuestion = req.body.securityQuestion;
    const securityAnswer = req.body.securityAnswer;
    const name = req.body.name;
    const surname = req.body.surname;
    const gender = req.body.gender;
    const address = req.body.address;
    const phoneNumber = req.body.phoneNumber;
    const email = req.body.email;
    const schoolType = req.body.schoolType;
    const grade = req.body.grade;
    const profileType = req.body.profileType;
    const profileStatus = req.body.profileStatus;
    

    console.log("post parameters: " + username+"", password+"")//, profilePictureBuffer+"")
    //const profilePictureBuffer = await fs.readFile(filePath + "");

    const user = new UserModel({
        username,
        password,
        profilePicture: file,
        securityQuestion,
        securityAnswer,
        name,
        surname,
        gender,
        address,
        phoneNumber,
        email,
        schoolType,
        grade,
        profileType,
        profileStatus
    })

    user.password = encryptPassword(user.password)

    let u = await UserModel.findOne({ username: username });

    if(file){
      user.profilePicture = file
    } else {
      user.profilePicture = u?.profilePicture
    }

    if(u){
      console.log("changing user")

      await UserModel.updateOne({ username: username}, {$set:{
        username: user.username,
        password: user.password,
        profilePicture: user.profilePicture,
        securityQuestion: user.securityQuestion,
        securityAnswer: user.securityAnswer,
        name: user.name,
        surname: user.surname,
        gender: user.gender,
        address: user.address,
        phoneNumber: user.phoneNumber,
        email: user.email,
        schoolType: user.schoolType,
        grade: user.grade,
        profileType: user.profileType,
        profileStatus: user.profileStatus
      }})
      // u.save()
      
      res.status(201).send('User changed successfully');
      return
    }

    await user.save();

    // res.set('Access-Control-Allow-Origin', "http://localhost:4200")
    // res.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    // res.set('Access-Control-Allow-Headers', '*');
    //res.set('Access-Control-Allow-Credentials', true);
    res.status(201).send('User created successfully');
    
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/users/changeTeacher', upload.single('file') , async (req, res) => {
  try {
    // Connect to the database
    console.log("got in post changeTeacher")
    await connectToDatabase();

    if (!req.file) {
      console.log("no file uploaded")
      return res.status(400).json({ error: 'No file uploaded' });
    }

    //const { userDict } = req.body;
    const file = req.file.buffer; // Access the uploaded file through req.file
    console.log(file)
    const heardFrom = req.body.heardFrom;
    const teachingGroup = req.body.teachingGroup;
    const classes = req.body.classes;
    const username = req.body.username;
    

    //console.log("post parameters: " + username+"", password+"")//, profilePictureBuffer+"")
    //const profilePictureBuffer = await fs.readFile(filePath + "");

    const user = await UserModel.findOne({ username: username });

    if(user !== null){
      user.heardFrom = heardFrom
      user.teachingGroup = teachingGroup
      user.classes = classes
      user.cv = file

      await user.save();
      res.status(201).send('Teacher changed successfully');
    } else {
      console.log("no user found with username: " + username)
    }
    
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/users/changePassword',upload.single('file') , async (req, res) => {
  try {
    // Connect to the database
    console.log("got in post changePassword")
    await connectToDatabase();

    //const { userDict } = req.body;
    const username = req.body.username;
    const newPassword = req.body.newPassword;
    

    console.log("post parameters: user-" + username+" pass-" + newPassword+"")//, profilePictureBuffer+"")
    //const profilePictureBuffer = await fs.readFile(filePath + "");

    const user = await UserModel.findOne({ username: username });

    if(user !== null){
      let encPass = encryptPassword(newPassword)

      user.password = encPass

      await user.save();
      res.status(201).send('Teacher changed successfully');
    } else {
      console.log("no user found with username: " + username)
    }
    
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/users/addTution', upload.single('file') , async (req, res) => {
  try {
    // Connect to the database
    console.log("got in post addclass")
    await connectToDatabase();

    // if (!req.file) {
    //   console.log("no file uploaded")
    //   return res.status(400).json({ error: 'No file uploaded' });
    // }

    //const { userDict } = req.body;
    

    //const file = req.file.buffer; // Access the uploaded file through req.file
    const selectedClass = req.body.class; // Access the username string
    const date = req.body.date;
    const time = req.body.time;
    const additionalInfo = req.body.additionalInfo;
    const wantTwoClasses = req.body.wantTwoClasses;
    const student = req.body.student
    const professor = req.body.professor
    const isConfirmed = 'false'
    const isDone = 'false'
    let comment = ''
    

    console.log("post parameters: " + student+" ", professor+" " + date + "")//, profilePictureBuffer+"")
    //const profilePictureBuffer = await fs.readFile(filePath + "");

    const tution = new TutionModel({
        selectedClass,
        date,
        time,
        additionalInfo,
        wantTwoClasses,
        student,
        professor,
        isConfirmed,
        isDone,
        comment
    })

    
    await tution.save();

    // res.set('Access-Control-Allow-Origin', "http://localhost:4200")
    // res.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    // res.set('Access-Control-Allow-Headers', '*');
    //res.set('Access-Control-Allow-Credentials', true);
    res.status(201).send('Tution created successfully');
    
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/users/confirmTution', upload.single('file') , async (req, res) => {
  try {
    // Connect to the database
    console.log("got in post confirmTution")
    await connectToDatabase();

    
    const selectedClass = req.body.class; // Access the username string
    const date = req.body.date;
    const time = req.body.time;
    const additionalInfo = req.body.additionalInfo;
    const wantTwoClasses = req.body.wantTwoClasses;
    const student = req.body.student
    const professor = req.body.professor
    const isConfirmed = req.body.isConfirmed
    const declineComment = req.body.declineComment
    
    const score = req.body.score
    const comment = req.body.comment
    
    //const isConfirmed = 'false'
    

    console.log("post parameters: " + student+" ", professor+" " + date + "")//, profilePictureBuffer+"")
    //const profilePictureBuffer = await fs.readFile(filePath + "");

    
    await TutionModel.updateOne({ student:student, professor: professor, date: date, time: time}, {$set:{
      isConfirmed: isConfirmed,
      declineComment: declineComment
    }})

    if(score){
      await TutionModel.updateOne({ student:student, professor: professor, date: date, time: time}, {$set:{
        score: score,
        comment: comment,
        isScored: "true"
      }})
    }

    // res.set('Access-Control-Allow-Origin', "http://localhost:4200")
    // res.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    // res.set('Access-Control-Allow-Headers', '*');
    //res.set('Access-Control-Allow-Credentials', true);
    res.status(201).send('Tution confirmed successfully');
    
  } catch (error) {
    console.error('Error fetching tutions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/users/addClass', upload.single('file') , async (req, res) => {
  try {
    // Connect to the database
    console.log("got in post confirmTution")
    await connectToDatabase();

    
    const name = req.body.name; // Access the username string
    const status = req.body.status;

    

    if(status === 'approved'){
      let c = await ClassModel.findOne({name: name})
      if(c){
        await ClassModel.updateOne({ name: name}, {$set:{
          status: 'approved'
        }})
      } else {
        let c = new ClassModel()
        c.name = name
        c.status = 'approved'

        await c.save();
      }

      console.log("approved class: " + name)
      return
    }
    

    let c = new ClassModel()
    c.name = name
    c.status = 'not approved'

    await c.save();
    console.log('Class added successfully: ' + name)

    res.status(201).send('Class added successfully');
    
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/users', async (req, res) => {
  try {
    // Connect to the database
    console.log("got in get users")
    await connectToDatabase();

    
    

    // Read user data from the JSON file
    // const usersData = await fs.readFile('./users.json', 'utf-8');
    // const users = JSON.parse(usersData);

    // // Insert users into the MongoDB collection
    // await UserModel.insertMany(users);

    // Fetch all users from the MongoDB collection
    let allUsers = await UserModel.find({});

    //console.log(allUsers)

    for(let user of allUsers){
      //console.log(user)
      user.profilePictureUrl = user.profilePicture?.toString('base64')

      user.cvUrl = user.cv?.toString('base64')

      user.password = decryptPassword(user.password)
    }

    // let pass = 'danilo'
    // let encPass = encryptPassword(pass)
    // console.log(encPass)
    // console.log(decryptPassword(encPass))

    
    //res.set('Access-Control-Allow-Origin', "http://localhost:4200")
    res.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/classes', async (req, res) => {
  try {
    // Connect to the database
    console.log("got in get classes")
    await connectToDatabase();

    
    let allClasses = await ClassModel.find({});

    //console.log(allClasses)

    res.json(allClasses);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/tutions', async (req, res) => {
  try {
    // Connect to the database
    console.log("got in get tutions")
    await connectToDatabase();

    
    let allTutions = await TutionModel.find({});

    //console.log(allClasses)

    res.json(allTutions);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


const crypto = require('crypto');

// Your secret encryption key (keep this secure)
const secretKey = 'your-secret-key';

// Function to encrypt a password
function encryptPassword(password: any) {
  const cipher = crypto.createCipher('aes-256-cbc', secretKey);
  let encryptedPassword = cipher.update(password, 'utf-8', 'hex');
  encryptedPassword += cipher.final('hex');
  return encryptedPassword;
}

// Function to decrypt a password
function decryptPassword(encryptedPassword: any) {
  const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
  let decryptedPassword = decipher.update(encryptedPassword, 'hex', 'utf-8');
  decryptedPassword += decipher.final('utf-8');
  return decryptedPassword;
}