const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken: mapToken});
module.exports.index=async(req,res)=>{
    const alllistings=await Listing.find();
    res.render("listings/index.ejs",{alllistings});
}
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.showListing=async(req,res)=>{
    const {id}=req.params;
    const listing= await Listing.findById(id).populate({path:"reviews", populate: {
        path: 'author'
      }}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!")
        res.redirect("/listing");
    }
    res.render("listings/show.ejs",{listing});
};
module.exports.createListing=async(req,res,next)=>{ 

        let response = await geocodingClient
          .forwardGeocode({
            query: req.body.location,
            limit: 1,
          })
          .send();
    
        // ... rest of the function ...
      
    
    let url=req.file.path;
    let filename=req.file.filename;
    const newlisting=new Listing(req.body);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    // console.log(response.body.features[0].geometry);
    newlisting.geometry=response.body.features[0].geometry;
    
     let savedlisting=await newlisting.save(); 
     
    //  console.log(savedlisting);
    req.flash("success","New Listing Created!");
    res.redirect("/listing");
};
module.exports.renderEditForm=async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!")
        return res.redirect("/listing");
    }
    let originalImageUrl=listing.image.url;
    // console.log(originalImageUrl);

    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};
module.exports.updateListing=async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for the listing");   
    }
    
    const { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file!=="undefined"){
        const { path, filename } = req.file
        listing.image.url = path,
          listing.image.filename = filename,
          await listing.save()
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listing/`);
  }
  module.exports.destroyLIsting=async(req,res)=>{
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted")
    res.redirect("/listing");
}
