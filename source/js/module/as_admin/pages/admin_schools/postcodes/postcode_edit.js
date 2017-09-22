/**
 * Created by vitaly on 12.09.17.
 */
const 	React 			= 	require('react'),
		Morearty 		= 	require('morearty'),
		PostcodeForm 	= 	require('module/as_admin/pages/admin_schools/postcodes/postcode_form'),
		Immutable 		= require('immutable');

const PostcodeAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 	= this.getDefaultBinding(),
				routingData = binding.toJS('routing.pathParameters'),
				postcodeId 	= routingData[0];

		this.FORM_URL = `tools/postcodes`;
		window.Server.postCode.get({postcodeId}).then( data => {
			binding.set('postcodeData', Immutable.fromJS(data));
		});
	},
	submitEdit: function(data) {
		const 	binding 	= this.getDefaultBinding(),
				routingData = binding.toJS('routing.pathParameters'),
				postcodeId 	= routingData[0];

		data.point.lng = Number(data.point.lng);
		data.point.lat = Number(data.point.lat);

		window.Server.postCode.put({postcodeId}, data).then( () => {
			document.location.hash = this.FORM_URL;
		}).catch( (err) => {
			document.location.hash = this.FORM_URL;
		});
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<PostcodeForm
				title 			= "Edit postcode"
				onFormSubmit 	= { this.submitEdit }
				binding 		= { binding }
			/>
		)
	}
});


module.exports = PostcodeAddPage;