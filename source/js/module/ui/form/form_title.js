const	React			= require('react'),
		FormTitleStyle	= require('../../../../styles/ui/forms/b_form_title.scss');

const FormTitle = React.createClass({
	propTypes: {
		type: React.PropTypes.string.isRequired,
		text: React.PropTypes.string.isRequired
	},
	getDefaultProps: function () {
		return {
			type: 'simpleElement'
		};
	},
	render: function () {
		return (
			<h3 className="bFormTitle">
				{ this.props.text }
			</h3>
		)
	}
});

module.exports = FormTitle;