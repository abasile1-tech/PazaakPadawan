import React, { useState } from 'react';
import { Link } from 'react-router-dom';
function () {

  return (
    <>
      <div className="playBar">
        <div className='playerOne'>
      <PlayerOne img='' playerName="Pin-Gun Jinn" />
      </div>
      <div className='turnIndicator'>
      <TurnIndicator playerName="Pin-Gun Jinn" />
      </div>
      <div className='playerTwo'>
      <PlayerTwo img='' playerName="Pin-Gun Jinn" />
      </div>
      </div>
    </>
  );
}

export default PlayBar;
