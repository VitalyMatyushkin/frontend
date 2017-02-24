/**
 * Created by Anatoly on 14.09.2016.
 */

const   React 		= require('react'),
		Morearty	= require('morearty'),
		Actions 	= require('./request-list-model'),
		If 			= require('module/ui/if/if'),
		Popup 		= require('module/ui/popup'),
		AddRequest 	= require('module/shared_pages/settings/account/add_request'),
		Grid 		= require('module/ui/grid/grid'),
		Loader		= require('module/ui/loader');

const PermissionRequestList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.actions = new Actions(this).init();
	},
	render: function () {
		const 	self = this,
				binding = self.getDefaultBinding(),
				schools = binding.get('schools');

		return (
			<div>
				<Loader condition={!Boolean(schools)}/>
				<If condition={Boolean(schools)}>
					<div className="eTable_view">
						<Grid model={this.actions.grid}/>
						<Popup binding={binding} stateProperty={'popup'} onRequestClose={this.actions._closePopup.bind(this.actions)} otherClass="bPopupGrant">
							<AddRequest binding={binding.sub('addRequest')}
										onSuccess={this.actions._onSuccess.bind(this.actions)}
										onCancel={this.actions._closePopup.bind(this.actions)}
							/>
						</Popup>
					</div>
				</If>
			</div>
		);
	}
});

module.exports = PermissionRequestList;