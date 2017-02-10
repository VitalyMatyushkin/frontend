const	React = require('react');

const	If = require('../../../../../ui/if/if');

const	CreateOtherEventPanelStyles = require('../../../../../../../styles/ui/b_create_other_event_panel.scss');

const CreateOtherEventPanel = React.createClass({
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	getInitialState: function() {
		return {
			isVisible: true
		};
	},
	handleCrossClick: function() {
		this.setState({
			isVisible: false
		});
	},
	render: function() {
		return (
			<div className="bCreateOtherEventPanelWrapper">
				<If condition={this.state.isVisible}>
					<div className="bCreateOtherEventPanel">
						<div className="eCreateOtherEventPanel_left">
							{"You successfully create an event. "}
							<a	className	= "eCreateOtherEventPanel_link"
								href		= "#events/manager"
							>
								Create more
							</a>
							{" on this date?"}
						</div>
						<div className="eCreateOtherEventPanel_right">
							<i	className	= "fa fa-times eCreateOtherEventPanel_cross"
								aria-hidden	= "true"
								onClick		= {this.handleCrossClick}
							>
							</i>
						</div>
					</div>
				</If>
			</div>
		);
	}
});

module.exports = CreateOtherEventPanel;