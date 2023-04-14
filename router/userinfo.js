// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()

const userHandler=require('../router_handler/userinfo_handler')

//获取用户的基本信息
router.get('/userinfo',userHandler.getUserInfo )
//更新用户基本信息
router.post('/userinfo',userHandler.updataUserInfo)
//重置密码
router.post('/updatepwd',userHandler.updataPassword)
//更换头像
router.post('/update/avatar',userHandler.upadteAvatar)
//获取侧边栏数据
router.get('/menus',userHandler.getAside)
// 向外共享路由对象
module.exports = router