import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';
import MarverService from './services/MarvelService';
import './style/style.scss';

const marvelService = new MarverService();
marvelService.getCharacter(1011059).then(res => console.log(res));

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

