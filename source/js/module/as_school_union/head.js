const	Morearty	= require('morearty'),
		React		= require('react');

const	Logo				= require('module/as_school/head/logo'),
		TopMenu				= require('module/ui/menu/public_menu'),
		{SchoolUnionActions}= require('./school_union_actions');

const	Bootstrap	= require('styles/bootstrap-custom.scss');

const Head = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const schoolUnionId = this.getMoreartyContext().getBinding().get('activeSchoolId');
		SchoolUnionActions.getTournaments(this, schoolUnionId);
	},
	render: function() {
		const 	binding 		= this.getDefaultBinding(),
				menuSchoolUnion = ['League','Calendar','Fixtures','Results','News','Schools'];
		if (binding.toJS('schoolHomePage.tournamentsShow')) {
			menuSchoolUnion.splice(2, 0, 'Tournaments');
		}
		return (
			<div className="bTopPanel mSchoolPanel mFixed">
				<div className="eTopPanel_container">
					<div className="eTopPanel_row">
						<div className="eTopPanel_col_small_4">
							<Logo />
						</div>
						<div className="eTopPanel_col_small_8 eTopPanel_right">
							<TopMenu
								menuItems={menuSchoolUnion}
							/>
						</div>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = Head;
