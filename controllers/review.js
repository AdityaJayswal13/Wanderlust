const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createReview=async(req,res)=>{
  if (!req.isAuthenticated) {
    req.flash('warning', 'you must be logged in ')
    return res.redirect('/login')
}

  let listing=await Listing.findById(req.params.id);
  let newReview=new Review(req.body.review);
  newReview["author"] = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
    await listing.save();
    const listingUrl = req.originalUrl.replace('/reviews', '');
    req.flash("success", "New Review Created!");
    res.redirect(`/listing/${listing._id}`);  
 
 }
 module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");

    res.redirect(`/listing/${id}`);

   
};