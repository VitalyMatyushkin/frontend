const	React 		= require('react'),
		Morearty	= require('morearty'),
		Model 		= require('module/as_admin/pages/admin_schools/school_sandbox/events/events-school-model'),
		{Grid} 		= require('module/ui/grid/grid');


const EventsPage = React.createClass({
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


module.exports = EventsPage;
