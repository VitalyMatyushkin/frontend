import * as React from 'react';
import * as Morearty from 'morearty';
import * as Timezone from 'moment-timezone';


import 'styles/pages/b_notification_item.scss';

interface ChanelStatus {
    channelId: string
    deliveryStatus: string
    sentTime: string
    status: string
    _id: string
}


export const NotificationItem = (React as any).createClass({
    mixins: [Morearty.Mixin],
    componentWillUnmount() {

    },
    renderChannelStatusList(notificationChannels: ChanelStatus[]): React.ReactNode {
        const titles = ['channelId', 'channelType', 'deliveryStatus', 'sentTime', 'status'];

        const rows = notificationChannels.map((rowObj, i) => {
            const cells = titles.map( title => {
                if (title === 'sentTime') {
                    return <td key={title + i}>{this.getDateTime(rowObj[title])}</td>;
                } else {
                    return <td key={title + i}>{rowObj[title]}</td>;
                }
            });

            return (
                <tr key={i}>
                    <th scope="row">{i + 1}</th>
                    {cells}
                </tr>
            );
        });
        return (
            <div className="eNotificationItem_table table-responsive">
                <h3>Channel Status List</h3>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th >#</th>
                        <th>Channel Id</th>
                        <th>Channel Type</th>
                        <th>Delivery Status</th>
                        <th>Sent Time</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
        );
    },

    getDateTime(item: string): string {
        return Timezone.tz(item, window.timezone).format('DD.MM.YYYY/HH:mm:ss');
    },

    render() {
        const 	binding 		= this.getDefaultBinding(),
                globalBinding 	= this.getMoreartyContext().getBinding(),
                notifications   = binding.toJS('data'),
                /*
                    because this component is called by click from /action-descriptors/notification-model
                    and /admin_user_notifications/admin_user_notifications_class, and notify ID
                    is transmitted in different ways
                 */
                notificationId 	= globalBinding.get('routing.parameters.id') ? globalBinding.get('routing.parameters.id') : globalBinding.get('routing.pathParameters.2');

        const currentNotification = notifications.find(n => n.id === notificationId);
        return (
            <div className = "bNotificationItem_container">
                <div className = "eNotificationItem_main">
                    <div className = "eText">
                        <div className = "eTextKey">Title</div>
                        <div className = "eTextValue">{currentNotification.title}</div>
                        <div className = "eTextKey">User Id</div>
                        <div className = "eTextValue">{currentNotification.userId}</div>
                        <div className = "eTextKey">Status</div>
                        <div className = "eTextValue">{currentNotification.status}</div>
                        <div className = "eTextKey">Delivery Status</div>
                        <div className = "eTextValue">{currentNotification.deliveryStatus}</div>
                        <div className = "eTextKey">Entity Type</div>
                        <div className = "eTextValue">{currentNotification.entityType}</div>
                        <div className = "eTextKey">Type</div>
                        <div className = "eTextValue">{currentNotification.type}</div>
                        <div className = "eTextKey">Created</div>
                        <div className = "eTextValue">{this.getDateTime(currentNotification.createdAt)}</div>
                        <div className = "eTextKey">Updated</div>
                        <div className = "eTextValue">{this.getDateTime(currentNotification.updatedAt)}</div>
                    </div>
                </div>
                {this.renderChannelStatusList(currentNotification.channelStatus)}
            </div>
        );
    }
});