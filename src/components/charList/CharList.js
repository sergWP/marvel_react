import { Component } from 'react'; 
import MarverService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component {
    state = {
        charList: {},
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210
    }

    // новый экземпляр класса
    marvelService = new MarverService();

    // оптимизация
    // вызываем onRequest без офсета (не дублируем код)
    // офсет по умолчанию в MarverService
    componentDidMount() {
        this.onRequest();
    }

    // запрос героев с офсетом
    onRequest = (offest) => {
        this.onCharListLoading();
        this.marvelService
            .getAllCharacters(offest)
            .then(this.onCharsLoaded) // обновляем стейт - результат запроса
            .catch(this.onError)
    }

    // герои грузятся
    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    // герои загрузились
    // записываем в стейт
    onCharsLoaded = (newChars) => {
        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newChars],
            loading: false,
            newItemLoading: false,
            offset: offset + 9
        }))
    }

    // ошибка
    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    render() {
        const {charList, loading, newItemLoading, offset} = this.state;

        // проверяем, загрузились данные в стейт или нет
        // выводит только если в стейде есть данные
        const content = !(loading) 
            ? charList.map(item => 
                <li key={item.id} onClick={() => {this.props.onCharSelected(item.id)}} className="char__item">
                    <img src={item.thumbnail} alt="abyss"/>
                    <div className="char__name">{item.name}</div>
                </li>
                ) 
            : null;

        return (
            <div className="char__list">
                <ul className="char__grid">{content}</ul>
                <button 
                    onClick={() => this.onRequest(offset)}
                    disabled={newItemLoading}
                    className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;