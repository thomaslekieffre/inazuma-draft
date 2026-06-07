/**

 * Rosters canoniques IE3 — source Fandom (scripts/fandom-rosters-final.json).

 * MAJ: npm run data:rebuild après édition du JSON Fandom.

 */

import type { FFITeamId } from './team-names'



export const FFI_STARTING_XI: Record<FFITeamId, string[]> = {

  'Orpheus': ['Blasi', 'Gattuso', 'Marco', 'Giuseppe', 'Vento', 'Angelo', 'Dante', 'Hide Nakata', 'Fidio', 'Raffaele', 'Giorgio'],
  'Unicorn': ['Kid', 'Ted', 'Tony', 'Dyke', 'Domon', 'Ichinose', 'Mark', 'Steve', 'Dylan', 'Michele', 'Eddie'],
  'Knights of Queen': ['Freddy', 'Johnny G', 'David', 'Lance', 'Edge', 'Peter', 'Gary', 'Paul', 'Edgar', 'Philip', 'Nick'],
  'The Empire': ['Jorge', 'Therese', 'Julio', 'Gordo', 'Ramon', 'Roberto', 'Pablo', 'Esteban', 'Leone', 'Diego', 'Mario'],
  'The Kingdom': ['Javali', 'Monstro', 'Lagarto', 'Formiga', 'Cavalo', 'Leonardo', 'Presa', 'Borboleta', 'Roniejo', 'Gato', 'Grilo'],
  'Red Matador': ['Fermín', 'Queraldo', 'Rafael', 'Antonio', 'Laudi', 'Miquel', 'Igor', 'Pedro', 'Samuel', 'David', 'Isaac'],
  'Rose Griffon': ['Ladji', 'Pierre', 'Miguel', 'Frantz', 'Kevin', 'Laurent', 'Ronnie', 'Julien', 'Jérôme', 'Alain', 'Michel'],
  'Brockenborg': ['Torsten', 'Alex', 'Heinrich', 'Luka', 'Manuel', 'Niklas', 'Jonas', 'Theo', 'Maxim', 'Elvin', 'Jens'],
  'Little Gigant': ['Rococo', 'Windy', 'Walter', 'Ginny', 'Marron', 'Ryuu', 'Maxi', 'Shintei', 'Goushu', 'Drago', 'Squid'],

}



export const CANONICAL_TEAM_ROSTERS: Record<string, string[]> = {

  'Inazuma Japan': ['Mark Evans', 'Darren LaChance', 'Jack Wallside', 'Scott Banyan', 'Archer Hawkins', 'Tod Ironside', 'Nathan Swift', 'Hurley Kane', 'Thor Stoutberg', 'Jordan Greenway', 'Caleb Stonewall', 'Jude Sharp', 'David Samford', 'Shawn Froste', 'Xavier Foster', 'Kevin Dragonfly', 'Austin Hobbes', 'Axel Blaze'],
  'Big Waves': ['Jinbei', 'Seahorse', 'Barracuda', 'Beach', 'Water', 'Turtle', 'Kraken', 'Dolphin', 'Shrimp', 'Crab', 'Surfing', 'Angler', 'Summer', 'Reef', 'Jaws', 'Merlin'],
  'Desert Lion': ['Nasser', 'Talal', 'Bjorn', 'Jamel', 'Fual', 'Musa', 'Hassan', 'Khalfan', 'Seid', 'Sly', 'Messa', 'Yusuf', 'Rajab', 'Zach', 'Adele', 'Majidi'],
  'Fire Dragon': ['Jung-Soo', 'Ji-Nan', 'Eum-Yang', 'Doo-Yoon', 'Myong-Ho', 'Seong-Hwan', 'Hyeon-Dae', 'Chang-Soo', 'Pek-Young', 'Eun-Young', 'Jeong-Yun', 'Jeong-Won', 'Aphrodi', 'Burn', 'Gazel', 'Seong-Jun'],
  'Knights of Queen': ['Freddy', 'Gareth', 'Johnny G', 'David', 'Lance', 'Edge', 'Martin', 'Peter', 'Gary', 'Paul', 'Eric', 'Beat', 'Mikey', 'Edgar', 'Philip', 'Nick'],
  'The Empire': ['Jorge', 'Lionel', 'Therese', 'Julio', 'Gordo', 'Ramon', 'Hernan', 'Esteban', 'Sergio', 'Roberto', 'Pablo', 'Herman', 'Leone', 'Diego', 'Mario', 'Ricardo'],
  'Unicorn': ['Kid', 'Alex', 'Ted', 'Tony', 'Dyke', 'Domon', 'Rob', 'Bob', 'Steve', 'Ichinose', 'Sean', 'Mark', 'Sammy', 'Dylan', 'Michele', 'Eddie'],
  'Orpheus': ['Blasi', 'Daniele', 'Vento', 'Ottorino', 'Gattuso', 'Marco', 'Giuseppe', 'Angelo', 'Giorgio', 'Dante', 'Gianluca', 'Enrico', 'Alessandro', 'Hide Nakata', 'Fidio', 'Raffaele'],
  'The Kingdom': ['Falcao', 'Javali', 'Lagarto', 'Bagre', 'Monstro', 'Formiga', 'Urso', 'Cavalo', 'Presa', 'Borboleta', 'Coruja', 'Leonardo', 'Tigre', 'Roniejo', 'Gato', 'Grilo'],
  'Little Gigant': ['Rococo', 'Kane', 'Windy', 'Walter', 'Ginny', 'Marron', 'McCall', 'Shintei', 'Yumu', 'Kito', 'Maxi', 'Maygar', 'Ryuu', 'Squid', 'Goushu', 'Drago'],
  'Team K': ['Indigo', 'Grigio', 'Roseo', 'Azubel', 'Nello', 'Azzurro', 'Pardo', 'Verdio', 'Rosso', 'Giallo', 'Marrone', 'Amaranto', 'Demonio', 'Violette', 'Bianco', 'Lattimo'],
  'Team Garshield': ['Fox', 'Goliath', 'Jackal', 'Henktacker', 'Buffalo', 'Dingo', 'Spider', 'Papillon', 'Owl', 'Hedge', 'Mantis', 'Crow', 'Giraffe', 'Coyote', 'Scorpio', 'Gavial'],
  'Red Matador': ['Fermín', 'Juan', 'Queraldo', 'José', 'Rafael', 'Antonio', 'Laudi', 'Joan', 'Igor', 'Miquel', 'Pedro', 'Carlos', 'Samuel', 'David', 'Isaac', 'Federico'],
  'Rose Griffon': ['Ladji', 'Émile', 'Pierre', 'Miguel', 'Frantz', 'Kevin', 'André', 'Jean', 'Laurent', 'Ronnie', 'Stéphane', 'Julien', 'Claude', 'Jérôme', 'Alain', 'Michel'],
  'Brockenborg': ['Torsten', 'Ger', 'Alex', 'Heinrich', 'Kurt', 'Luka', 'Manuel', 'Jonas', 'Theo', 'Jan', 'Niklas', 'Ern', 'Maxim', 'Peter', 'Elvin', 'Jens'],
  'The Great Horn': ['Zolani', 'Hiyuu', 'Dinga', 'Jake', 'Muzonge', 'Caxias', 'Mubulelo', 'Kenede', 'Abari', 'Athol', 'Reggie', 'Sulani', 'Tenba', 'Natal', 'Mulamuli', 'Ezeckiel'],
  'Tenkuu no Shito': ['Enolel', 'Nanael', 'Genel', 'Ekadel', 'Elfel', 'Sakinel', 'Winel', 'Enuel', 'Aiel', 'Guel', 'Sein'],
  'Makai Gundan Z': ['Astaroth', 'Beelzebub', 'Abigor', 'Hebimoth', 'Belial', 'Mephisto', 'Glasya', 'Barbatos', 'Arachnes', 'Satanathos', 'Desta'],
  'Ogre': ['Luceafǎr', 'Bump Trungus', 'Lump Trungus', 'Jenkins', 'Ischer', 'Stark', 'Triumvir', 'Gunther', 'Callous', 'Malice', 'Lancer'],
  'Occult': ['Mask', 'Zombie', 'Styx', 'Franky', 'Undead', 'Creepy', 'Jiangshi', 'Mummy', 'Grave', 'Wolfy', 'Ghost', 'Sanguin', 'Dollman', 'Noir', 'Alien', 'Talisman'],
  'Wild': ['Boar', 'Bullford', 'Toad', 'Fishman', 'Raccoon', 'Lion', 'Monkey', 'Chameleon', 'Mouseman', 'Koala', 'Chicken', 'Eagle', 'Panda', 'Cheetah', 'Gorilla', 'Snake'],
  'Brainwashing': ['Feldt', 'Under', 'Waters', 'Good', 'Stronger', 'Marvel', 'Leading', 'Stiller', 'Oughtry', 'Tell', 'Rock', 'Kind', 'Busta', 'Mooney', 'Seller', 'Turner'],
  'Otaku': ['Idol', 'Eldorado', 'Train', 'Vox', 'Cosplay', 'Formby', 'Net', 'Signalman', 'Robot', 'Novel', 'Hero', 'Online', 'Custom', 'Gamer', 'Artist', 'Arcade'],
  'Royal Academy': ['King', 'Carlton', 'Drent', 'Simmons', 'Martin', 'Master', 'Bloom', 'Swing', 'Waldon', 'Potts', 'Tomlinson', 'Ingham', 'Lawrenson', 'Hatch'],
  'Zeus': ['Poseidon', 'Icarus', 'Apollo', 'Hephestus', 'Ares', 'Dionysus', 'Heracles', 'Chronos', 'Artemis', 'Hermes', 'Athena', 'Medusa', 'Hera', 'Aphrodite', 'Demeter', 'Achilles'],
  'Special Players': ['Carl Kappa', 'Rococo kid', 'Silvia Woods', 'Bobby Shearer 2', 'Camellia Travis', 'Shawn Froste 2 DF', 'Paul Peabody', 'Celia Hills', 'Erik Eagle 2', 'Jude Sharp 2', 'Canon Evans', 'Shawn Froste 2 FW', 'Masaki', 'Maxwell Carson', 'Nelly Raimon', 'Shadow Cimmerian', 'Syon Blaze', 'William Glass'],

}

