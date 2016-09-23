/**
 * Created by wert on 16.01.16.
 */

const React = require('react'),
    Morearty = require('morearty');


const Head = React.createClass({
    mixins: [Morearty.Mixin],
    returnToLoginPage: function () {
        document.location.hash = '#login';
    },
    render: function () {
        var self = this;
        if (document.location.hash != '#login') {
            return (
                <div className="bTopPanel">
                    <div className="bTopLogo" onClick={self.returnToLoginPage}><img src="images/logo.png"/></div>
                </div>
            )
        }else{
            return (<div></div>)
        }
    }
});

module.exports = Head;