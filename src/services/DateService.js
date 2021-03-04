import dateReadableFormat from '../data/date_readable_format.json';

export default class DateService {    
    static #normalizeTime = (hours, minutes) => {
        return `${(hours < 10 ? '0' : '') + hours.toString()}:${(minutes < 10 ? '0' : '') + minutes.toString()}`;
    }

    static getTimeCode(date = new Date()) {
        return DateService.#normalizeTime(date.getHours(), date.getMinutes());
    }

    static getReadableFormat(lang, date = new Date()) {
        const selectedLangFormat = dateReadableFormat[lang] || dateReadableFormat['ru'];

        const [ day, month ] = [
            selectedLangFormat.days[date.getUTCDay()],
            selectedLangFormat.months[date.getMonth()],
        ];

        return {
            timeCode: DateService.getTimeCode(date),
            day,
            date: date.getDate(),
            month,
            year: date.getFullYear(),
        };
    }
};
