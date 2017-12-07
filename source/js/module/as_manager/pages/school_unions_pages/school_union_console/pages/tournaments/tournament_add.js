/**
 * Created by vitaly on 05.12.17.
 */

const 	TournamentForm 	= require('./tournament_form'),
		{DateHelper} 	= require('module/helpers/date_helper'),
		Morearty		= require('morearty'),
		React 			= require('react');

const TournamentAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.getDefaultBinding().clear();
		const 	globalBinding = this.getMoreartyContext().getBinding(),
				activeSchoolId = globalBinding.get('userRules.activeSchoolId');
		
		this.activeSchoolId = activeSchoolId;
	},
	submitAdd: function(data) {
		data.photos = [{picUrl: data.picUrl}];
		if (data.startTime){
			data.startTime = DateHelper.getFormatDateTimeUTCString(data.startTime);
		}
		if (data.endTime){
			data.endTime = DateHelper.getFormatDateTimeUTCString(data.endTime);
		}
		delete data.picUrl;
		this.activeSchoolId && window.Server.schoolTournaments.post(this.activeSchoolId, data).then(function() {
			document.location.hash = 'school_union_console/tournaments';
		});
	},
	render: function() {
		return (
			<TournamentForm
				title		= "Add new tournament"
				onFormSubmit= {this.submitAdd}
				schoolId	= {this.activeSchoolId}
				binding		= {this.getDefaultBinding()}
			/>
		)
	}
});


module.exports = TournamentAddPage;