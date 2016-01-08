const 	If 		= require('module/ui/if/if'),
		Map 	= require('module/ui/map/map'),
		React 	= require('react');

const OpponentsMapPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			rootBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = rootBinding.get('activeSchoolId'),
			binding = self.getDefaultBinding();

		window.Server.schoolInfo.get(activeSchoolId).then(function (data) {
			binding.set('schoolInfo', Immutable.fromJS(data));
		});

		window.Server.schoolOpponents.get(activeSchoolId).then(function (data) {
			binding.set('list', Immutable.fromJS(data));
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div className="bOpponentsMap" ref="map">
				<If condition={binding.get('schoolInfo.postcode.point.lat')}>
					<Map binding={self.getDefaultBinding()} point={{lat: binding.get('schoolInfo.postcode.point.lat'), lng: binding.get('schoolInfo.postcode.point.lng')}} />
				</If>
			</div>
		)
	}
});


module.exports = OpponentsMapPage;
