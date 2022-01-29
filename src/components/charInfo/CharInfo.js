import { Component } from 'react/cjs/react.production.min';
import MarverService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMsg from '../errorMsg/errorMsg';
import Skeleton from '../skeleton/Skeleton';
import './charInfo.scss';

class CharInfo extends Component {

    // стейт
    state = {
        char: null,
        loading: false,
        error: false,
        thumbStyle: ''
    }

    // новый экземпляр класса
    marvelService = new MarverService();

    componenDidMount() {
        this.updateChar();
    }

    // запускаем updateChar() если charId в пропсах изменился
    componentDidUpdate(prevProps, prevState) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar()
        }
    }

    updateChar = () => {
        const {charId} = this.props;
        if(!charId) {
            return
        } else {
            this.marvelService
                .getCharacter(charId)
                .then(this.onCharLoaded)
                .catch(this.onError)
        }
    }

    onCharLoaded = (char) => {
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

    // метод для ошибки если нет персонажа под таким ID
    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    render() {
        const {char, loading, error, thumbStyle} = this.state;

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
}

const View = ({char, thumbStyle}) => {
    const {thumbnail, name, description, homepage, wiki, comics} = char;
    const comicsItems = comics.map((item, idx) => {
                            // eslint-disable-next-line
                            if (idx >= 10) return;
                            return (
                                <li key={idx} className="char__comics-item">
                                    {item.name}
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

export default CharInfo;