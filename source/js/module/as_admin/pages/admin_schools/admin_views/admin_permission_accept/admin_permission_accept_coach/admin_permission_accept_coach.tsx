import * as React from 'react'
import * as Morearty from 'morearty'
import * as Immutable from 'immutable'

import * as Loader from 'module/ui/loader'
import * as SportManager from 'module/shared_pages/settings/account/helpers/sport-manager'
import {ServiceList} from "module/core/service_list/service_list";
import {AdminServiceList} from "module/core/service_list/admin_service_list";

import 'styles/ui/b_admin_permission_accept_coach.scss'

export const AdminPermissionAcceptCoach = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		isSuperAdmin: (React as any).PropTypes.bool,
		afterSubmitPage: (React as any).PropTypes.string
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			schoolId: undefined,
			school: undefined,
			prId: undefined,
			permissionRequest: undefined
		});
	},
	componentWillMount: function() {
		const binding = this.getDefaultBinding();

		const permissionRequestId = this.getPermissionRequestId();
		const schoolId = this.getSchoolId();

		binding.clear();
		binding.set('prId', permissionRequestId);
		binding.set('schoolId', schoolId);

		binding.set('isSync', false);
		if (typeof permissionRequestId !== 'undefined') {
			window.Server.permissionRequest.get({prId: permissionRequestId, schoolId:schoolId}).then(permissionRequest =>{
				console.log(permissionRequest);

				binding.set('isSync', true);
				binding.set('permissionRequest', permissionRequest);
				binding.set('sportManager', Immutable.fromJS( {rivals: permissionRequest.sports} ));
			});
		}
	},
	getPermissionRequestId(): string {
		const globalBinding = this.getMoreartyContext().getBinding();
		const routingData = globalBinding.sub('routing.parameters').toJS();

		return routingData.prId;
	},
	getSchoolId(): string {
		const globalBinding = this.getMoreartyContext().getBinding();
		const routingData = globalBinding.sub('routing.parameters').toJS();

		return routingData.schoolId;
	},
	getPermissionService() {
		if(this.props.isSuperAdmin) {
			return (window.Server as AdminServiceList).statusPermissionRequest
		} else {
			return (window.Server as ServiceList).statusPermissionRequest;
		}
	},
	getSportServiceName() {
		if(this.props.isSuperAdmin) {
			return 'schoolSports';
		} else {
			return 'schoolSports';
		}
	},
	onAcceptPermission: function() {
		const binding = this.getDefaultBinding();

		const permissionRequest = binding.toJS('permissionRequest');
		const schoolId = binding.toJS('schoolId');
		const permissionId = permissionRequest.id;
		const sportArray = binding.toJS('sportManager.rivals');
		const sportIdArray = sportArray.map(sport => sport.id);

		this.getPermissionService().put(
			{ schoolId, prId: permissionId },
			{ status: 'ACCEPTED', sportIds: sportIdArray }
			)
			.then(() => {
				document.location.hash = this.props.afterSubmitPage;
			});
	},
	render: function() {
		const binding = this.getDefaultBinding();

		if(binding.toJS('isSync')) {
			return (
				<div className='bAdminPermissionAcceptCoach'>
					<div className='bForm'>
						<div className="eForm_atCenter">
							<h2 className='eForm_header mBlack'>
								Accept coach permission.
							</h2>
							<p>
								You are accepting a coach onto your schools account, please now select the sports that this user will have access to once they have been granted permissions.
							</p>
							<div className='eAdminPermissionAcceptCoach_form'>
								<div className="eForm_field">
									<div className="eForm_fieldName mNoLeftPadding">
										Allow coach sports
									</div>
									<SportManager
										binding			= { binding.sub('sportManager') }
										schoolId		= { binding.toJS('schoolId') }
										serviceName 	= { this.getSportServiceName() }
										extraCssStyle	= "mInline mRightMargin mWidth250"
									/>
								</div>
								<div className="bButton" onClick={this.onAcceptPermission}>Accept permission</div>
							</div>
						</div>
					</div>
				</div>
			)
		} else {
			return (
				<div className='bLoaderWrapper'>
					<Loader condition={ true }/>
				</div>
			);
		}
	}
});