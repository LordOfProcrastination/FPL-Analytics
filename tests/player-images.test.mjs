import assert from 'node:assert/strict';
import test from 'node:test';
import { clubColours, getClubColours, getPlayerImageSources, neutralColours } from '../src/utils/playerImages.ts';

const player = { code: 223094, photo: '223094.jpg', element_type: 4 };
test('portraits use image codes and shirts use stable club codes', () => {
  const sources = getPlayerImageSources(player, { code: 43 });
  assert.equal(sources[0], 'https://resources.premierleague.com/premierleague25/photos/players/110x140/223094.png');
  assert.equal(sources[1], 'https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_43-110.png');
  assert.equal(sources[2], '/images/player-silhouette.svg');
});
test('goalkeepers use the separate shirt variant', () => {
  assert.match(getPlayerImageSources({ ...player, element_type: 1 }, { code: 3 })[1], /shirt_3_1-110.png$/);
});
test('missing image codes skip portraits and unknown clubs skip shirts', () => {
  assert.deepEqual(getPlayerImageSources({ ...player, code: 0, photo: '' }), ['/images/player-silhouette.svg']);
  assert.match(getPlayerImageSources({ ...player, code: 0, photo: '154561.jpg' })[0], /154561.png$/);
  assert.deepEqual(getClubColours(99999), neutralColours);
  assert.deepEqual(getClubColours(), neutralColours);
});
test('all clubs from the verified bootstrap have colours', () => {
  for (const code of [3, 7, 91, 94, 36, 8, 9, 31, 11, 54, 88, 40, 2, 14, 43, 1, 4, 17, 6, 56]) {
    assert.ok(clubColours[code], `Missing club ${code}`);
  }
});
