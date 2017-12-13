/**
 * Created by bridark on 04/08/15.
 */
import * as React    	from 'react';

export class PublicLogin extends React.Component {
    handleSignInUpClick(): void {
        const subdomains = document.location.host.split('.');
        subdomains[0] = "app";
        const domain = subdomains.join(".");
        (window as any).location.href = `//${domain}/#login`;
    }
    
    render() {
        return(
            <div className="bPublicMenu_login">
                <div onClick={this.handleSignInUpClick.bind(null,this)}>
                    Log In
                </div>
            </div>
        )
    }
}