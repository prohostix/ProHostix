import Enquiry from '../models/Enquiry.js';
import JobApplication from '../models/JobApplication.js';
import Subscriber from '../models/Subscriber.js';

// @desc    Create new enquiry
// @route   POST /api/enquiries
// @access  Public
export const createEnquiry = async (req, res) => {
    try {
        const enquiry = new Enquiry(req.body);
        const createdEnquiry = await enquiry.save();
        res.status(201).json(createdEnquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private/Admin
export const getEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        res.json(enquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create job application
// @route   POST /api/enquiries/careers
// @access  Public
export const createJobApplication = async (req, res) => {
    try {
        const applicationData = { ...req.body };

        // Handle file upload
        if (req.file) {
            applicationData.resume = req.file.path.replace(/\\/g, "/"); // Normalize path
        } else if (typeof applicationData.resume === 'object') {
            // Clean up if resume is passed as empty object/stringified object when no file
            delete applicationData.resume;
        }

        const application = new JobApplication(applicationData);
        const createdApplication = await application.save();
        res.status(201).json(createdApplication);
    } catch (error) {
        console.error("Job Application Error:", error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get job applications
// @route   GET /api/enquiries/careers
// @access  Private/Admin
export const getJobApplications = async (req, res) => {
    try {
        const applications = await JobApplication.find().sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Subscribe to newsletter
// @route   POST /api/enquiries/subscribe
// @access  Public
export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        const exists = await Subscriber.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: 'Email already subscribed' });
        }
        const subscriber = new Subscriber({ email });
        await subscriber.save();
        res.status(201).json(subscriber);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get subscribers
// @route   GET /api/enquiries/subscribe
// @access  Private/Admin
export const getSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find().sort({ createdAt: -1 });
        res.json(subscribers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark all enquiries as read
// @route   PUT /api/enquiries/mark-all-read
// @access  Private/Admin
export const markAllEnquiriesRead = async (req, res) => {
    try {
        await Promise.all([
            Enquiry.updateMany({ status: 'new' }, { status: 'contacted' }),
            Subscriber.updateMany({ status: 'new' }, { status: 'read' }),
            JobApplication.updateMany({ status: 'received' }, { status: 'reviewing' })
        ]);
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const deleteEnquiry = async (req, res) => {
    try {
        console.log('Backend: Attempting to delete enquiry with ID:', req.params.id);
        const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
        if (!enquiry) {
            console.log('Backend: Enquiry NOT found with ID:', req.params.id);
            return res.status(404).json({ message: 'Enquiry not found' });
        }
        console.log('Backend: Enquiry successfully removed with ID:', req.params.id);
        res.json({ message: 'Enquiry removed' });
    } catch (error) {
        console.error('Backend: Delete Enquiry Error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteJobApplication = async (req, res) => {
    try {
        console.log('Backend: Attempting to delete job application with ID:', req.params.id);
        const application = await JobApplication.findByIdAndDelete(req.params.id);
        if (!application) {
            console.log('Backend: Job Application NOT found with ID:', req.params.id);
            return res.status(404).json({ message: 'Application not found' });
        }
        console.log('Backend: Job Application successfully removed with ID:', req.params.id);
        res.json({ message: 'Application removed' });
    } catch (error) {
        console.error('Backend: Delete Job Application Error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteSubscriber = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Subscriber ID is required' });
        }

        const subscriber = await Subscriber.findOneAndDelete({ _id: id });

        if (!subscriber) {
            return res.status(404).json({ message: 'Subscriber not found' });
        }

        res.json({ message: 'Subscriber removed' });
    } catch (error) {
        console.error('Backend: Delete Subscriber Error:', error);
        res.status(500).json({ message: error.message });
    }
};
