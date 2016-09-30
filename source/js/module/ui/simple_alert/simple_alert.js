const	React	= require('react'),
		Button	= require('./../../ui/button/button');

const SimpleAlert = React.createClass({
	propTypes: {
		okButtonText:			React.PropTypes.string.isRequired,
		handleClickOkButton:	React.PropTypes.func.isRequired,
		isOpen:					React.PropTypes.bool.isRequired
	},

	render: function() {
		if(this.props.isOpen) {
			return (
				<div className="bSimpleAlert">
					<div className="eSimpleAlert_body">
						{this.props.children}
					</div>
					<div className="eSimpleAlert_footer">
						<Button	text	={ this.props.okButtonText }
								onClick	={ this.props.handleClickOkButton }
						/>
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = SimpleAlert;