const express=require('express')
const router=express.Router()

// 导入文章的路由处理函数模块
const article_handler = require('../router_handler/article_handler')

//导入解析formdata格式表单数据的包
const multer=require('multer')
// 导入处理路径的核心模块
const path = require('path')

// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') })

//发布新文章
//upload.single() 表示上传单个文件,参数为提交表单数据对应的key
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
router.post('/add', upload.single('cover_img'),article_handler.addArticle)

//获取用户全部文章
router.get('/list',article_handler.getArticle)

//获取用户文章--根据分类类名
// router.post('/listByName',article_handler.getArticleByName)
// //获取用户文章--根据发布状态
// router.post('/listByState',article_handler.getArticleByState)
//获取用户文章---加限定条件
router.post('/listByDetail',article_handler.getArticleByDetail)


//获取用户详情
router.get('/info',article_handler.getArticleInfo)
//删除文章
router.delete('/info',article_handler.deleteArticleInfo)

module.exports=router