/**
 * Created by vitaly on 12.09.17.
 */
const 	React 			= 	require('react'),
		Morearty 		= 	require('morearty'),
		PostcodeForm 	= 	require('module/as_admin/pages/admin_schools/postcodes/postcode_form');

const PostcodeAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.FORM_URL = `tools/postcodes`;
	},
	submitAdd: function(data) {
		data.point.lng = Number(data.point.lng);
		data.point.lat = Number(data.point.lat);
		console.log(data);
		window.Server.postCodes.post(data).then( () => {
			document.location.hash = this.FORM_URL;
		}).catch( (err) => {
			document.location.hash = this.FORM_URL;
		});
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<PostcodeForm
				title 			= "Add new postcode"
				onFormSubmit 	= { this.submitAdd }
				binding 		= { binding.sub('postcodeAdd') }
			/>
		)
	}
});


module.exports = PostcodeAddPage;