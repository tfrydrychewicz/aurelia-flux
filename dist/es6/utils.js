function globStringToRegexString(str) {
    return preg_quote(str).replace(/\\\*/g, '.*').replace(/\\\?/g, '.');
}
function preg_quote(str, delimiter) {
    return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
}

export class Utils {
    static patternsToRegex(patterns) {
        if(Array.isArray(patterns) === false) {
            patterns = Array.of(patterns);
        }

        return new RegExp('^' + patterns.map(globStringToRegexString).join('|') + '$');
    }
}
