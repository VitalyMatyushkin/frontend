/**
 * Created by Woland on 23.08.2017.
 */
const 	React 		= require('react'),
		Morearty 	= require('morearty'),
		Immutable 	= require('immutable');

const 	Form 		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		FormColumn 	= require('module/ui/form/form_column');

const Loader = require('module/ui/loader');

const NotificationsForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSubmit: React.PropTypes.func.isRequired,
		schoolId: React.PropTypes.string.isRequired
	},
	componentWillMount: function(){
		const binding = this.getDefaultBinding();
		const schoolId = this.props.schoolId;

		binding.toJS('isSync', false);

		window.Server.schoolNotifications.get({ schoolId }).then(notifications => {
			binding.set('form', Immutable.fromJS(notifications));
			binding.set('isSync', true);
		});
	},
	componentWillUnmount: function () {
		this.getDefaultBinding().clear();
	},
	valueReader: function(value) {
		switch (value) {
			case 'DISABLED':	return false;
			case 'AUTO':		return true;
		}
	},
	valueWriter: function(value) {
		switch (value) {
			case false: return 'DISABLED';
			case true:	return 'AUTO';
		}
	},
	render: function(){
		const binding = this.getDefaultBinding();

		let form = null;
		if(binding.toJS('isSync')) {
			form = (
				<Form
					name={"Notifications settings"}
					binding={binding.sub('form')}
					onSubmit={this.props.onSubmit}
					submitOnEnter={false}
				>
					<FormColumn customStyle={'mTwoColumns'}>
						<h3>Registration and profile management</h3>
						<FormField
							valueReader={this.valueReader}
							valueWriter={this.valueWriter}
							classNames="mWideSingleLine"
							type="checkbox"
							field="PERMISSION_REQUEST_ACCEPTED"
						>
							User’s role request has been accepted
						</FormField>
						<FormField
							valueReader={this.valueReader}
							valueWriter={this.valueWriter}
							classNames="mWideSingleLine"
							type="checkbox"
							field="PERMISSION_REQUEST_REJECTED"
						>
							User’s role request has been denied
						</FormField>
						<FormField
							valueReader={this.valueReader}
							valueWriter={this.valueWriter}
							classNames="mWideSingleLine"
							type="checkbox"
							field="PERMISSION_CREATED"
						>
							The user has been granted a new role
						</FormField>
						<h3>User management</h3>
						<FormField
							valueReader={this.valueReader}
							valueWriter={this.valueWriter}
							classNames="mWideSingleLine"
							type="checkbox"
							field="PERMISSION_REQUEST_CREATED"
						>
							New role request
						</FormField>
						<FormField
							valueReader={this.valueReader}
							valueWriter={this.valueWriter}
							classNames="mWideSingleLine"
							type="checkbox"
							field="MERGE_STUDENT"
						>
							Student merged
						</FormField>
					</FormColumn>
					<FormColumn customStyle={'mTwoColumns'}>
						<h3>Games management</h3>
						<FormField
							valueReader={this.valueReader}
							valueWriter={this.valueWriter}
							classNames="mWideSingleLine"
							type="checkbox"
							field="EVENT_CREATED"
						>
							Event has been created
						</FormField>
						<FormField
							valueReader={this.valueReader}
							valueWriter={this.valueWriter}
							classNames="mWideSingleLine"
							type="checkbox"
							field="EVENT_UPDATED"
						>
							Event has been rescheduled
						</FormField>
						<FormField
							valueReader={this.valueReader}
							valueWriter={this.valueWriter}
							classNames="mWideSingleLine"
							type="checkbox"
							field="EVENT_CANCELED"
						>
							Event has been cancelled
						</FormField>
						<FormField
							valueReader={this.valueReader}
							valueWriter={this.valueWriter}
							classNames="mWideSingleLine"
							type="checkbox"
							field="EVENT_DETAILS_UPDATED"
						>
							Event details has been updated
						</FormField>
						<FormField
							valueReader={this.valueReader}
							valueWriter={this.valueWriter}
							classNames="mWideSingleLine"
							type="checkbox"
							field="EVENT_TEAM_PLAYER_ADDED"
						>
							Game team member has been added
						</FormField>
						<FormField
							valueReader={this.valueReader}
							valueWriter={this.valueWriter}
							classNames="mWideSingleLine"
							type="checkbox"
							field="EVENT_TEAM_PLAYER_UPDATED"
						>
							Game team member has been updated
						</FormField>
						<FormField
							valueReader={this.valueReader}
							valueWriter={this.valueWriter}
							classNames="mWideSingleLine"
							type="checkbox"
							field="EVENT_TEAM_PLAYER_REMOVED"
						>
							Game team member has been removed
						</FormField>
						<FormField
							valueReader={this.valueReader}
							valueWriter={this.valueWriter}
							classNames="mWideSingleLine"
							type="checkbox"
							field="EVENT_INDIVIDUAL_PLAYER_ADDED"
						>
							Game individual member has been added
						</FormField>
						<FormField
							valueReader={this.valueReader}
							valueWriter={this.valueWriter}
							classNames="mWideSingleLine"
							type="checkbox"
							field="EVENT_INDIVIDUAL_PLAYER_REMOVED"
						>
							Game individual member has been removed
						</FormField>
						<FormField
							valueReader={this.valueReader}
							valueWriter={this.valueWriter}
							classNames="mWideSingleLine"
							type="checkbox"
							field="MESSAGE_INBOX_CONSENT_REQUEST"
						>
							Consent request has been sent
						</FormField>
						<FormField
							valueReader		= {this.valueReader}
							valueWriter		= {this.valueWriter}
							classNames 		= "mWideSingleLine"
							type 			= "checkbox"
							field 			= "CLUB_CREATED"
						>
							Club has been created
						</FormField>
						<h3>Invites management</h3>
						<FormField
							valueReader={this.valueReader}
							valueWriter={this.valueWriter}
							classNames="mWideSingleLine"
							type="checkbox"
							field="INVITE_INCOMING"
						>
							New event invite from an opposing school
						</FormField>
						<FormField
							valueReader={this.valueReader}
							valueWriter={this.valueWriter}
							classNames="mWideSingleLine"
							type="checkbox"
							field="INVITE_ACCEPTED_BY_OPPONENT"
						>
							An opposing school has accepted your event invite
						</FormField>
						<FormField
							valueReader={this.valueReader}
							valueWriter={this.valueWriter}
							classNames="mWideSingleLine"
							type="checkbox"
							field="INVITE_REJECTED_BY_OPPONENT"
						>
							An opposing school has rejected your event invite
						</FormField>
					</FormColumn>
				</Form>
			);
		} else {
			form = (
				<div className='bLoaderWrapper'>
					<Loader condition={ true }/>
				</div>
			);
		}

		return form;
	}
});

module.exports = NotificationsForm;