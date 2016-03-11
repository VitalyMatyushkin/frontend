/**
 * Created by Bright on 08/03/2016.
 */
/**
 * Return the handler to query for number of schools related to current user
 * @Param ctx - component context
 * */

const ActiveUserHelper = {
    howManySchools:function(ctx){
        //Get current user id
        let currentUserId = ctx.getMoreartyContext().getBinding().get('userData.userInfo').get('id');
        //Check if the current user is defined, then get number of schools related to user
        if(currentUserId !== null && currentUserId !== undefined){
            return window.Server.getMaSchools.get(
                {
                    filter:{
                        presets:["owner","admin","manager","teacher","coach"],
                        include: "postcode"
                    }
                }
            ).then((schools)=>{
                return new Promise(resolve => resolve(schools.length));
            });
        }
    }
};
module.exports = ActiveUserHelper;