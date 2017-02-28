
const 	React 		= require('react'),
		Morearty    = require('morearty');

const Logo = React.createClass({
	mixins:[Morearty.Mixin],
	render:function() {
		const 	activeSchool 	= this.getMoreartyContext().getBinding().toJS('activeSchool'),
				schoolLogo		= {backgroundImage:`url(${activeSchool.pic || 'images/default_blazon.svg'})`};

		return (
			<div className="bPublicLogo">
				<div style={schoolLogo} className ="ePublicLogo_img"/>
				<span className = "ePublicLogo_school"> {activeSchool.name} </span>
			</div>);
	}
});


module.exports = Logo;
