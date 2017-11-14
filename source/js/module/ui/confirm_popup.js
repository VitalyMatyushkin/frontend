const	React		= require('react'),

		classNames	= require('classnames'),
		Button		= require('./button/button');

const ConfirmPopup = React.createClass({
	propTypes: {
		isOkButtonDisabled:			React.PropTypes.bool,
		okButtonText:				React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.array //if we want use tags (ex. <i> font awesome)
		]),
		cancelButtonText:			React.PropTypes.string,
		handleClickOkButton:		React.PropTypes.func,
		handleClickCancelButton:	React.PropTypes.func,
		isShowButtons:				React.PropTypes.bool,
		customStyle:				React.PropTypes.string,
		customFooterStyle: 			React.PropTypes.string
	},
	getDefaultProps: function() {
		return {
			isShowButtons: true
		};
	},
	handleClickOkButton: function() {
		this.props.handleClickOkButton();
	},
	getConfirmPopupStyle: function() {
		let style = "bConfirmPopup";

		if(this.props.customStyle) {
			style = style + " " + this.props.customStyle;
		}

		return style;
	},
	render: function() {
		const okButtonClassName = classNames({
			mMarginLeft:	true,
			mDisable:		this.props.isOkButtonDisabled
		});

		const	bodyStyle = classNames({
				eConfirmPopup_body	: true,
				mZeroMargin			: !this.props.isShowButtons
			}),
			footerStyle = classNames({
				eConfirmPopup_footer	: true,
				mHide					: !this.props.isShowButtons
			}, this.props.customFooterStyle);

		return (
			<div>
				<div className="eConfirmPopup_overlay">
					<div className={this.getConfirmPopupStyle()}>
						<div className={bodyStyle}>
							{this.props.children}
						</div>
						<div className={footerStyle}>
							<Button text={this.props.cancelButtonText}
									onClick={this.props.handleClickCancelButton}
									extraStyleClasses="mCancel"
								/>
							<Button text={this.props.okButtonText}
									onClick={this.handleClickOkButton}
									extraStyleClasses={okButtonClassName}
									isDisabled={this.props.isOkButtonDisabled}
								/>
						</div>
					</div>
					<div className='bPopupBack mAcitve'></div>
				</div>
			</div>
		);
	}
});

module.exports = ConfirmPopup;
