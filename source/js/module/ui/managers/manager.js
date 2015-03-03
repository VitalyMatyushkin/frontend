var Manager,
	FootballManager = require('./football/football');

Manager = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		game: React.PropTypes.oneOf(['football']).isRequired
	},
    getDefaultProps: function () {
        return {
            edit: true
        }
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			mangerBinding = {default: binding, data: self.getBinding('data')};

        if (!self.props.edit) {
            return <div className="bManager">
                <div className="eManager_gameDate">28.03.2015</div>
                <div className="eManager_rivalType">schools</div>
                <div className="eManager_gameResult">
                    <span className="eManager_rival">FCB</span>
                    <span className="eManager_score">1:0</span>
                    <span className="eManager_rival">EBS</span>
                </div>
                <FootballManager binding={mangerBinding} edit={self.props.edit} />
            </div>
        } else {
            return <div className="bManager mEdit">
                <div className="eManager_gameDate">
                    <input class="eMangerDatePicker" type="text"/>
                </div>
                <div className="eManager_rivalType">
                    <select className="eManager_selectRivalType">
                        <option>schools</option>
                        <option>houses</option>
                        <option>classes</option>
                    </select>
                </div>
                <div className="eManager_gameResult">
                    <span className="eManager_rival">
                        <input class="eMangerDatePicker" type="text" placeholder="school/learner/class" />
                    </span>
                    <span className="eManager_rival">
                        <input class="eMangerDatePicker" type="text" placeholder="school/learner/class" />
                    </span>
                </div>
                <FootballManager binding={mangerBinding} />
            </div>
        }

	}
});

module.exports = Manager;
