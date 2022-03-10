import { useState, useEffect } from 'react'; 
import Spinner from '../spinner/spinner';
import ErrorMsg from '../errorMsg/errorMsg';
import useMarverService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {

    const [char, setChar] = useState(null);
    const [thumbStyle, setThumbStyle] = useState('');

    // новый экземпляр класса
    const {loading, error, getCharacter, clearError} = useMarverService();

    useEffect(() => {
        updateChar();
        const timerId = setInterval(updateChar, 60000);

        return () => {
            clearInterval(timerId)
        }
    }, []);

    const onCharLoaded = (char) => {
        let style = '';
       
        // проверяем, доступна ли картинка
        char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
            ? style = 'contain'
            : style = ''

        // обновляем стейт
        setChar(char);
        setThumbStyle(thumbStyle => style);
    }

    // обновить данные персонажа
    const updateChar = () => {
        clearError();
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000); // рандом в диапазоне
        getCharacter(id) // получем данные 1го персонажа
            .then(onCharLoaded) // обновляем стейт
    }
    
    const errorMessage = error ? <ErrorMsg/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char} thumbStyle={thumbStyle}/> : null;

    return (
        <div className="randomchar">
            {errorMessage}
            {spinner}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main" onClick={updateChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}

const View = ({char, thumbStyle}) => {
    const {name, thumbnail, description, homepage, wiki} = char;
    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={thumbStyle ? {objectFit: thumbStyle} : null}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">{description}</p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;