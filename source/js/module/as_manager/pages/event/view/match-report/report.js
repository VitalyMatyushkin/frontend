/**
 * Created by Anatoly on 30.09.2016.
 */

const	React				= require('react'),
		Morearty			= require('morearty'),

		If					= require('module/ui/if/if'),
		Actions 			= require('./report-actions'),
		SVG 				= require('module/ui/svg'),

		MatchReportStyle	= require('../../../../../../../styles/pages/event/b_match_report.scss'),
		ButtonStyle			= require('../../../../../../../styles/ui/b_button.scss'),
		EditButtonStyle		= require('../../../../../../../styles/pages/public_event/public_event.scss'),
		Bootstrap  	    	= require('../../../../../../../styles/bootstrap-custom.scss');

const MatchReport = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes:{
		eventId: React.PropTypes.string.isRequired
	},
	componentWillMount: function(){
		this.actions = new Actions(this);
		this.actions.load();
	},
	render:function(){
		const 	self 		= this,
				binding 	= self.getDefaultBinding();

		return(
			<div className="bMatchReport">
				<If condition={!this.actions.isEditMode()}>
					<div className="mAdded">
						<div className="eMatchReport_text">{binding.get('content')}</div>
						<div className="eMatchReport_btn">
							<div className="bButton mCircle" onClick={this.actions.onEdit.bind(this.actions)}>
								<SVG icon="icon_edit2"/>
							</div>
						</div>
					</div>
				</If>
				<If condition={this.actions.isEditMode()}>
					<div className="mNew row">
						<div className="col-md-9">
						<Morearty.DOM.textarea
							placeholder="Enter match report ..."
							className="eEvent_report"
							onChange={Morearty.Callback.set(binding, 'content')}
							value={binding.get('content')}
						/>
						</div>
						<div className="bEventButtons col-md-3">
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
	}
});

module.exports = MatchReport;

