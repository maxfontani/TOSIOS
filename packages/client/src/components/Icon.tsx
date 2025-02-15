import React, { CSSProperties, ReactNode, useEffect } from 'react';
import { PlayerAbility, IconColor } from '@tosios/common/src/types';

export function Icon(props: { style?: CSSProperties; children: ReactNode; color?: IconColor; handlePlayerEmojiChange: any; playerEmoji: string; playerAbility: PlayerAbility }): React.ReactElement {
    const { style, children, color, handlePlayerEmojiChange, playerEmoji, playerAbility } = props;
    const [hovered, setHovered] = React.useState(false);
    const [active, setActive] = React.useState(false);

    const ICON_HOVERED: CSSProperties = {
        cursor: 'pointer',
        background: (color && ICON_COLORS[color]) || GREEN,
        transform: 'scale(1.1)'
    }

    useEffect(() => {
        if (children === playerEmoji) {
            setActive(true)
        } else {
            setActive(false)
        }
    }, [playerEmoji])
    
    return (
        <div
            style={{
                ...ICON,
                ...style,
                ...(hovered && ICON_HOVERED),
                ...(active && ICON_HOVERED)
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={e => {
                handlePlayerEmojiChange(e.target, playerAbility)
            }}
        >
            {children}
        </div>
    );
}

const GREEN: string = 'linear-gradient(180deg, #56B870 0%,#a5c956 100%)'
const RED: string = 'linear-gradient(0deg, #c44a50 0%,#cf0404 100%)'
const YELLOW: string = 'linear-gradient(0deg, #F3AAAA 0%,#febf04 100%)'
const BLUE: string = 'linear-gradient(0deg, #7abcff 0%,#60abf8 44%,#4096ee 100%)'

const ICON_COLORS = {
    green: GREEN,
    red: RED,
    blue: BLUE,
    yellow: YELLOW
}

const ICON = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '150px',
    height: '150px',
    fontSize: '80px',
    border: '2px solid black',
    borderRadius: '10px',
    margin: '0 10px',
    transition: 'transform .2s'
};

