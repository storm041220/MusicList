//data routes

const { request } = require('express');
const express = require('express');

const Data = require('./../models/Data');

const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({

    //destination for files
    destination: function (req, file, callback) {
        callback(null, './public/uploads/images');
    },

    //add back the extension
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});

//upload parameters for multer
const upload = multer({
    storage: storage,
    limits:{
        fieldSize: 1024*1024*3,
    }
});

//routes list
router.get('/list', async (req,res)=>{
    let dataItem = await Data.find().sort({timeCreated: 'desc'}) ;

    res.render('list', { dataItem: dataItem });
});

router.get('/create', (req, res) => {
    res.render('create');
});


//view detail
router.get('/:slug', async (req, res) => {
    let data = await Data.findOne({ slug: req.params.slug });

    if (data) {
        res.render('detail', { data: data });
    } else {
        res.redirect('/');
    }
});

//handles new post
router.post('/', upload.single('image'), async (req, res) => {
    // console.log(req.body);
    let data = new Data({
        title: req.body.title,
        price: req.body.price,
        amount: req.body.amount,
        made: req.body.made,
        description: req.body.description,
        img: req.file.filename,
    });


    try {
        data = await data.save();
        console.log(data.id);
        console.log(data.slug);
        res.redirect(`data/${data.slug}`);
    } catch (error) {
        res.send(error);
    }
});

router.get('/edit/:id', async (req, res) => {
    let data = await Data.findById(req.params.id);
    res.render('edit', { data: data });
})

//routes handle update
router.put('/:id', async (req, res) => {
    req.data = await Data.findById(req.params.id);
    let data = req.data;
    data.title = req.body.title,
        data.price = req.body.price,
        data.amount = req.body.amount,
        data.made = req.body.made,
        data.description = req.body.description

    try {
        data = await data.save();
        res.redirect(`/data/${data.slug}`);
    } catch (error) {
        res.send(error);
    }
});

//routes delete
router.delete('/:id', async (req, res) => {
    await Data.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

module.exports = router;