const	React			= require('react'),

		AddButtonStyles	= require('../../../../styles/ui/multiselect_dropdown/b_add_button.scss');

const AddButton = React.createClass({
	propTypes: {
		handleClick : React.PropTypes.func.isRequired
	},

	render: function() {

		return (
			<div	className	= "bAddButton"
					onClick		= {this.props.handleClick}
			>
				<i className="fa fa-plus fa-2x" aria-hidden="true"/>
			</div>
		)
	}
});

module.exports = AddButton;