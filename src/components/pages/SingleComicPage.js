import {Link, useParams} from 'react-router-dom';
import { useState, useEffect } from "react";

import './SingleComicPage.scss';
import useMarverService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMsg from '../errorMsg/errorMsg';

const SingleComicPage = () => {

    const {comicId} = useParams();

    const [comic, setComic] = useState(null);
    const [thumbStyle, setThumbStyle] = useState('');

    const {loading, error, getComic, clearError} = useMarverService();

    useEffect(() => {
        updateComic();
    }, [comicId]);

    const updateComic = () => {
        clearError();
        getComic(comicId) // получем данные 1го персонажа
            .then(onComicLoaded) // обновляем стейт
    }

    const onComicLoaded = (comic) => {
        let style = '';
       
        // проверяем, доступна ли картинка
        comic.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
            ? style = 'contain'
            : style = ''

        // обновляем стейт
        setComic(comic);
        setThumbStyle(thumbStyle => style);
    }

    const errorMessage = error ? <ErrorMsg/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !comic) ? <View comic={comic} thumbStyle={thumbStyle}/> : null;

    return (
        <div className="single-comic">
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = ({comic, thumbStyle}) => {
    const {thumbnail, title, description, pageCount, language, price} = comic;

    return (
        <>
            <img 
                src={thumbnail} 
                alt={title}
                className="single-comic__img"
                style={thumbStyle ? {objectFit: thumbStyle} : null}
            />
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount ? `${pageCount} pages` : null}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </>
    )
}

export default SingleComicPage;