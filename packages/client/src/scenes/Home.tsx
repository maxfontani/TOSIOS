import {
    Box,
    Button,
    GitHub,
    IListItem,
    Input,
    Room,
    Select,
    Separator,
    Space,
    Text,
    View,
    Icon
} from '../components';
import { Constants, Types } from '@tosios/common';
import React, { Component, Fragment } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { Client } from 'colyseus.js';
import { Helmet } from 'react-helmet';
import { RoomAvailable } from 'colyseus.js/lib/Room';
import qs from 'querystringify';
import { useAnalytics } from '../hooks';
import { IMapItem, PlayerAbility } from '@tosios/common/src/types';

const MapsList: Types.IMapItem[] = Constants.MAPS.map((map) => ({
    name: map.name,
    playersScale: map.playersScale,
    maxPlayers: map.maxPlayers
}));

const MapsNamesList: string[] = MapsList.map((map: IMapItem): string => {return map.name});

interface IProps extends RouteComponentProps {}

interface IState {
    playerName: string;
    playerEmoji: string;
    playerAbility: PlayerAbility;
    hasNameChanged: boolean;
    hasEmojiChanged: boolean; 
    isNewRoom: boolean;
    roomName: string;
    roomMap: Types.IMapItem;
    roomMaxPlayers: any;
    mode: any;
    rooms: Array<RoomAvailable<any>>;
    timer: NodeJS.Timeout | null;
}

export default class Home extends Component<IProps, IState> {
    private client?: Client;

    constructor(props: IProps) {
        super(props);

        this.state = {
            playerName: '',
            playerEmoji: '',
            playerAbility: '',
            hasNameChanged: false,
            hasEmojiChanged: false,
            isNewRoom: false,
            roomName: localStorage.getItem('roomName') || '',
            roomMap: MapsList[0],
            roomMaxPlayers: MapsList[0].maxPlayers,
            mode: 'deathmatch',
            rooms: [],
            timer: null,
        };
    }

    // BASE
    componentDidMount() {
        try {
            const host = window.document.location.host.replace(/:.*/, '');
            const port = process.env.NODE_ENV !== 'production' ? Constants.WS_PORT : window.location.port;
            const url = `${window.location.protocol.replace('http', 'ws')}//${host}${port ? `:${port}` : ''}`;

            this.client = new Client(url);
            this.setState(
                {
                    timer: setInterval(this.updateRooms, Constants.ROOM_REFRESH),
                },
                this.updateRooms,
            );
        } catch (error) {
            console.error(error);
        }
    }

    componentWillUnmount() {
        const { timer } = this.state;

        if (timer) {
            clearInterval(timer);
        }
    }

    // HANDLERS
    handlePlayerNameChange = (event: any) => {
        this.setState({
            playerName: event.target.value,
            hasNameChanged: true,
        });
    };
    
    handlePlayerEmojiChange = (target: any, ability: PlayerAbility) => {
        if (this.state.playerEmoji === target.innerText) {
            this.setState({
                playerEmoji: '',
                hasEmojiChanged: true,
            }); 
        } else {
            this.setState({
                playerEmoji: target.innerText,
                playerAbility: ability,
                hasEmojiChanged: true,
            });
        }
    };

    handleNameSave = () => {
        const { playerName, playerEmoji, playerAbility } = this.state;
        const analytics = useAnalytics();

        localStorage.setItem('playerName', playerName);
        this.setState({
            hasNameChanged: false,
        });

        localStorage.setItem('playerEmoji', playerEmoji);
        this.setState({
            hasEmojiChanged: false,
        });

        localStorage.setItem('playerAbility', playerAbility);
        this.setState({
            hasEmojiChanged: false,
        });


        analytics.track({ category: 'User', action: 'Rename' });
    };


    handleRoomNameChange = (event: any) => {
        const roomName = event.target.value;
        localStorage.setItem('roomName', roomName);
        this.setState({
            roomName,
        });
    };

    handleRoomClick = (roomId: string) => {
        const { playerName, playerEmoji, playerAbility } = this.state;
        const analytics = useAnalytics();

        if (playerName && playerEmoji && playerAbility) {
            analytics.track({
                category: 'Room',
                action: 'Join',
            });
            this.handleNameSave()
            navigate(`/${roomId}`);
        } else {
            alert('Please enter a name AND choose a HERO')
        }
    };

    handleCreateRoomClick = () => {
        const { playerName, playerEmoji, playerAbility, roomName, roomMap, roomMaxPlayers, mode } = this.state;
        const analytics = useAnalytics();
        const roomMapName = roomMap.name;

        const options: Types.IRoomOptions = {
            playerName,
            playerEmoji,
            playerAbility,
            roomName,
            roomMapName,
            roomMaxPlayers,
            mode
        };

        if (playerName && playerEmoji && playerAbility) {
            analytics.track({ category: 'Game', action: 'Create' });
            navigate(`/new${qs.stringify(options, true)}`);
        } else {
            alert('Please enter a name AND choose a HERO')
        }
    };

    handleCancelRoomClick = () => {
        this.setState({
            isNewRoom: false,
        });
    };

    // METHODS
    updateRooms = async () => {
        if (!this.client) {
            return;
        }

        const rooms = await this.client.getAvailableRooms(Constants.ROOM_NAME);
        this.setState({
            rooms,
        });
    };


    // RENDER
    render() {
        return (
            <View
                flex
                center
                style={{
                    padding: 32,
                    flexDirection: 'column',
                    height: '100%'
                }}
            >
                <Helmet>
                    <title>{`${Constants.APP_TITLE} - Home`}</title>
                    <meta
                        name="description"
                        content="TOTAL EMOJI MAYHEM."
                    />
                </Helmet>

                <View
                    flex
                    center
                    column
                    style={{
                        width: 700,
                        maxWidth: '100%',
                    }}
                >
                    {/* <img alt="TOSIOS" src={titleImage} /> */}
                    <Space size="xs" />
                    <Text style={{ color: 'orange', fontFamily:'Bangers, cursive', fontSize: 48, fontWeight:900, margin: 0}}>
                        MOJI WARZ
                    </Text>
                    <Space size="xxs" />
                
                    <Space size="m" />
                    {this.renderName()}
                    <Space size="m" />
                    {this.renderRoom()}
                    <Space size="m" />
                    <GitHub />
                </View>
            </View>
        );
    }

    renderName = () => {
        return (
            <Box
                style={{
                    width: 400,
                    maxWidth: '100%',
                }}
            >
                <Text style={{textAlign: 'center', fontWeight:900}}>
                    Enter your NAME:
                </Text>
                <Space size="xs" />
                <Input
                    value={this.state.playerName}
                    placeholder="Name"
                    maxLength={Constants.PLAYER_NAME_MAX}
                    onChange={this.handlePlayerNameChange}
                    style={{
                        textAlign: 'center',
                        backgroundColor: 'black',
                        color: 'white',
                        fontWeight: 700
                    }}
                />

                <Space size="xs" />
                <Text style={{textAlign: 'center', fontWeight:900}}>
                    Choose your HERO:
                </Text>
                <Space size="xs" />
                <View                
                    flex
                    center
                    style={{
                        justifyContent: 'space-between'
                    }}
                >
                    <Icon color='blue' handlePlayerEmojiChange={this.handlePlayerEmojiChange} playerEmoji={this.state.playerEmoji} playerAbility='shoot'>&#129497;</Icon>
                    <Icon color='red' handlePlayerEmojiChange={this.handlePlayerEmojiChange} playerEmoji={this.state.playerEmoji} playerAbility='invisibility'>&#129499;</Icon>
                    <Icon color='green'handlePlayerEmojiChange={this.handlePlayerEmojiChange} playerEmoji={this.state.playerEmoji} playerAbility='charge'>&#129423;</Icon>
                </View>
                {/* {this.state.hasNameChanged && this.state.playerName && (
                    <>
                        <Space size="xs" />
                        <Button title="Save" text="Save" onClick={this.handleNameSave} style={{backgroundColor: 'gold'}} />  
                    </>
                )} */}
            </Box>
        );
    };

    renderRoom = () => {
        return (
            <Box
                style={{
                    width: 500,
                    maxWidth: '100%',
                }}
            >
                {this.renderNewRoom()}
                <Space size="xxs" />
                <Separator />
                <Space size="xxs" />
                {this.renderRooms()}
                <Space size="xxs" />
            </Box>
        );
    };

    renderNewRoom = () => {
        const { isNewRoom, roomName, roomMap, roomMaxPlayers } = this.state;
        const analytics = useAnalytics();

        return (
            <View
                flex
                style={{
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                }}
            >
                {!isNewRoom && (
                    <Button
                        title="Create new room"
                        text="+ New Room"
                        onClick={() => this.setState({ isNewRoom: true })}
                        style={{
                            fontWeight: 900
                        }}
                    />
                )}
                {isNewRoom && (
                    <View style={{ width: '100%' }}>
                        {/* Name */}
                        <Text>Name:</Text>
                        <Space size="xxs" />
                        <Input
                            placeholder="Name"
                            value={roomName}
                            maxLength={Constants.ROOM_NAME_MAX}
                            onChange={this.handleRoomNameChange}
                            style={{backgroundColor: '#efefef'}}
                        />
                        <Space size="s" />

                        {/* Map */}
                        <Text>Map:</Text>
                        <Space size="xxs" />
                        <Select
                            value={roomMap.name}
                            values={MapsNamesList}
                            onChange={(event: any) => {
                                const newRoomMap = MapsList.filter(map => {return map.name === event.target.value})[0]
                                this.setState({ roomMap: newRoomMap });
                                analytics.track({
                                    category: 'Game',
                                    action: 'Map',
                                    label: event.target.value,
                                });
                            }}
                            style={{backgroundColor: '#efefef'}}
                        />
                        <Space size="s" />

                        {/* Players */}
                        <Text>Max players:</Text>
                        <Space size="xxs" />
                        <Select
                            value={roomMaxPlayers}
                            values={roomMap.playersScale}
                            onChange={(event: any) => {
                                this.setState({ roomMaxPlayers: event.target.value });
                                analytics.track({
                                    category: 'Game',
                                    action: 'Players',
                                    value: event.target.value,
                                });
                            }}
                            style={{backgroundColor: '#efefef'}}

                        />
                        <Space size="s" />

                        {/* GAME MODE
                        <Text>Game mode:</Text>
                        <Space size="xxs" />
                        <Select
                            value={mode}
                            values={GameModesList}
                            onChange={(event: any) => {
                                this.setState({ mode: event.target.value });
                                analytics.track({
                                    category: 'Game',
                                    action: 'Mode',
                                    label: event.target.value,
                                });
                            }}
                        />
                        <Space size="s" /> */}

                        {/* Button */}
                        <View>
                            <Button title="Create room" text="Create" bold onClick={this.handleCreateRoomClick} />
                            <Space size="xs" />
                            <Button title="Cancel" text="Cancel" reversed onClick={this.handleCancelRoomClick} style={{color: 'black'}} />
                        </View>
                    </View>
                )}
            </View>
        );
    };

    renderRooms = () => {
        const { rooms } = this.state;

        if (!rooms || !rooms.length) {
            return (
                <View
                    flex
                    center
                    style={{
                        borderRadius: 8,
                        backgroundColor: '#efefef',
                        color: 'darkgrey',
                        height: 128,
                    }}
                >
                    No rooms yet...
                </View>
            );
        }

        return rooms.map(({ roomId, metadata, clients, maxClients }, index) => {
            const map = MapsList.find((item) => item.name === metadata.roomMapName);
            const mapName = map ? map.name : metadata.roomMapName;

            return (
                <Fragment key={roomId}>
                    <Room
                        id={roomId}
                        roomName={metadata.roomName}
                        roomMapName={mapName}
                        clients={clients}
                        maxClients={maxClients}
                        mode={metadata.mode}
                        onClick={this.handleRoomClick}
                    />
                    {index !== rooms.length - 1 && <Space size="xxs" />}
                </Fragment>
            );
        });
    };
}


