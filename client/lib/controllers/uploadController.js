const getBase64URI = (file) => {
    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
};

export const uploadBlogImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const imageUrl = getBase64URI(req.file);
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Internal Server Error during upload', error: error.message });
    }
};

export const uploadServiceImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const imageUrl = getBase64URI(req.file);
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error('Service Upload Error:', error);
        res.status(500).json({ message: 'Internal Server Error during upload', error: error.message });
    }
};

export const uploadSolutionImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const imageUrl = getBase64URI(req.file);
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error('Solution Upload Error:', error);
        res.status(500).json({ message: 'Internal Server Error during upload', error: error.message });
    }
};

export const uploadLeadershipImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const imageUrl = getBase64URI(req.file);
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error('Leadership Upload Error:', error);
        res.status(500).json({ message: 'Internal Server Error during upload', error: error.message });
    }
};

export const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const imageUrl = getBase64URI(req.file);
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error('Profile Upload Error:', error);
        res.status(500).json({ message: 'Internal Server Error during upload', error: error.message });
    }
};
