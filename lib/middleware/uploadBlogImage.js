import multer from "multer";

const uploadBlogImage = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Only image files allowed"), false);
        } else {
            cb(null, true);
        }
    }
});

export default uploadBlogImage;
