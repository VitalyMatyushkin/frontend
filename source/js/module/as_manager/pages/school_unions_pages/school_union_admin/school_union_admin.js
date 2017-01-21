const	React				= require('react'),
		Morearty			= require('morearty'),
		RouterView			= require('module/core/router'),
		Route				= require('module/core/route'),
		Immutable			= require('immutable'),
		SchoolUnionSummary	= require('../school_union_admin/pages/school_union_summary/school_union_summary'),
		SubMenu				= require('module/ui/menu/sub_menu');

const SchoolUnionAdmin = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.fromJS({
			schoolUnionSummary: {},
			schoolRouting: {}
		});
	},
	componentWillMount: function() {
		this.setMenuItems();
	},
	setMenuItems: function() {
		this.menuItems = [{
			href	: '/#school_admin/summary',
			name	: 'Summary',
			key		: 'Summary'
		}];
	},
	render: function() {
		const	binding			= this.getDefaultBinding(),
				globalBinding	= this.getMoreartyContext().getBinding();

		return (
			<div>
				<SubMenu	binding	= {binding.sub('schoolRouting')}
							items	= {this.menuItems}
				/>
				<div className="bSchoolUnion">
					<RouterView	routes	= {binding.sub('schoolRouting')}
								binding	= {globalBinding}
					>
						<Route	path		= "/school_union_admin/summary"
								binding		= {binding.sub('schoolUnionSummary')}
								component	= {SchoolUnionSummary}
						/>
						<Route	path		= "/school_union_admin/summary/edit"
								binding		= {binding.sub('schoolUnionSummary')}
								component	= {SchoolUnionSummary}
						/>
					</RouterView>
				</div>
			</div>
		);
	}
});

module.exports = SchoolUnionAdmin;