import React, { CSSProperties } from 'react';
import { Space, Text, View } from '../../components';
import { heartEmptyImage, heartFullImage } from '../../images';
import { isMobile } from 'react-device-detect';

const HEART_SIZE = isMobile ? 24 : 36;

/**
 * Render the health of the player.
 */
export const Health = React.memo(
    (props: { name: string; lives: number; maxLives: number; style?: CSSProperties }): React.ReactElement => {
        const { name, lives, maxLives = 3, style } = props;

        // Create list of hearts
        const hearts = [];
        for (let i = 0; i < maxLives; i++) {
            const isFull = i < lives;

            hearts.push(
                <img
                    key={i}
                    src={isFull ? heartFullImage : heartEmptyImage}
                    alt={isFull ? 'full-heart' : 'empty-heart'}
                    width={HEART_SIZE}
                    height={HEART_SIZE}
                />,
            );
        }

        return (
            <div style={styles.column}>
                <Text style={styles.nameText}>{name}</Text>
                <Space size="xxs" />
                <View style={styles.flexCenter}>{hearts}</View>
            </div>
        );
    },
);

const styles: { [key: string]: CSSProperties } = {
    column: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    nameText: {
        textAlign: 'center',
        color: 'white',
        fontSize: isMobile ? 14 : 16,
    },
    flexCenter: {
        display: 'flex',
        alignItems: 'center',
    },
};
