
const   React       = require('react'),
        Immutable   = require('immutable'),
        Popup       = require('module/ui/popup');

const GalleryListPage = React.createClass({
    mixins:[Morearty.Mixin],
    getInitialState:function(){
        return{albumPrompt:true}
    },
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId');
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding();
        return (
            <div className="bSchoolGallery">
                <h2>School Gallery</h2>
            </div>
        )
    }
});
module.exports = GalleryListPage;