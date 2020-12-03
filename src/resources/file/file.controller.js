const multer = require('multer')
const path = require('path');
const {v4: uuidv4} = require('uuid')
const File = require('./file.model')

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'uploads')
    },
    filename: (req,file,cb) => {
        const newFileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${path.extname(file.originalname)}`;
        cb(null,newFileName)
    }
})

const upload = multer({storage: storage, limits:{fileSize:1000000*100},}).single('fileField');

const handleGetFile = (req,res) => {
    //handle file get upon get request
    console.log("Get request on file api route.")
    res.send({"message":"Get request on file api route."})
}

const handleUploadFile = (req,res) => {
    //handle file upload
    console.log("Post request on file api route.")

    upload(req, res, async (err) => {
        if(!req.file){
            res.status(401).json({error:"File not present"}).end()
        }

        const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
        })

        const responseFile = await file.save();
        res.json({ file: `${process.env.APP_BASE_URL}/files/${responseFile.uuid}` });
    })

}

const handleShowFile = async (req,res) => {
    try{
        const uuid = req.params.uuid
        const file = await File.findOne({uuid}).lean().exec()

        if(!file){
            //file not found
            res.status(400).json({'message':"Either the link has been expired or no such file is present."})
        }

        return res.json({ uuid: file.uuid, fileName: file.filename, fileSize: file.size, downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}` });
    } catch(err){
        res.status(400).json({'message':"Something went wrong."})
    }

}

const handleDownloadFile = async (req,res) => {
    try {
        const uuid = req.params.uuid
        const file = await File.findOne({uuid}).lean().exec()

        if(!file){
            //file not found
            res.status(400).json({'message':"Either the link has been expired or no such file is present."})
        }
        const downloadLink = `${__dirname}/../../../${file.path}`  
        return res.download(downloadLink)
        
    } catch (error) {
        console.log(`error: ${error}`)
        res.status(400).json({'message':"Something went wrong."})

    }
}

const handleSendEmail = (req,res) => {
    try {
        const {uuid, emailTo, emailFrom} = req.body

        if(!uuid || !emailFrom || !emailTo){
            res.status(400).json({'error':"All fields are required."}).end()
        }

    } catch (error) {
        
    }
}

module.exports = {handleUploadFile,handleGetFile,handleShowFile,handleDownloadFile,handleSendEmail}