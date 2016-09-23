const 	React 		= require('react'),
		classNames	= require('classnames');

const Popup = React.createClass({
	propTypes: {
		handleClickCloseButton:	React.PropTypes.func.isRequired,
		isOpened:				React.PropTypes.bool.isRequired
	},
	render: function() {
		//TODO rename css classes
		if(this.props.isOpened) {
			return (
				<div>
					<div className="bNewPopup">
						<div className="ePopup_Close" onClick={this.props.handleClickCloseButton}></div>
						{this.props.children}
					</div>
					<div className='bPopupBack mAcitve'></div>
				</div>
			)
		} else{
			return null;
		}
	}
});

module.exports = Popup;



