import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { faPhone, faVideo } from '@fortawesome/free-solid-svg-icons';
import ActionButton from './ActionButton';
import { socket } from '../communication';

function useClientID({ userCustomId }) {
  const [clientID, setClientID] = useState('');

  useEffect(() => {
    socket.emit('init', { id: userCustomId });

    socket.on('clientId', (id) => {
      document.title = `${id} - VideoCall`;
      setClientID(id);
      console.log('Client ID:', id);
    });

    return () => {
      socket.off('clientId');
    };
  }, [userCustomId]);

  return clientID;
}


function MainWindow({ startCall , userType , userCustomId}) {
  const clientID = useClientID({userCustomId});
  const [friendID, setFriendID] = useState(null);


  // if (userType !== 'volunteer') {
  //   window.ReactNativeWebView.postMessage(JSON.stringify({ id: 'volunteergrgregeID' }));
  // }


  /**
   * Start the call with or without video
   * @param {Boolean} video
   */
  const callWithVideo = (video) => {
    const config = { audio: true, video };
    return () => friendID && startCall(true, friendID, config, userType);
  };

  return (
    <div className="container main-window">
      <div>
        <h3>
          Hi, your ID is
          <input
            type="text"
            className="txt-clientId"
            defaultValue={clientID}
            readOnly
          />
        </h3>
        {userType === 'volunteer' && (
          <div>
            <h4>Get started by calling a friend below</h4>
            <input
              type="text"
              className="txt-clientId"
              spellCheck={false}
              placeholder="Type ID here"
              onChange={(event) => setFriendID(event.target.value)}
            />
            <div>
              <ActionButton icon={faVideo} onClick={callWithVideo(true)} />
              <ActionButton icon={faPhone} onClick={callWithVideo(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
}

MainWindow.propTypes = {
  startCall: PropTypes.func.isRequired
};

export default MainWindow;
