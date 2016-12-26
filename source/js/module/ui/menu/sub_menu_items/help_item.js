const 	React 	= require('react');

function HelpItem(props) {
    function handleClick(e) {
        e.preventDefault();
        document.getElementById('formUserId').submit();
    };
    return (
        <a className={props.className} onClick={handleClick}>
            {props.name}
            <form id='formUserId' method='post' target='_blank' action='http://docs.squadintouch.com/faq'>
                    <input type='hidden' value={props.userId} />
            </form>
        </a>
    );
};


HelpItem.propTypes = {
    userId:		React.PropTypes.string,
    name:       React.PropTypes.string,
    className:  React.PropTypes.string
};

module.exports = HelpItem;