const 	TypeMixin 	= require('module/ui/form/types/type_mixin'),
		Date 		= require('module/ui/form/types/date'),
		Moment      = require('moment'),
		React 		= require('react'),
		Morearty	= require('morearty');

const TypeDate =  React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
    propTypes: {
        id:				React.PropTypes.string ,		// just old good html id
	    region:         React.PropTypes.string
    },
	componentWillMount: function () {
		const   binding = this.getDefaultBinding(),
				value = this.props.region === 'US' ? Moment(binding.get('value')).format('YYYY-DD-MM') : binding.get('value');;

		binding.set('value', value);
	},
	render: function () {
        const   binding = this.getDefaultBinding(),
				value = binding.get('value');

		return (
            <Date value={value} region={this.props.region} validateOn={false} id={this.props.id} onChange={this.changeValue} onBlur={this.setValue} />
		)
	}
});


module.exports = TypeDate;