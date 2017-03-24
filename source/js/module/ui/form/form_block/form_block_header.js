const	React			= require('react'),
		FormBlockStyle	= require('../../../../../styles/ui/forms/b_form_block.scss');

const FromBlockHeader = React.createClass({
	propTypes: {
		onClick: React.PropTypes.func.isRequired
	},
	getDefaultProps: function () {
		return {
			type: 'simpleElement'
		};
	},
	render: function () {
		return (
			<div
				className	= "eFormBlock_header"
				onClick		= { this.props.onClick }
			>
				<i className="fa fa-times" aria-hidden="true"></i>
			</div>
		);
	}
});

module.exports = FromBlockHeader;