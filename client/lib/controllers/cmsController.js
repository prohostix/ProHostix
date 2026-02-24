import Service from '../models/Service.js';
import Solution from '../models/Solution.js';
import CaseStudy from '../models/CaseStudy.js';
import Leadership from '../models/Leadership.js';
import HeroImage from '../models/HeroImage.js';
import OpenRole from '../models/OpenRole.js';
import PageContent from '../models/PageContent.js';
import Navigation from '../models/Navigation.js';
import SocialLink from '../models/SocialLink.js';

// Generic CRUD handlers generator
const createHandler = (Model) => async (req, res) => {
    try {
        console.log(`Creating ${Model.modelName}:`, req.body);
        const item = new Model(req.body);
        const savedItem = await item.save();
        res.status(201).json(savedItem);
    } catch (error) {
        console.error(`Error creating ${Model.modelName}:`, error);
        res.status(400).json({ message: error.message });
    }
};

const getAllHandler = (Model) => async (req, res) => {
    try {
        const items = await Model.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateHandler = (Model) => async (req, res) => {
    try {
        console.log(`Updating ${Model.modelName} ${req.params.id}:`, req.body);
        const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (error) {
        console.error(`Error updating ${Model.modelName}:`, error);
        res.status(400).json({ message: error.message });
    }
};

const deleteHandler = (Model) => async (req, res) => {
    try {
        const item = await Model.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json({ message: 'Item removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPageContent = async (req, res) => {
    try {
        const { page, section } = req.query;
        const query = {};
        if (page) query.page = page;
        if (section) query.section = section;

        const content = await PageContent.find(query);
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Exports for specific models
export const getServices = getAllHandler(Service);
export const createService = createHandler(Service);
export const updateService = updateHandler(Service);
export const deleteService = deleteHandler(Service);

export const getSolutions = getAllHandler(Solution);
export const createSolution = createHandler(Solution);
export const updateSolution = updateHandler(Solution);
export const deleteSolution = deleteHandler(Solution);

export const getCaseStudies = getAllHandler(CaseStudy);
export const createCaseStudy = createHandler(CaseStudy);
export const updateCaseStudy = updateHandler(CaseStudy);
export const deleteCaseStudy = deleteHandler(CaseStudy);

export const getLeadership = getAllHandler(Leadership);
export const createLeadership = createHandler(Leadership);
export const updateLeadership = updateHandler(Leadership);
export const deleteLeadership = deleteHandler(Leadership);

export const getHeroImages = getAllHandler(HeroImage);
export const createHeroImage = createHandler(HeroImage);
export const updateHeroImage = updateHandler(HeroImage);
export const deleteHeroImage = deleteHandler(HeroImage);

export const getOpenRoles = getAllHandler(OpenRole);
export const createOpenRole = createHandler(OpenRole);
export const updateOpenRole = updateHandler(OpenRole);
export const deleteOpenRole = deleteHandler(OpenRole);

export const getAllPageContent = getAllHandler(PageContent);
export const createPageContent = createHandler(PageContent);
export const updatePageContent = updateHandler(PageContent);
export const deletePageContent = deleteHandler(PageContent);

export const getNavigation = getAllHandler(Navigation);
export const createNavigation = createHandler(Navigation);
export const updateNavigation = updateHandler(Navigation);
export const deleteNavigation = deleteHandler(Navigation);

export const getSocialLinks = getAllHandler(SocialLink);
export const createSocialLink = createHandler(SocialLink);
export const updateSocialLink = updateHandler(SocialLink);
export const deleteSocialLink = deleteHandler(SocialLink);

import Settings from '../models/Settings.js';
export const getSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const settings = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(settings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
