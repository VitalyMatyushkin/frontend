var ChallengesView;

ChallengesView = React.createClass({
	mixins: [Morearty.Mixin],
    componentWillMount: function () {
        var schoolsBinding = this.getMoreartyContext().getBinding().sub('schools');

        window.Server.schools.get().then(function (data) {
            schoolsBinding.set('schools.list', Immutable.fromJS(data));
        });
    },
	render: function() {
        var schoolsBinding = this.getMoreartyContext().getBinding().sub('schools');

		return <div className="bChallenges">

		</div>;
	}
});


module.exports = ChallengesView;
