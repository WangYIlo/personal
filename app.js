//导入express
const express = require('express')
const bodyParser = require('body-parser')
//创建服务器实例对象
const app = express()

//导入并配置cors中间件
const cors = require('cors')
app.use(cors())

// 使用body-parser中间件----express也将其作为内置中间件
// 配置解析表单数据的中间件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//托管静态资源文件----注意需要放在最上面
app.use('/uploads',express.static('./uploads'))

//配置解析Token的中间件
const expressJWT = require('express-jwt')
const config = require('./config')

//除了api注册登录接口，其他接口都是有权限接口，需要进行 Token 身份认证
app.use(expressJWT({secret:config.jwtSecretKey}).unless({ path: [/^\/api\//]}))


// 处理用户登录注册相关的路由
const adminRouter = require('./router/admin')
// 导入并使用用户信息路由
const userinfoRouter=require('./router/userinfo')
// 导入文章类别管理路由
const artCateRouter=require('./router/artcate')
//导入文章管理路由
const articleRouter=require('./router/article')

//注册 登录路由
app.use('/api', adminRouter)
//注册 用户信息路由
app.use('/my', userinfoRouter)
//注册 文章类别管理路由
app.use('/my/article',artCateRouter)
//注册 文章管理路由
app.use('/my/article',articleRouter)


//定义错误级别的中间件
app.use((err, req, res, next) => {
    //身份认证失败
    if (err.name === "UnauthorizedError") return res.status(401).send("身份认证失败");
    //未知错误
    res.status(401).send('未知错误...')
})

app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007')
})