const express = require('express');

//bring in mongoose
const mongoose = require('mongoose');

//method-override
const methodOverride = require('method-override');

const Data = require('./models/Data');

const dataRouter = require('./routes/data');

const app = express();

//connect to mongodb
mongoose.connect('mongodb+srv://namxmi:Bongthoi12@cluster0.dokml.mongodb.net/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

//set template engine

app.set('view engine', 'hbs');
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));

//route for main page

app.get('/', async (req, res) => {

    let dataItem = await Data.find().sort({timeCreated: 'desc'}) ;

    res.render('index', { dataItem: dataItem });
});


app.use(express.static("public"));
app.use('/data', dataRouter);

app.listen(process.env.PORT || 5000);