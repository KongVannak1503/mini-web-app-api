const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

function dynamicUploader(fieldName = 'file', subfolder = 'default') {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadDir = path.join(__dirname, '../uploads', subfolder);
            ensureDirectoryExists(uploadDir);
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueName = `${Date.now()}-${file.originalname}`;
            cb(null, uniqueName);
        },
    });

    const fileFilter = (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            cb(null, true);
        } else {
            cb(new Error('Only images or PDFs are allowed'));
        }
    };

    return multer({ storage, fileFilter }).single(fieldName);
}

module.exports = { dynamicUploader };
