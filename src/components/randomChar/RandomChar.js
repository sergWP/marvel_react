import { Component } from 'react'; 
import Spinner from '../spinner/spinner';
import ErrorMsg from '../errorMsg/errorMsg';
import MarverService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    constructor(props) {
        super(props);
        console.log('constructor');
    }

    // стейт
    state = {
        char: {},
        loading: true,
        error: false,
        thumbStyle: ''
    }

    // новый экземпляр класса
    marvelService = new MarverService();

    // componentDidMount() вызывается сразу после монтирования (то есть, вставки компонента в DOM). 
    // В этом методе должны происходить действия, которые требуют наличия DOM-узлов. 
    // Это хорошее место для создания сетевых запросов.
    // https://ru.reactjs.org/docs/react-component.html#componentdidmount
    componentDidMount() {
        console.log('componentDidMount');
        this.updateChar();
    }

    // https://ru.reactjs.org/docs/react-component.html#componentdidupdate
    componentDidUpdate() {
        console.log('componentDidUpdate');
    }

    // componentWillUnmount() вызывается непосредственно перед размонтированием и удалением компонента.
    // В этом методе выполняется необходимый сброс: отмена таймеров, сетевых запросов и подписок, созданных в componentDidMount()
    // https://ru.reactjs.org/docs/react-component.html#componentwillunmount
    componentWillUnmount() {
        console.log('Unmount');
    }

    onCharLoaded = (char) => {
        console.log('onCharLoaded');
        let style = '';
       
        // проверяем, доступна ли картинка
        char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
            ? style = 'contain'
            : style = ''

        // обновляем стейт
        this.setState({
            char,
            loading: false,
            thumbStyle: style
        })
    }

    // обновить данные персонажа
    updateChar = () => {
        console.log('updateChar');
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000); // рандом в диапазоне
        this.marvelService
            .getCharacter(id) // получем данные 1го персонажа
            .then(this.onCharLoaded) // обновляем стейт
            .catch(this.onError); // вызов метода при ошибке
    }

    // метод для ошибки если нет персонажа под таким ID
    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }
    
    render() {
        const {char, loading, error, thumbStyle} = this.state;
        const errorMessage = error ? <ErrorMsg/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <View char={char} thumbStyle={thumbStyle}/> : null;

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
                    <button className="button button__main" onClick={this.updateChar}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
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