'use es6';

// CJK stands for Chinese, Japanese, Korean characters
const CJKRegex = new RegExp('\\p{scx=Han}' +
    // Hanzi script - Chinese writing system
    '|\\p{scx=Hangul}' +
    // Hangul script - Korean writing system
    '|\\p{scx=Hiragana}' +
    // Hiragana script - one of the Japanese writing systems
    '|\\p{scx=Katakana}',
    // Katakana script - one of the Japanese writing systems
    'u');
export default CJKRegex;