/**
 * Created by Anatoly on 30.09.2016.
 */

const	React			= require('react'),
		Morearty		= require('morearty'),
		If				= require('module/ui/if/if'),
		Actions 		= require('./report-actions'),
		SVG 			= require('module/ui/svg');

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
					<div>
						<div className="bEditButtonWrapper">
							<div className="bEditButton" onClick={this.actions.onEdit.bind(this.actions)}>
								<SVG icon="icon_edit"/>
							</div>
						</div>
						<div style={{whiteSpace: 'pre-line'}}>{binding.get('content')}</div>
					</div>
				</If>
				<If condition={this.actions.isEditMode()}>
					<div>
						<Morearty.DOM.textarea
							placeholder="Enter match report"
							className="eEvent_report"
							onChange={Morearty.Callback.set(binding, 'content')}
							value={binding.get('content')}
						/>
						<div className="bEventButtons">
							<div className="bEventButton mCancel" onClick={this.actions.onCancel.bind(this.actions)}>
								Cancel
							</div>
							<div className="bEventButton" onClick={this.actions.onSave.bind(this.actions)}>
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

