/**
 * Created by vitaly on 23.08.17.
 */
const 	TypeMixin 	= require('module/ui/form/types/type_mixin'),
		DateTime 	= require('module/ui/form/types/datetime'),
		Moment      = require('moment'),
		React 		= require('react'),
		Morearty	= require('morearty');

const TypeDate =  React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	propTypes: {
		id:				React.PropTypes.string,		// just old good html id
		region:         React.PropTypes.string
	},
	componentWillMount: function () {
		const   binding = this.getDefaultBinding(),
				value = this.props.region === 'US' ? Moment(binding.get('value')).format('YYYY-DD-MM HH:mm') : binding.get('value');

		binding.set('value', value);
	},
	render: function () {
		const 	self = this,
				binding = self.getDefaultBinding(),
				value = binding.get('value');

		return (
			<DateTime value={value} region={this.props.region} validateOn={false} id={self.props.id} onChange={self.changeValue} onBlur={self.setValue} />
		)
	}
});


module.exports = TypeDate;