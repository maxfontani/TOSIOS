import { Inline, View } from './';
import React, { CSSProperties } from 'react';
import { GitHubIcon } from '../icons';
import { Text } from './Text';

const URL = 'https://github.com/maxfontani/TOSIOS';
const UPSTREAM_URL = 'https://github.com/halftheopposite/tosios';

const GITHUB: CSSProperties = {
    color: 'white',
    fontSize: 14,
};

export function GitHub(): React.ReactElement {
    return (
        <div className="footer">
            <View flex center style={GITHUB}>
                <GitHubIcon />
                <Inline size="xxs" />
                <a href={URL}>
                    <Text>MOJI Repo</Text>
                </a>
                <Inline size="xxs" />
                |
                <Inline size="xxs" />
                <a href={UPSTREAM_URL}>
                <Text>Original Repo</Text>
                </a>
            </View>
        </div>
    );
}
