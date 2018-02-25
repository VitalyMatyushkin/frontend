/**
 * Created by bridark on 08/06/15.
 */
    //[Refactored use fileType instead]]
// TODO: Do we still need it ?
const   classNames  = require('classnames'),
       {If}         = require('module/ui/if/if'),
        React       = require('react'),
        ReactDOM    = require('react-dom'),
        Morearty    = require('morearty'),
	    SessionHelper	= require('module/helpers/session_helper'),
        $           = require('jquery');

// TODO: delete me

console.error('upload_blazon deprecated. Use imageFileType instead');

let
    urlStr,
    preview,
    albumDetails={},
    currentAction;

const BlazonUpload = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            currentSchoolId = typeof rootBinding.get('routing.parameters.id') !== 'undefined' ? rootBinding.get('routing.parameters.id') : rootBinding.get('userRules.activeSchoolId');
        currentAction = document.location.href.split('/');
        currentAction = currentAction[currentAction.length-1];
        if(currentAction !== 'add'){
            window.Server.school.get(currentSchoolId).then(function(school){
                //preview = self.renderPhoto(school.pic);
                ReactDOM.findDOMNode(self.refs.prevImage).src = school.pic;
            });
        }
    },
    _updatePhotoUpload:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding();
        window.Server.addAlbum.post(rootBinding.get('userRules.activeSchoolId'), {
            name: 'blazon_'+rootBinding.get('userRules.activeSchoolId')+'_staging',
            description: 'blazon_'+rootBinding.get('userRules.activeSchoolId')+'_staging',
            eventId: rootBinding.get('userRules.activeSchoolId')
        }).then(function(res){
            albumDetails=res;
        });
    },
    renderPhoto: function(imgSrc) {
        var self = this,
            classes = classNames({
                'eAlbums_photo': true,
                'eAlbum_ext':true
            }),
            styles = {backgroundImage: 'url(' + imgSrc + ')'};
        return <div className={classes} style={styles}></div>
    },
    handleFile: function(e) {
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding();
        var file = e.target.files[0];
        ReactDOM.findDOMNode(self.refs.imageChanged).innerText = 'Processing...';
        if(currentAction === 'add') {
			const userId = SessionHelper.getUserIdFromSession(
				rootBinding.sub('userData')
			);

			window.Server.addAlbum.post(
				userId,
				{
					name:			`blazon_${userId}_staging`,
					description:	`blazon_${userId}_staging`,
					eventId:		userId
            	}
            ).then(function(res){
                albumDetails=res;
                var formData = new FormData(),
                    uri = window.apiBase + '/storage/sqt_album_1433792142221_a340185653dd693a37c8a502_staging',
                    fileName = Math.random().toString(12).substring(7) + '.' + file.name.split('.')[1];
                formData.append('file', file, fileName);
                $.ajax({
                    url: uri + '/upload',
                    type: 'POST',
                    success: function(res) {
                        var uploadedFile = res.result.files.file[0],
                            model = {
                                name: uploadedFile.name,
                                albumId: albumDetails.id,
                                description: uploadedFile.name,
                                authorId:albumDetails.ownerId,
                                pic: uri + '/files/' + uploadedFile.name
                            };
                        window.Server.photos.post(albumDetails.id, model).then(function(data){
                            urlStr = 'http:'+uri+'/files/'+fileName+'/contain?height=60&width=60';
                            rootBinding.set('picUrl',urlStr);
                            //React.findDOMNode(self.refs.prevImage).src = data.pic+'/contain?height=60&width=60';
                            ReactDOM.findDOMNode(self.refs.imageChanged).innerText = 'Image changed - Please submit to effect changes';
                            self.forceUpdate();
                            return data;
                        });
                    },
                    // Form data
                    data: formData,
                    //Options to tell jQuery not to process data or worry about content-type.
                    cache: false,
                    contentType: false,
                    processData: false
                });
            });
        }else{
            window.Server.addAlbum.post(rootBinding.get('userRules.activeSchoolId'), {
                name: 'blazon_'+rootBinding.get('userRules.activeSchoolId')+'_staging',
                description: 'blazon_'+rootBinding.get('userRules.activeSchoolId')+'_staging',
                eventId: rootBinding.get('userRules.activeSchoolId')
            }).then(function(res){
                albumDetails=res;
                var formData = new FormData(),
                    uri = window.apiBase + '/storage/'+albumDetails.storageId,
                    fileName = Math.random().toString(12).substring(7) + '.' + file.name.split('.')[1];
                formData.append('file', file, fileName);
                $.ajax({
                    url: uri + '/upload',
                    type: 'POST',
                    success: function(res) {
                        var uploadedFile = res.result.files.file[0],
                            model = {
                                name: uploadedFile.name,
                                albumId: albumDetails.id,
                                description: uploadedFile.name,
                                authorId:albumDetails.ownerId,
                                pic: uri + '/files/' + uploadedFile.name
                            };
                        window.Server.photos.post(albumDetails.id, model).then(function(data){
                            urlStr = 'http:'+uri+'/files/'+fileName+'/contain?height=60&width=60';
                            rootBinding.set('picUrl',urlStr);
                            //React.findDOMNode(self.refs.prevImage).src = data.pic+'/contain?height=60&width=60';
                            ReactDOM.findDOMNode(self.refs.imageChanged).innerText = 'Image changed - Please submit to effect changes';
                            self.forceUpdate();
                            return data;
                        });
                    },
                    // Form data
                    data: formData,
                    //Options to tell jQuery not to process data or worry about content-type.
                    cache: false,
                    contentType: false,
                    processData: false
                });
            });
        }
    },
    render: function() {
		const	self		= this,
				binding		= self.getDefaultBinding(),
				rootBinding	= self.getMoreartyContext().getBinding();

		const userId = SessionHelper.getUserIdFromSession(
			rootBinding.sub('userData')
		);
		const isOwner = userId !== binding.get('ownerId');

        return <div className="bAlbums_list">
            <If condition={isOwner}>
                <div className="eAlbums_photo mUpload mUpload_ext">+
                    <input onChange={self.handleFile} type="file" className="eAlbums_input eBlazon_input"/>
                </div>
            </If>
            <div>
                <img className="eBlazon_prev" ref="prevImage"/>
            </div>
            <div><span className="eBlazon_notify" ref="imageChanged"/></div>
        </div>;
    }
});


module.exports = BlazonUpload;
