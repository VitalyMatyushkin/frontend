var Manager,
	FootballManager = require('./football/football');

Manager = React.createClass({
	mixins: [Morearty.Mixin],
    getRivals: function () {
        var self = this,
            binding = self.getDefaultBinding();

        return binding.get('newEvent.rivals').reduce(function (memo, rival, index) {
            var name = rival.get('name');

            if (index !== 0) {
                memo = memo.push(<span className="eManagerContainerVs">VS</span>)
            }

            return memo.push(<span className="eManagerContainer_rival">{name}</span>);
        }, Immutable.List()).toArray();
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			rivalsType = binding.get('newEvent.model.rivalsType'),
            rivals = binding.get('newEvent.rivals');

            return <div className="eManagerContainer">
				<h4 className="eManagerContainer_title">{self.getRivals()}</h4>
				<FootballManager binding={binding} />
			</div>;
	}
});

module.exports = Manager;
