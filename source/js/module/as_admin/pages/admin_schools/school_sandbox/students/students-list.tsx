/**
 * Created by vitaly on 23.08.17.
 */

import * as React from 'react';
import * as Morearty from 'morearty';
import {StudentListModel} from 'module/as_admin/pages/admin_schools/school_sandbox/students/students-list-model';
import {Grid} from 'module/ui/grid/grid';


export const StudentsList = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.model = new StudentListModel(this);
	},
	render: function () {
		return (
			<Grid model={this.model.grid}/>
		);
	}
});
