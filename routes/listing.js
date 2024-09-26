const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema}=require("../schema.js");
const listingController=require("../controllers/listing.js");
const {isLoggedIn}=require("../middelware.js");
const multer = require('multer')
const { storage } = require('../cloudConfig.js')
const upload = multer({ storage })

const validateListing=(req,res,next)=>{
    const listingData = req.body.listing || req.body;
    let {error}=listingSchema.validate(listingData);

    if(error){
        let erMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,error);
    }else{
        next();
    }
}
router.route("/").get(wrapAsync(listingController.index))
 .post(isLoggedIn,upload.single('listing[image]'),validateListing ,wrapAsync(listingController.createListing));

//New Route
router.get("/New",isLoggedIn,listingController.renderNewForm);


//update Route
router.put("/:id", isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing));

//delete Route
router.delete("/:id",isLoggedIn,wrapAsync(listingController.destroyLIsting));

//show Route
router.get("/:id",wrapAsync(listingController.showListing));

//edit Route
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.renderEditForm));

module.exports=router;