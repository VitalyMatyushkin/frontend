/**
 * Created by Woland on 23.08.2017.
 */
const 	React 		= require('react'),
		Morearty 	= require('morearty'),
		Immutable 	= require('immutable');

const 	Form 		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		FormColumn 	= require('module/ui/form/form_column');

const NotificationsForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSubmit: React.PropTypes.func.isRequired,
		schoolId: React.PropTypes.string.isRequired
	},
	componentWillMount: function(){
		const 	binding = this.getDefaultBinding(),
				schoolId = this.props.schoolId;
		
		window.Server.schoolNotifications.get({ schoolId }).then(notifications => {
			binding.set(Immutable.fromJS(notifications));
		});
	},
	render: function(){
		const binding = this.getDefaultBinding();
		
		return (
			<Form
				name 			= { "Notifications settings" }
				binding 		= { binding }
				onSubmit 		= { this.props.onSubmit }
				submitOnEnter 	= { false }
			>
				<FormColumn customStyle={'mTwoColumns'}>
					<h3>Registration and profile management</h3>
					<FormField
						classNames 		= "mWideSingleLine"
						type 			= "checkbox"
						field 			= "PERMISSION_REQUEST_ACCEPTED"
					>
						User’s role request has been accepted
					</FormField>
					<FormField
						classNames 		= "mWideSingleLine"
						type 			= "checkbox"
						field 			= "PERMISSION_REQUEST_REJECTED"
					>
						User’s role request has been denied
					</FormField>
					<FormField
						classNames 		= "mWideSingleLine"
						type 			= "checkbox"
						field 			= "PERMISSION_CREATED"
					>
						The user has been granted a new role
					</FormField>
					<h3>User management</h3>
					<FormField
						classNames 		= "mWideSingleLine"
						type 			= "checkbox"
						field 			= "PERMISSION_REQUEST_CREATED"
					>
						New role request
					</FormField>
				</FormColumn>
				<FormColumn customStyle={'mTwoColumns'}>
					<h3>Games management</h3>
					<FormField
						classNames 		= "mWideSingleLine"
						type 			= "checkbox"
						field 			= "EVENT_CREATED"
					>
						Event has been created
					</FormField>
					<FormField
						classNames 		= "mWideSingleLine"
						type 			= "checkbox"
						field 			= "EVENT_UPDATED"
					>
						Event has been rescheduled
					</FormField>
					<FormField
						classNames 		= "mWideSingleLine"
						type 			= "checkbox"
						field 			= "EVENT_CANCELED"
					>
						Event has been cancelled
					</FormField>
					<FormField
						classNames 		= "mWideSingleLine"
						type 			= "checkbox"
						field 			= "EVENT_DETAILS_UPDATED"
					>
						Event details has been updated
					</FormField>
					<FormField
						classNames 		= "mWideSingleLine"
						type 			= "checkbox"
						field 			= "EVENT_TEAM_PLAYER_ADDED"
					>
						Event team player has been added
					</FormField>
					<FormField
						classNames 		= "mWideSingleLine"
						type 			= "checkbox"
						field 			= "EVENT_TEAM_PLAYER_REMOVED"
					>
						Event team player has been removed
					</FormField>
					<h3>Invites management</h3>
					<FormField
						classNames 		= "mWideSingleLine"
						type 			= "checkbox"
						field 			= "INVITE_INCOMING"
					>
						New event invite from an opposing school
					</FormField>
					<FormField
						classNames 		= "mWideSingleLine"
						type 			= "checkbox"
						field 			= "INVITE_ACCEPTED_BY_OPPONENT"
					>
						An opposing school has accepted your event invite
					</FormField>
					<FormField
						classNames 		= "mWideSingleLine"
						type 			= "checkbox"
						field 			= "INVITE_REJECTED_BY_OPPONENT"
					>
						An opposing school has rejected your event invite
					</FormField>
					<FormField
						classNames 		= "mWideSingleLine"
						type 			= "checkbox"
						field 			= "MESSAGE_INBOX_CONSENT_REQUEST"
					>
						New message with consent request
					</FormField>
				</FormColumn>
			</Form>
		);
	}
});

module.exports = NotificationsForm;