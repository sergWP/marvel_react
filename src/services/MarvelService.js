 class MarverService {
    // доступы
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=6022a09bcb419514d68593ea1c86ee27';
    _baseOffset = 210;

    // функция-запрос
    getResource = async (url) => {
        let res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    // получаем данные 9 персонажей
    // присваиваем базовый оффсет если параметр не передан
    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter);
    }

    // получем данные 1го персонажа
    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    // трансформируем входящие данные в нужный нам вид
    _transformCharacter = (char) => {
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
 }

 export default MarverService