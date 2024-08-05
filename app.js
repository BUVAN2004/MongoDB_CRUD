const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const exhbs = require('express-handlebars');
const dbo = require('./db');
const ObjectID = dbo.ObjectID;

app.engine('hbs',exhbs.engine({layoutsDir:'views/', defaultLayout:"main", extname:'hbs'}))
app.set('view engine','hbs');
app.set('views' ,'views');
app.use(bodyparser.urlencoded({extended: true}));


app.get('/',async(req,res)=>{
    let message;
    let database = await dbo.getdatabase();
    const collection = database.collection('employees');
    const cursor = collection.find({});
    let data = await cursor.toArray();

    let edit_id,edit_employee;
    if(req.query.edit_id){
        edit_id = req.query.edit_id;
        edit_employee = await collection.findOne({_id: new ObjectID(edit_id)});
    }

    if(req.query.delete_id){
        await collection.deleteOne({id : ObjectID(delete_id)});
        return res.redirect('/?status=3');
    }

    switch(req.query.status){
        case '1':
            message = "Create(Insertion) Operation Done successfully";
            break;
        case '2':
            message = "Updation(Edit) operation done successfully";
            break;
        case '3':
            message = "Delete operation done successfully";
            break;
        default:
            message="No operation performed";
    }


    res.render('main',{message, data, edit_id, edit_employee});
})

app.post('/save_employee', async (req,res)=>{
    let database = await dbo.getdatabase();
    const collection = database.collection('employees');
    let data = { name: req.body.name, age: req.body.age, designation: req.body.designation};
    await collection.insertOne(data);
    return res.redirect('/?status=1')
})

app.post('/update_employee/:edit_id', async (req,res)=>{
    let database = await dbo.getdatabase();
    const collection = database.collection('employees');
    let data = { name: req.body.name, age: req.body.age, designation: req.body.designation};
    let edit_id = req.params.edit_id;
    await collection.updateOne({_id: new ObjectID(edit_id)},{ $set: data});
    return res.redirect('/?status=2')
})

app.listen(8000,()=>{console.log('Listening to 8000 port');})
