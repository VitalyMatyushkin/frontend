/**
 * Created by vitaly on 12.09.17.
 */
const	React 		= require('react'),
		Morearty	= require('morearty'),
		Model 		= require('module/as_admin/pages/admin_schools/postcodes/postcodes-list-model'),
		Grid 		= require('module/ui/grid/grid');


const PostcodesList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.model = new Model(this);
	},
	render: function () {
		return (
			<Grid model={this.model.grid}/>
		);
	}
});


module.exports = PostcodesList;