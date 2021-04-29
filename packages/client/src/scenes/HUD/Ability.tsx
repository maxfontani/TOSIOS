import React, { CSSProperties, useEffect, useState } from 'react';
import { Space, Text } from '../../components';
import { isMobile } from 'react-device-detect';
import { Constants } from '@tosios/common'
import Cooldown from '../../components/Cooldown'
import { PlayerAbility } from '@tosios/common/src/types';

const DEFAULT_RATE = 2000;

const { BULLET_RATE, INVIS_RATE, CHARGE_RATE } = Constants;

/**
 * Render the ability cooldown bar of the player.
 */
export const Ability = (props: { ability: PlayerAbility; lastShootAt: number}): React.ReactElement => {
        let { ability, lastShootAt } = props;
        const [abilityRate, setAbilityRate] = useState(DEFAULT_RATE);
        const [complete, setComplete] = useState(100);

        useEffect(() => {
            switch(ability) {
                case 'shoot':
                    setAbilityRate(BULLET_RATE);
                    break;
                case 'invisibility':
                    setAbilityRate(INVIS_RATE);
                    break;
                case 'charge':
                    setAbilityRate(CHARGE_RATE);
                    break;
                default:
                    break;  
            }
        }, [ability])

        useEffect(() => {
            lastShootAt === 0 || !ability 
                ? setComplete(100) 
                : updateProgressBar(lastShootAt);

        }, [lastShootAt])

        function updateProgressBar(lastShootAt: number) {
            const timerCooldown = setInterval(() => {
            const sinceLastShoot = Date.now() - lastShootAt;
            if (sinceLastShoot < abilityRate) {
                setComplete(Math.floor((abilityRate - sinceLastShoot) / 1000))
            } else {
                setComplete(100)
                clearInterval(timerCooldown)
            }
            }, 200);
        }
        
        return (
            <div style={styles.column}>
                <Text style={styles.text}>Cooldown</Text>
                <Space size="xxs" />
                <Cooldown complete={complete} />
            </div>
        );
    }

const styles: { [key: string]: CSSProperties } = {
    column: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: 'white',
        fontSize: isMobile ? 14 : 16,
    },
    flexCenter: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
};
