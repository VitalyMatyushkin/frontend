const	React		= require('react'),
		Morearty	= require('morearty'),
		RouterView	= require('module/core/router'),
		Route		= require('module/core/route');

const	PlaceList	= require('./place_list'),
		PlaceView	= require('./place_view'),
		PlaceEdit	= require('./place_edit'),
		PlaceAdd	= require('./place_add');

const PlacesPage = React.createClass({
	mixins: [Morearty.Mixin],
	handleClickForm: function(formId, formName) {
		document.location.hash = 'school_admin/forms/students?id=' + formId + '&name=' + formName;
	},
	handleClickStudent: function(studentId) {
		document.location.hash = 'school_admin/students/stats?id=' + studentId;
	},
	render: function() {
		const	binding 		= this.getDefaultBinding(),
				globalBinding	= this.getMoreartyContext().getBinding();

		return (
			<RouterView	routes	= { binding.sub('placesRouting') }
						binding	= { globalBinding }
			>
				<Route
					path		= "/school_console/places"
					binding		= { binding.sub('placeList') }
					component	= { PlaceList }
					handleClick	= { this.handleClickForm }
				/>
				<Route
					path		= "/school_console/places/add"
					binding		= { binding.sub('placeAdd') }
					component	= { PlaceAdd }
				/>
				<Route
					path		= "/school_console/places/edit"
					binding		= { binding.sub('placeEdit') }
					component	= { PlaceEdit }
				/>
				<Route
					path		= "/school_console/places/view"
					binding		= { binding.sub('placeView') }
					component	= { PlaceView }
				/>
			</RouterView>
		)
	}
});

module.exports = PlacesPage;