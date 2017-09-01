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
						The role request has been confirmed
					</FormField>
					<FormField
						classNames 		= "mWideSingleLine"
						type 			= "checkbox"
						field 			= "PERMISSION_REQUEST_REJECTED"
					>
						The role request has been declined
					</FormField>
					<FormField
						classNames 		= "mWideSingleLine"
						type 			= "checkbox"
						field 			= "PERMISSION_CREATED"
					>
						New role has been granted
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
					<h3>Invites management</h3>
					<FormField
						classNames 		= "mWideSingleLine"
						type 			= "checkbox"
						field 			= "INVITE_INCOMING"
					>
						New incoming invite from opposing school
					</FormField>
					<FormField
						classNames 		= "mWideSingleLine"
						type 			= "checkbox"
						field 			= "INVITE_ACCEPTED_BY_OPPONENT"
					>
						Outgoing invite has been accepted by opposing school
					</FormField>
					<FormField
						classNames 		= "mWideSingleLine"
						type 			= "checkbox"
						field 			= "INVITE_REJECTED_BY_OPPONENT"
					>
						Outgoing invite has been rejected by opposing school
					</FormField>
				</FormColumn>
			</Form>
		);
	}
});

module.exports = NotificationsForm;