/**
 * Created by Woland on 22.01.2017.
 */
const 	React 			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		{Autocomplete} 	= require('module/ui/autocomplete2/OldAutocompleteWrapper');

const AdminPermissionAcceptStudentComponent = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		afterSubmitPage: React.PropTypes.string
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			permissionId: null,
			comment: null,
			schoolId: null,
			formId: null,
			houseId: null,
			studentId: null
		});
	},
	componentWillMount: function() {
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				prId 			= routingData.prId,
				schoolId 		= routingData.schoolId;

		binding.clear();
		binding.set('prId', prId);
		binding.set('schoolId', schoolId);

		if (prId) {
			window.Server.permissionRequest.get({prId:prId, schoolId:schoolId}).then(function (data) {
				binding.set('comment', data.requestedPermission.comment);
			});
		}
	},
	serviceFormFilter: function(fromName) {
		const 	binding 	= this.getDefaultBinding(),
				schoolId 	= binding.get('schoolId');

		return window.Server.schoolForms.get(schoolId, {
			filter: {
				where: {
					name: {
						like: fromName,
						options:'i'
					}
				}
			}
		});
	},
	onSelectForm: function(formId) {
		const binding = this.getDefaultBinding();

		binding.set('formId', formId);
	},
	serviceHouseFilter: function(houseName) {
		const 	binding 	= this.getDefaultBinding(),
				schoolId 	= binding.get('schoolId');

		return window.Server.schoolHouses.get(schoolId, {
			filter: {
				where: {
					name: {
						like: houseName,
						options:'i'
					}
				}
			}
		});
	},
	onSelectHouse: function(houseId) {
		const binding = this.getDefaultBinding();

		binding.set('houseId', houseId);
	},

	onAcceptPermission: function() {
		const 	binding 	= this.getDefaultBinding(),
				prId 		= binding.get('prId'),
				schoolId 	= binding.get('schoolId'),
				studentId 	= binding.get('studentId'),
				houseId		= binding.get('houseId'),
				formId		= binding.get('formId');

		window.Server.statusPermissionRequest.put(
			{
				schoolId:schoolId,
				prId:prId
			},
			{
				status:'ACCEPTED',
				houseId: houseId,
				formId: formId
			}).then(() => {
				document.location.hash = this.props.afterSubmitPage;
			});
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<div className='bForm'>
				<h2>Accept student permission. Please choose:</h2>
				<h3>Comment: {binding.get('comment')}</h3>
				<div className='eForm_field'>
					<Autocomplete
						serviceFilter={this.serviceFormFilter}
						serverField='name'
						onSelect={this.onSelectForm}
						placeholder='Form'
					/>
				</div>
				<div className='eForm_field'>
					<Autocomplete
						serviceFilter={this.serviceHouseFilter}
						serverField='name'
						onSelect={this.onSelectHouse}
						placeholder='House'
					/>
				</div>
				<div className="bButton" onClick={this.onAcceptPermission}>Accept permission</div>
			</div>
		)
	}
});

module.exports = AdminPermissionAcceptStudentComponent;