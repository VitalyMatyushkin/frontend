const 	Logo 			= require('module/as_school/head/logo'),
		{PublicMenu} 	= require('module/ui/menu/public_menu'),
		Morearty 		= require('morearty'),
		React 			= require('react');

const Head = React.createClass({
	mixins: [Morearty.Mixin],

	render: function() {
		return (
			<div className="bTopPanel mSchoolPanel mFixed">
				<div className="eTopPanel_container">
					<div className="eTopPanel_row">
						<div className="eTopPanel_col_small_4">
							<Logo />
						</div>
						<div className="eTopPanel_col_small_8 eTopPanel_right">
							<PublicMenu menuItems={['Calendar','Fixtures','Results','News']}/>
						</div>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = Head;
