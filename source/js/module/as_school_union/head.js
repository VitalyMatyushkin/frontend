const 	Logo 		= require('module/as_school/head/logo'),
		TopMenu 	= require('module/ui/menu/public_menu'),
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
                        <div className="col-sm-4 col-md-4">
                            <Logo />
                        </div>
                        <div className="col-sm-8 col-md-8 eTopPanel_right">
                            <TopMenu menuItems={['Scores','Calendar','Fixtures','Results','News','Schools']}></TopMenu>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = Head;
