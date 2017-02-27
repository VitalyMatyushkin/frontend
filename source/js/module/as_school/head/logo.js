
const 	React 		= require('react'),
		Morearty    = require('morearty');

const Logo = React.createClass({
	mixins:[Morearty.Mixin],
	render:function() {
		const 	activeSchool 	= this.getMoreartyContext().getBinding().toJS('activeSchool'),
				schoolLogo		= activeSchool.pic || '';

		return (
			<div className="bPublicLogo">
				<img src={schoolLogo} className ="ePublicLogo_img"/>
				<span className = "ePublicLogo_school"> {activeSchool.name} </span>
			</div>);
	}
});


module.exports = Logo;
