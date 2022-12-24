const router = require('express').Router();
const adminController = require('../controller/adminController');
const {
    uploadSingle,
    uploadMultiple
} = require('../middleware/multer');
//auth
const auth = require('../middleware/auth');

//login
router.get('/signin', adminController.viewSignin);
router.post('/signin', adminController.actionSignin);
router.use(auth); //middleware
//logout
router.get('/logout', adminController.actionLogout);

//dashboard
router.get('/dashboard', adminController.viewDashboard);

//category
router.get('/category', adminController.viewCategory);
router.post('/category', adminController.addCategory);
router.put('/category/edit', adminController.editCategory);
router.delete('/category/:id', adminController.deleteCategory);

//bank
router.get('/bank', adminController.viewBank);
router.post('/bank', uploadSingle, adminController.addBank);
router.put('/bank/edit', uploadSingle, adminController.editBank);
router.delete('/bank/:id', adminController.deleteBank);

//item
router.get('/item', adminController.viewItem);
router.post('/item', uploadMultiple, adminController.addItem);
router.get('/item/:id', adminController.showEditItem);
router.put('/item/edit/:id', uploadMultiple, adminController.editItem);
router.get('/item/show-image/:id', adminController.showImageItem);
router.delete('/item/:id', adminController.deleteItem);

//detail item
router.get('/item/show-detail-item/:itemId', adminController.viewDetailItem);
router.post('/item/add/feature', uploadSingle, adminController.addFeature);
router.put('/item/update/feature', uploadSingle, adminController.editFeature);
router.delete('/item/:itemId/feature/:id', adminController.deleteFeature);

//activity
router.post('/item/add/activity', uploadSingle, adminController.addActivity);
router.put('/item/update/activity', uploadSingle, adminController.editActivity);
router.delete('/item/:itemId/activity/:id', adminController.deleteActivity);

//booking
router.get('/booking', adminController.viewBooking);
router.get('/booking/show-detail/:id', adminController.showDetailBooking);
router.put('/booking/:id/confirmation', adminController.actionConfirmation);
router.put('/booking/:id/rejection', adminController.actionReject);

module.exports = router;