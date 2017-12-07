const	React		= require('react'),
		{Button}	= require('../button/button');

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
		if(this.props.isDisplaying) {
			return (
				<div className="bPopupMessage">
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
		} else {
			return null;
		}
	}
});

module.exports = PopupMessage;



