/**
 * Created by Anatoly on 19.07.2016.
 */

const   Header	= require('./header'),
		Row 	= require('./body/row'),
		If 		= require('module/ui/if/if'),
        React 	= require('react');

const Table = React.createClass({
	propTypes: {
		model: React.PropTypes.object.isRequired
	},
	componentWillMount: function () {
	},
	render: function () {
		const model = this.props.model,
			data = model.data,
			columns = model.columns;

		return (
			<div className="eDataList_list mTable">
				<Header columns={model.columns} order={model.order}/>
				{data && data.length ? data.map((item, index) => {
					return <Row key={item.id ? item.id : index} dataItem={item} columns={columns}/>
				}) : null}
			</div>
		)
	}
});

module.exports = Table;
