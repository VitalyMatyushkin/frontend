/**
 * Created by Anatoly on 30.09.2016.
 */

const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		If				= require('module/ui/if/if'),
		Actions 		= require('./report-actions');

const MatchReport = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes:{
		eventId: React.PropTypes.string.isRequired
	},
	componentWillMount: function(){
		this.actions = new Actions(this).load();
	},
	render:function(){
		const 	self 		= this,
				binding 	= self.getDefaultBinding();

		return(
			<div className="bMatchReport">
				<If condition={!this.actions.isEditMode()}>
					<div>
						<div className="bEditButtonWrapper">
							<div className="bEditButton" onClick={this.actions.onEdit}>
								<SVG icon="icon_edit"/>
							</div>
						</div>
						<div>{binding.get('model.matchReport')}</div>
					</div>
				</If>
				<If condition={this.actions.isEditMode()}>
					<div>
						<Morearty.DOM.textarea
							placeholder="Enter match report"
							className="eEvent_report"
							onChange={Morearty.Callback.set(binding, 'model.matchReport')}
							value={binding.get('model.matchReport')}
						/>
						<div className="bEventButtons">
							<div className="bEventButton mCancel" onClick={this.actions.onCancel}>
								Cancel
							</div>
							<div className="bEventButton" onClick={this.actions.onSave}>
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

