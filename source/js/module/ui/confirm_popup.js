const	React	= require('react'),
		Button	= require('./button/button');

function Popup(props) {
	return (
		<div>
			<div className="bConfirmPopup">
				<div className="eConfirmPopup_body">
					{ props.children }
				</div>
				<div className="eConfirmPopup_footer">
					<Button	text				= { props.okButtonText }
							onClick				= { props.handleClickOkButton }
							extraStyleClasses	= { 'mMarginRight' }
					/>
					<Button	text	= { props.cancelButtonText }
							onClick	= { props.handleClickCancelButton }
					/>
				</div>
			</div>
			<div className='bPopupBack mAcitve'></div>
		</div>
	);
}

Popup.propTypes = {
	okButtonText:				React.PropTypes.string.isRequired,
	cancelButtonText:			React.PropTypes.string.isRequired,
	handleClickOkButton:		React.PropTypes.func.isRequired,
	handleClickCancelButton:	React.PropTypes.func.isRequired
};

module.exports = Popup;

