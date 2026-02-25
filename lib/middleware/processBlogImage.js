import sharp from "sharp";

const MAX_WIDTH = 1200;
const JPG_QUALITY = 82;

export const processBlogImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file found" });
        }

        // Process image with Sharp and get buffer
        const processedBuffer = await sharp(req.file.buffer)
            .rotate() // auto-orient (EXIF)
            .resize({
                width: MAX_WIDTH,
                withoutEnlargement: true
            })
            .jpeg({
                quality: JPG_QUALITY,
                mozjpeg: true
            })
            .toBuffer();

        // Pass final Base64 image URL to next handler
        req.body.image = `data:image/jpeg;base64,${processedBuffer.toString('base64')}`;

        next();
    } catch (error) {
        console.error("Image processing failed:", error);
        res.status(500).json({
            message: "Image processing failed"
        });
    }
};
