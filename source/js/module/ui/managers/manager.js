var Manager,
	FootballManager = require('./football/football'),
	Autocomplete = require('module/ui/autocomplete/autocomplete');

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
	getDefaultState: function () {
		var self = this;

		return Immutable.fromJS({
			filterMode: 'leaners'
		});
	},
	/**
	 * Сервис фильтрации по дому
	 * @param houseName
	 * @returns {*}
	 */
	serviceHouseFilter: function(houseName) {
		var self = this;

		return window.Server.housesFilter.get({
			schoolId: '4a7ce40a-2348-4325-bd9d-75b5dd020209',
			name: houseName
		});
	},
	/**
	 * Сервис фильтрации по классу
	 * @param className
	 * @returns {*}
	 */
	serviceClassFilter: function(className) {
		var self = this;

		return window.Server.classesFilter.get({
			schoolId: '4a7ce40a-2348-4325-bd9d-75b5dd020209',
			name: className
		});
	},
	/**
	 * Сервис фильтрации по ученику
	 * @param leanerName
	 * @returns {*}
	 */
	serviceLeanerFilter: function(leanerName) {
		var self = this;

		return window.Server.learnersFilter.get({
			schoolId: '4a7ce40a-2348-4325-bd9d-75b5dd020209',
			name: leanerName
		}).then(function(resultArray){

			// Модифицируем результат, добавля поле суммирующее имя и фамилию ученика
			resultArray.map(function(leaner){
				leaner.fullName = leaner.firstName + ' ' + leaner.lastName;

				return leaner;
			});

			return resultArray;
		});
	},
	changeCompleteType: function(event) {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('filterMode', event.currentTarget.value);
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			mangerBinding = {default: binding, data: self.getBinding('data')},
			filterMode = binding.get('filterMode');

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
                    <select className="eManager_selectRivalType" onChange={self.changeCompleteType}>
                        <option selected="selected">leaners</option>
                        <option>houses</option>
                        <option>classes</option>
                    </select>
                </div>
                <div className="eManager_gameResult">
                    <span className="eManager_rival">
						<div>Filter mode: {filterMode}</div>

						Selected class id: <span>{self.getDefaultBinding().sub('autocompleteClass').get('selectedId')}</span>
						<Autocomplete serviceFilter={self.serviceClassFilter} serverField="name" binding={self.getDefaultBinding().sub('autocompleteClass')} />

						Selected leaner id: <span>{self.getDefaultBinding().sub('autocompleteLeaner').get('selectedId')}</span>
						<Autocomplete serviceFilter={self.serviceLeanerFilter} serverField="fullName" binding={self.getDefaultBinding().sub('autocompleteLeaner')} />

						Selected house id: <span>{self.getDefaultBinding().sub('autocompleteHouse').get('selectedId')}</span>
						<Autocomplete serviceFilter={self.serviceHouseFilter} serverField="name" binding={self.getDefaultBinding().sub('autocompleteHouse')} />
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
