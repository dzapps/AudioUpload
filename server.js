var express = require('express');
var app = express();

app.set('view engine', 'ejs');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('html', require('ejs').renderFile);

var helpers = require('express-helpers');
helpers(app);

app.use(express.static(__dirname + '/public/'));
app.use(express.static(__dirname + '/public/uploads'));

var server = app.listen(process.env.PORT, function () {
    console.log("server started")
});

//mongodb set up
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var db;
var FILE_COLLECTION = "files";

mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    db = database;
    console.log("connected to db");
});

//file uploads with multer
/********************************************************************/
var path = require('path');
var multer = require('multer');
var crypto = require('crypto');
var storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) return cb(err);

            cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
});
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(mp3|wav|ogg)$/)) {
            return cb(null, false, new Error('err: file type'));
        }
        cb(null, true);
    }

});

app.post('/process_upload', upload.single('myfile'), function (req, res) {

    if (req.file) {
        req.file.score = 0;
       

        //store file info into db only if it is an audio file
        db.collection(FILE_COLLECTION).insertOne(req.file, function (err, doc) {
            if (err) {
                handleError(res, err.message, "db Error: adding file");
                res.end('Error adding file info into db.');
            } else {
                res.render('upload_pages/confirm', {s: req.file});
               
            }
        });
    }
    else if (Error) {
        res.render('upload_pages/errorPage');

    }
});
/********************************************************************/



app.get('/', function (req, res) {
    res.render('index');
});

app.get('/home', function (req, res) {
    res.render('index');
});

app.get('/upload', function (req, res) {
    res.render('upload_pages/upload');
});


app.get('/files', function (req, res) {
    //recent uploads

    db.collection(FILE_COLLECTION).find({}).sort({x: -1}).toArray(function (err, docs) {
        if (err) {
            handleError(res, err.message, "Error");
        } else {
            res.render('files_pages/recentUploads', {allFiles: docs});
        }
    });
});

app.get('/featured', function (req, res) {
    //top 5 uploads by score

    db.collection(FILE_COLLECTION).find({}).limit(5).sort({score: -1}).toArray(function (err, docs) {
        if (err) {
            handleError(res, err.message, "Error");
        } else {
            res.render('files_pages/topUploads', {allFiles: docs});
        }
    });
});


app.get('/files/:id', function (req, res) {
    //files by id

    db.collection(FILE_COLLECTION).findOne({_id: new ObjectID(req.params.id)}, function (err, doc) {
        if (err) {
            handleError(res, err.message, "db Error: getting file by id");
        } else {
            res.render('playSong', {doc});
        }
    });
});

app.get("/score/:id", function (req, res) {
    //score by id

    db.collection(FILE_COLLECTION).findOne({_id: new ObjectID(req.params.id)}, function (err, doc) {
        if (err) {
            handleError(res, err.message, "db Error: getting file by id");
        } else {
            res.send(''+doc.score);
        }
    });
});


app.post("/like/", function (req, res) {

    var songID = req.body.SongID;
    //score++
    db.collection(FILE_COLLECTION).update({_id: new ObjectID(songID)}, {$inc: {score: 1}}, function (err, doc) {
        if (err) {
            handleError(res, err.message, "db Error: getting file by id");
        } else {
            
            res.sendStatus(200);
        }
    });

});



app.post("/dislike/", function (req, res) {

    var songID = req.body.SongID;
    //score--
    db.collection(FILE_COLLECTION).update({_id: new ObjectID(songID)}, {$inc: {score: -1}}, function (err, doc) {
        if (err) {
            handleError(res, err.message, "db Error: getting file by id");
        } else {
            
            res.sendStatus(200);
        }
    });

});


