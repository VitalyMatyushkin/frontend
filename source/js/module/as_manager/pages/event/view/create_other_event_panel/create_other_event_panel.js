const	React						= require('react');

const	If							= require('../../../../../ui/if/if');

const	EventHelper					= require('../../../../../helpers/eventHelper');

const	CreateOtherEventPanelStyles	= require('../../../../../../../styles/ui/b_create_other_event_panel.scss');

const CreateOtherEventPanel = React.createClass({
	propTypes: {
		eventId : React.PropTypes.string.isRequired
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
		const mode = EventHelper.EVENT_CREATION_MODE.ANOTHER;

		return (
			<div className="bCreateOtherEventPanelWrapper">
				<If condition={this.state.isVisible}>
					<div className="bCreateOtherEventPanel">
						<div className="eCreateOtherEventPanel_left">
							{"You have successfully created an event. "}
							<a	className	= "eCreateOtherEventPanel_link"
								href		= {`#events/manager?mode=${mode}&eventId=${this.props.eventId}`}
							>
								Add another event
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
				</If>
			</div>
		);
	}
});

module.exports = CreateOtherEventPanel;