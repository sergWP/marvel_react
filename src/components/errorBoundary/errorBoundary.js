import {Component} from 'react';
import ErrorMsg from '../errorMsg/errorMsg';

class ErrorBoundary extends Component {
    state = {
        error: false
    }

    /*
    static getDerivedStateFromError(error) {
        // Обновите состояние (только стейт!) так, чтобы следующий рендер показал запасной интерфейс.
        return { error: true }
    }
    */

    componentDidCatch(error, info) {
        // метод жизненного цикла вызывается после возникновения ошибки у компонента-потомка
        console.log(error, info);
        this.setState({error: true});
    }

    render() {
        if ( this.state.error === true ) {
            return <ErrorMsg />
        }

        return this.props.children;
    }
}

export default ErrorBoundary;