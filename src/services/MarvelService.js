 import {useHttp} from '../hooks/http.hooks';
 
 const useMarverService = () => {

    const {loading, request, error, clearError} = useHttp();

    // доступы
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=6022a09bcb419514d68593ea1c86ee27';
    const _baseOffset = 210;
    const _comicsOffset = 0;

    // получаем данные 9 персонажей
    // присваиваем базовый оффсет если параметр не передан
    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    // получем данные 1го персонажа
    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    // трансформируем входящие данные в нужный нам вид
    const _transformCharacter = (char) => {
        // check description has text
        const description = char.description ? char.description : 'No description';
        return {
            id: char.id,
            name: char.name,
            description: description.length > 200 ? `${(description).substr(0, 200)}...` : description, // check length
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    // получем комиксы
    const getComics = async (offset = _comicsOffset) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    // получем данные 1го комикса
    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    // трансформируем входящие данные в нужный нам вид
    const _transformComics = (char) => {
        // check description has text
        const price = char.prices[0].price ? `$${char.prices[0].price}` : 'Not avalible';
        return {
            id: char.id,
            title: char.title,
            price: price,
            pageCount: char.pageCount,
            language: char.textObjects[0].language,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension
        }
    }

    return {loading, error, clearError, getAllCharacters, getCharacter, getComics, getComic}

 }

 export default useMarverService;