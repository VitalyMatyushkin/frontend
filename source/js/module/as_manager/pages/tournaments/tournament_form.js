/**
 * Created by vitaly on 04.12.17.
 */
const 	Form 		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		React 		= require('react'),
		Morearty	= require('morearty');

const TournamentForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string.isRequired,
		onFormSubmit: React.PropTypes.func,
		schoolId: React.PropTypes.string
	},
	getSportsService: function(schoolId) {
		return (sportName) => {
			const filter = {
				filter: {
					where: {
						name: {
							like: sportName,
							options: 'i'
						}
					},
					limit: 50,
					order:'name ASC'
				}
			};
			
			return window.Server.schoolSports.get(schoolId, filter);
		};
	},
	render: function() {
		const binding = this.getDefaultBinding();
		return (
			<div className ="eTournamentForm">
				<Form
					formStyleClass	= "mNarrow"
					name			= {this.props.title}
					onSubmit		= {this.props.onFormSubmit}
					binding			= {this.getDefaultBinding()}
					submitButtonId	= 'Tournament_submit'
					cancelButtonId	= 'Tournament_cancel'
				>
					<FormField
						type 		= "imageFile"
						field 		= "picUrl"
						labelText 	= "+"
						typeOfFile 	= "image"
					/>
					<FormField
						type		= "text"
						field		= "name"
						validation	= "required"
					>
						Name
					</FormField>
					<FormField
						field			= 'sportId'
						type			= 'autocomplete'
						defaultItem		= { binding.toJS('sport') }
						serviceFullData	= { this.getSportsService(this.props.schoolId) }
					>
						Sport
					</FormField>
					<FormField
						type		= "datetime"
						field		= "startTime"
						validation	= "datetime required"
					>
						Start Time
					</FormField>
					<FormField
						type		= "datetime"
						field		= "endTime"
						validation	= "datetime required"
					>
						End time
					</FormField>
					<FormField
						type	= "text"
						field	= "link"
					>
						Link
					</FormField>
				</Form>
			</div>
		)
	}
});


module.exports = TournamentForm;