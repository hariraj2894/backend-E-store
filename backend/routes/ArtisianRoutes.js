const express = require('express');
const { CreateArtisian, getUsers,LoginArtisian, getArtisans, UserLogin, CreateUser, getUserById, updateEarnedAmountForArtisian,getEarnedAmount, leader, codPayment, CheckcodPayment, adduserCart, AdminLogin, awardArtisan, getArtisan, updateUserProfile, updateArtistProfile, updateArtisan} = require('../controllers/ArtisianController');

const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/artisianregister', CreateArtisian);
router.post('/login', LoginArtisian);
router.post('/userregister', CreateUser);
router.post('/userlogin', UserLogin);
router.get('/userprofile/:id', getUserById)
router.post('/updateearned', updateEarnedAmountForArtisian);
router.get('/earned/:id', getEarnedAmount)
router.get('/leaderboard', leader)
router.get('/cod/:id',CheckcodPayment)
router.post('/checkcod/:id',codPayment)
router.post('/usercart',adduserCart)
router.post('/superLogin', AdminLogin)
router.post('/award', awardArtisan);
router.get('/profile/:id', getArtisan)
router.put('/profilEdit/:id', upload.single('img'), updateArtisan); 
router.get('/search', getArtisans);
router.get('/artists', getArtisans);
router.get('/users', getUsers);

module.exports = router;

