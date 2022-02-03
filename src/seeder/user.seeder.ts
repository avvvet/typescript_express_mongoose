import User from "../models/User"
import dbConnect from '../config/db'
import Departments from "../models/Departments"

dbConnect()

const seeder = async () => {
    const departmentData = [
        {
            _id : "61f3fea0025189a254d6d036",
            name : "Blue Department",
            description : "blue office",
        },
        {
            _id : "61f4fea72f9c3d47f3407c98",
            name : "Green Department",
            description : "green office",
        }
    ]

    const userData = [
    {
        first_name : "Jon",
        last_name : "Martin",
        department : {
            _id : "61f3fea0025189a254d6d036",
            name : "blue office"
        },
        role : "ADMIN",
        email : "admin@gmail.com",
        username : "admin@gmail.com",
        password: '$2b$10$Nh5yLLtcnea6/iMp2O424.jxKq.I7FYr4IGU8627tFoH.XQBuabpa'
      },
      {
        first_name : "Sam",
        last_name : "kotex",
        department : {
            _id : "61f3fea0025189a254d6d036",
            name : "blue office"
        },
        role : "ADMIN",
        email : "sam@gmail.com",
        username : "sam@gmail.com",
        password: '123456'
      },
      {
        first_name : "Mark",
        last_name : "Onega",
        department : {
            _id : "61f3fea0025189a254d6d036",
            name : "blue office"
        },
        role : "ADMIN",
        email : "mark@gmail.com",
        username : "mark@gmail.com",
        password: '123456'
      },
      {
        first_name : "Debra",
        last_name : "zerogo",
        department : {
            _id : "61f4fea72f9c3d47f3407c98",
            name : "green office"
        },
        role : "DEPARTMENT_MANAGER",
        email : "dep@gmail.com",
        username : "dep@gmail.com",
        password: '$2b$10$r.3O8Y4xhUi.wdsSWIc.b..ZEgeb0r67qkRpvCMwJWE/XGIyuECfG'
      },
      {
        first_name : "toby",
        last_name : "onogoba",
        department : {
            _id : "61f4fea72f9c3d47f3407c98",
            name : "green office"
        },
        role : "EMPLOYEE",
        email : "toby@gmail.com",
        username : "toby@gmail.com",
        password: '123456'
      },
      {
        first_name : "Freeman",
        last_name : "togo",
        department : {
            _id : "61f4fea72f9c3d47f3407c98",
            name : "green office"
        },
        role : "EMPLOYEE",
        email : "freeman@gmail.com",
        username : "freem@gmail.com",
        password: '123456'
      },
    ]

    Departments.collection.drop().then((result) => {
        if(result) {
            console.log('department collection droped ...')
            Departments.insertMany(departmentData).then((docs) => {
                console.log("\x1b[32m", 'department seed created ...')
            })
        }
    })

    User.collection.drop().then((result) => {
        if(result) {
            console.log('user collection droped ...')
            User.insertMany(userData).then((docs) => {
                console.log("\x1b[32m", 'user seed created ...')
            })
        }
    })
   
}

seeder()


