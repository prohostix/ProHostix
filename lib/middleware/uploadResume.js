import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = "uploads/resumes";

// Ensure folder exists
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadPath);
    },
    filename(req, file, cb) {
        const uniqueName = `resume-${Date.now()}${path.extname(
            file.originalname
        )}`;
        cb(null, uniqueName);
    }
});

function checkFileType(file, cb) {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname || mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Accepting only PDF/DOC/DOCX files"));
    }
}

const uploadResume = multer({
    storage,
    fileFilter(req, file, cb) {
        checkFileType(file, cb);
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

export default uploadResume;
