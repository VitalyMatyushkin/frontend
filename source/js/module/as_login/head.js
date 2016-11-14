/**
 * Created by wert on 16.01.16.
 */

const   React       		= require('react'),
        Morearty    		= require('morearty'),
		TopPanelStyles		= require('../../../styles/main/b_top_panel.scss'),
		TopLogoStyles		= require('../../../styles/main/b_top_logo.scss');


const Head = React.createClass({
    mixins: [Morearty.Mixin],
    returnToLoginPage: function () {
        document.location.hash = '#login';
    },
    render: function () {
        if (document.location.hash != '#login') {
            return (
                <div className="bTopPanel">
                    <div className="bTopLogo" onClick={this.returnToLoginPage}><img src="images/logo.png"/></div>
                </div>
            )
        }else{
            return (<div></div>)
        }
    }
});

module.exports = Head;