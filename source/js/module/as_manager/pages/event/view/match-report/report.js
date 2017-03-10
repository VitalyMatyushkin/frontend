/**
 * Created by Anatoly on 30.09.2016.
 */

const	React				= require('react'),
		Morearty			= require('morearty'),

		If					= require('module/ui/if/if'),
		Actions 			= require('./report-actions'),
		Loader				= require('module/ui/loader'),
		RoleHelper			= require('module/helpers/role_helper'),

		MatchReportStyle	= require('../../../../../../../styles/pages/event/b_match_report.scss'),
		ButtonStyle			= require('../../../../../../../styles/ui/b_button.scss'),
		EditButtonStyle		= require('../../../../../../../styles/pages/public_event/public_event.scss'),
		Bootstrap			= require('../../../../../../../styles/bootstrap-custom.scss'),
		PencilButton		= require('../../../../../ui/pencil_button');

const MatchReport = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes:{
		eventId		: React.PropTypes.string.isRequired,
		role		: React.PropTypes.string.isRequired
	},
	componentWillMount: function(){
		const 	binding 	= this.getDefaultBinding(),
				rootBinding	= this.getMoreartyContext().getBinding();

		binding.set('isLoadActions', true);
		this.actions = new Actions(this);

		this.actions.load();
	},
	isShowViewMode: function() {
		return !this.actions.isEditMode();
	},
	isShowEditMode: function() {
		return this.props.role !== 'PARENT' && this.props.role !== 'STUDENT' && this.actions.isEditMode();
	},
	isShowEditButton: function() {
		return this.props.role !== 'PARENT' && this.props.role !== 'STUDENT';
	},
	render:function(){
		const 	self 			= this,
				binding 		= self.getDefaultBinding(),
				isLoadActions 	= binding.toJS('isLoadActions');

		if (!isLoadActions) {
			return(
				<div className="bMatchReport">
					<If condition={this.isShowViewMode()}>
						<div className="mAdded">
							<div className="eMatchReport_text">{binding.get('content')}</div>
							<If condition={this.isShowEditButton()}>
								<div className="eMatchReport_btn">
									<PencilButton handleClick={this.actions.onEdit.bind(this.actions)}/>
								</div>
							</If>
						</div>
					</If>
					<If condition={this.isShowEditMode()}>
						<div className="mNew row">
							<div className="col-md-9">
								<Morearty.DOM.textarea
									placeholder="Enter match report ..."
									className="eEvent_report"
									onChange={Morearty.Callback.set(binding, 'content')}
									value={binding.get('content')}
								/>
							</div>
							<div className="eMatchReport_buttons col-md-3">
								<div className="bButton mCancel mMarginRight" onClick={this.actions.onCancel.bind(this.actions)}>
									Cancel
								</div>
								<div className="bButton" onClick={this.actions.onSave.bind(this.actions)}>
									Save
								</div>
							</div>
						</div>
					</If>
				</div>
			);
		} else {
			return (
				<Loader condition={true} />
			);
		}
	}
});

module.exports = MatchReport;

