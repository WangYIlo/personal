//导入express
const express =require('express')
//创建路由对象
const router =express.Router()
const artcate_handler = require('../router_handler/artcate_handler')

//获取文章分类列表
router.get('/cates',artcate_handler.getArticleCates)

//新增文章分类
router.post('/addcates',artcate_handler.addArticleCates)

//根据id删除文章分类
router.delete('/deletecate/:id',artcate_handler.deleteCateById)

//根据id获取文章分类
router.get('/cates/:id',artcate_handler.getCateById)

//根据id更新文章分类
router.post('/updatecate',artcate_handler.updataCateById)

//  向外共享路由对象
module.exports=router