/**
 * Created by Anatoly on 17.04.2016.
 */
const 	React = require('react');

const NoRolePage = React.createClass({
   render:function(){
       return(
           <h2 style={{textAlign: 'center', marginTop: '50px'}}>Please select a role from the list.</h2>
       );
   }
});

module.exports = NoRolePage;