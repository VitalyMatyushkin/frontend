import * as React from "react"
import * as Immutable from 'immutable'
import * as Morearty from 'morearty'

import {ConfirmPopup} from "module/ui/confirm_popup"
import {SchoolLimitsForm} from "module/as_admin/pages/admin_schools/new_user_requests/school_limits_form"
import * as Loader from "module/ui/loader"
import {RolesHelper} from "module/as_admin/pages/schools/roles_helper";

export const SchoolLimitsPopup = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		schoolId: (React as any).PropTypes.string.isRequired,
		isSolePETeacher: (React as any).PropTypes.bool.isRequired,
		handleSuccessSubmit: (React as any).PropTypes.func.isRequired
	},
	componentWillMount() {
		const binding = this.getDefaultBinding();

		binding.set('isSync', false);
		window.Server.school.get(this.props.schoolId).then( data => {
			binding.set('schoolLimitsForm', Immutable.fromJS({form: data}));
			binding.set('isSync', true);
		})
	},
	handleSubmit(data) {
		const dataToSubmit = Object.assign({}, data);
		dataToSubmit.allowedPermissionPresets = RolesHelper.convertRolesFromClientToServer(
			this.getDefaultBinding().toJS('schoolLimitsForm.availableRoles')
		);

		window.Server.school.put(this.props.schoolId, dataToSubmit)
			.then(() => this.props.handleSuccessSubmit());
	},
	renderForm() {
		if (this.getDefaultBinding().toJS('isSync')) {
			return (
				<SchoolLimitsForm
					binding = { this.getDefaultBinding().sub('schoolLimitsForm') }
					isSolePETeacher = { this.props.isSolePETeacher }
					onSubmit = { data => this.handleSubmit(data) }
				/>
			);
		} else {
			return <Loader/>;
		}
	},
	render() {
		return (
			<ConfirmPopup
				isShowButtons = {false}
				customStyle = 'mWidth420px'
			>
				{this.renderForm()}
			</ConfirmPopup>
		);
	}
});