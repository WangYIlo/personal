const db = require('../db/index')
const path = require('path')

//添加文章
exports.addArticle = (req, res) => {
  // 处理文章的信息对象
  const articleInfo = {
    // 标题、内容、发布状态、所属分类的Id
    ...req.body,
    // 文章封面的存放路径
    cover_img: path.join('/uploads', req.file.filename),
    // 文章的发布时间
    pub_date: new Date(),
    // 文章作者的Id
    admin_id: req.user.id,
  }
  console.log(articleInfo);
  const sql = `insert into articles set ?`
  db.query(sql, articleInfo, (err, results) => {
    if (err) return res.status(400).json(err)
    if (results.affectedRows !== 1) return res.send({ status: 400, message: '发布文章失败' })
    res.send({
      status: 200,
      message: "发布文章成功"
    })
  })
}

//获取文章--需要接收-cate_id,state,user_id(通过请求头token可以获取)
exports.getArticle = (req, res) => {
  const sql = `select * from articles where admin_id=? and is_delete=0 `
  db.query(sql, req.user.id, (err, results) => {
    //sql执行执行失败
    if (err) return res.status(400).json(err)
    //成功
    res.send({
      status: 200,
      message: '获取文章成功！',
      data: results
    })
  })
}


// 根据文章类名名字获取文章---接收 query:cate_name--中文需要处理 暂时时候data接收   admin_id--haeder   
exports.getArticleByName = (req, res) => {
  const sql = `select * from articles where (admin_id=? and cate_name=?) and  is_delete=0`
  db.query(sql, [req.user.id, req.body.cate_name], (err, results) => {
    if (err) return res.status(400).json(err)

    //成功
    res.send({
      status: 200,
      message: '获取文章成功！',
      data: results
    })
  })
}

//根据文章状态获取文章--data接收 state admin_id
exports.getArticleByState = (req, res) => {
  const sql = `select * from articles where (admin_id=? and state=?) and  is_delete=0`
  db.query(sql, [req.user.id, req.body.state], (err, results) => {
    if (err) return res.status(400).json(err)

    // if(res.length)
    //成功
    res.send({
      status: 200,
      message: '获取文章成功！',
      data: results
    })
  })
}



// 结合上面2种综合--根据文章状态，类名
exports.getArticleByDetail = (req, res) => {
  // 只有文章状态--data接收 state admin_id
  if (req.body.cate_name && !req.body.state) {
    const sql = `select * from articles where (admin_id=? and cate_name=?) and  is_delete=0`
    db.query(sql, [req.user.id, req.body.cate_name], (err, results) => {
      if (err) return res.status(400).json(err)

      //成功
      return res.send({
        status: 200,
        message: '获取文章成功！',
        data: results
      })
    })
  }
   // 只有文章类名--data接收 state admin_id
  if (req.body.state && !req.body.cate_name) {
    const sql = `select * from articles where (admin_id=? and state=?) and  is_delete=0`
    db.query(sql, [req.user.id, req.body.state], (err, results) => {
      if (err) return res.status(400).json(err)
      //成功
      return res.send({
        status: 200,
        message: '获取文章成功！',
        data: results
      })
    })
  }

  if (req.body.state && req.body.cate_name) {
    const sql = `select * from articles where admin_id=? and state=? and cate_name=? and is_delete=0`
    db.query(sql, [req.user.id,req.body.state, req.body.cate_name], (err, results) => {
      if (err) return res.status(400).json(err)
      //成功
      res.send({
        status: 200,
        message: '获取文章成功！',
        data: results
      })
    })   
  }

}

//获取文章详情
exports.getArticleInfo=(req,res)=>{
  const sql=`select * from articles where id=?`
  db.query(sql,req.query.id,(err,results)=>{
    if (err) return res.status(400).json(err)
    //成功
    if(results.length!==1) return res.send({status:400,message:'文章详情打开失败'})

    userInfo={...results[0],admin:req.user.username,nickname:req.user.nickname}
    res.send({
      status: 200,
      message: '获取文章成功！',
      data: userInfo
    })
  })
}

//删除文章
exports.deleteArticleInfo=(req,res)=>{
  const sql=`update articles set is_delete=1 where id=?`
  db.query(sql,req.query.id,(err,results)=>{
    if (err) return res.status(400).json(err)
    //影响行数不等于1
    if(results.affectedRows!==1) return res.send({status:400,message:'文章删除失败'})
    //成功
    res.send({
      status: 200,
      message: '文章删除成功！',
    })
  })
}