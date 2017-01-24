const	React		= require('react'),

		classNames	= require('classnames'),
		Button		= require('./button/button');

const ConfirmPopup = React.createClass({

	propTypes: {
		isOkButtonDisabled:			React.PropTypes.bool,
		okButtonText:				React.PropTypes.string,
		cancelButtonText:			React.PropTypes.string,
		handleClickOkButton:		React.PropTypes.func,
		handleClickCancelButton:	React.PropTypes.func,
		isShowButtons:				React.PropTypes.bool
	},
	getDefaultProps: function() {
		return {
			isShowButtons: true
		};
	},
	handleClickOkButton: function() {
		if(!this.props.isOkButtonDisabled) {
			this.props.handleClickOkButton();
		}
	},
	render: function() {
		const okButtonClassName = classNames({
			mMarginRight:	true,
			mDisable:		this.props.isOkButtonDisabled
		});

		const bodyStyle = classNames({
				eConfirmPopup_body	: true,
				mZeroMargin			: !this.props.isShowButtons
			}),
			footerStyle = classNames({
				eConfirmPopup_footer	: true,
				mHide					: !this.props.isShowButtons
			});

		return (
			<div>
				<div className="bConfirmPopup">
					<div className="bodyStyle">
						{this.props.children}
					</div>
					<div className={footerStyle}>
						<Button	text				= {this.props.okButtonText}
								onClick				= {this.handleClickOkButton}
								extraStyleClasses	= {okButtonClassName}
						/>
						<Button	text	= {this.props.cancelButtonText}
								onClick	= {this.props.handleClickCancelButton}
						/>
					</div>
				</div>
				<div className='bPopupBack mAcitve'></div>
			</div>
		);
	}
});

module.exports = ConfirmPopup;
