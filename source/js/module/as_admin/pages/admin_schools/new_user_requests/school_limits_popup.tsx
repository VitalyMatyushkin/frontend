import * as React from "react"
import * as Immutable from 'immutable'
import * as Morearty from 'morearty'

import {ConfirmPopup} from "module/ui/confirm_popup"
import {SchoolLimitsForm} from "module/as_admin/pages/admin_schools/new_user_requests/school_limits_form"
import * as Loader from "module/ui/loader"

export const SchoolLimitsPopup = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		schoolId: (React as any).PropTypes.string.isRequired,
		onSubmit: (React as any).PropTypes.func.isRequired
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
		console.log(data);
	},
	renderForm() {
		if (this.getDefaultBinding().toJS('isSync')) {
			return (
				<SchoolLimitsForm
					binding = { this.getDefaultBinding().sub('schoolLimitsForm') }
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
				okButtonText            = "Save"
                cancelButtonText        = "Cancel"
                isOkButtonDisabled      = { this.getDefaultBinding().toJS('isProcessingSubmit') }
				handleClickOkButton		= { this.handleClickOkButton }
				handleClickCancelButton	= { this.handleClickCancelButton }
				customStyle				= 'mMiddle mFullWidth'
			>
				{this.renderForm()}
			</ConfirmPopup>
		);
	}
});