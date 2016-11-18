/**
 * Created by Anatoly on 17.11.2016.
 */
const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		FormField 		= require('module/ui/form/form_field');

const EventIndividualScoreAvailable = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes:{
		isVisible: React.PropTypes.bool.isRequired
	},
	getDefaultState:function () {
		return Immutable.fromJS({
			value:true
		});
	},
	render:function () {
		if(this.props.isVisible)
			return (
				<FormField type="checkbox" binding={this.getDefaultBinding()}
						   field="individualScoreAvailable"
						   fieldClassName="mIndividualScoreAvailable" >
					Individual score available
				</FormField>
			);

		return null;
	}
});

module.exports = EventIndividualScoreAvailable;