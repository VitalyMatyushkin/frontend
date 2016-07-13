/**
 * Created by Bright on 07/04/2016.
 */
const   React       =   require('react'),
        Immutable   =   require('immutable');

const   AdminDropList  =  React.createClass({
        mixins         :  [Morearty.Mixin],
        propTypes      :  {
            listItems  : React.PropTypes.array.isRequired,
            listItemFunction : React.PropTypes.func,
            itemId : React.PropTypes.string
        },
        getDefaultState:function(){
            return Immutable.fromJS({
                wrapperActive : false
            });
        },
        _listItemClick:function(item){
            const self  =   this;
            self.props.listItemFunction && self.props.listItemFunction(self.props.itemId,item);
        },
        _renderListItems:function(){
            const   self    =   this;
            if(self.props.listItems){
                return(
                    <ul className="dropdown">
                        {self.props.listItems.map((item,index)=>{
							const text = item.text ? item.text : item;
                            return(
                                <li key={index}><span onClick={self._listItemClick.bind(null,item)}>{text}</span></li>
                            )
                        })}
                    </ul>
                );
            }
        },
        _getWrapperClickFunction:function(event){
            const   self    =   this,
                    binding =   self.getDefaultBinding(),
                    wState  =   binding.get('wrapperActive');
            binding.set('wrapperActive',Immutable.fromJS(!wState));
            event.stopPropagation();
        },
        _getOnBlurFunction:function(event){
            const   self    =   this,
                    binding =   self.getDefaultBinding(),
                    cState  =   binding.get('wrapperActive');
            //On mouse leave check if the current state is true
            //dismiss active state
            if(cState === true){
                binding.set('wrapperActive',Immutable.fromJS(!cState));
                event.stopPropagation();
            }
        },
        render:function(){
            const   self    =   this,
                    binding =   self.getDefaultBinding();
            return (
                <div className={binding.get('wrapperActive')?'wrapper-dropdown-5 active':'wrapper-dropdown-5'}
                     tabIndex="1"
                     onClick={self._getWrapperClickFunction} 
                     onBlur={self._getOnBlurFunction}>
                    Edit
                    {self._renderListItems()}
                </div>
            )
        }
});
module.exports      =   AdminDropList;