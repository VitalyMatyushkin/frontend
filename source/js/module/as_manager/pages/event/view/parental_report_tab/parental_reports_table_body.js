/**
 * Created by Woland on 23.11.2017.
 */
const React 					= require('react'),
	
	RoleHelper 					= require('module/helpers/role_helper'),
	
	EventParticipationMessage 	= require('module/ui/message_list/message/event_participation_message');

const ParentalReportsTableBody = React.createClass({
	propTypes: {
		messages:				React.PropTypes.array.isRequired,
		onGotIt:				React.PropTypes.func.isRequired,
		onClickShowComments:	React.PropTypes.func.isRequired,
		onClickSubmitComment:	React.PropTypes.func.isRequired,
		checkComments:			React.PropTypes.func.isRequired,
		setComments:			React.PropTypes.func.isRequired,
		role: 					React.PropTypes.string.isRequired,
		user: 					React.PropTypes.object.isRequired
	},
	getInitialState: function(){
		return {
			expandedElementArray: this.props.messages.map( () => false )
		}
	},
	getStatus: function(message) {
		const role = this.props.role;
		switch (true){
			case message.isActionPerformed:
				return 'Read';
			case role === RoleHelper.USER_ROLES.PARENT && !message.isActionPerformed:
				return 'Don\'t read';
			default:
				return 'Got it';
		}
	},
	getTypeForMessage: function(message){
		const role = this.props.role;
		
		if (role !== RoleHelper.USER_ROLES.PARENT) {
			switch (true){
				case message.isActionPerformed === false:
					return 'INBOX';
				case message.isActionPerformed === true:
					return 'ARCHIVE';
			}
		} else {
			switch (true){
				case message.isActionPerformed === false:
					return 'OUTBOX';
				case message.isActionPerformed === true:
					return 'ARCHIVE';
			}
		}
	},
	renderMessage: function(index){
		const messages = this.props.messages;
		
		if (this.state.expandedElementArray[index]) {
			const message = messages[index];
			return (
				<tr key={message.id}>
					<td colSpan="6">
						<EventParticipationMessage
							onClickShowComments 	= { this.props.onClickShowComments }
							onClickSubmitComment 	= { this.props.onClickSubmitComment }
							checkComments 			= { this.props.checkComments }
							setComments 			= { this.props.setComments }
							message 				= { message }
							type 					= { this.getTypeForMessage(message) }
							onAction 				= { this.props.onGotIt }
							user 					= { this.props.user }
						/>
					</td>
				</tr>
			);
		} else {
			return null;
		}
	},
	onClickMessage: function(index){
		const expandedElementArray = this.state.expandedElementArray.slice();
		expandedElementArray[index] = !expandedElementArray[index];
		this.setState({
			expandedElementArray: expandedElementArray
		});
	},
	getSenderFromMessage: function(message){
		return (message.playerDetails.permissionId 	=== message.sender.permissionId &&
				message.playerDetails.userId 		=== message.sender.userId) ?
					`${message.sender.fullName} (student)` :
					`${message.sender.fullName} (${message.playerDetailsData.firstName}'s parent)`;
	},
	render: function(){
		let rows = [];
		
		const messages = this.props.messages;
		
		messages.forEach( (message, index) => {
			const 	name 		= `${message.playerDetailsData.firstName} ${message.playerDetailsData.lastName}`,
					isTakePart 	= message.isTakePart ? 'Yes' : 'No',
					details 	= message.details,
					sender 		= this.getSenderFromMessage(message);
			
			rows.push(
				<tr
					key 	= { index }
					onClick = { () => { this.onClickMessage(index) } }
					style 	= { {cursor: 'pointer'} }
				>
					<td>{ name }</td>
					<td>{ isTakePart }</td>
					<td>{ details }</td>
					<td>{ sender }</td>
					<td>
						{this.getStatus(message)}
					</td>
					<td>{this.state.expandedElementArray[index] ? <i className="fa fa-sort-asc" aria-hidden="true"></i> : <i className="fa fa-sort-desc" aria-hidden="true"></i>}</td>
				</tr>
			);
			
			rows.push(this.renderMessage(index));
		});

		
		return (
			<tbody>
				{ rows }
			</tbody>
		);
	}
});

module.exports = ParentalReportsTableBody;