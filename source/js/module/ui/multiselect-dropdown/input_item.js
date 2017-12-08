const	React			= require('react'),

		classNames		= require('classnames'),

		SVG				= require('../svg'),
		InputItemStyles	= require('../../../../styles/ui/multiselect_dropdown/b_input_item.scss');

const InputItem = React.createClass({
	propTypes: {
		text					: React.PropTypes.string.isRequired,
		handleClickRemoveItem	: React.PropTypes.func.isRequired
	},

	render: function() {

		return (
			<div className="bInputItem">
				<div className="eInputItem_text">
					{this.props.text}
				</div>
				<div	className	= "eInputItem_cross"
						onClick		= {this.props.handleClickRemoveItem}
				>
					<i className="eCustomFont eCustomFont-cross"/>
				</div>
			</div>
		)
	}
});

module.exports = InputItem;