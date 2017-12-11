/**
 * Created by vitaly on 23.11.17.
 */
const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable');

const LeagueSportSelec = React.createClass({
	mixins: [Morearty.Mixin],
	getCurrentSport: function() {
		return this.getDefaultBinding().toJS('currentLeagueSport');
	},
	getSports: function() {
		const sports = this.getDefaultBinding().toJS('leagueSports');
		
		return sports.map(sport => {
			return (
				<option	value	= { sport.id }
						   key		= { sport.id }
				>
					{sport.name}
				</option>
			);
		});
	},
	handleChangeSport: function(eventDescriptor) {
		const	sportId	= eventDescriptor.target.value,
				sports	= this.getDefaultBinding().toJS('leagueSports');
		
		const	foundSport	= sports.find(sport => sport.id === sportId);
		
		this.getDefaultBinding().set('currentLeagueSport', Immutable.fromJS(foundSport));
	},
	render: function(){
		return (
			<select
				className		= "bDropdown"
				defaultValue	= "not-selected-sport"
				value			= {this.getCurrentSport().id}
				onChange		= {this.handleChangeSport}
			>
				{this.getSports()}
			</select>
		);
	}
});

module.exports = LeagueSportSelec;