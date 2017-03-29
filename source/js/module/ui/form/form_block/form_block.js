const	React			= require('react'),
		classNames		= require('classnames'),
		FromBlockHeader	= require('./form_block_header'),
		FormBlockStyle	= require('../../../../../styles/ui/forms/b_form_block.scss');

const FormBlock = React.createClass({
	propTypes: {
		type:				React.PropTypes.string.isRequired,
		isVisible:			React.PropTypes.string.isRequired,
		isShowCloseButton:	React.PropTypes.bool,
		onClickClose:		React.PropTypes.func
	},
	getDefaultProps: function () {
		return {
			type:				'block',
			isVisible:			true,
			isShowCloseButton:	true
		};
	},
	render: function () {
		const className = classNames({
			'bFormBlock':	true,
			'mInvisible':	!this.props.isVisible
		});

		return (
			<div className={className}>
				{
					this.props.isShowCloseButton ?
						<FromBlockHeader onClick={this.props.onClickClose}/> :
						null
				}
				{ this.props.children }
			</div>
		)
	}
});

module.exports = FormBlock;