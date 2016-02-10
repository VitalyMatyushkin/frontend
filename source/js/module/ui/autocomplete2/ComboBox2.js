/**
 * Created by wert on 26.01.16.
 */

/** using bluebird promise cancellation here, though this is not cleaner way I believe */

const   React   = require('react'),
        Lazy    = require('lazyjs');

const ComboBox2 = React.createClass({
    propTypes: {
        /**
         * Placeholder text displayed when input area is empty
         */
        placeholder:     React.PropTypes.string,
        /**
         * True when combobox expect data from an async request
         */
        isLoading:       React.PropTypes.bool,
        /**
         * Function that return sync and async result of search.
         * @param searchText - text for search request
         * @returns {sync:[...], async:Promise}
         */
        searchFunction:  React.PropTypes.func,
        /**
         * Call when user click on element in list.
         * @param id      - element id from search result
         * @param element - element from search result
         */
        onSelect:                 React.PropTypes.func,
        onEscapeSelection:        React.PropTypes.func,
        /**
         * Function return element representaition in combobox list.
         * @param element - element from search result.
         * @returns text element representation
         */
        getElementTitle: React.PropTypes.func
    },
    getInitialState: function(){
        return {
            dataList:            [],
            isLoading:           false,
            isOpen:              false,
            prevText:            undefined,
            currentText:         undefined,
            currentIndex:        undefined,
            currentAsyncRequest: undefined
        };
    },
    /**
     * Will trigger on input end. Strictly saying on focus loose.
     * @param event
     */
    onChange: function(event){
        const self = this;

        self.props.onEscapeSelection();
        self.search(event.target.value);
    },
    search: function(searchText) {
        const self = this;

        if(searchText !== null && searchText !== undefined && searchText !== '') {
            const searchResult  = self.props.searchFunction(searchText);

            self.state.currentAsyncRequest && self.state.currentAsyncRequest.cancel();

            self.setState({
                isLoading:              typeof searchResult.async !== 'undefined',      // if there is something to load - mark ourself as loading
                currentAsyncRequest:    searchResult.async,                             // storing promise to be able reject it later
                dataList:               searchResult.sync,
                currentText:            searchText,
                prevText:               searchText,
                currentIndex:           undefined
            });
            searchResult.async.then((data) => {
                self.setState({
                    isLoading:  false,
                    isOpen: true,
                    dataList:   self.state.dataList.concat(data)
                });
            });
        } else if(searchText === '') {
            self.setState({
                currentText: undefined
            });
        }
    },
    onKeyUp: function(e){
        const self = this;
        let currentIndex = self.state.currentIndex;

        switch (e.key) {
            case 'Enter':
                if(self.state.isOpen && currentIndex !== undefined) {
                    self.selectElement(currentIndex);
                    self.closeMenu();
                } else {
                    self.search(self.state.currentText);
                }
                break;
            case 'Escape':
                if(self.state.isOpen) {
                    self.restorePrevSelectedText();
                    self.closeMenu();
                }
                break;
            case 'ArrowUp':
                if(!self.state.isOpen) {
                    self.search(self.state.currentText);
                } else {
                    if(currentIndex === undefined || currentIndex  === 0) {
                        currentIndex = self.state.dataList.length - 1;
                    } else {
                        currentIndex -= 1;
                    }
                }
                self.markElement(currentIndex);
                break;
            case 'ArrowDown':
                if(!self.state.isOpen) {
                    self.search(self.state.currentText);
                } else {
                    if(currentIndex === undefined || currentIndex + 1 === self.state.dataList.length) {
                        currentIndex = 0;
                    } else {
                        currentIndex += 1;
                    }
                }
                self.markElement(currentIndex);
                break;
        }
    },
    restorePrevSelectedText: function() {
        const self = this;

        self.setState({
            currentText:  self.state.prevText,
            currentIndex: undefined
        });
    },
    selectElement: function(index) {
        const self = this,
              currentElement = self.state.dataList[index];

        self.props.onSelect(currentElement.id, currentElement);
        self.setState({
            currentIndex: undefined,
            dataList:     [],
            currentText:  self.props.getElementTitle(self.state.dataList[index])
        });
    },
    markElement: function(index) {
        const self = this;

        self.setState({
            currentIndex: index,
            currentText:  self.props.getElementTitle(self.state.dataList[index])
        });
    },
    /**
     * Handles left mouse button click on text input
     */
    onInputClick: function(){
        const self = this;

        if(self.state.currentText !== undefined && self.state.currentText !== '') {
            self.search(self.state.currentText);
        }
    },
    /**
     * Handles left mouse button click on list element
     * @param index - index of element from data list
     */
    onListItemClick: function(index){
        const self = this;

        self.selectElement(index);
        self.closeMenu();
    },
    onBlur: function(){
        const self = this;

        self.closeMenu();
    },
    /**
     * Toggle dropdown menu: show/hidden
     */
    toggleMenu: function(){
        const self = this;

        if(self.canOpenMenu()) {
            self.openMenu();
        } else if(self.state.isOpen) {
            self.closeMenu();
        }
    },
    /**
     * Open dropdown menu
     */
    openMenu: function(){
        const self = this;

        self.setState({
            isOpen: true
        });
    },
    /**
     * Close dropdown menu
     */
    closeMenu: function(){
        const self = this;

        self.setState({
            isOpen: false
        });
    },
    /**
     * Will check if it's possible to open menu?
     * @returns {boolean}
     */
    canOpenMenu: function() {
        const self = this;

        return !self.state.isOpen && self.state.dataList !== undefined && self.state.dataList.length !== 0;
    },
    renderMenuItems: function() {
        const self = this;

        if(self.state.dataList.length == 0) {
            return (
                <div className="eCombobox_list" role="listbox">
                    <div className='eCombobox_option'>
                        No matches found
                    </div>
                </div>
            );
        } else {
            return (
                <div className="eCombobox_list" role="listbox">
                    {self.state.dataList.map(self.renderMenuItem)}
                </div>
            );
        }
    },
    renderMenuItem: function(data){
        const self = this;
        let cssStyle = 'eCombobox_option';

        const index = Lazy(self.state.dataList).indexOf(data);

        if(index === self.state.currentIndex) {
            cssStyle += " mSelected";
        }

        return (
            <div className={cssStyle} onMouseDown={self.onListItemClick.bind(self, index)}>
                {self.props.getElementTitle(data)}
            </div>
        );
    },
    getPlaceHolder: function() {
        const   self = this;

        if(self.state.currentText === undefined || self.state.currentText === '') {
            return self.props.placeholder;
        } else {
            return undefined;
        }
    },
    render: function(){
        const   self = this,
                placeholder = self.getPlaceHolder(),
                value       = self.state.currentText,
                isOpenCN    = self.state.isOpen === true ? 'mOpen' : '';

        const hintStyle = {
            position:   'absolute',
            opacity:    1,
            color:      "#ccd6dd",
            tabIndex:   -1
        };
        const inputStyle = {
            backgroundColor:    'transparent',
            position:           'relative'
        };
        // this will act instead of loader spinner for a while
        const loaderStyle = {
            position:    'absolute',
            top:         '3px',
            right:       '3px',
            height:      '17px',
            display:      self.state.isLoading ? undefined : "none"
        };

        return (
            <div className={`bCombobox ${isOpenCN}`}>
                <input type='text' value={placeholder} style={hintStyle} readOnly/>
                <input
                    style={inputStyle}
                    ref="input"
                    className="eCombobox_input"
                    placeholder={placeholder}
                    value={value}
                    onChange={self.onChange}
                    onKeyUp={self.onKeyUp}
                    onClick={self.onInputClick}
                    onBlur={self.onBlur}
                    role="combobox"
                />
                <img style={loaderStyle} src="/images/spinner.gif"/>
                {self.renderMenuItems()}
            </div>
        );
    }
});

module.exports = ComboBox2;