import * as React from 'react';

export function SupportedBrowsers() {
	return (
		<div className='bSchoolMaster'>
			<div className='bSupportedBrowsers'>
				<h1>
					Desktop browsers
				</h1>
				<p>
					The latest versions of most desktop browsers are supported.
				</p>
				<table className="table table-striped table-bordered">
					<thead>
						<tr>
							<th scope="col"></th>
							<th scope="col">Chrome</th>
							<th scope="col">Firefox</th>
							<th scope="col">Internet Explorer</th>
							<th scope="col">Microsoft Edge</th>
							<th scope="col">Opera</th>
							<th scope="col">Safari</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">Mac</th>
							<td className='eSupportedBrowsers_tableItem mGreen'>
								Supported
							</td>
							<td className='eSupportedBrowsers_tableItem mGreen'>
								Supported
							</td>
							<td className='eSupportedBrowsers_tableItem mGrey' >
								N/A
							</td>
							<td className='eSupportedBrowsers_tableItem mGrey' >
								N/A
							</td>
							<td className='eSupportedBrowsers_tableItem mGreen'>
								Supported
							</td>
							<td className='eSupportedBrowsers_tableItem mGreen'>
								Supported
							</td>
						</tr>
						<tr>
							<th scope="row">Windows</th>
							<td className='eSupportedBrowsers_tableItem mGreen'>
								Supported
							</td>
							<td className='eSupportedBrowsers_tableItem mGreen'>
								Supported
							</td>
							<td className='eSupportedBrowsers_tableItem mGreen'>
								Supported, IE12+
							</td>
							<td className='eSupportedBrowsers_tableItem mGreen'>
								Supported
							</td>
							<td className='eSupportedBrowsers_tableItem mGreen'>
								Supported
							</td>
							<td className='eSupportedBrowsers_tableItem mRed'>
								Not supported
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}