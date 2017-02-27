const 	Logo 		= require('module/as_school/head/logo'),
		TopMenu 	= require('module/ui/menu/public_menu'),
		PublicLogin = require('module/ui/menu/public_login'),
		Morearty    = require('morearty'),
		React 		= require('react'),
		Bootstrap  	= require('styles/bootstrap-custom.scss');

const Head = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const 	self 	= this,
				binding = this.getDefaultBinding();

		return (
			<div className="bTopPanel mSchoolPanel mFixed">
				<div className="container">
					<div className="row">
						<div className="col-md-5">
							<Logo />
						</div>
						<div className="col-md-7 eTopPanel_right">
							<TopMenu menuItems={['Calendar','Fixtures','Results','News']}></TopMenu>
							<PublicLogin />
						</div>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = Head;
