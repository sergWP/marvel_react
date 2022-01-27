// process.env.PUBLIC_URL    -> очень редко применяются из папки паблик. Лучше избегать
import img from './error.gif';

const ErrorMsg = () => {
    return (
        //<img src={process.env.PUBLIC_URL + '/error.gif'} />
        <img src={img} alt='Error' />

    )
}

export default ErrorMsg;