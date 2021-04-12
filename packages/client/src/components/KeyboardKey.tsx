import React, { CSSProperties } from 'react';

export function KeyboardKey(props: { value: string }): React.ReactElement {
    const { value } = props;

    return <kbd style={styles.keyboardKey}>{value}</kbd>;
}

const styles: { [key: string]: CSSProperties } = {
    keyboardKey: {
        display: 'inline-flex',
        font: '11px Consolas, monospace, Liberation Mono, Menlo',
        lineHeight: 10,
        color: '#444d56',
        backgroundColor: 'tomato',
        border: '1px solid black',
        borderRadius: 3,
        boxShadow: 'inset 0 -1px 0 #d1d5da',
        fontSize: 24,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 24,
        paddingLeft: 8,
        paddingRight: 8,
        height: 40,
    },
};
