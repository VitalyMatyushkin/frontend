const	React		= require('react'),

		classNames	= require('classnames'),
		Button		= require('./button/button');

const ConfirmPopup = React.createClass({

	propTypes: {
		isOkButtonDisabled:			React.PropTypes.bool.isRequired,
		okButtonText:				React.PropTypes.string.isRequired,
		cancelButtonText:			React.PropTypes.string.isRequired,
		handleClickOkButton:		React.PropTypes.func.isRequired,
		handleClickCancelButton:	React.PropTypes.func.isRequired
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

		return (
			<div>
				<div className="bConfirmPopup">
					<div className="eConfirmPopup_body">
						{ this.props.children }
					</div>
					<div className="eConfirmPopup_footer">
						<Button	text				= { this.props.okButtonText }
								onClick				= { this.handleClickOkButton }
								extraStyleClasses	= { okButtonClassName }
						/>
						<Button	text	= { this.props.cancelButtonText }
								onClick	= { this.props.handleClickCancelButton }
						/>
					</div>
				</div>
				<div className='bPopupBack mAcitve'></div>
			</div>
		);
	}
});

module.exports = ConfirmPopup;
