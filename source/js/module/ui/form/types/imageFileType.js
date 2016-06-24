/**
 * Created by wert on 01.03.16.
 */


const   TypeMixin   = require('module/ui/form/types/type_mixin'),
        className   = require('classnames'),
        SVG         = require('module/ui/svg'),
        Immutable   = require('immutable'),
        React       = require('react');

/** Handles file upload to cloud. As result will return uploaded file url to form */
const ImageFileTypeUpload = React.createClass({
    mixins:[Morearty.Mixin, TypeMixin],
    propTypes:{
        typeOfFile:React.PropTypes.string,
        labelText: React.PropTypes.string
    },
    getDefaultState: function () {
        return Immutable.fromJS({
            fileLoading: false
        });
    },
    _inputFileChange:function(e){
        const   self        = this,
                binding     = self.getDefaultBinding(),
                imgFile     = e.target.files[0];

        binding.set('fileLoading', true);
        window.Server.images.upload(imgFile)
            .then(imgUrl => {
                binding.set('defaultValue', imgUrl);
                self.setValue(imgUrl);
            })
            .finally(() => {
                binding.set('fileLoading',false);
            });
    },

    render:function(){
        const   self        = this,
                binding     = self.getDefaultBinding(),
                gifClasses  = className({
                    'eLoader_gif':      true,
                    'eLoader_gif_hide': !binding.get('fileLoading'),
                    'eLoader_gif_show': binding.get('fileLoading')
                });

        let coverImg;
        if(binding.get('defaultValue') !== undefined) {
            coverImg = window.Server.images.getResizedToBoxUrl(binding.get('defaultValue'), 300, 300);
        } else {
            coverImg= '/images/empty_pic_uploader_box.png';
        }
		const style = {backgroundImage: `url(${coverImg})`};
        return (
            <div className="eForm_blazonUpload">
                <div className="eForm_blazonPreview">
					<div className="eImg" style={style}></div>
					<div className={gifClasses}>
						<img src="images/spin-loader-black.gif"/>
					</div>
                </div>
                <div className="eForm_fileInput">
                    <input className="inputFile" name="file" id="file" type="file" onChange={self._inputFileChange}/>
                    <label className="bRoundBtn" htmlFor="file"><SVG icon="icon_add_photo" /></label>
                </div>
            </div>
        );
    }
});

module.exports = ImageFileTypeUpload;