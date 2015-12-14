var ListPageMixin,
    If = require('module/ui/if/if'),
    GroupAction = require('module/ui/list/group_action'),
    Popup = require('module/ui/popup'),
    //workerThread = require('module/as_manager/pages/school_admin/dataWorkerThread'),
    persistentData,
    dataWorker;
ListPageMixin = {
	propTypes: {
		formBinding: React.PropTypes.any.isRequired,
		filters: React.PropTypes.object,
		addSchoolToFilter: React.PropTypes.bool
	},
	componentWillMount: function () {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
            metaBinding = self.getDefaultBinding().meta(),
            binding = self.getDefaultBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');
		!self.serviceName && console.error('Please provide service name');
		self.activeSchoolId = activeSchoolId;
        self.popUpState = false;
        self.updatePageNumbers = true;
        metaBinding.set('isFiltersActive', false);
        //setup a web worker to sort and filter data in background
        if(window.Worker){
            dataWorker = new Worker('build/js/module/as_manager/pages/school_admin/dataWorkerThread.js');
            dataWorker.onmessage = function(e){
                if(self.isPaginated && e.data.length > self.pageLimit){
                    binding.set(Immutable.fromJS(e.data.slice(0,(self.pageLimit+1))));
                    self._getTotalCountAndRenderPagination(e.data.length);
                }else{
                    binding.set(Immutable.fromJS(e.data));
                }
            };
        }
		self.updateData();
	},
    componentDidMount:function(){
        var self = this;
        if(self.isSuperAdminPage)React.findDOMNode(self.refs.otherCheck).checked = true;
        //self.timeoutId = setTimeout(function(){
        //    //Pagination method
        //    //self._getTotalCountAndRenderPagination();
        //},4000);

    },
    //@Param:customCount the length/size of data to be paginated
    _getTotalCountAndRenderPagination:function(customCount){
        var self = this,
            globalBinding = self.getMoreartyContext().getBinding(),
            pageNumberNode = React.findDOMNode(self.refs.pageNumber),
            isOdd = false,
            selectNode = React.findDOMNode(self.refs.pageSelect);
        if(self.isPaginated){
            customCount = customCount === undefined ? globalBinding.get('totalCount') : customCount;
            self.numberOfPages = Math.floor(customCount/self.pageLimit);
            //Check if count
            if(customCount%self.pageLimit !== 0){
                //self.numberOfPages += 1;
                self.extraPages = customCount % self.pageLimit;
                //isOdd = true;
            }
            if(selectNode !== null){
                selectNode.options.length = 0;
                if(customCount >= self.pageLimit){
                    for(var i=0; i<self.numberOfPages; i++){
                        var option = document.createElement('option');
                        option.text =(i < self.numberOfPages ? i+1 : i-1);
                        option.value =  (i < self.numberOfPages ? i+1 : i-1);
                        selectNode.add(option);
                    }
                }
            }
            if(pageNumberNode !== null && customCount >= self.pageLimit){
                pageNumberNode.innerText = 'out of '+(self.numberOfPages);
            }else{
                pageNumberNode !== null ? pageNumberNode.innerText = '1 out of 1': '';
            }
        }
    },
    _handlePageSelectChange:function(){
        var self = this,
            selectNode = React.findDOMNode(self.refs.pageSelect),
            optVal = selectNode.options[selectNode.selectedIndex].value,
            skipLimit = optVal >= 2 ? optVal * self.pageLimit  : 0,
            binding = self.getDefaultBinding(),
            metaBinding = binding.meta(),
            filterValue = {
                skip:{skip:skipLimit}
            };
        self.customLimit = self.pageLimit;
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
		self.request && self.request.cancel();
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
        //@Property: sandbox flag to determine if page requires extra requests to server for filtering
        //All relevant data to the page are requested and stored in a bag for as long as the page is open
        if(self.sandbox === true && isFiltersActive){
            if(newFilter && Object.keys(newFilter).length > 0){
                var tempData = self.persistantData;
                dataWorker.postMessage([tempData,newFilter]);
            }else{
                binding.set(Immutable.fromJS(self.persistantData));
            }
        //Execute if the filters aren't engaged but there is a filter Object
        }else if(self.sandbox === true && newFilter){
            //If newFilter contains a skip key then perform a pagination page skip
            for(var skipFilter in newFilter){
                if('skip' in newFilter[skipFilter]){
                    var skippedData = self.persistantData.splice((newFilter[skipFilter].skip-1),self.pageLimit-1);
                    binding.set(Immutable.fromJS(skippedData));
                }else{
                    //Perform an order sort
                    var tempData = self.persistantData;
                    dataWorker.postMessage([tempData,newFilter]);
                }
            }
        }
        else{
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
                    //Is the page allowed to paginate
                    if(self.isPaginated){
                        binding.set(Immutable.fromJS(data.slice(0,(self.pageLimit+1))));
                        self._getTotalCountAndRenderPagination(data.length);
                    }else{
                        binding.set(Immutable.fromJS(data));
                    }
                    self.persistantData = data;
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
                        if(self.isPaginated){
                            binding.set(Immutable.fromJS(notAccepted.slice(0,(self.pageLimit+1))));
                            self._getTotalCountAndRenderPagination(notAccepted.length);
                        }else{
                            binding.set(Immutable.fromJS(notAccepted));
                        }
                        self.persistantData = notAccepted;
                    }else{
                        if(self.isPaginated){
                            binding.set(Immutable.fromJS(data.slice(0,(self.pageLimit+1))));
                            self._getTotalCountAndRenderPagination(data.length);
                        }else{
                            binding.set(Immutable.fromJS(data));
                        }
                        self.persistantData = data;
                    }
                });
            }
        }
	},
	componentWillUnmount: function () {
		var self = this,
            binding = self.getDefaultBinding();
		self.request && self.request.cancel();
        clearTimeout(self.timeoutId);
        self.persistantData.length = 0;
        binding.clear()
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
                        }
                    };
                    break;
                case 'all':
                    self.filters ={
                        include:['principal','school']
                        ,where:{
                            principalId:{neq:''}
                        }
                    };
                    break;
                case 'others':
                    self.filters={
                        include:['principal','school']
                        ,where:{
                            and:[{principalId:{neq:''}},{preset:{neq:'student'}}]
                        }
                    };
                    break;
                default :
                    self.filters={
                        include:['principal','school']
                        ,where:{
                            and:[{principalId:{neq:''}},{preset:{neq:'student'}}]
                        }
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
                }
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
                            <select ref="pageSelect" onChange={self._handlePageSelectChange.bind(null,this)} className="pagination_select">1</select>
                            <div className="rightPagination">Page</div>
                        </div>
                    </div>
                </If>
                <If condition={includeGroupAction.indexOf(currentPage[currentPage.length-1]) === -1 && currentPage[currentPage.length-1] === 'students'}>
                    <div className="eSchoolMaster_groupAction">
                        <div className="eSchoolMaster_pagination">
                            <div ref="pageNumber" className="leftPagination"></div>
                            <select ref="pageSelect" onChange={self._handlePageSelectChange.bind(null,this)} className="pagination_select">1</select>
                            <div className="rightPagination">Page</div>
                        </div>
                    </div>
                </If>
			</div>
		)
	}
};

module.exports = ListPageMixin;