/**
 * Created by bridark on 02/09/15.
 */
const   Morearty	= require('morearty'),
        React       = require('react');

const SchoolLounge = React.createClass({
    mixins:[Morearty.Mixin],

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