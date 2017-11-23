const	React 				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		ListInviteClass 	= require('module/as_admin/pages/tools/list_invite_class'),
	{Grid}				= require('module/ui/grid/grid');


const ListInvite = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		//The function, which will call when user click on <Row> in Grid
		handleClick: React.PropTypes.func
	},
	componentWillMount: function () {
		const 	binding 	= this.getDefaultBinding(),
				grid 		= binding.toJS('grid');
		
		if (grid) {
			this.model = new ListInviteClass(this).createGridFromExistingData(grid);
		} else {
			this.model = new ListInviteClass(this).createGrid();
		}
	},
	render: function () {
		const binding = this.getDefaultBinding();
		
		binding.set('grid', Immutable.fromJS(this.model.grid));
		return this.model.grid ? <Grid model={this.model.grid}/> : null;
	}
});


module.exports = ListInvite;