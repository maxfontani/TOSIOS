import React, { CSSProperties } from 'react';
import { Space, Text, View } from '../../components';
import { isMobile } from 'react-device-detect';
import { Constants } from '@tosios/common'
import ProgressBar from '../../components/ProgressBar'
import { PlayerAbility } from '@tosios/common/src/types';

const BAR_COLOR = "#6a1b9a";
const DEFAULT_RATE = 2000;

const { BULLET_RATE, INVIS_RATE, CHARGE_RATE } = Constants


/**
 * Render the ability cooldown bar of the player.
 */
export const Ability = (props: { ability: PlayerAbility; tstart: number}): React.ReactElement => {
        let { ability, tstart } = props;

        let abilityRate = DEFAULT_RATE;
        let completed = 100;

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

        let sinceLastShoot = Date.now() - tstart
        if (sinceLastShoot < abilityRate) {
            completed = Math.round((sinceLastShoot / abilityRate) * 100)  
        }

        return (
            <div style={styles.column}>
                <Text style={styles.text}>Cooldown</Text>
                <Space size="xxs" />
                <ProgressBar bgcolor={BAR_COLOR} complete={completed} />
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
