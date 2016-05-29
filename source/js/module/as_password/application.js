/**
 * Created by Anatoly on 29.05.2016.
 */

const 	HeadView 		= require('./head'),
        CenterView 		= require('./center'),
        React 			= require('react');

const ApplicationView = React.createClass({
    mixins: [Morearty.Mixin],

    render: function() {/**
	 * Created by Anatoly on 29.05.2016.
	 */
        const 	self 	= this,
				binding = self.getDefaultBinding();

        return (
            <div>
                <HeadView binding={binding} />
                <CenterView binding={binding} />
            </div>
        );
    }
});


module.exports = ApplicationView;