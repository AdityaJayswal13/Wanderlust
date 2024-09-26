const mongoose=require("mongoose");
const Review=require("./review.js");

const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
       
    },  
    description :{
        type:String,
        required:true
        
    },
    image:{
        url:String,
        filename:String,
        
    },
    price:Number,
    location:String,
    country: String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review",
        },
    ], 
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",

    },
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
        
    }
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;  