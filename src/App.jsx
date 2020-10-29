import React from 'react'
import { IonPhaser } from '@ion-phaser/react'
import game from './game/game';

class App extends React.Component {
    state = {
        initialize: false,
        game: {username: 'Charly'},
    }

    render() {
        const { initialize, game, username } = this.state;
        return (<div>
            <h1 > Games are Fun </h1>

            <IonPhaser gamePass = { game } initialize = { initialize }/> 
            </div>
        )
    }
}


export default App;