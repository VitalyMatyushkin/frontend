var FootballManager;

FootballManager = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return <div className="eManagerGame_team">
			<span className="ePlayer">John Smith</span>
			<span className="ePlayer">John Smith</span>
			<span className="ePlayer">John Smith</span>
			<span className="ePlayer">John Smith</span>
			<span className="ePlayer">John Smith</span>
			<span className="ePlayer">John Smith</span>
			<span className="ePlayer">John Smith</span>
			<span className="ePlayer">John Smith</span>
			<span className="ePlayer">John Smith</span>
			<span className="ePlayer">John Smith</span>
            <input type="text" class="ePlayerAdd" placeholder="learner" />
		</div>
	}
});

module.exports = FootballManager;
