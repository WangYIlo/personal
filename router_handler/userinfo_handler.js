const db = require('../db/index')
const bcrypt = require('bcryptjs')

//获取用户基本信息---根据用户id进行查找(token中包含了id)
//req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
exports.getUserInfo = (req, res) => {
    //根据用户的id，查询用户基本信息--排除password
    const sql = `select id,username,nickname,email,user_pic from admin where id=?`
    db.query(sql, req.user.id, (err, results) => {
        //执行语句失败
        if (err) return res.status(400).json(err)
        //执行成功--需要判断有无找到
        if (results.length !== 1) return res.send({ status: 404, message: '获取用户信息失败' })
        //查找到 需要将用户信息响应给客户端
        res.send({
            status: 200,
            message: '获取用户基本信息成功',
            data: results[0]
        })
    })
}

//更新用户基本信息--接收id,nickname,email
exports.updataUserInfo = (req, res) => {
    const users = {}
    if (req.body.id) users.id = req.body.id
    if (req.body.nickname) users.nickname = req.body.nickname
    if (req.body.email) users.email = req.body.email
    const sql = `update admin set ? where id=?`
    db.query(sql, [users, req.body.id], (err, results) => {
        //执行语句失败
        if (err) return res.status(400).json(err)
        //成功--但是查找不到
        if (results.affectedRows !== 1) return res.send({ status: 404, message: '修改用户信息失败' })

        //修改成功
        return res.send({
            status: 200,
            message: '修改用户信息成功！'
        })
    })
}

//重置密码---接收oldPwd,newPwd
exports.updataPassword = (req, res) => {
    //先根据id查找用户存不存在
    const sql = `select * from admin where id=?`
    db.query(sql, req.user.id, (err, results) => {
        //执行语句失败
        if (err) return res.status(400).json(err)
        //用户不存在
        if (results.length !== 1) return res.send({ status: 404, message: '用户不存在' })

        //需要判断提交的旧密码是否正确
        // 即可使用 bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.send({ status: 400, message: '原密码不正确' })
        //更新成功---执行语句
        const updateSql = `update admin set password=? where id=?`
        //对新密码进行加密处理
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        db.query(updateSql, [newPwd, req.user.id], (err, results) => {
            //执行语句失败
            if (err) return res.status(400).json(err)
            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.send({status:400,messgae:'更新密码失败！'})
            res.send({
                status: 200,
                message: '密码更新成功'
            })
        })

    })
}

//更换头像---接收base64格式的字符串avatar
exports.upadteAvatar=(req,res)=>{
    const sql=`update admin set user_pic=? where id=?`
    db.query(sql,[req.body.avatar,req.user.id],(err,results)=>{
        //执行sql失败
        if(err) return res.status(400).json(err)
        //用户不存在--影响行数不为1
        if(results.affectedRows!==1) return res.send({status:404,message:'更新头像失败'}) 
        //更新成功
        return res.send({
            status:'200',
            message:'更新成功'
        })
    })
}

//获取侧边栏数据
exports.getAside=(req,res)=>{
    res.send({
        status:200,
        "message": "获取左侧菜单成功！",
        "data": [
            {
                "indexPath": "/home",
                "title": "首页",
                "icon": "el-icon-s-home",
                "children": null
            },
            {
                "indexPath": "2",
                "title": "文章管理",
                "icon": "el-icon-s-order",
                "children": [
                    {
                        "indexPath": "/art-cate",
                        "title": "文章分类",
                        "icon": "el-icon-s-data"
                    },
                    {
                        "indexPath": "/art-list",
                        "title": "文章列表",
                        "icon": "el-icon-document-copy"
                    }
                ]
            },
            {
                "indexPath": "3",
                "title": "个人中心",
                "icon": "el-icon-user-solid",
                "children": [
                    {
                        "indexPath": "/user-info",
                        "title": "基本资料",
                        "icon": "el-icon-s-operation"
                    },
                    {
                        "indexPath": "/user-avatar",
                        "title": "更换头像",
                        "icon": "el-icon-camera"
                    },
                    {
                        "indexPath": "/user-pwd",
                        "title": "重置密码",
                        "icon": "el-icon-key"
                    }
                ]
            }
        ]
    })
}