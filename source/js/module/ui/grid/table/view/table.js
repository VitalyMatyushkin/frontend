/**
 * Created by Anatoly on 19.07.2016.
 */

const 	Header	= require('./header'),
		Row 	= require('./body/row'),
		React 	= require('react');

const Table = React.createClass({
	propTypes: {
		model: 			React.PropTypes.object.isRequired,
		//The function, which will call when user click on <Row> in Grid
		handleClick: 	React.PropTypes.func
	},
	
	render: function () {
		const 	model 		= this.props.model,
				data 		= model.data,
				columns 	= model.columns;

		return (
			<div className="eDataList_list mTable">
				<Header columns={model.columns} />
				{data && data.length ? data.map((item, index) => {
					return <Row
								handleClick	={ this.props.handleClick }
								key			={ item.id ? item.id : index }
								dataItem	={ item }
								columns		={ columns }
							/>
				}) : null}
			</div>
		)
	}
});

module.exports = Table;
