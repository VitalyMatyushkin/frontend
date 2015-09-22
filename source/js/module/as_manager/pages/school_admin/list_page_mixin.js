var ListPageMixin,
    If = require('module/ui/if/if'),
    GroupAction = require('module/ui/list/group_action'),
    Popup = require('module/ui/popup'),
    persistentData;
ListPageMixin = {
	propTypes: {
		formBinding: React.PropTypes.any.isRequired,
		filters: React.PropTypes.object,
		addSchoolToFilter: React.PropTypes.bool
	},
	componentWillMount: function () {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');
		!self.serviceName && console.error('Please provide service name');
		self.activeSchoolId = activeSchoolId;
        self.popUpState = false;
        self.updatePageNumbers = true;
		self.updateData();
	},
    getCustomQueryCount:function(){
        var self = this,
            globalBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = globalBinding.get('userRules.activeSchoolId'),
            customQueryFilter = self.filters;
        delete customQueryFilter["limit"];
        if(self.isPaginated === true){
            if(activeSchoolId !== null){
                if(self.serviceCount !== undefined){
                    window.Server[self.serviceCount].get({id:activeSchoolId}).then(function(totalCount){
                        globalBinding.set('totalCount',totalCount.count);
                    });
                }else{
                    window.Server[self.serviceName].get(activeSchoolId,{filter:customQueryFilter}).then(function(data){
                        globalBinding.set('totalCount',data.length);
                    });
                }
            }else{
                if(self.serviceCount !== undefined){
                    window.Server[self.serviceCount].get().then(function(totalCount){
                        globalBinding.set('totalCount',totalCount.count);
                    });
                }else{
                    window.Server[self.serviceName].get({filter:customQueryFilter}).then(function(data){
                        globalBinding.set('totalCount',data.length);
                        self.filters.limit = self.pageLimit;
                        self._getTotalCountAndRenderPagination();
                    });
                }
            }
        }
    },
    componentDidMount:function(){
        var self = this;
        if(self.isSuperAdminPage)React.findDOMNode(self.refs.otherCheck).checked = true;
        //self.timeoutId = setTimeout(function(){
        //    //Pagination method
        //    self._getTotalCountAndRenderPagination();
        //},4000);
    },
    _getTotalCountAndRenderPagination:function(customCount){
        var self = this,
            globalBinding = self.getMoreartyContext().getBinding(),
            pageNumberNode = React.findDOMNode(self.refs.pageNumber),
            isOdd = false,
            selectNode = React.findDOMNode(self.refs.pageSelect);
        if(self.isPaginated){
            customCount = customCount === undefined ? globalBinding.get('totalCount') : customCount;
            self.numberOfPages = customCount !== undefined ? (Math.floor(customCount/self.filters.limit)) : 0;
            //Check if count
            if(customCount%self.filters.limit !== 0){
                self.numberOfPages += 1;
                self.extraPages = customCount % self.filters.limit;
                isOdd = true;
            }
            if(selectNode !== null){
                selectNode.options.length = 0;
                if(customCount >= self.filters.limit){
                    for(var i=0; i<self.numberOfPages; i++){
                        var option = document.createElement('option');
                        option.text =(i < self.numberOfPages ? i+1 : i-1);
                        option.value =  (i < self.numberOfPages ? i+1 : i-1);
                        selectNode.add(option);
                    }
                }
            }
            if(pageNumberNode !== null){
                pageNumberNode.innerText = 'out of '+(self.numberOfPages);
            }
        }
    },
    _handlePageSelectChange:function(){
        var self = this,
            selectNode = React.findDOMNode(self.refs.pageSelect),
            optVal = selectNode.options[selectNode.selectedIndex].value,
            skipLimit = optVal >= 2 ? (optVal - 1) * self.filters.limit  : 0,
            binding = self.getDefaultBinding(),
            metaBinding = binding.meta(),
            filterValue = {
                limit:{limit:self.filters.limit},
                skip:{skip:skipLimit}
            };
        if(metaBinding.get('isFiltersActive') === true){
            metaBinding.set('isFiltersActive',false);
        }
        self.updatePageNumbers = false;
        self.updateData(filterValue);
    },
	updateData: function(newFilter) {
		var self = this,
			requestFilter = { where: {} },
            defaultRequestFilter ={where:{}},
			binding = self.getDefaultBinding(),
            page = window.location.href.split('/'),
            globalBinding = self.getMoreartyContext().getBinding(),
			isFiltersActive = binding.meta().get('isFiltersActive');

        //console.log(newFilter);

        //Exempt current admin from user and permissions list
        if(page[page.length-1] ==='#admin_schools'||page[page.length-1] ==='permissions'){
            if(typeof self.filters === 'object'){
                if('where' in self.filters){
                    if(self.filters.where.id !== undefined){
                        if(self.filters.where.id.neq !== undefined){
                            self.filters.where.id.neq = self.getMoreartyContext().getBinding().get('userData.authorizationInfo.userId');
                        }
                    }else{
                        if(self.filters.where.principalId !== undefined){
                            if(self.filters.where.principalId.neq !== undefined){
                                self.filters.where.principalId.neq = self.getMoreartyContext().getBinding().get('userData.authorizationInfo.userId');
                            }
                        }
                    }
                }
            }
        }
        //Test when to show loading prompt
        if(isFiltersActive === undefined && newFilter === undefined){
            self.popUpState = true;
        }
		self.request && self.request.abort();
		// Фильтрация по школе
		if (self.props.addSchoolToFilter !== false) {
			requestFilter.where.schoolId = self.activeSchoolId;
		}
        // add custom filter
        if (typeof self.filters === 'object') {
            Object.keys(self.filters).forEach(function (filter) {
                requestFilter[filter] = self.filters[filter];
                defaultRequestFilter[filter] = self.filters[filter];
            });
        }

        if(self.sandbox === true && isFiltersActive){
            if(newFilter && Object.keys(newFilter).length > 0){
                var filterKey = '';
                Object.keys(newFilter).forEach(function(filter){
                    filterKey = filter;
                });
                //console.log(newFilter);
                //console.log(filterKey);
                //console.log(newFilter[filterKey]);
                var innerObj = newFilter[filterKey],
                    innerObjKey = '';
                Object.keys(innerObj).forEach(function(ins){
                    innerObjKey = ins;
                });
                //console.log(innerObjKey);
                if(innerObjKey !== 'order'){
                    var filterVal = (innerObj[innerObjKey]!== undefined ? innerObj[innerObjKey]:'a') ,
                        capitalizedVal = filterVal.replace(/^[a-z]/, function(char){return char.toUpperCase()});
                    //console.log(capitalizedVal);
                    if(filterVal.length > 1){
                        binding.update(function(allList){
                            return allList.filter(function(listItem){
                                //console.log(listItem.get('user').toJS().firstName);
                                var str = listItem.get(filterKey).toJS()[innerObjKey];
                                //console.log(str);
                                return str.indexOf(capitalizedVal) >= 0;
                            });
                        });
                    }
                    delete newFilter[filterKey];
                }else{
                    if(innerObjKey ==='order'){
                        var primitiveData,orderKey,outOrder, inOrder,
                            mappedData;
                        primitiveData = binding.toJS();
                        orderKey = newFilter[filterKey][innerObjKey];
                        outOrder = orderKey.split(" ")[0];
                        inOrder = orderKey.split(" ")[1];
                        mappedData = primitiveData.map(function(el,i){
                            //console.log(el[filterKey][innerObjKey]);
                            return el;
                        });
                        mappedData.sort(function(a,b){
                            if(inOrder ==='DESC'){
                                return b[filterKey][outOrder].localeCompare(a[filterKey][outOrder]);
                            }else{
                                return a[filterKey][outOrder].localeCompare(b[filterKey][outOrder]);
                            }
                        });
                        //console.log(mappedData);
                        binding.set(Immutable.fromJS(mappedData));
                    }
                }
            }else{
                binding.set(Immutable.fromJS(persistentData));
            }
        }else{
            // Добавление фильтров по полям, если есть
            if (newFilter && isFiltersActive && Object.keys(newFilter).length > 0) {
                for (var filterName in newFilter) {
                    requestFilter.where[filterName] = newFilter[filterName];
                    if('limit' in (newFilter[filterName])){
                        defaultRequestFilter.limit = parseInt(newFilter[filterName].limit);
                        requestFilter.limit = parseInt(newFilter[filterName].limit);
                    }else if('order' in (newFilter[filterName])){
                        defaultRequestFilter.order = newFilter[filterName].order;
                        requestFilter.order = newFilter[filterName].order;
                    }else if('skip' in (newFilter[filterName])){
                        defaultRequestFilter.skip = parseInt(newFilter[filterName].skip);
                        requestFilter.skip = parseInt(newFilter[filterName].skip);
                    }
                    else{
                        defaultRequestFilter.where[filterName] = newFilter[filterName];
                    }
                }
                self.lastFiltersState = newFilter;
            }
            //Column sorting without filters engaged
            if(newFilter && Object.keys(newFilter).length > 0){
                for(var filterName in newFilter){
                    if('limit' in (newFilter[filterName])){
                        defaultRequestFilter.limit = parseInt(newFilter[filterName].limit);
                        requestFilter.limit = parseInt(newFilter[filterName].limit);
                    }else if('order' in (newFilter[filterName])){
                        defaultRequestFilter.order = newFilter[filterName].order;
                        requestFilter.order = newFilter[filterName].order;
                    }else if('skip' in (newFilter[filterName])){
                        defaultRequestFilter.skip = parseInt(newFilter[filterName].skip);
                        requestFilter.skip = parseInt(newFilter[filterName].skip);
                    }
                    else{
                        defaultRequestFilter.where[filterName] = newFilter[filterName];
                    }
                }
            }
            //Condition to test for other service requests without ids
            if(self.activeSchoolId !== null){
                self.request = window.Server[self.serviceName].get(self.activeSchoolId, { filter: requestFilter }).then(function (data) {
                    self.popUpState = false;
                    binding.set(Immutable.fromJS(data));
                    //console.log(data);
                    persistentData = data;
                    //self.getCustomQueryCount();
                });
            }else{
                self.request = window.Server[self.serviceName].get({filter:defaultRequestFilter}).then(function (data) {
                    if(page[page.length-1] === 'requests'){
                        var notAccepted = [];
                        data.forEach(function(d){
                            if(d.accepted === 'undefined' || d.accepted === undefined){
                                notAccepted.push(d);
                            }
                        });
                        self.popUpState = false;
                        binding.set(Immutable.fromJS(notAccepted));
                        //self.getCustomQueryCount();
                    }else{
                        binding.set(Immutable.fromJS(data));
                        if(self.updatePageNumbers){if(self.isPaginated)self.getCustomQueryCount();}
                        self.popUpState = false;
                    }
                });
            }
        }
	},
	componentWillUnmount: function () {
		var self = this;
		self.request && self.request.abort();
        clearTimeout(self.timeoutId);
	},
	_getEditFunction: function() {
		var self = this;

		return function(data) {
			//	self.props.formBinding.set(Immutable.fromJS(data));

			document.location.hash = document.location.hash + '/edit?id=' + data.id;
		}
	},
	toggleFilters: function() {
		var self = this,
			metaBinding = self.getDefaultBinding().meta(),
			isFiltersActive = metaBinding.get('isFiltersActive');

		if (isFiltersActive) {
			metaBinding.set('isFiltersActive', false);
			self.updateData();
		} else {
			metaBinding.set('isFiltersActive', true);
			self.updateData(self.lastFiltersState);
		}
	},
    toggleBaseFilters:function(el){
        var self = this,
            currentBase = React.findDOMNode(self.refs[el]),
            currentBaseVal = currentBase.value,
            isChecked = currentBase.checked;
        $('.bFilterCheck').attr('checked',false);
        if(isChecked){
            currentBase.checked = isChecked;
            switch (currentBaseVal){
                case 'students':
                    self.filters = {
                        include:['principal','school']
                        ,where:{
                            and:[{preset:{nin:['coach','teacher','parent','manager','owner','admin']}},{preset:'student'}]
                        },
                        limit:self.pageLimit
                    };
                    break;
                case 'all':
                    self.filters ={
                        include:['principal','school']
                        ,where:{
                            principalId:{neq:''}
                        },
                        limit:self.pageLimit
                    };
                    break;
                case 'others':
                    self.filters={
                        include:['principal','school']
                        ,where:{
                            and:[{principalId:{neq:''}},{preset:{neq:'student'}}]
                        },
                        limit:self.pageLimit
                    };
                    break;
                default :
                    self.filters={
                        include:['principal','school']
                        ,where:{
                            and:[{principalId:{neq:''}},{preset:{neq:'student'}}]
                        },
                        limit:self.pageLimit
                    };
                    break;
            }
            self.updatePageNumbers = true;
            self.updateData();
        }else{
            React.findDOMNode(self.refs.otherCheck).checked = true;
            self.filters={
                include:['principal','school']
                ,where:{
                    and:[{principalId:{neq:''}},{preset:{neq:'student'}}]
                },
                limit:self.pageLimit
            };
            self.updatePageNumbers = true;
            self.updateData();
        }
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
			isFiltersActive = binding.meta().get('isFiltersActive'),
            currentPage = window.location.href.split('/'),
            excludeAddButton = ['logs','permissions','archive','#admin_schools','requests'], //Add page name to this array if you don't want to display add button
            includeGroupAction = ['permissions','#admin_schools'],
            listPageTitle;
        if((currentPage[currentPage.length-1] === 'permissions'||currentPage[currentPage.length-1] ==='#admin_schools')){
            listPageTitle = 'Permissions ( '+globalBinding.get('userData.userInfo.firstName')+' '+globalBinding.get('userData.userInfo.lastName')+' - '+(self.setPageTitle !== undefined ? self.setPageTitle+' )' : 'System Admin )');
        }else{
            listPageTitle = self.serviceName[0].toUpperCase() + self.serviceName.slice(1);
        }
		return (
			<div className={isFiltersActive ? 'bFiltersPage' : 'bFiltersPage mNoFilters'}>
				<h1 className="eSchoolMaster_title">{listPageTitle}</h1>
                <div className="eSchoolMaster_groupAction">
                    <If condition={includeGroupAction.indexOf(currentPage[currentPage.length-1]) !== -1}>
                        <GroupAction groupActionFactory={self._getGroupActionsFactory} serviceName={self.serviceName}  binding={self.getMoreartyContext().getBinding()} actionList={self.groupActionList} />
                    </If>
                    <div className="eSchoolMaster_buttons eSchoolMaster_buttons_admin">
                        <If condition={self.isSuperAdminPage}>
                            <div className="filterBase_container">
                                <span>Filter base: </span>
                                <input type="checkbox" className="bFilterCheck" ref="stdCheck" value="students" onChange={self.toggleBaseFilters.bind(null,'stdCheck')}/><span>Students Only</span>
                                <input type="checkbox" className="bFilterCheck" ref="otherCheck" value="others" onChange={self.toggleBaseFilters.bind(null,'otherCheck')}/><span>Others Only</span>
                                <input type="checkbox" className="bFilterCheck" ref="allCheck" value="all" onChange={self.toggleBaseFilters.bind(null,'allCheck')}/><span>All users</span>
                            </div>
                        </If>
                        <div className="bButton" onClick={self.toggleFilters}>Filters {isFiltersActive ? '⇡' : '⇣'}</div>
                        <If condition={excludeAddButton.indexOf(currentPage[currentPage.length-1]) === -1}>
                            <a href={document.location.hash + '/add'} className="bButton">Add...</a>
                        </If>
                    </div>
                </div>
				{self.getTableView()}
                <If condition={includeGroupAction.indexOf(currentPage[currentPage.length-1]) !== -1}>
                    <div className="eSchoolMaster_groupAction">
                        <div className="groupAction bottom_action">
                            <GroupAction groupActionFactory={self._getGroupActionsFactory} serviceName={self.serviceName} binding={self.getMoreartyContext().getBinding()} actionList={self.groupActionList} />
                        </div>
                        <div className="eSchoolMaster_pagination">
                            <div ref="pageNumber" className="leftPagination"></div>
                            <select ref="pageSelect" onChange={self._handlePageSelectChange.bind(null,this)} className="pagination_select"></select>
                            <div className="rightPagination">Page</div>
                        </div>
                    </div>
                </If>
                <Popup binding={binding} stateProperty={'popup'} initState={self.popUpState} otherClass="eSchoolMaster_loading">
                    Loading....
                </Popup>
			</div>
		)
	}
};

module.exports = ListPageMixin;