const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js")
const {reviewSchema}=require("../schema.js");
const reviewController=require("../controllers/review.js");
const {isLoggedIn }=require("../middelware.js")


const validateReview=(req,res,next)=>{
    // console.log(req.body)
    let {error}=reviewSchema.validate(req.body);

    if(error){
        let erMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,erMsg  );
    }else{
        next();
    }
}
//create a Review
router.post("/",isLoggedIn,validateReview ,wrapAsync(reviewController.createReview));
//delete in review route
router.delete("/:reviewId",wrapAsync(reviewController.destroyReview));
module.exports=router;