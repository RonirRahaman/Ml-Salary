import React from 'react';
import Mainbody from './Components/MainBody/mainbody';
import OpenAiChat from './Components/OpenAiChat/OpenAiChat';

const App: React.FC = () => {
  return (  
    <div className="App">
      <Mainbody />
      <OpenAiChat />
    </div>
  );
}

export default App;
