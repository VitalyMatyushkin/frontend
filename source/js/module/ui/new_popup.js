const React = require('react');

function Popup(props) {
	//TODO rename css classes
	if(props.isOpened) {
		return (
			<div>
				<div className="bNewPopup">
					<div className="ePopup_Close" onClick={props.handleClickCloseButton}></div>
					{props.children}
				</div>
				<div className='bPopupBack mAcitve'></div>
			</div>
		)
	} else{
		return null;
	}
}

Popup.propTypes = {
	handleClickCloseButton:	React.PropTypes.func.isRequired,
	isOpened:				React.PropTypes.bool.isRequired
};

module.exports = Popup;

