import { Container, Health, Leaderboard, Menu, Messages, Players, Time } from './';
import { Keys, Models } from '@tosios/common';
import React, { CSSProperties } from 'react';
import { Announce } from './Announce';
import { View, Space } from '../../components';
import { isMobile } from 'react-device-detect';
import { Ability } from './Ability';
import { PlayerAbility } from '@tosios/common/src/types';
import { autoDetectRenderer } from 'pixi.js';

const HUD_PADDING = isMobile ? '0.3%' : '0.7%';

export interface HUDProps {
    gameMode: string;
    gameMap: string;
    gameModeEndsAt: number;
    roomName: string;
    playerId: string;
    playerName: string;
    playerAbility: PlayerAbility;
    playerLives: number;
    playerMaxLives: number;
    players: Models.PlayerJSON[];
    playersCount: number;
    playersMaxCount: number;
    messages: Models.MessageJSON[];
    announce?: string;
}

/**
 * The interface displaying important information to the user:
 * - Lives
 * - Ability cooldown
 * - Time left
 * - Number of players
 * - Chat
 * - Leaderboard
 * - Menu
 */
export const HUD = 
React.memo(
    (props: {hud: HUDProps, getLastShootAt: any}): React.ReactElement => {
        const {
            playerId,
            gameMode,
            gameMap,
            gameModeEndsAt,
            roomName,
            playerName,
            playerAbility,
            playerLives,
            playerMaxLives,
            players,
            playersCount,
            playersMaxCount,
            messages,
            announce
        } = props.hud;
        const getLastShootAt = props.getLastShootAt;
        const [leaderboardOpened, setLeaderboardOpened] = React.useState(false);
        const [menuOpened, setMenuOpened] = React.useState(false);
        const [lastShootAt, setLastShootAt] = React.useState(0);

        const handleLeave = () => {
            window.location.href = window.location.origin;
        };

        const handleKeyDown = (event: any) => {
            const key = event.code;

            if (Keys.LEADERBOARD.includes(key)) {
                event.preventDefault();
                event.stopPropagation();
                setLeaderboardOpened(true);
            }

            if (Keys.SHOOT.includes(key)) {
                setTimeout(() => {
                    setLastShootAt(getLastShootAt())}, 150)
            }
        };

        const handleMouseDown = (event: any) => {
            event.preventDefault();
            event.stopPropagation();
            setTimeout(() => {
                setLastShootAt(getLastShootAt())}, 150)
        };

        const handleKeyUp = (event: any) => {
            const key = event.code;

            if (Keys.LEADERBOARD.includes(key)) {
                event.preventDefault();
                event.stopPropagation();
                setLeaderboardOpened(false);
            }

            if (Keys.MENU.includes(key)) {
                event.preventDefault();
                event.stopPropagation();
                setMenuOpened((prev) => !prev);
            }
        };

        // Listen for key presses (and unlisten on unmount).
        React.useEffect(() => {
            window.document.addEventListener('keydown', handleKeyDown);
            window.document.addEventListener('keyup', handleKeyUp);
            window.document.addEventListener('mousedown', handleMouseDown);

            return () => {
                window.document.removeEventListener('keydown', handleKeyDown);
                window.document.removeEventListener('keyup', handleKeyUp);
                window.document.removeEventListener('mousedown', handleMouseDown);
            };
        }, []);

        return (
            <View flex fullscreen style={styles.columnUp}>
                {/* Menu */}
                {menuOpened ? <Menu onClose={() => setMenuOpened(false)} onLeave={handleLeave} style={styles.menu}/> : null}

                <View flex style={styles.columnUp}>
                    <Container style={styles.status}>
                        {/* Health */}
                        <Health name={playerName} lives={playerLives} maxLives={playerMaxLives} />

                        <Space size="xxs" />

                        {/* Ability */}
                        <Ability ability={playerAbility} lastShootAt={lastShootAt}/>
                    </Container>

                    {/* Time */}
                    <Time mode={gameMode} endsAt={gameModeEndsAt} style={styles.time} />

                    {/* Players */}
                    <Players
                        count={playersCount}
                        maxCount={playersMaxCount}
                        style={styles.players}
                        onMenuClicked={() => setMenuOpened(true)}
                    />
                </View>

                {/* Messages */}
                {isMobile ? null : <Messages messages={messages} style={styles.messages} />}

                {/* Announce */}
                <Announce announce={announce} style={styles.announce} />

                {/* Leaderboard */}
                {leaderboardOpened ? (
                    <Leaderboard
                        roomName={roomName}
                        mapName={gameMap}
                        mode={gameMode}
                        players={players}
                        playerId={playerId}
                    />
                ) : null}

            </View>
        );
    }
    ,
);

const styles: { [key: string]: CSSProperties } = {
    hud: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: HUD_PADDING,
        pointerEvents: 'none',
        width: '100%',
        height: '100%'
    },
    menu:{
        position: 'absolute',
        width: '100%',
        height: '100%',
        padding: 16,
        zIndex: 99,
    },
    columnUp: {
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        width: '98%',
        padding: HUD_PADDING,
    },
    status: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: HUD_PADDING,
    },
    messages: {
        position: 'absolute',
        left: HUD_PADDING,
        bottom: '5%',
    },
    announce: {
        position: 'absolute',
        top: '50%',
        left: '40%'
    },
};
