module.exports.isLoggedIn=(req,res,next)=>{
if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","You must be logged in to create or Delete a new listing");
    return res.redirect("/login");
}
    next();
}
module.exports.saveRedirectUrl = (req, res, next) => {
    res.locals.redirectUrl = (req.session.redirectUrl || '/listing').replace('/reviews', '');
    next()
  }

  