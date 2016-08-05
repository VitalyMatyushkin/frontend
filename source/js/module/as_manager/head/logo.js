const React = require('react'),
    Morearty = require('morearty'),
    SVG = require('module/ui/svg');

const Logo = React.createClass({
    mixins: [Morearty.Mixin],
    returnToHomePage: function () {
        const subdomains = document.location.host.split('.');
        let homePage,
            role = subdomains[0];
        switch (role) {
            case 'manager':
                homePage = 'school_admin/summary';
                break;
            case 'parents':
                homePage = 'events/calendar/all';
                break;
        }
        document.location.hash = homePage;
    },
    render: function () {
        var self = this;
        return (
            <div className="bTopLogo" onClick={self.returnToHomePage}>
                <img src="images/logo.png"/>
            </div>
        )
    }
});

module.exports = Logo;
