import { Component } from 'react'; 
import MarverService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component {
    state = {
        chars: {},
        loading: true
    }

    // новый экземпляр класса
    marvelService = new MarverService();

    // оптимизация
    // вызываем onRequest без офсета (не дублируем код)
    // офсет по умолчанию в MarverService
    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offest) => {
        this.marvelService
            .getAllCharacters(offest)
            .then(this.onCharsLoaded) // обновляем стейт
    }

    onCharsLoaded = (chars) => {
        this.setState({
            chars,
            loading: false
        })
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    render() {
        const {chars, loading} = this.state;

        // проверяем, загрузились данные в стейт или нет
        // выводит только если в стейде есть данные
        const content = !(loading) 
            ? chars.map(item => 
                <li key={item.id} onClick={() => {this.props.onCharSelected(item.id)}} className="char__item">
                    <img src={item.thumbnail} alt="abyss"/>
                    <div className="char__name">{item.name}</div>
                </li>
                ) 
            : null;

        return (
            <div className="char__list">
                <ul className="char__grid">{content}</ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;