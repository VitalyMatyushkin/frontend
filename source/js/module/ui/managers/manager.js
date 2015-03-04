var Manager,
	FootballManager = require('./football/football'),
	Autocomplete = require('module/ui/autocomplete/autocomplete');

Manager = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		game: React.PropTypes.oneOf(['football']).isRequired
	},
	getDefaultState: function () {
		var self = this;

		return Immutable.fromJS({
			filterMode: 'schools',
            autocompleteClass: {},
            autocompleteHouse: {}
		});
	},
	/**
	 * Сервис фильтрации по дому
	 * @param houseName
	 * @returns {*}
	 */
	serviceHouseFilter: function(schoolId, houseName) {
		var self = this;

        return window.Server.housesFilter.get({
            filter: {
                where: {
                    schoolId: schoolId,
                    name: {
                        like: houseName,
                        options: 'i'
                    }
                }
            }
        });
	},
	/**
	 * Сервис фильтрации по классу
	 * @param className
	 * @returns {*}
	 */
	serviceClassFilter: function(schoolId, className) {
		var self = this;

		return window.Server.classesFilter.get({
            filter: {
                where: {
                    schoolId: schoolId,
                    name: {
                        like: className,
                        options: 'i'
                    }
                }
            }
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
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('activeSchoolId'),
			binding = self.getDefaultBinding(),
			mangerBinding = {default: binding, data: self.getBinding('data')},
			filterMode = binding.get('filterMode'),
			currentAutocomplete;

		if (filterMode === 'classes') {
			currentAutocomplete =  <div>
				Selected class id: <span>{self.getDefaultBinding().sub('autocompleteClass').get('selectedId')}</span>
				<Autocomplete serviceFilter={self.serviceClassFilter.bind(self, activeSchoolId)} serverField="name" binding={self.getDefaultBinding().sub('autocompleteClass')} />
			</div>
		} else if (filterMode === 'houses') {
			currentAutocomplete = <div>
				Selected house id: <span>{self.getDefaultBinding().sub('autocompleteHouse').get('selectedId')}</span>
				<Autocomplete serviceFilter={self.serviceHouseFilter.bind(self, activeSchoolId)} serverField="name" binding={self.getDefaultBinding().sub('autocompleteHouse')} />
			</div>
		} else {
            currentAutocomplete = <div>
                Selected school id: <span>{activeSchoolId}</span>
            </div>
        }

        //if (!self.props.edit) {
        //    return <div className="bManager">
        //        <div className="eManager_gameDate">28.03.2015</div>
        //        <div className="eManager_rivalType">schools</div>
        //        <div className="eManager_gameResult">
        //            <span className="eManager_rival">FCB</span>
        //            <span className="eManager_score">1:0</span>
        //            <span className="eManager_rival">EBS</span>
        //        </div>
        //        <FootballManager binding={mangerBinding} edit={self.props.edit} />
        //    </div>
        //} else {
            return <div className="bManager mEdit">
                <div className="eManager_gameDate">
                    <input class="eMangerDatePicker" type="text"/>
                </div>
                <div className="eManager_rivalType">
                    <select className="eManager_selectRivalType" value={filterMode} onChange={self.changeCompleteType}>
                        <Morearty.DOM.option value="schools" selected="selected">schools</Morearty.DOM.option>
                        <Morearty.DOM.option value="houses">houses</Morearty.DOM.option>
                        <Morearty.DOM.option value="classes">classes</Morearty.DOM.option>
                    </select>
                </div>
                <div className="eManager_gameResult">
                    <span className="eManager_rival">
					{currentAutocomplete}
                    </span>
                    <span className="eManager_rival">
                        <input class="eMangerRival" type="text" placeholder={'Enter rivalname'} />
                    </span>
                </div>
                <FootballManager binding={mangerBinding} />
            </div>;
        //}

	}
});

module.exports = Manager;
