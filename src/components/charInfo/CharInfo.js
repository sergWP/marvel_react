import { useState, useEffect } from "react";
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import useMarverService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMsg from '../errorMsg/errorMsg';
import Skeleton from '../skeleton/Skeleton';
import './charInfo.scss';

const CharInfo = (props) => {

    const [char, setChar] = useState(null);
    const {loading, error, getCharacter, clearError} = useMarverService();
    const [thumbStyle, setThumbStyle] = useState('');

    // запускаем updateChar() если charId в пропсах изменился
    useEffect(() => {
        updateChar();
    }, [props.charId]);

    const updateChar = () => {
        if(!props.charId) {
            return
        } else {
            clearError();
            getCharacter(props.charId)
                .then(onCharLoaded)
        }
    }

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

    const skeleton = char || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMsg/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char} thumbStyle={thumbStyle}/> : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )

}

const View = ({char, thumbStyle}) => {
    const {thumbnail, name, description, homepage, wiki, comics} = char;
    const comicsItems = comics.map((item, idx) => {
        const getComicsId = item.resourceURI.match(/\d/g).join('').slice(1);
        // eslint-disable-next-line
        if (idx >= 10) return;
        return (
            <li key={idx} className="char__comics-item">
                <Link to={`/comics/${getComicsId}`}>{item.name}</Link>
            </li>
        )
    });

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={thumbStyle ? {objectFit: thumbStyle} : null}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">Homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">{description}</div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comicsItems.length > 0 ? comicsItems : 'This character is not used in comics.'}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;