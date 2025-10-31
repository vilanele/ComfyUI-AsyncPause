import { extension_base_path } from './path.js';
const sounds = {
    bonus: 'bonus.mp3',
    bottle: 'bottle.mp3',
    chime: 'chime.mp3',
    pop: 'pop.wav',
    cartoon: 'cartoon.mp3',
    cowbell: 'cowbell.mp3',
    positive: 'positive.mp3',
    bike: 'bike.mp3',
    collect: 'collect.mp3',
    echo: 'echo.mp3',
    glass: 'glass.mp3',
    notification: 'notification.mp3'
};
const default_sound = 'echo';
function soundPath(sound) {
    return `/extensions/${extension_base_path}/audio/${sounds[sound]}`;
}
export { sounds, default_sound, soundPath };
