const	React	= require('react'),
	{If}	= require('./if/if');

function Popup(props) {
	//TODO rename css classes
	if(props.isOpened) {
		return (
			<div>
				<div className='bPopupBack mAcitve'>
					<div className="bNewPopup">
						<If condition={props.isShowCloseButton}>
							<div className="ePopup_Close" onClick={props.handleClickCloseButton}/>
						</If>
						{props.children}
					</div>
				</div>
			</div>
		)
	} else{
		return null;
	}
}

Popup.propTypes = {
	handleClickCloseButton:	React.PropTypes.func.isRequired,
	isShowCloseButton:		React.PropTypes.bool.isRequired,
	isOpened:				React.PropTypes.bool.isRequired
};

module.exports = Popup;

