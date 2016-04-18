/**
 * Created by Anatoly on 17.04.2016.
 */
const 	React = require('react');

const NoRolePage = React.createClass({
   render:function(){
       return(
           <h2 style={{textAlign: 'center', marginTop: '50px'}}>The role is not selected.</h2>
       );
   }
});

module.exports = NoRolePage;