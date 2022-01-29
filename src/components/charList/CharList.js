import { Component } from 'react'; 
import MarverService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component {
    state = {
        chars: {},
        loading: true
    }

    componentDidMount() {
        this.updateChars();
    }

    // новый экземпляр класса
    marvelService = new MarverService();

    onCharsLoaded = (chars) => {
        this.setState({
            chars,
            loading: false
        })
    }

    updateChars = () => {
        this.marvelService
            .getAllCharacters()
            .then(this.onCharsLoaded) // обновляем стейт
    }

    render() {
        const {chars, loading} = this.state;
        // проверяем, загрузились данные в стейт или нет
        // выводит только если в стейде есть данные
        const content = !(loading) ? chars.map((item, idx) => <View key={idx} char={item}/>) : null;
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

// можно выносить в отдельный блок или компонент
const View = ({char}) => {
    const {name, thumbnail} = char;
    return (
        <li className="char__item">
            <img src={thumbnail} alt="abyss"/>
            <div className="char__name">{name}</div>
        </li>
    )
}

export default CharList;