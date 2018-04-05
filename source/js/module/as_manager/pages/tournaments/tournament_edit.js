/**
 * Created by vitaly on 05.12.17.
 */

const 	TournamentForm 	= require('./tournament_form'),
		React 			= require('react'),
		Morearty		= require('morearty'),
		{DateHelper} 	= require('module/helpers/date_helper'),
		Loader	        = require('module/ui/loader'),
		Immutable 		= require('immutable');


const TournamentEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				activeSchoolId 	= globalBinding.get('userRules.activeSchoolId'),
				tournamentId 	= routingData.id;
		
		binding.clear();
		
		if (tournamentId) {
			window.Server.schoolTournament.get({schoolUnionId: activeSchoolId, tournamentId: tournamentId}).then( data => {
				data.picUrl = data.photos[0].picUrl;
				binding.set(Immutable.fromJS(data));
				binding.set('isSync', true);
			});
			
			this.tournamentId = tournamentId;
			this.activeSchoolId = activeSchoolId;
		}
	},
	submitEdit: function(data) {
		data.photos = [{picUrl: data.picUrl}];
		if (data.startTime){
			data.startTime = DateHelper.getFormatDateTimeUTCStringByRegion(data.startTime, this.props.region);
		}
		if (data.endTime){
			data.endTime = DateHelper.getFormatDateTimeUTCStringByRegion(data.endTime, this.props.region);
		}
		delete data.picUrl;
		this.activeSchoolId && window.Server.schoolTournament
			.put({schoolUnionId: this.activeSchoolId, tournamentId: this.tournamentId}, data)
			.then(function() {
			document.location.hash = 'tournaments';
		});
	},
	render: function() {
		const binding = this.getDefaultBinding();

		if (binding.get('isSync')) {
			return (
				<TournamentForm
					title		= "Edit tournament"
					onFormSubmit= {this.submitEdit}
					region      = {this.props.region}
					binding		= {binding}
					schoolId	= {this.activeSchoolId}
				/>
			)
		} else {
			return <Loader/>
		}

	}
});


module.exports = TournamentEditPage;