import React, { CSSProperties, useEffect, useState } from 'react';
import { Space, Text } from '../../components';
import { isMobile } from 'react-device-detect';
import { Constants } from '@tosios/common'
import ProgressBar from '../../components/ProgressBar'
import { PlayerAbility } from '@tosios/common/src/types';

const DEFAULT_RATE = 2000;

const { BULLET_RATE, INVIS_RATE, CHARGE_RATE } = Constants

/**
 * Render the ability cooldown bar of the player.
 */
export const Ability = (props: { ability: PlayerAbility; tstart: number}): React.ReactElement => {
        let { ability, tstart } = props;

        const [completed, setCompleted] = useState(100)
        let abilityRate = DEFAULT_RATE;

        switch(ability) {
            case 'shoot':
                abilityRate = BULLET_RATE;
                break;
            case 'invisibility':
                abilityRate = INVIS_RATE;
                break;
            case 'charge':
                abilityRate = CHARGE_RATE;
                break;
            default:
                break;  
        }

        useEffect(() => {
            setCompleted(0)
            const timerProgressBar = setInterval(updateProgressBar, 250, tstart);
            setTimeout(() => clearInterval(timerProgressBar), abilityRate+150)
        }, [tstart])
        
        function updateProgressBar(tstart:number) {
            const sinceLastShoot = Date.now() - tstart
            console.log('UPD PB');
            if (sinceLastShoot < abilityRate) {
                setCompleted(Math.round((abilityRate - sinceLastShoot) / 1000))
            } else {
                setCompleted(100);
            }
        }
        
        return (
            <div style={styles.column}>
                <Text style={styles.text}>Cooldown</Text>
                <Space size="xxs" />
                <ProgressBar complete={completed} />
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
