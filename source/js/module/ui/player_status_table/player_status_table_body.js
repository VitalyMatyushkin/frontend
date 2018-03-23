const	React			= require('react'),
		RoleHelper 		= require('module/helpers/role_helper'),
		MessageConsts	= require('module/ui/message_list/message/const/message_consts'),
		Bootstrap  		= require('../../../../styles/bootstrap-custom.scss');

const EventInvitationMessage = require('module/ui/message_list/message/event_invitation_message');

const PlayerStatusTableBody = React.createClass({
	propTypes: {
		players: 				React.PropTypes.array.isRequired,
		messages: 				React.PropTypes.array.isRequired,
		role: 					React.PropTypes.string.isRequired,
		user: 					React.PropTypes.object.isRequired,
		template: 				React.PropTypes.object.isRequired,
		onClickShowComments: 	React.PropTypes.func.isRequired,
		onClickSubmitComment: 	React.PropTypes.func.isRequired,
		checkComments: 			React.PropTypes.func.isRequired,
		onAction: 				React.PropTypes.func.isRequired
	},
	getInitialState: function(){
		return {
			expandedElementArray: this.props.players.map( () => false )
		}
	},
	renderStatusByPlayerAndMessage: function (player) {
		let status = '';
		switch (true) {
			case this.getParentsByPlayer(player).length === 0 && player.status === 'NOT_READY': {
				status = 'Not sent';
				break;
			}
			default: {
				status = MessageConsts.MESSAGE_INVITATION_STATUS_MAP[player.status];
				break;
			}
		}

		return status;
	},
	getParentsByPlayer(player) {
		let parents = [];

		const currentMessage = this.props.messages.find(messages => messages.playerDetailsData.id === player.id);
		if(typeof currentMessage !== 'undefined') {
			parents = currentMessage.playerDetailsData.parents ? currentMessage.playerDetailsData.parents : [];
		}

		return parents;
	},
	renderParents: function(player){
		const parents = this.getParentsByPlayer(player);

		if (Array.isArray(parents) && parents.length > 0) {
			return (
				parents.map((parent, index) => {
					return (
						<div key={`parent_${index}`}>{parent}</div>
					)
				})
			);
		} else {
			return null;
		}
	},
	onClickPlayer: function(index){
		const expandedElementArray = this.state.expandedElementArray.slice();
		expandedElementArray[index] = !expandedElementArray[index];
		this.setState({
			expandedElementArray: expandedElementArray
		});
	},
	
	getTypeForMessage: function(message){
		const role = this.props.role;
		
		if (role !== RoleHelper.USER_ROLES.PARENT) {
			switch (true){
				case message.isActionPerformed === false:
					return 'OUTBOX';
				case message.isActionPerformed === true:
					return 'ARCHIVE';
			}
		} else {
			switch (true){
				case message.isActionPerformed === false:
					return 'INBOX';
				case message.isActionPerformed === true:
					return 'ARCHIVE';
			}
		}
	},
	
	renderMessage: function(index){
		const 	players 	= this.props.players,
				messages 	= this.props.messages;
		
		if (this.state.expandedElementArray[index]) {
			const message = messages[index];
			return (
				<tr key={message.id}>
					<td colSpan="3">
						<EventInvitationMessage
							message 				= { message }
							type 					= { this.getTypeForMessage(message) }
							onAction 				= { this.props.onAction }
							onClickShowComments 	= { this.props.onClickShowComments }
							onClickSubmitComment 	= { this.props.onClickSubmitComment }
							checkComments 			= { this.props.checkComments }
							template 				= { this.props.template }
							user 					= { this.props.user }
						/>
					</td>
				</tr>
			);
		} else {
			return null;
		}
	},
	
	render: function(){
		const players = this.props.players;

		let rows = [];
		players.forEach((player, index) => {
			rows.push(
				<tr style={{cursor: 'pointer'}} key={player.id} onClick={() => { this.onClickPlayer(index) }}>
					<td>{player.name}</td>
					<td>{this.renderStatusByPlayerAndMessage(player)}</td>
					<td>{this.renderParents(player)}</td>
					<td>
						{
							player.status !== 'NOT_SEND' ?
								(
									this.state.expandedElementArray[index] ?
										<i className="fa fa-sort-asc" aria-hidden="true"/> :
										<i className="fa fa-sort-desc" aria-hidden="true"/>
								) :
								null
						}
					</td>
				</tr>
			);
			if(player.status !== 'NOT_SEND') {
				rows.push(this.renderMessage(index));
			}
		});
		
		return (
			<tbody>
				{ rows }
			</tbody>
		);
	}
});

module.exports = PlayerStatusTableBody;