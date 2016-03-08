/**
 * Created by Bright on 08/03/2016.
 */
/**
 * Return the number of schools the current active user has permissions or access to, by attaching result as a meta
 * information in the current binding context.
 * @Param ctx - component context
 * */

const ActiveUserHelper = {
    howManySchools:function(ctx){
        //Get current user id and the context meta binding
        let currentUserId = ctx.getMoreartyContext().getBinding().get('userData.userInfo').get('id'),
            binding = ctx.getDefaultBinding().meta();
        //Check if the current user is defined, then get number of schools related to user
        if(currentUserId !== null && currentUserId !== undefined){
            window.Server.getMaSchools.get(
                {
                    filter: {
                        presets:["owner","admin","manager","teacher","coach"],
                        include: "postcode"
                    }
                }
            ).then(function(schools){
                binding.set('numOfSchools',schools.length);
                return schools;
            });
        }
    }
};
module.exports = ActiveUserHelper;