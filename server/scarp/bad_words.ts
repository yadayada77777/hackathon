import { IDictionary } from "./IDictionary";

const bad_words: IDictionary<string[]> = {
    "suicidality": ['דיכאון', 'יאוש','כשלון','כישלון'],
    "curses": []
}
export function getBadWords() {
    return bad_words;
}   