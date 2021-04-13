import { TMX } from '../tiled';
import gigantic from './gigantic.json';
import small from './small.json';
import neon from './neon.json';

export const List: { [key: string]: TMX.IMap } = {
    small,
    gigantic,
    neon
};
