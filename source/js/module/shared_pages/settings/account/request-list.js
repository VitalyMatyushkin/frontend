/**
 * Created by Anatoly on 14.09.2016.
 */

const	React			= require('react'),
		Morearty		= require('morearty');

const	Actions 		= require('./request-list-model'),
		If				= require('module/ui/if/if'),
		Popup			= require('module/ui/popup'),
		SchoolHelper	= require('../../../helpers/school_helper'),
		AddRequest		= require('module/shared_pages/settings/account/add_request'),
		Grid			= require('module/ui/grid/grid'),
		Loader			= require('module/ui/loader');

const PermissionRequestList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.actions = new Actions(this).init();
		SchoolHelper.loadActiveSchoolInfo(this).then(() => {
			const binding = this.getDefaultBinding();

			binding.set('isSync', true);
		});
	},
	isSync: function() {
		const binding = this.getDefaultBinding();

		const	schools	= binding.get('schools'),
				isSync	= binding.get('isSync');

		return typeof schools !== 'undefined' && isSync;
	},
	render: function () {
		const binding = this.getDefaultBinding();

		const	schools	= binding.get('schools'),
				isSync	= binding.get('isSync');

		return (
			<div>
				<Loader condition={!this.isSync()}/>
				<If condition={this.isSync()}>
					<div className="eTable_view">
						<Grid model={this.actions.grid}/>
						<Popup	binding			= {binding}
								stateProperty	= {'popup'}
								onRequestClose	= {this.actions._closePopup.bind(this.actions)}
								otherClass		= "bPopupGrant"
						>
							<AddRequest	binding			= {binding.sub('addRequest')}
										activeSchool	= {SchoolHelper.getActiveSchoolInfo(this)}
										onSuccess		= {this.actions._onSuccess.bind(this.actions)}
										onCancel		= {this.actions._closePopup.bind(this.actions)}
							/>
						</Popup>
					</div>
				</If>
			</div>
		);
	}
});

module.exports = PermissionRequestList;