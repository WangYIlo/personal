const db = require('../db/index')
const jwt=require('jsonwebtoken')
const bcrypt =require('bcryptjs')

const config=require('../config')
//注册
exports.register = (req, res) => {
    const admin_info = req.body
    //检测用户名和密码是否为空
    if (!admin_info.username || !admin_info.password) return res.json({ status: 400, message: '用户名或密码为空' })
    //检测用户名是否被占有
    const sql = `select * from admin where username= ?`
    db.query(sql,admin_info.username,(err,results)=>{
        if(err) return res.send({
            status:404,
            message:err.message
        })
        if(results.length>0) return res.send({status: 400, message: '用户名已存在,请重新注册!'})

      //注册成功  
      //利用bcrypt对密码进行加密
      admin_info.password=bcrypt.hashSync(admin_info.password,10)
      //   const registerSql=`insert into admin (name,password,identify) values(?,?,?)`
      //便捷方式--当数据对象的每个属性与数据表字段一一对应
      const registerSql = 'insert into admin set ?'
      db.query(registerSql,{username:admin_info.username,password:admin_info.password},(err,results)=>{
        if (err) return res.status(400).json(err)
        if(results.affectedRows !== 1) return res.send({status: 404, message: '注册失败，请稍后再试！'})
        res.send({
            status:200,
            message:'注册成功!',
        })
      })
    })
}

//登录
exports.login = (req, res) => {
    const admin_info=req.body
    const sql=`select * from admin where username=?`
    db.query(sql,admin_info.username,(err,resluts)=>{
        if(err) return res.status(400).json(err)
        if(resluts.length!==1) return res.send({status:404,message:'用户名不存在'})
        //判断用户输入的密码是否正确
        const compareResult = bcrypt.compareSync(admin_info.password, resluts[0].password)
        //如果对比结果为flase
        if(!compareResult) return res.send({status:400,message:'用户名或密码不正确,请重新输入'})

        // 剔除完毕之后,amin 中只保留了用户的 id, username, nickname, email 这四个属性的值
        // 需要将password,user_pic置空
        const admin={ ...resluts[0], password: '', user_pic: '' }
        const tokenStr=jwt.sign(admin,config.jwtSecretKey,{expiresIn:'10h'})

        res.send({
            status:200,
            message:'登录成功',
            token:'Bearer '+tokenStr
        })

    })
}