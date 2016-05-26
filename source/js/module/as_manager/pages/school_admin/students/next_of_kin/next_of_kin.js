/**
 * Created by Anatoly on 26.05.2016.
 */

const 	React 			= require('react'),
		NextOfKinFields = require('./next_of_kin_fields');

const NextOfKin = React.createClass({
	mixins: [Morearty.Mixin],
	renderFileds:function(i){
		return (
			<div>
				<NextOfKinFields />
				<span className="button" >Delete</span>
			</div>
		);
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<div className="bNextOfKin">
				<h2>Next Of Kin <span>+</span></h2>
				<div>

				</div>
			</div>
		);
	}
});



module.exports = NextOfKin;