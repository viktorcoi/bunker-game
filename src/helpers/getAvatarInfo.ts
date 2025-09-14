const colorTable = [
    {symbol: 'aа', color: '#78909c'},
    {symbol: 'bб', color: '#ff544b'},
    {symbol: 'cв', color: '#d8ff4b'},
    {symbol: 'dг', color: '#87ff63'},
    {symbol: 'eд', color: '#ffd442'},
    {symbol: 'fе', color: '#46ffff'},
    {symbol: 'gё', color: '#6da9ff'},
    {symbol: 'hж', color: '#ffadc3'},
    {symbol: 'iз', color: '#bfa0ff'},
    {symbol: 'jи', color: '#ffa067'},
    {symbol: 'kй', color: '#59ffb4'},
    {symbol: 'lк', color: '#e462ff'},
    {symbol: 'mл', color: '#d3ff82'},
    {symbol: 'nм', color: '#9c98ff'},
    {symbol: 'oн', color: '#83ff8a'},
    {symbol: 'pо', color: '#ff5d5d'},
    {symbol: 'qп', color: '#d3ff56'},
    {symbol: 'rр', color: '#5ee1ff'},
    {symbol: 'sс', color: '#ff3197'},
    {symbol: 'tт', color: '#606aff'},
    {symbol: 'uу', color: '#82ff8d'},
    {symbol: 'vф', color: '#586eff'},
    {symbol: 'wх', color: '#ff9466'},
    {symbol: 'yц', color: '#54eeff'},
    {symbol: 'zч', color: '#e1ff2f'},
    {symbol: 'ш', color: '#8232ff'},
    {symbol: 'щ', color: '#d9ff27'},
    {symbol: 'ъ', color: '#1dffc5'},
    {symbol: 'ы', color: '#ff8302'},
    {symbol: 'ь', color: '#6472ff'},
    {symbol: 'э', color: '#ffb654'},
    {symbol: 'ю', color: '#0e88ff'},
    {symbol: 'я', color: '#9f43ff'},
];

const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.substring(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return {r, g, b};
};

const darkenColor = (color: string, percent: number) => {
    const rgb = hexToRgb(color);
    rgb.r = Math.round(rgb.r * (1 - percent / 100));
    rgb.g = Math.round(rgb.g * (1 - percent / 100));
    rgb.b = Math.round(rgb.b * (1 - percent / 100));
    return `#${(1 << 24 | rgb.r << 16 | rgb.g << 8 | rgb.b).toString(16).slice(1)}`;
};

export const getColorForName = (value: string) => {
    let name = value;
    if (!name) name = 'nn';
    let [firstName, lastName] = name?.split(' ');
    if (!firstName) firstName = 'n'
    if (!lastName) lastName = firstName?.[1] || firstName;
    let firstColor = '#fff', secondColor = '#fff';
    colorTable.filter(({symbol, color}) => {
        if (symbol.includes(firstName[0]?.toLowerCase())) firstColor = color;
        if (symbol.includes(lastName[0]?.toLowerCase())) secondColor = color;
    })

    return `linear-gradient(135deg, ${firstColor}, ${darkenColor(secondColor, 35)})`
};

export const getInitialsFromName = (
    userName: string
) => {
    const [firstName, lastName] = userName?.toUpperCase()?.split(' ');
    const firstInitial = firstName?.[0] || '';
    const lastInitial = lastName?.[0] || '';
    return `${firstInitial}${lastInitial}`;
};
