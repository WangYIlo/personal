// @login && register
const express=require('express')
const router=express.Router()


const admin_handler=require('../router_handler/admin_handler')


//登录路由
router.post('/login',admin_handler.login)

//注册路由
router.post('/register',admin_handler.register)

module.exports=router