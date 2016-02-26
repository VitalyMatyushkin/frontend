/**
 * Created by wert on 26.02.16.
 */


const
        ReactDom        = require('reactDom'),
        React           = require('react'),
        Promise         = require('bluebird'),
        ImageService    = require('module/core/services/ImageService');

function runPlaygroundMode() {

    const imgService = new ImageService('http://img.stage.squadintouch.com');

    const MyForm = React.createClass({
        getInitialState : function() {
            return {};
        },
        handleChange: function(e){
            const   self    = this,
                    file    = e.target.files[0];
            imgService.upload(file).then( key => {
                const url = imgService.getOriginalUrlByKey(key);
                console.log('uploaded!: ' + JSON.stringify(url, null, 2));
                self.setState({
                    imgUrl: imgService.getResizedToHeightUrl(url, 300)
                });
            });
        },
        render: function(){
            const img = this.state.imgUrl ? <img src={this.state.imgUrl} /> : undefined;
            return (
                <div>
                    <input
                        ref="fileInput"
                        type="file"
                        onChange={this.handleChange}
                    />
                    {img}
                </div>
            );
        }
    });


    // Init app
    ReactDom.render(
        React.createElement(MyForm),
        document.getElementById('jsMain')
    );
}

module.exports = runPlaygroundMode;