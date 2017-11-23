import * as React from 'react';

export interface IfProps {
    condition: boolean,
    children?: any
}

export function If(props: IfProps) {
    return props.condition === true ? props.children : null ;
}