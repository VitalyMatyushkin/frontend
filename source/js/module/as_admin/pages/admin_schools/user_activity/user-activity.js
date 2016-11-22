/**
 * Created by Anatoly on 21.11.2016.
 */

const   React 		= require('react'),
    Morearty	= require('morearty'),
    Model 		= require('./user-activity-model'),
    Grid 		= require('module/ui/grid/grid');

const UserActivity = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function () {
        this.model = new Model(this).init();
    },
    render: function () {
        return <Grid model={this.model.grid}/>;
    }
});

module.exports = UserActivity;