/**
 * Created by wert on 01.03.16.
 */


const   TypeMixin   = require('module/ui/form/types/type_mixin'),
        className   = require('classnames'),
		{SVG}        = require('module/ui/svg'),
		{If}		= require('module/ui/if/if'),
        Immutable   = require('immutable'),
		Morearty    = require('morearty'),
        React       = require('react');

/** Handles file upload to cloud. As result will return uploaded file url to form */
const ImageFileTypeUpload = React.createClass({
    mixins:[Morearty.Mixin, TypeMixin],
    id: '',
	propTypes:{
        labelText: React.PropTypes.string
    },
	componentWillMount: function() {
		const self = this;

		self.id = new Date().getTime();
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
                //binding.set('defaultValue', imgUrl);
                self.setValue(imgUrl);
            })
            .finally(() => {
                binding.set('fileLoading',false);
            });
    },
	clearValue:function(e){
		this.setValue(null);

		e.stopPropagation();
	},
    render:function(){
        const   self        = this,
                binding     = self.getDefaultBinding(),
				noEmpty		= !!binding.get('value'),
                gifClasses  = className({
                    eLoader_gif: 	true,
					mHidden: 		!binding.get('fileLoading')
                });

        let coverImg;
        if(noEmpty) {
            coverImg = window.Server.images.getResizedToMinValueUrl(binding.get('value'), 170);
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
					<input	id={`image-file-${self.id}`}
							name={`image-file-${self.id}`}
							className="eInputFile"
							type="file"
							onChange={self._inputFileChange}
					/>
                    <label	className="eRoundBtn"
							htmlFor={`image-file-${self.id}`}
					>
						<SVG icon="icon_add_photo" />
					</label>
					<If condition={noEmpty && false}>  {/* wait task #1087 */}
						<span className="eTrash" onClick={self.clearValue}>
							<SVG icon="icon_trash" /> Delete image
						</span>
					</If>
                </div>
            </div>
        );
    }
});

module.exports = ImageFileTypeUpload;