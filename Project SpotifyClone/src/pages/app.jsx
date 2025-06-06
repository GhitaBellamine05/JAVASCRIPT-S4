import React from 'react'
import Sidebar from '../Components/sidebar'
import Player from '../Components/player'
import Display from '../Components/display'

const App2 = () =>{
    return(
        <div className='h-screen bg-black'>
            <div className='h-[90%] flex'>
                <Sidebar />
                <Display />
            </div>
            <Player />
            <audio preload='auto'></audio>
        </div>
    )
}

export default App2