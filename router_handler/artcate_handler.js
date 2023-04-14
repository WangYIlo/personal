//导入数据库
const db = require('../db/index')

//获取文章分类列表
exports.getArticleCates = (req, res) => {
    // 根据分类的状态，获取所有未被删除的分类列表数据
    // is_delete 为 0 表示没有被 标记为删除 的数据
    const sql = `select * from article_cate where admin_id=? and is_delete=0 `
    db.query(sql,req.user.id, (err, results) => {
        //sql语句执行失败
        if (err) return res.status(400).json(err)
        //执行成功
        res.send({
            status: 200,
            message: '获取文章分类列表成功！',
            data: results
        })
    })
}

//新增文章分类--传入name,alias
exports.addArticleCates = (req, res) => {
    //新增文章前,需要查询文章分类的名称以及别名是否被占用
    const sql = `select * from article_cate where name=? or alias=?`
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        //执行语句失败
        if (err) return res.status(400).json(err)
        //执行成功
        //1.名称与别名都被占用
        if (results.length === 2) return res.send({ status: '400', message: '分类名称与别名被占用，请更换后重试！' })
        //2.名称与别名有一个被占用
        if (results.length === 1 && results[0].name === req.body.name) return res.send({ status: '400', message: '分类名称被占用，请更换后重试！' })
        if (results.length === 1 && results[0].alias === req.body.alias) return res.send({ status: '400', message: '分类别名被占用，请更换后重试！' })
        console.log(results);
        //没有被占用---添加
        const insertSql = `insert into article_cate set ?`
        db.query(insertSql, { name: req.body.name, alias: req.body.alias,admin_id:req.user.id }, (err, results) => {
            //执行语句失败
            if (err) return res.status(400).json(err)

            //执行成功,但是影响行数不等于1
            if (results.affectedRows !== 1) return res.send({ status: 404, message: '新增文章分类失败！' })

            res.send({
                status: 200,
                message: '新增文章分类成功！'
            })

        })
    })
}

//根据id删除文章分类--params为id--通过req.params获取
exports.deleteCateById = (req, res) => {
    //将该文章的is_delete=1
    const sql = `update article_cate set is_delete=1 where id=?`
    db.query(sql, req.params.id, (err, results) => {
        //执行语句失败
        if (err) return res.status(400).json(err)

        //执行语句成功
        //但影响行数不等于1--没有删除
        if (results.affectedRows !== 1) return res.send({ status: 400, message: '删除文章分类失败--文章id不存在' })

        //删除成功
        res.send({
            status: 200,
            message: '删除文章分类成功'
        })
    })
}

//根据id获取文章分类数据--params为id--通过req.params获取
exports.getCateById = (req, res) => {
    const sql = `select * from article_cate where id=?`
    db.query(sql, req.params.id, (err, results) => {
        //语句执行失败
        if (err) return res.status(400).json(err)

        //语句执行成功
        //没有找到
        if (results.length !== 1) return res.send({ status: 404, message: '获取文章分类数据失败--文章id不存在！' })

        //找到
        res.send({
            status: 200,
            message: '获取文章分类数据成功!',
            data: results[0]
        })
    })
}

//根据id更新文章分类数据--传入 id name alias
exports.updataCateById = (req, res) => {
    //需要判断修改别名,名称存不存在
    const sql = `select * from article_cate where name=? or alias=?`
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        //执行语句失败
        if (err) return res.status(400).json(err)
        //执行成功
        //1.名称与别名都被占用
        if (results.length === 2) return res.send({ status: '400', message: '分类名称与别名被占用，请更换后重试！' })
        //2.名称与别名有一个被占用
        if (results.length === 1 && results[0].name === req.body.name) return res.send({ status: '400', message: '分类名称被占用，请更换后重试！' })
        if (results.length === 1 && results[0].alias === req.body.alias) return res.send({ status: '400', message: '分类别名被占用，请更换后重试！' })

        //更新文章
        const updateSql = `update article_cate set ? where id=?`
        db.query(updateSql, [{ name: req.body.name, alias: req.body.alias }, req.body.id], (err, results) => {
            //执行语句失败
            if (err) return res.status(400).json(err)

            if(results.affectedRows!==1) return res.send({status:404,message:'更新文章分类失败--文章id不存在！'})

            res.send({
                status:200,
                message:'更新文章分类成功!'
            })
        })
    })
}