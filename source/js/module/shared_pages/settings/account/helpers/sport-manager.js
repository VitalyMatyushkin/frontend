/**
 * Created by Vitaly on 27.07.17.
 */

const	React				= require('react'),
        Morearty			= require('morearty'),
        Immutable			= require('immutable'),
	    {Autocomplete}		= require('module/ui/autocomplete2/OldAutocompleteWrapper'),
        CrossButton	        = require('module/ui/cross_button/cross_button');

const   SportsManager = React.createClass({
        mixins: [Morearty.Mixin],
        propTypes: {
            schoolId : React.PropTypes.string.isRequired,
            serviceName: React.PropTypes.string.isRequired,
            extraCssStyle: React.PropTypes.string
        },

    sportsService: function(sportName) {
        const 	schoolId    = this.props.schoolId,
                binding		= this.getDefaultBinding(),
                rivals		= binding.toJS('rivals');

        const sports = rivals.map(r => r.id);
        const filter = {
            filter: {
                where: {
                    id: {
                        $nin: sports
                    },
                    name: {
                        like: sportName,
                        options: 'i'
                    }
                },
                limit: 100,
                order:'name ASC'
            }
        };
        const service = window.Server[this.props.serviceName];
        return service.get(schoolId, filter);
    },

    onSelectSport: function (order, id, model) {
        const binding = this.getDefaultBinding();
        if(typeof id !== 'undefined' && typeof model !== 'undefined') {
            binding.set(`rivals.${order}`, Immutable.fromJS(model));
        }
    },

    onClickRemoveSportButton: function(rivalIndex) {
        const	binding	= this.getDefaultBinding();
        let		rivals	= binding.toJS('rivals');

        rivals.splice(rivalIndex, 1);

        binding.set('rivals', Immutable.fromJS(rivals));
    },

    render: function() {
        const	binding	        = this.getDefaultBinding(),
                rivals	        = binding.toJS('rivals'),
                extraCssStyle   = this.props.extraCssStyle;

        const choosers = rivals.map((rival, rivalIndex) => {
            return (
                <div key={rivalIndex} className="eForm_field">
                <Autocomplete
                    key			    = { `sport_input_${rivalIndex}` }
                    defaultItem     = { binding.toJS(`rivals.${rivalIndex}`) }
                    serviceFilter   = { this.sportsService }
                    serverField     = "name"
                    placeholder     = "Please select sport"
                    onSelect        = { this.onSelectSport.bind(null, rivalIndex) }
                    extraCssStyle	= { extraCssStyle }
                />
                <CrossButton
                    key			    = { `cross_button_${rivalIndex}` }
                    onClick         = { this.onClickRemoveSportButton.bind(this, rivalIndex) }
                />
                </div>
            );
        });

        choosers.push(
            <Autocomplete
                key			    = { `sport_input_${rivals.length}` }
                defaultItem     = { binding.toJS(`rivals.${rivals.length}`) }
                serviceFilter   = { this.sportsService }
                serverField     = "name"
                placeholder     = "Please select sport"
                onSelect        = { this.onSelectSport.bind(null, rivals.length) }
            />
        );
        return (
            <div>
                {choosers}
            </div>
        );
    }
});

module.exports = SportsManager;