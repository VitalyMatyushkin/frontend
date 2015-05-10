var If = require('module/ui/if/if'),
    SVG = require('module/ui/svg'),
    EventAlbum;

EventAlbum = React.createClass({
    mixins: [Morearty.Mixin],
    getAlbum: function(album) {
        var self = this;

        return <div className="eEventAlbum_item">
            <span className="eEventAlbum_title">{album.get('name')}</span>
        </div>;
    },
    render: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            albums = binding.get('albums').map(self.getAlbum);

        return <div className="bEventAlbum">
            <div className="eEventAlbum_button"></div>
            <div className="eEventAlbum_items">
                {albums}
                <div className="eEventAlbum_item mNew">
                    <span className="eEventAlbum_title">+</span>
                </div>
            </div>
            <div className="eEventAlbum_button mNext"></div>
        </div>;
    }
});


module.exports = EventAlbum;
