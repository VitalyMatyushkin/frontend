/**
 * Created by bridark on 19/10/15.
 */
var ExtraPermissionsField,
    AutoComplete = require('module/ui/autocomplete/autocomplete'),
    React = require('react'),
    If = require('module/ui/if/if');
ExtraPermissionsField = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes:{
        extraFieldKey:React.PropTypes.string
    },
    getInitialState:function(){
        return {
            isOpen:false
        }
    },
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        self.studentObj={firstName:'',lastName:'',house:'',form:''}
    },
    /*
    * Render custom auto complete boxes using data already bound to parent component
    * @Path:_formAutocomplete,_houseAutocomplete path to response from server already stored in context
    * Implements an autocomplete box not tied into context data binding to enable separate information to be entered
    */
    renderOptionListForHouses:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            houseModel = binding.get('_houseAutocomplete.response'),
            houseListItems;
        if(houseModel && houseModel.length > 1){
            houseListItems = houseModel.map(function(item,index){
                return (
                    <div id={item.id} className="eCombobox_option" role="option" onClick={self.handleOptionItemClick.bind(null,'listHouseInput',item.name,'listHouse')}>
                        {item.name}
                    </div>
                );
            });
        }
        return(
            <div className="bCombobox">
                <input ref="listHouseInput" className="eCombobox_input" aria-owns="houseList" placeholder="House name" onBlur={self.handleInputBlur.bind(null,'listHouse')}></input>
                <span aria-hidden="true" className="eCombobox_button" onClick={self.handleDropDownButtonClick.bind(null,'listHouse')}>▾</span>
                <div id="houseList" ref="listHouse" className="eCombobox_list" aria-expanded="false" role="listbox">{houseListItems}</div>
            </div>
        );
    },
    renderOptionListForForms:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            formsModel = binding.get('_formAutocomplete.response'),
            formsListItems;
        if(formsModel && formsModel.length > 1){
            formsListItems = formsModel.map(function(f){
                return (
                    <div id={f.id} className="eCombobox_option" role="option" onClick={self.handleOptionItemClick.bind(null,'listFormInput',f.name,'listForm')}>
                        {f.name}
                    </div>
                );
            });
        }
        return(
            <div className="bCombobox">
                <input ref="listFormInput"  className="eCombobox_input" placeholder="Form name" onBlur={self.handleInputBlur.bind(null,'listForm')}></input>
                <span aria-hidden="true" className="eCombobox_button" onClick={self.handleDropDownButtonClick.bind(null,'listForm')}>▾</span>
                <div ref="listForm" className="eCombobox_list" aria-expanded={this.state.isOpen + ''} role="listbox">{formsListItems}</div>
            </div>
        );
    },
    handleOptionItemClick:function(optionParent,setTo,optionList){
        var self = this,
            binding = self.getDefaultBinding(),
            el = React.findDOMNode(self.refs[optionParent]);
        el.value = setTo;
        optionList === 'listForm'?self.studentObj.form = setTo : self.studentObj.house = setTo;
        self.toggleExpansion(optionList);

    },
    handleInputClick:function(handle){
        var self = this;
        self.toggleExpansion(handle);
    },
    handleInputBlur:function(target){
        var self = this,
            binding = self.getDefaultBinding();
        self.toggleExpansion(target);
        binding.set(self.props.extraFieldKey,self.studentObj);
    },
    handleDropDownButtonClick:function(handler){
        var self = this;
        self.toggleExpansion(handler);
    },
    toggleExpansion:function(handler){
        var self = this;
        if(handler === 'listHouse'){
            var el = React.findDOMNode(self.refs.listHouse);
            if(el.getAttribute('aria-expanded') === 'false'){
                el.setAttribute('aria-expanded','true');
                el.classList.add('eCombobox_showOptions');
            }else{
                el.setAttribute('aria-expanded','false');
                el.classList.remove('eCombobox_showOptions');
            }
        }else{
            if(handler ==='listForm'){
                var el = React.findDOMNode(self.refs.listForm);
                if(el.getAttribute('aria-expanded') === 'false'){
                    el.setAttribute('aria-expanded','true');
                    el.classList.add('eCombobox_showOptions');
                }else{
                    el.setAttribute('aria-expanded','false');
                    el.classList.remove('eCombobox_showOptions');
                }
            }
        }
    },
    onChangeFirstName:function(event){
        var self = this,
            binding = self.getDefaultBinding();
        self.studentObj.firstName = event.currentTarget.value;
    },
    onChangeLastName:function(event){
        var self = this,
            binding = self.getDefaultBinding();
        self.studentObj.lastName = event.currentTarget.value;
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            houseAutoComplete = self.renderOptionListForHouses(),
            formAutoComplete = self.renderOptionListForForms();
        return (
            <div>
                <input type="text" disabled value={binding.get('_schoolAutocomplete.model').name} style={{backgroundColor:'#d3d3d3'}}/>
                {houseAutoComplete}
                {formAutoComplete}
                <div>
                    <div className="eRegistration_input">
                        <input ref="firstNameField" placeholder="Firstname" type={'text'} onChange={self.onChangeFirstName} />
                    </div>
                    <div className="eRegistration_input">
                        <input ref="lastNameField" placeholder="Lastname" type={'text'} onChange={self.onChangeLastName} />
                    </div>
                </div>
            </div>
        );
    }
});
module.exports = ExtraPermissionsField;