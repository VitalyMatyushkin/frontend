/**
 * Created by Anatoly on 01.10.2016.
 */

const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable');

const MatchReport = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes:{
		activeSchoolId: React.PropTypes.string.isRequired
	},
	componentWillMount: function(){
		const 	self 		= this,
				binding 	= self.getDefaultBinding(),
				eventId 	= binding.toJS('model.id');

		window.Server.publicSchoolEventReport.get({
			schoolId: this.props.activeSchoolId,
			eventId: eventId
		}).then(report => {
			binding.set('model.matchReport', Immutable.fromJS(report.content));
		});
	},
	render:function(){
		const 	self 		= this,
				binding 	= self.getDefaultBinding(),
				report 		= binding.get('model.matchReport');

		if(report){
			return(
				<div className="bMatchReport">
					{report}
				</div>
			);
		}

		return null;
	}
});

module.exports = MatchReport;

