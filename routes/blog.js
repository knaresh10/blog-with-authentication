const { Router } = require('express')
const multer = require('multer')
const path = require('path')

const Blog = require('../models/blog')
const router = Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('./public/uploads'))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
      cb(null, fileName)
    }
})

const upload = multer({ storage: storage })

router.get("/add_new", (req, res) => {
    res.render('addblog', {
        user: req.user
    })
})

router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy')
    console.log(blog)
    res.render('blogview', {
        user: req.user,
        blog: blog
    })
})
router.post('/', upload.single('coverImage'), async (req, res) => {
    const {title, body} = req.body
    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`
    })
    res.redirect(`blog/${blog._id}`)
})



module.exports = router
