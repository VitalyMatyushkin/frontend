/**
 * Created by bridark on 04/06/15.
 */
var HeadView = require('module/as_admin/head'),
    CenterView = require('module/as_admin/center'),
    ApplicationView;

ApplicationView = React.createClass({
    mixins: [Morearty.Mixin],
    componentDidMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            appVisibility = Helpers.pageVisibility.checkVisibilityOptions();
        document.addEventListener(appVisibility.visibilityChange,function(){
                var obj = Helpers.pageVisibility.checkVisibilityOptions();
                if(document[obj.hidden]==true){
                    if(Helpers.cookie.get('authorizationInfo') !== undefined){
                        Helpers.cookie.remove('authorizationInfo');
                        binding.sub('authorizationInfo').clear();
                        document.location.hash = '#login';
                        document.location.reload(true);
                    }
                }
            }
        );
    },
    render: function() {
        var self = this,
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