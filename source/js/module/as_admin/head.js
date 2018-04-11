// @flow
/**
 * Created by bridark on 04/06/15.
 */
const	React		= require('react'),
		Morearty	= require('morearty'),
		Logo		= require('module/as_admin/head/logo'),
		{TopMenu}	= require('module/ui/menu/top_menu'),
		UserBlock	= require('module/shared_pages/head/user_block'),
		TopNavStyle	= require('styles/main/b_top_nav.scss'),
		Bootstrap	= require('styles/bootstrap-custom.scss');

const Head = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const binding = this.getDefaultBinding();

		const menuItems = [
			{
				href: '/#users/users',
				name: 'Users',
				key: 'Users',
				routes:['/users/:subPage', '/users/:filter', '/users/:inviteId/:mode'],
				authorization:true
			},
			{
				href: '/#schools/admin_views/list',
				name: 'Schools',
				key: 'Schools',
				routes:['/schools/:subPage', '/schools/:filter', '/schools/:inviteId/:mode'],
				authorization:true
			},
			{
				href: '/#sports',
				name: 'Sports',
				key: 'Sports',
				routes:['/sports/:subPage', '/sports/:filter', '/sports/:inviteId/:mode'],
				authorization:true
			},
			{
				href: '/#tools/import_students',
				name: 'Tools',
				key: 'Tools',
				routes:['/tools/:subPage', '/tools/:filter', '/tools/:inviteId/:mode'],
				authorization:true
			},
			{
				href: '/#payments/stripe_integrations',
				name: 'Payments',
				key: 'payments',
				routes:['/payments/:subPage'],
				authorization:true
			},
			{
				href:			'/#apps',
				name:			'Applications',
				key:			'Applications',
				routes:			['/apps/:subPage', '/apps/:filter', '/apps/:inviteId/:mode'],
				authorization:	true
			}
		];

		binding.set('topMenuItems', menuItems);

		return (
			<div className="bTopPanel container">
				<div className="row">
					<div className="col-md-4">
						<Logo/>
					</div>
					<div className="col-md-8 bTopNav">
						<TopMenu
							binding = {
								{
									default:		binding.sub('routing'),
									itemsBinding:	binding.sub('topMenuItems')
								}
							}
						/>
						<UserBlock
							binding	= { binding.sub('userData') }
							asAdmin	= { true }
						/>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = Head;
