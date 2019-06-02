import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-bottts-sprites';

let options = {};

exports.avatarMaker = email => {
let avatars = new Avatars(sprites(options));
return avatars.create(email);
}
