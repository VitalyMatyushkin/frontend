/**
 * Created by bridark on 02/09/15.
 */
var SchoolLounge,
    React = require('react');
SchoolLounge = React.createClass({
    mixins:[Morearty.Mixin],
    componentWillMount:function(){
        //Some logic
        //var self = this,
        //    globalBinding = self.getMoreartyContext().getBinding();
        //console.log(globalBinding.toJS());
    },
    render:function(){
        return(
            <div className="eSchoolLounge">
                <h1>Welcome to SquadInTouch</h1>
                <h2>Logged in successfully! </h2>
                <h4>You've been redirected here because you have not been verified or given required privileges!</h4>
                <ul>
                    <span>Actions available to you now are:</span>
                    <li>* Check and update your details by clicking on cogwheel on the right</li>
                    <li>* Logout</li>
                </ul>
            </div>
        )
    }
});
module.exports = SchoolLounge;