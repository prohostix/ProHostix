import Client from '../models/Client.js';

/**
 * GET all clients (public or admin)
 */
export const getClients = async (req, res) => {
    try {
        let query = {};
        
        // If not authenticated, only show active clients
        if (!req.user) {
            query = { active: true };
        }

        // Use lean() for faster queries (returns plain JS objects instead of Mongoose documents)
        const clients = await Client.find(query)
            .sort({ order: 1, createdAt: -1 })
            .lean()
            .exec();
            
        res.status(200).json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ 
            message: 'Failed to fetch clients', 
            error: error.message 
        });
    }
};

/**
 * GET single client by ID
 */
export const getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.status(200).json(client);
    } catch (error) {
        console.error('Error fetching client:', error);
        res.status(500).json({ 
            message: 'Failed to fetch client', 
            error: error.message 
        });
    }
};

/**
 * POST create new client (admin only)
 */
export const createClient = async (req, res) => {
    try {
        const { name, logo, website, order, active, description } = req.body;

        if (!name || !logo) {
            return res.status(400).json({ 
                message: 'Name and logo are required' 
            });
        }

        const newClient = await Client.create({
            name,
            logo,
            website,
            order: order || 0,
            active: active !== undefined ? active : true,
            description
        });

        res.status(201).json(newClient);
    } catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({ 
            message: 'Failed to create client', 
            error: error.message 
        });
    }
};

/**
 * PUT update client (admin only)
 */
export const updateClient = async (req, res) => {
    try {
        const { name, logo, website, order, active, description } = req.body;

        const updatedClient = await Client.findByIdAndUpdate(
            req.params.id,
            { name, logo, website, order, active, description },
            { new: true, runValidators: true }
        );

        if (!updatedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.status(200).json(updatedClient);
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ 
            message: 'Failed to update client', 
            error: error.message 
        });
    }
};

/**
 * DELETE client (admin only)
 */
export const deleteClient = async (req, res) => {
    try {
        const deletedClient = await Client.findByIdAndDelete(req.params.id);

        if (!deletedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.status(200).json({ 
            message: 'Client deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ 
            message: 'Failed to delete client', 
            error: error.message 
        });
    }
};
