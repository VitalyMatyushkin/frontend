const	React		= require('react'),
		Button		= require('./../../ui/button/button'),
		classNames	= require('classnames');

const PopupMessage = React.createClass({
	propTypes: {
		isDisplaying:			React.PropTypes.bool,
		text:					React.PropTypes.string,
		handleClickOkButton:	React.PropTypes.func
	},
	getDefaultProps: function () {
		return {
			isDisplaying: false
		};
	},
	render: function() {
		const popupMessageClassName = classNames({
			bPopupMessage:	true,
			mDisable:		!this.props.isDisplaying
		});

		return (
			<div className={popupMessageClassName}>
				<div className='ePopupMessage_body'>
					{this.props.children}
				</div>
				<div className='ePopupMessage_footer'>
					<Button	text={'Ok'}
							onClick={this.props.handleClickOkButton}
					/>
				</div>
			</div>
		);
	}
});

module.exports = PopupMessage;



