/**
 * Created by Anatoly on 09.09.2016.
 */

const   React       = require('react'),
		classNames 	= require('classnames');

const   ActionDropList  =  React.createClass({
        propTypes      :  {
            listItems  : React.PropTypes.array.isRequired,
            listItemFunction : React.PropTypes.func,
            itemId : React.PropTypes.string
        },
        getInitialState:function(){
            return {
                wrapperActive : false
            };
        },
        _listItemClick:function(item){
			const self = this;
            self.props.listItemFunction && self.props.listItemFunction(self.props.itemId,item);
        },
        _renderListItems:function(){
			const self = this;
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
        onClick:function(event){
            const self = this;

            self.setState({wrapperActive: !self.state.wrapperActive});
            event.stopPropagation();
        },
        onBlur:function(event){
            const self = this;
            //On mouse leave check if the current state is true
            //dismiss active state
            if(self.state.wrapperActive){
				self.setState({wrapperActive: !self.state.wrapperActive});
                event.stopPropagation();
            }
        },
        render:function(){
            const   self = this,
					classes = classNames({
						'wrapper-dropdown-5':true,
						active:self.state.wrapperActive
					});
            return (
                <div className={classes}
                     tabIndex="1"
                     onClick={self.onClick}
                     onBlur={self.onBlur}>
                    Edit
                    {self._renderListItems()}
                </div>
            )
        }
});

module.exports = ActionDropList;