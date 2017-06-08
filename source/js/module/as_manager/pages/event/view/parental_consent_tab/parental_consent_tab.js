const	React					= require('react'),
		Morearty				= require('morearty'),
		Immutable				= require('immutable'),
		MessageListActions		= require('module/as_manager/pages/messages/message_list_wrapper/message_list_actions/message_list_actions'),
		PlayerStatusTable		= require('module/ui/player_status_table/player_status_table'),
		Loader					= require('module/ui/loader'),
		ParentalConsentTabStyle	= require('../../../../../../../styles/ui/b_parental_consent_tab/b_parental_consent_tab.scss');

const ParentalConsentTab = React.createClass({
	mixins: [Morearty.Mixin],
	listeners: [],
	propTypes: {
		schoolId:	React.PropTypes.string.isRequired,
		eventId:	React.PropTypes.string.isRequired
	},
	componentWillMount: function() {
		this.loadAndSetMessages();
		this.addListeners();
	},
	componentWillUnmount: function() {
		this.listeners.forEach(listener => this.getDefaultBinding().removeListener(listener));
	},
	loadAndSetMessages: function() {
		MessageListActions.loadParentalConsentMessagesByEventId(this.props.schoolId, this.props.eventId).then(messages => {
			this.getDefaultBinding().atomically()
				.set('isSync',		true)
				.set('messages',	Immutable.fromJS(messages))
				.commit();
		});
	},
	addListeners: function() {
		this.listeners.push(this.getDefaultBinding().sub('isSync').addListener(descriptor => {
			const isSync = descriptor.getCurrentValue();

			if(!isSync) {
				this.loadAndSetMessages();
			}
		}));
	},
	getPlayers: function() {
		return this.getDefaultBinding().toJS('messages').map(m => {
			const name = `${m.playerDetailsData.firstName} ${m.playerDetailsData.lastName}`;

			return {
				id:		m.playerDetailsData.id,
				name:	name,
				status:	m.invitationStatus
			}
		});
	},
	render: function() {
		const	binding		= this.getDefaultBinding();

		const	messages	= binding.toJS('messages'),
				isSync		= binding.toJS('isSync');

		if(!isSync) {
			return (
				<div className="bParentalConsentTab">
					<Loader/>
				</div>
			);
		} else if(isSync && messages.length > 0) {
			return (
				<div className="bParentalConsentTab">
					<PlayerStatusTable
						players={this.getPlayers()}
					/>
				</div>
			);
		} else if(isSync && messages.length === 0) {
			return (
				<div className="bParentalConsentTab">
					<div
						className="eParentalConsentTab_info"
					>
						There is no messages.
					</div>
				</div>
			);
		}
	}
});

module.exports = ParentalConsentTab;