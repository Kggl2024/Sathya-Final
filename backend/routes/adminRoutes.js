const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route to get all companies
router.get('/companies', adminController.getCompanies);

// Route to get projects by company ID
router.get('/projects/:companyId', adminController.getProjectsByCompany);

// Route to get sites by project ID
router.get('/sites/:projectId', adminController.getSitesByProject);

// Route to get work descriptions by site ID and category ID
router.get('/work-descriptions/:siteId/:categoryId', adminController.getWorkDescriptions);

// Route to get completion entries by site ID
router.get('/completion-entries-by-site/:siteId', adminController.getCompletionEntriesBySite);

// Route to get PO reckoner totals by site ID
router.get('/po-reckoner-totals/:siteId', adminController.getPoReckonerTotals);

// Route to get expense details by site ID
router.get('/expense-details/:siteId', adminController.getExpenseDetailsBySite);


// Route to get work descriptions by site ID
router.get('/work-descriptions-by-site/:siteId', adminController.getWorkDescriptionsBySite);

// Route to get PO totals by site ID and desc ID
router.get('/po-total-budget/:siteId/:descId', adminController.getPoTotalBudget);


router.get('/po-budget', adminController.getPoBudget);

router.post('/save-po-budget', adminController.savePoBudget);

// Route to get overheads
router.get('/overheads', adminController.getOverheads);

// Route to save overhead
router.post('/save-overhead', adminController.saveOverhead);

// Route to save actual budget entries
router.post('/save-actual-budget', adminController.saveActualBudget);

router.get('/actual-budget/:po_budget_id', adminController.getActualBudgetEntries);

module.exports = router;