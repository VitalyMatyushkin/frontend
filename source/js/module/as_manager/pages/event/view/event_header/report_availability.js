/**
 * Created by vitaly on 18.10.17.
 */
const   React           	= require('react'),
		Morearty        	= require('morearty'),
		SVG 	        	= require('module/ui/svg'),
		Form 		    	= require('module/ui/form/form'),
		FormField 	    	= require('module/ui/form/form_field');

const ReportAvailability = React.createClass({
	mixins:[Morearty.Mixin],
	propTypes: {
		onCancel: React.PropTypes.func.isRequired,
		isParent: React.PropTypes.bool.isRequired,
		eventId:  React.PropTypes.string.isRequired
	},
	componentWillMount: function(){
		const   binding         = this.getDefaultBinding();

		binding.set('dataUploaded', false);
		if (this.props.isParent) {
			window.Server.children.get()
				.then((data) => {
					binding.set('dataUploaded', true);
					this.children = data;
					this.participatEventChildren = this.getChildrenParticipatingEvent();
					this.childrenOptionArray = this.getSelectChildrenOption();
				});
		} else {
			binding.set('dataUploaded', true);
		}
	},
	componentWillUnmount: function(){
		const binding = this.getDefaultBinding();
		binding.clear('formAvailability');
	},
	onSubmitPermission: function (data) {
		const   bindingForm	= this.getDefaultBinding().sub('formAvailability'),
				rootBinding = this.getMoreartyContext().getBinding(),
				eventId = this.props.eventId;

		let userId, permissionId;
		if (this.props.isParent) {
			const thisParentChildren = this.participatEventChildren;
			if (thisParentChildren.length > 1) {
				const 	selectedChild = bindingForm.meta('children.value').toJS(),
						indexOption = this.childrenOptionArray.indexOf(selectedChild);

				userId = thisParentChildren[indexOption].userId;
				permissionId = thisParentChildren[indexOption].permissionId;
			} else {
				userId = thisParentChildren[0].userId;
				permissionId = thisParentChildren[0].permissionId;
			}
			const 	isTakePart = data.availabilityEnabled ? data.availabilityEnabled : false,
					details = data.details ? data.details : '',
					playerDetails = {
						userId,
						permissionId
					};
			window.Server.parentEventReportAvailability.post(eventId, {isTakePart, details, playerDetails})
				.then(() => this.getDefaultBinding().set('editReportAvailability', false));
		} else {
			userId = rootBinding.get('userData.sessions.roleSession.userId'),
			permissionId = this.getPermissionIdFromPlayers(userId);
			const 	isTakePart = data.availabilityEnabled ? data.availabilityEnabled : false,
					details = data.details ? data.details : '',
					playerDetails = {
						userId,
						permissionId
					};
			window.Server.studentEventReportAvailability.post(eventId, {isTakePart, details, playerDetails})
				.then(() => this.getDefaultBinding().set('editReportAvailability', false));
		}

	},
	getPermissionIdFromPlayers: function (userId){
		const   binding = this.getDefaultBinding(),
				players = binding.toJS('model.players');

		return players.find(p => p.userId === userId).permissionId;
	},
	getChildrenParticipatingEvent: function () {
		const   binding = this.getDefaultBinding(),
				allStudent = binding.toJS('eventTeams.viewPlayers.players'),
				resultArray = [];
		if (Array.isArray(allStudent[0])) {
			allStudent.forEach(students => {
				students.forEach(s => {if (this.children.map(c => c.id).indexOf(s.userId) !== -1) {
					resultArray.push(s)
				}});
			});
		} else {
			allStudent.forEach(s => {if (this.children.map(c => c.id).indexOf(s.userId) !== -1) {
				resultArray.push(s)
			}});
		}

		return resultArray;
	},
	getSelectChildrenOption: function () {
		return this.participatEventChildren.map(c => {
			return `${c.firstName} ${c.lastName}`})
	},
	render: function() {
		const   binding = this.getDefaultBinding(),
				dataUploaded = binding.get('dataUploaded'),
				isParent = this.props.isParent;

		if (dataUploaded) {
			const 	childrenParticipatingEvent = isParent ? this.participatEventChildren : [],
					titleForm = (isParent && childrenParticipatingEvent.length === 1) ?
				`Report Availability for ${childrenParticipatingEvent[0].firstName} ${childrenParticipatingEvent[0].lastName}` :
				"Report Availability";
			return (
				<div className="bPopupEdit_container">
					<Form
						formStyleClass	= "mNarrow"
						name			= {titleForm}
						binding			= {binding.sub('formAvailability')}
						onSubmit		= {this.onSubmitPermission}
						defaultButton	= "Save"
						onCancel		= {this.props.onCancel}
					>
						{ isParent && childrenParticipatingEvent.length > 1 ?
							<FormField	field    		= 'children'
										type     		= 'dropdown'
										options  		= { this.childrenOptionArray }
										defaultValue 	= { this.childrenOptionArray[0] }
							>
								Select child
							</FormField>
							:
							<div></div>
						}
						< FormField type        = "checkbox"
									field       = "availabilityEnabled"
									classNames  = "mSingleLine"
						>
							Availability
						</FormField>
						<FormField	type		= "textarea"
									field		= "details"
						>
							Details
						</FormField>
					</Form>
				</div>
			);
		} else {
			return (
				<div className="bPopupEdit_container">
					<div className="bForm mNarrow">
						<div className="eForm_atCenter" style={{width: '212px'}}>
							<h2>Report Availability</h2>
							<div className="eLoader"><SVG icon="icon_spin-loader-black" /></div>
						</div>
					</div>
				</div>
			);
		}
	}
});
module.exports = ReportAvailability;