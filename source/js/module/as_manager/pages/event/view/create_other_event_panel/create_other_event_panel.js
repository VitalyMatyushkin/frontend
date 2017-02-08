const	React = require('react');

const	CreateOtherEventPanelStyles = require('../../../../../../../styles/ui/b_create_other_event_panel.scss');

const CreateOtherEventPanel = React.createClass({
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	getInitialState: function() {
		return {
			top	: '-35px'
		};
	},
	componentWillMount: function() {
		setTimeout(() => {
			this.setState({
				top	: "0px"
			});
		}, 1000);
	},
	handleCrossClick: function() {
		this.setState({
			top	: "-35px"
		});
	},
	render: function() {
		const style = {
			top	: this.state.top
		};

		return (
			<div className="bCreateOtherEventPanelWrapper">
				<div className="bCreateOtherEventPanel" style={style}>
					<div className="eCreateOtherEventPanel_left">
						<a	className	= "eCreateOtherEventPanel_link"
							href		= "#events/manager"
						>
							Would you like to create another event?
						</a>
					</div>
					<div className="eCreateOtherEventPanel_right">
						<i	className	= "fa fa-times eCreateOtherEventPanel_cross"
							aria-hidden	= "true"
							onClick		= {this.handleCrossClick}
						>
						</i>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = CreateOtherEventPanel;