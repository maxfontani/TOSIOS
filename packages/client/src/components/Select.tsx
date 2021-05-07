import React, { CSSProperties, SyntheticEvent } from 'react';

const SELECT: CSSProperties = {
    fontSize: 16,
    borderRadius: 8,
    height: 48,
    paddingLeft: 8,
    paddingRight: 8,
    outline: 'none',
    border: '1px solid #efefef',
    width: '100%',
    maxWidth: '100%',
    textTransform: 'capitalize',
};

export interface IListItem {
    value: string | number;
    title: string;
}


export function Select(props: {
    value?: any;
    values: any;
    style?: CSSProperties;
    onChange?: (event: SyntheticEvent) => void;
}): React.ReactElement {
    const { value, values = [], style, onChange } = props;

    const list = values.map((item: any) => (
        <option key={item} value={item}>
            {item}
        </option>
    ));

    return (
        <select
            style={{
                ...SELECT,
                ...style,
            }}
            value={value}
            onChange={onChange}
        >
            {list}
        </select>
    );
}
