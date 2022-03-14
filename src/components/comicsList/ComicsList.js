import { useState, useEffect } from 'react'; 
import {Link} from "react-router-dom";
import './comicsList.scss';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMsg/errorMsg';
import useMarverService from '../../services/MarvelService';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getComics} = useMarverService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    // запрос героев с офсетом
    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getComics(offset)
            .then(onComicsLoaded) // обновляем стейт - результат запроса
    }

    // герои загрузились
    // записываем в стейт
    // проверка длинны возвращаемых с АПИ данных
    const onComicsLoaded = (newComics) => {
        let ended = false;
        if (newComics.length < 8) {
            ended = true;
        }

        setComicsList(comicsList => [...comicsList, ...newComics]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 8);
        setComicsEnded(comicsEnded => ended);
    }

    function renderComics(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            return (
                <li 
                    key={i}
                    className="comics__item">
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img" style={imgStyle}/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        });

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderComics(comicsList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading  && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                disabled={newItemLoading}
                style={{'display': comicsEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}
                className="button button__main button__long"
                >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;