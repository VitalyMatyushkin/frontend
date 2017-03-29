const 	Logo 			= require('module/as_school/head/logo'),
		TopMenu 		= require('module/ui/menu/public_menu'),
		Morearty 		= require('morearty'),
		React 			= require('react'),
		SchoolConsts 	= require('module/helpers/consts/schools'),
		If 				= require('module/ui/if/if'),
		Bootstrap  		= require('styles/bootstrap-custom.scss');

const Head = React.createClass({
	mixins: [Morearty.Mixin],
	/**
	 * Function return true, if public school domain disabled and false if protected or available
	 * @returns {boolean}
	 */
	isPublicSchoolDomainDisabled: function(){
		return this.getMoreartyContext().getBinding().toJS('activeSchool.publicSite.status') === SchoolConsts.PUBLIC_SCHOOL_STATUS_SERVER['DISABLED'];
	},
	render: function() {
		const 	binding = this.getDefaultBinding();

		return (
			<If condition={!this.isPublicSchoolDomainDisabled()}>
				<div className="bTopPanel mSchoolPanel mFixed">
					<div className="eTopPanel_container">
						<div className="eTopPanel_row">
							<div className="eTopPanel_col_small_4">
								<Logo />
							</div>
							<div className="eTopPanel_col_small_8 eTopPanel_right">
								<TopMenu menuItems={['Calendar','Fixtures','Results','News']}></TopMenu>
							</div>
						</div>
					</div>
				</div>
			</If>
		)
	}
});

module.exports = Head;
