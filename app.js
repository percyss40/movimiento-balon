const storageKey = "movimiento-balon";
const dataVersion = 1;
const supabaseConfig = {
  url: "https://iwimqdsdeitmptrbqpzm.supabase.co",
  key: "sb_publishable_NMG86Tzb1tqVVLcj011F0w_WVgqZCfM"
};
let supabaseClient = null;
let currentUser = null;
const rosterNames = [
  "Cardozo, Manuel",
  "Memler, Sebastián",
  "Cortez, Joaquín",
  "Panozzo, Emiliano",
  "Pereyra, Gabriel",
  "Chino",
  "Conil, Nahuel",
  "Chesani, Luciano",
  "Geslao, Gastón",
  "Bustos, Franco",
  "Romero, Lucas",
  "Martínez, Alejandro",
  "Schneider, Agustín",
  "JP",
  "Yavorski, Javier",
  "Delpiano, Carlos",
  "Rodri",
  "Perez Lezcano, Francisco",
  "Fernandez, \"Harry\" Guillermo",
  "Boichuk, Franco",
  "Cabrera, Gabriel",
  "Chemes, Tomas",
  "Duarte, Lucas",
  "Zapana, Daniel"
];
const playerPhotoMap = {
  "player-boichuk-franco": "assets/players/boichuk-franco.png",
  "player-bustos-franco": "assets/players/bustos-franco.png",
  "player-cabrera-gabriel": "assets/players/cabrera-gabriel.png",
  "player-cardozo-manuel": "assets/players/cardozo-manuel.png",
  "player-chemes-tomas": "assets/players/chemes-tomas.png",
  "player-chesani-luciano": "assets/players/chesani-luciano.png",
  "player-chino": "assets/players/chino-v2.png",
  "player-conil-nahuel": "assets/players/conil-nahuel.png",
  "player-cortez-joaquin": "assets/players/cortez-joaquin.png",
  "player-delpiano-carlos": "assets/players/delpiano-carlos.png",
  "player-duarte-lucas": "assets/players/duarte-lucas.png",
  "player-fernandez-harry-guillermo": "assets/players/fernandez-harry-guillermo.png",
  "player-geslao-gaston": "assets/players/geslao-gaston.png",
  "player-jp": "assets/players/jp.png",
  "player-martinez-alejandro": "assets/players/martinez-alejandro.png",
  "player-memler-sebastian": "assets/players/memler-sebastian.png",
  "player-panozzo-emiliano": "assets/players/panozzo-emiliano.png",
  "player-pereyra-gabriel": "assets/players/pereyra-gabriel.png",
  "player-perez-lezcano-francisco": "assets/players/perez-lezcano-francisco.jpeg",
  "player-romero-lucas": "assets/players/romero-lucas.png",
  "player-schneider-agustin": "assets/players/schneider-agustin.png",
  "player-yavorski-javier": "assets/players/yavorski-javier.png",
  "player-zapana-daniel": "assets/players/zapana-daniel.jpeg"
};
const mvpNewsPhotoMap = {
  "player-perez-lezcano-francisco": "assets/mvp/perez-lezcano-francisco.png"
};

const mvpDefaultNewsText = {
  "player-perez-lezcano-francisco": "Fran se lleva el MVP tras lograr el batacazo en un gran partido en el que metió 5 goles e hizo ganar a \"la cara de la derrota\" en un partido que parecía desequilibrado a favor del equipo blanco."
};

const playerPhotoFocusMap = {
  "player-zapana-daniel": "center 34%"
};
const goalkeeperIds = [
  "player-zapana-daniel",
  "player-conil-nahuel",
  "player-fernandez-harry-guillermo"
];
const drawSpreadIds = new Set([
  "player-geslao-gaston",
  "player-cardozo-manuel",
  "player-panozzo-emiliano"
]);
const drawSeparatePairIds = new Set([
  "player-chesani-luciano",
  "player-delpiano-carlos"
]);
const removedPlayerIds = new Set([
  "player-perez-lezcano-nahuel",
  "player-kumagae-adriel",
  "player-sena-ian"
]);
const playerIdAliases = {
  "player-cabrera-gonzalo": "player-cabrera-gabriel"
};
const playerNameOverrides = {
  "player-cabrera-gabriel": "Cabrera Gonzalo"
};
const playerAttributeOverrides = {
  "player-cardozo-manuel": { overall: 80, pace: 88, shooting: 74, passing: 72, dribbling: 62, defense: 86, physical: 88 },
  "player-memler-sebastian": { overall: 82, pace: 76, shooting: 77, passing: 86, dribbling: 82, defense: 85, physical: 70 },
  "player-cortez-joaquin": { overall: 82, pace: 50, shooting: 87, passing: 92, dribbling: 72, defense: 71, physical: 67 },
  "player-panozzo-emiliano": { overall: 78, pace: 86, shooting: 72, passing: 70, dribbling: 83, defense: 80, physical: 69 },
  "player-pereyra-gabriel": { overall: 82, pace: 78, shooting: 87, passing: 84, dribbling: 84, defense: 76, physical: 70 },
  "player-chino": { overall: 88, pace: 80, shooting: 89, passing: 75, dribbling: 93, defense: 72, physical: 85 },
  "player-conil-nahuel": { overall: 81, pace: 81, shooting: 83, passing: 78, dribbling: 80, defense: 82, physical: 82 },
  "player-fernandez-harry-guillermo": { overall: 81, pace: 81, shooting: 83, passing: 78, dribbling: 80, defense: 82, physical: 82 },
  "player-zapana-daniel": { overall: 81, pace: 81, shooting: 83, passing: 78, dribbling: 80, defense: 82, physical: 82 },
  "player-chesani-luciano": { overall: 89, pace: 78, shooting: 80, passing: 88, dribbling: 80, defense: 91, physical: 90 },
  "player-geslao-gaston": { overall: 76, pace: 61, shooting: 56, passing: 72, dribbling: 62, defense: 87, physical: 91 },
  "player-bustos-franco": { overall: 86, pace: 84, shooting: 87, passing: 84, dribbling: 89, defense: 72, physical: 50 },
  "player-romero-lucas": { overall: 83, pace: 74, shooting: 86, passing: 79, dribbling: 75, defense: 80, physical: 84 },
  "player-martinez-alejandro": { overall: 80, pace: 75, shooting: 74, passing: 77, dribbling: 70, defense: 84, physical: 86 },
  "player-schneider-agustin": { overall: 90, pace: 90, shooting: 91, passing: 89, dribbling: 84, defense: 80, physical: 94 },
  "player-jp": { overall: 86, pace: 85, shooting: 83, passing: 80, dribbling: 82, defense: 75, physical: 88 },
  "player-yavorski-javier": { overall: 91, pace: 92, shooting: 91, passing: 86, dribbling: 88, defense: 80, physical: 87 },
  "player-delpiano-carlos": { overall: 87, pace: 80, shooting: 78, passing: 80, dribbling: 84, defense: 89, physical: 86 },
  "player-rodri": { overall: 75, pace: 86, shooting: 58, passing: 60, dribbling: 62, defense: 78, physical: 88 },
  "player-perez-lezcano-francisco": { overall: 88, pace: 81, shooting: 89, passing: 88, dribbling: 82, defense: 82, physical: 91 },
  "player-boichuk-franco": { overall: 82, pace: 64, shooting: 84, passing: 86, dribbling: 84, defense: 77, physical: 76 },
  "player-cabrera-gabriel": { overall: 75, pace: 62, shooting: 78, passing: 65, dribbling: 68, defense: 72, physical: 75 },
  "player-chemes-tomas": { overall: 82, pace: 64, shooting: 82, passing: 90, dribbling: 84, defense: 84, physical: 80 },
  "player-duarte-lucas": { overall: 70, pace: 30, shooting: 90, passing: 84, dribbling: 86, defense: 60, physical: 70 }
};
const galleryImages = Array.from({ length: 38 }, (_, index) => `assets/gallery/gallery-${String(index + 1).padStart(2, "0")}.jpeg`);
let gallerySlideIndex = 0;
let galleryTimer = null;
const importedMatches2025 = [
  {"id":"match-2025-03-02","date":"2025-03-02","venue":"Brown","teamA":["player-duarte-lucas","player-schneider-agustin","player-cardozo-manuel","player-perez-lezcano-nahuel","player-zapana-daniel","player-chemes-tomas","player-boichuk-franco"],"teamB":["player-bustos-franco","player-perez-lezcano-francisco","player-cortez-joaquin","player-panozzo-emiliano","player-conil-nahuel","player-pereyra-gabriel"],"scoreA":1,"scoreB":0,"scorers":["player-bustos-franco","player-chemes-tomas","player-chemes-tomas","player-cardozo-manuel","player-cardozo-manuel","player-cardozo-manuel","player-perez-lezcano-francisco","player-perez-lezcano-francisco","player-perez-lezcano-francisco","player-cortez-joaquin","player-schneider-agustin","player-schneider-agustin","player-schneider-agustin","player-schneider-agustin","player-pereyra-gabriel"],"assisters":[],"mvp":"player-perez-lezcano-francisco","comment":""},
  {"id":"match-2025-03-09","date":"2025-03-09","venue":"Brown","teamA":["player-martinez-alejandro","player-memler-sebastian","player-pereyra-gabriel","player-romero-lucas","player-perez-lezcano-nahuel","player-zapana-daniel","player-delpiano-carlos"],"teamB":["player-perez-lezcano-francisco","player-schneider-agustin","player-cortez-joaquin","player-panozzo-emiliano","player-conil-nahuel","player-chino","player-cardozo-manuel"],"scoreA":1,"scoreB":0,"scorers":["player-delpiano-carlos","player-cardozo-manuel","player-perez-lezcano-francisco","player-cortez-joaquin","player-schneider-agustin","player-schneider-agustin","player-chino","player-pereyra-gabriel","player-pereyra-gabriel"],"assisters":[],"mvp":"player-zapana-daniel","comment":""},
  {"id":"match-2025-03-16","date":"2025-03-16","venue":"Brown","teamA":["player-cardozo-manuel","player-cortez-joaquin","player-chesani-luciano","player-romero-lucas","player-perez-lezcano-nahuel","player-zapana-daniel","player-chino"],"teamB":["player-chemes-tomas","player-perez-lezcano-francisco","player-schneider-agustin","player-delpiano-carlos","player-boichuk-franco","player-panozzo-emiliano","player-conil-nahuel","player-pereyra-gabriel"],"scoreA":1,"scoreB":0,"scorers":["player-chemes-tomas","player-chemes-tomas","player-panozzo-emiliano","player-romero-lucas","player-perez-lezcano-francisco","player-cortez-joaquin","player-schneider-agustin","player-chino","player-chino","player-chino","player-chino","player-pereyra-gabriel","player-pereyra-gabriel"],"assisters":[],"mvp":"player-chino","comment":""},
  {"id":"match-2025-03-23","date":"2025-03-23","venue":"Brown","teamA":[],"teamB":["player-bustos-franco","player-panozzo-emiliano","player-martinez-alejandro","player-schneider-agustin","player-conil-nahuel","player-cardozo-manuel","player-chesani-luciano","player-pereyra-gabriel","player-perez-lezcano-nahuel","player-zapana-daniel","player-boichuk-franco","player-delpiano-carlos","player-chino","player-perez-lezcano-francisco"],"scoreA":0,"scoreB":0,"scorers":["player-bustos-franco","player-martinez-alejandro","player-martinez-alejandro","player-panozzo-emiliano","player-perez-lezcano-francisco","player-perez-lezcano-francisco","player-chino","player-pereyra-gabriel","player-pereyra-gabriel","player-pereyra-gabriel"],"assisters":[],"mvp":"player-pereyra-gabriel","comment":""},
  {"id":"match-2025-03-30","date":"2025-03-30","venue":"Brown","teamA":["player-memler-sebastian","player-pereyra-gabriel","player-romero-lucas","player-perez-lezcano-nahuel","player-chemes-tomas","player-boichuk-franco"],"teamB":["player-chesani-luciano","player-perez-lezcano-francisco","player-schneider-agustin","player-cortez-joaquin","player-panozzo-emiliano","player-zapana-daniel","player-chino","player-cardozo-manuel"],"scoreA":1,"scoreB":0,"scorers":["player-boichuk-franco","player-cardozo-manuel","player-panozzo-emiliano","player-panozzo-emiliano","player-romero-lucas","player-perez-lezcano-francisco","player-cortez-joaquin","player-chino","player-chino","player-pereyra-gabriel","player-pereyra-gabriel","player-pereyra-gabriel","player-pereyra-gabriel","player-pereyra-gabriel","player-pereyra-gabriel"],"assisters":[],"mvp":"player-pereyra-gabriel","comment":""},
  {"id":"match-2025-04-06","date":"2025-04-06","venue":"Brown","teamA":["player-bustos-franco","player-geslao-gaston","player-martinez-alejandro","player-cortez-joaquin","player-perez-lezcano-nahuel","player-chino"],"teamB":["player-romero-lucas","player-chemes-tomas","player-memler-sebastian","player-perez-lezcano-francisco","player-schneider-agustin","player-boichuk-franco","player-panozzo-emiliano","player-conil-nahuel"],"scoreA":1,"scoreB":0,"scorers":["player-memler-sebastian","player-memler-sebastian","player-delpiano-carlos","player-delpiano-carlos","player-romero-lucas","player-romero-lucas","player-perez-lezcano-francisco","player-perez-lezcano-francisco","player-cortez-joaquin","player-schneider-agustin","player-schneider-agustin","player-schneider-agustin","player-chino","player-chino"],"assisters":[],"mvp":"player-perez-lezcano-francisco","comment":""},
  {"id":"match-2025-04-13","date":"2025-04-13","venue":"Brown","teamA":["player-panozzo-emiliano","player-conil-nahuel","player-cortez-joaquin","player-chesani-luciano","player-boichuk-franco","player-delpiano-carlos","player-chino"],"teamB":["player-geslao-gaston","player-romero-lucas","player-chemes-tomas","player-memler-sebastian","player-zapana-daniel","player-pereyra-gabriel","player-cardozo-manuel"],"scoreA":1,"scoreB":0,"scorers":["player-delpiano-carlos","player-chesani-luciano","player-chesani-luciano","player-cardozo-manuel","player-cardozo-manuel","player-panozzo-emiliano","player-panozzo-emiliano","player-panozzo-emiliano","player-panozzo-emiliano","player-cortez-joaquin","player-cortez-joaquin","player-chino","player-chino","player-chino"],"assisters":[],"mvp":"player-panozzo-emiliano","comment":""},
  {"id":"match-2025-04-20","date":"2025-04-20","venue":"Brown","teamA":["player-cardozo-manuel","player-cortez-joaquin","player-pereyra-gabriel","player-romero-lucas","player-boichuk-franco","player-delpiano-carlos","player-chino"],"teamB":["player-kumagae-adriel","player-geslao-gaston","player-memler-sebastian","player-perez-lezcano-francisco","player-schneider-agustin","player-panozzo-emiliano","player-zapana-daniel"],"scoreA":1,"scoreB":0,"scorers":["player-romero-lucas","player-romero-lucas","player-perez-lezcano-francisco","player-cortez-joaquin","player-cortez-joaquin","player-cortez-joaquin","player-cortez-joaquin","player-schneider-agustin","player-schneider-agustin","player-chino"],"assisters":[],"mvp":"player-pereyra-gabriel","comment":""},
  {"id":"match-2025-04-27","date":"2025-04-27","venue":"Brown","teamA":["player-geslao-gaston","player-chesani-luciano","player-romero-lucas","player-zapana-daniel","player-chemes-tomas","player-boichuk-franco","player-chino"],"teamB":["player-memler-sebastian","player-perez-lezcano-francisco","player-delpiano-carlos","player-cortez-joaquin","player-conil-nahuel","player-pereyra-gabriel","player-cardozo-manuel"],"scoreA":1,"scoreB":0,"scorers":["player-boichuk-franco","player-boichuk-franco","player-boichuk-franco","player-romero-lucas","player-romero-lucas","player-perez-lezcano-francisco","player-perez-lezcano-francisco","player-chino","player-chino","player-chino","player-pereyra-gabriel","player-pereyra-gabriel","player-pereyra-gabriel"],"assisters":[],"mvp":"player-chemes-tomas","comment":""},
  {"id":"match-2025-05-04","date":"2025-05-04","venue":"Brown","teamA":["player-panozzo-emiliano","player-conil-nahuel","player-cortez-joaquin","player-perez-lezcano-nahuel","player-chemes-tomas","player-boichuk-franco","player-delpiano-carlos"],"teamB":["player-geslao-gaston","player-romero-lucas","player-memler-sebastian","player-perez-lezcano-francisco","player-zapana-daniel","player-pereyra-gabriel","player-chino","player-cardozo-manuel"],"scoreA":1,"scoreB":0,"scorers":["player-boichuk-franco","player-boichuk-franco","player-perez-lezcano-francisco","player-perez-lezcano-francisco","player-cortez-joaquin","player-cortez-joaquin","player-cortez-joaquin","player-chino","player-chino","player-pereyra-gabriel","player-pereyra-gabriel","player-pereyra-gabriel"],"assisters":[],"mvp":"","comment":""},
  {"id":"match-2025-05-11","date":"2025-05-11","venue":"Brown","teamA":["player-rodri","player-panozzo-emiliano","player-chesani-luciano","player-zapana-daniel","player-chemes-tomas","player-delpiano-carlos","player-chino"],"teamB":["player-martinez-alejandro","player-perez-lezcano-francisco","player-schneider-agustin","player-boichuk-franco","player-conil-nahuel","player-pereyra-gabriel","player-cardozo-manuel"],"scoreA":1,"scoreB":0,"scorers":["player-boichuk-franco","player-panozzo-emiliano","player-schneider-agustin","player-schneider-agustin","player-chino","player-chino","player-chino"],"assisters":[],"mvp":"player-chino","comment":""},
  {"id":"match-2025-05-25","date":"2025-05-25","venue":"Brown","teamA":["player-conil-nahuel","player-chesani-luciano","player-pereyra-gabriel","player-chemes-tomas"],"teamB":["player-delpiano-carlos","player-boichuk-franco","player-panozzo-emiliano","player-zapana-daniel","player-chino","player-cardozo-manuel"],"scoreA":1,"scoreB":0,"scorers":["player-chesani-luciano","player-boichuk-franco","player-chino","player-chino","player-chino","player-chino","player-pereyra-gabriel","player-pereyra-gabriel"],"assisters":[],"mvp":"player-chino","comment":""},
  {"id":"match-2025-06-01","date":"2025-06-01","venue":"Brown","teamA":[],"teamB":[],"scoreA":0,"scoreB":0,"scorers":["player-chemes-tomas","player-chemes-tomas","player-boichuk-franco","player-romero-lucas","player-romero-lucas","player-romero-lucas","player-pereyra-gabriel","player-pereyra-gabriel","player-pereyra-gabriel","player-pereyra-gabriel"],"assisters":[],"mvp":"","comment":""},
  {"id":"match-2025-06-15","date":"2025-06-15","venue":"Brown","teamA":["player-martinez-alejandro","player-schneider-agustin","player-zapana-daniel","player-chemes-tomas","player-chino"],"teamB":["player-chesani-luciano","player-memler-sebastian","player-delpiano-carlos","player-conil-nahuel","player-pereyra-gabriel","player-cardozo-manuel"],"scoreA":1,"scoreB":0,"scorers":["player-chemes-tomas","player-cardozo-manuel","player-schneider-agustin","player-chino","player-chino","player-pereyra-gabriel"],"assisters":[],"mvp":"","comment":""},
  {"id":"match-2025-06-29","date":"2025-06-29","venue":"Brown","teamA":["player-schneider-agustin","player-conil-nahuel","player-pereyra-gabriel","player-boichuk-franco","player-delpiano-carlos"],"teamB":["player-chesani-luciano","player-memler-sebastian","player-cortez-joaquin","player-panozzo-emiliano","player-zapana-daniel","player-chino","player-cardozo-manuel"],"scoreA":1,"scoreB":0,"scorers":["player-panozzo-emiliano","player-cortez-joaquin","player-cortez-joaquin","player-cortez-joaquin","player-schneider-agustin","player-schneider-agustin","player-schneider-agustin","player-schneider-agustin","player-schneider-agustin","player-chino","player-chino","player-chino","player-pereyra-gabriel","player-pereyra-gabriel","player-pereyra-gabriel"],"assisters":[],"mvp":"player-schneider-agustin","comment":""},
  {"id":"match-2025-07-06","date":"2025-07-06","venue":"Brown","teamA":[],"teamB":["player-rodri","player-geslao-gaston","player-panozzo-emiliano","player-memler-sebastian","player-schneider-agustin","player-conil-nahuel","player-cardozo-manuel","player-cortez-joaquin","player-pereyra-gabriel","player-romero-lucas","player-perez-lezcano-nahuel","player-zapana-daniel","player-chemes-tomas","player-chino","player-perez-lezcano-francisco"],"scoreA":0,"scoreB":0,"scorers":["player-chemes-tomas","player-cardozo-manuel","player-panozzo-emiliano","player-panozzo-emiliano","player-romero-lucas","player-romero-lucas","player-romero-lucas","player-perez-lezcano-francisco","player-schneider-agustin","player-chino","player-pereyra-gabriel"],"assisters":[],"mvp":"player-geslao-gaston","comment":""},
  {"id":"match-2025-07-13","date":"2025-07-13","venue":"Brown","teamA":["player-memler-sebastian","player-schneider-agustin","player-cardozo-manuel","player-romero-lucas","player-zapana-daniel","player-delpiano-carlos","player-chino"],"teamB":["player-bustos-franco","player-chesani-luciano","player-chemes-tomas","player-cortez-joaquin","player-boichuk-franco","player-conil-nahuel","player-pereyra-gabriel"],"scoreA":1,"scoreB":0,"scorers":["player-memler-sebastian","player-memler-sebastian","player-chesani-luciano","player-chesani-luciano","player-chemes-tomas","player-cardozo-manuel","player-cardozo-manuel","player-romero-lucas","player-romero-lucas","player-cortez-joaquin","player-cortez-joaquin","player-schneider-agustin"],"assisters":[],"mvp":"player-memler-sebastian","comment":""},
  {"id":"match-2025-07-20","date":"2025-07-20","venue":"Brown","teamA":["player-geslao-gaston","player-memler-sebastian","player-cardozo-manuel","player-pereyra-gabriel","player-romero-lucas","player-perez-lezcano-nahuel","player-delpiano-carlos"],"teamB":["player-bustos-franco","player-martinez-alejandro","player-chesani-luciano","player-perez-lezcano-francisco","player-cortez-joaquin","player-panozzo-emiliano","player-zapana-daniel","player-chino"],"scoreA":1,"scoreB":0,"scorers":["player-martinez-alejandro","player-chesani-luciano","player-chesani-luciano","player-cardozo-manuel","player-perez-lezcano-francisco","player-perez-lezcano-francisco","player-perez-lezcano-francisco","player-chino","player-chino","player-pereyra-gabriel","player-pereyra-gabriel","player-pereyra-gabriel","player-pereyra-gabriel"],"assisters":[],"mvp":"player-romero-lucas","comment":""}
];
const importedMatches2025Clausura = [
  {"id":"match-2025-08-03","date":"2025-08-03","venue":"Brown","teamA":["player-pereyra-gabriel","player-geslao-gaston","player-conil-nahuel","player-schneider-agustin","player-boichuk-franco","player-cortez-joaquin","player-memler-sebastian"],"teamB":["player-delpiano-carlos","player-romero-lucas","player-panozzo-emiliano","player-chino","player-cardozo-manuel","player-zapana-daniel","player-chesani-luciano"],"scoreA":1,"scoreB":0,"scorers":["player-delpiano-carlos","player-panozzo-emiliano","player-memler-sebastian","player-memler-sebastian","player-schneider-agustin","player-schneider-agustin","player-romero-lucas","player-romero-lucas","player-romero-lucas","player-romero-lucas","player-cortez-joaquin","player-cortez-joaquin","player-chesani-luciano","player-chesani-luciano","player-pereyra-gabriel","player-pereyra-gabriel","player-pereyra-gabriel","player-pereyra-gabriel"],"assisters":[],"mvp":"player-conil-nahuel","comment":""},
  {"id":"match-2025-08-10","date":"2025-08-10","venue":"Brown","teamA":[],"teamB":["player-kumagae-adriel","player-chino","player-zapana-daniel","player-pereyra-gabriel","player-delpiano-carlos","player-geslao-gaston","player-conil-nahuel","player-romero-lucas","player-boichuk-franco","player-cortez-joaquin","player-bustos-franco","player-chesani-luciano","player-memler-sebastian"],"scoreA":0,"scoreB":0,"scorers":["player-boichuk-franco","player-memler-sebastian","player-bustos-franco","player-chino","player-chino","player-chino","player-cortez-joaquin","player-chesani-luciano","player-chesani-luciano"],"assisters":[],"mvp":"player-kumagae-adriel","comment":""},
  {"id":"match-2025-08-17","date":"2025-08-17","venue":"Brown","teamA":["player-geslao-gaston","player-yavorski-javier","player-conil-nahuel","player-romero-lucas","player-boichuk-franco","player-bustos-franco","player-chesani-luciano"],"teamB":["player-delpiano-carlos","player-perez-lezcano-francisco","player-panozzo-emiliano","player-chino","player-pereyra-gabriel","player-cardozo-manuel","player-memler-sebastian","player-zapana-daniel"],"scoreA":1,"scoreB":0,"scorers":["player-cardozo-manuel","player-perez-lezcano-francisco","player-perez-lezcano-francisco","player-chino","player-pereyra-gabriel","player-yavorski-javier","player-yavorski-javier","player-yavorski-javier","player-yavorski-javier","player-yavorski-javier","player-yavorski-javier","player-yavorski-javier"],"assisters":[],"mvp":"player-yavorski-javier","comment":""},
  {"id":"match-2025-08-24","date":"2025-08-24","venue":"Brown","teamA":["player-delpiano-carlos","player-martinez-alejandro","player-schneider-agustin","player-boichuk-franco","player-cortez-joaquin","player-memler-sebastian"],"teamB":["player-sena-ian","player-yavorski-javier","player-cardozo-manuel","player-bustos-franco","player-zapana-daniel","player-chesani-luciano"],"scoreA":1,"scoreB":0,"scorers":["player-schneider-agustin","player-schneider-agustin","player-schneider-agustin","player-yavorski-javier"],"assisters":[],"mvp":"player-boichuk-franco","comment":""},
  {"id":"match-2025-09-14","date":"2025-09-14","venue":"Brown","teamA":["player-delpiano-carlos","player-romero-lucas","player-schneider-agustin","player-cortez-joaquin","player-bustos-franco"],"teamB":["player-martinez-alejandro","player-panozzo-emiliano","player-chino","player-pereyra-gabriel","player-chesani-luciano"],"scoreA":1,"scoreB":0,"scorers":["player-panozzo-emiliano","player-schneider-agustin","player-chesani-luciano"],"assisters":[],"mvp":"player-chesani-luciano","comment":""},
  {"id":"match-2025-09-28","date":"2025-09-28","venue":"Brown","teamA":[],"teamB":["player-rodri","player-sena-ian","player-cardozo-manuel","player-perez-lezcano-francisco","player-zapana-daniel","player-yavorski-javier","player-conil-nahuel","player-schneider-agustin","player-boichuk-franco","player-bustos-franco","player-memler-sebastian","player-chesani-luciano"],"scoreA":0,"scoreB":0,"scorers":["player-sena-ian","player-cardozo-manuel","player-schneider-agustin","player-schneider-agustin","player-bustos-franco","player-bustos-franco","player-bustos-franco","player-bustos-franco","player-perez-lezcano-francisco","player-perez-lezcano-francisco","player-yavorski-javier","player-yavorski-javier","player-yavorski-javier"],"assisters":[],"mvp":"player-bustos-franco","comment":""},
  {"id":"match-2025-10-05","date":"2025-10-05","venue":"Brown","teamA":["player-chino","player-panozzo-emiliano","player-martinez-alejandro","player-boichuk-franco","player-cortez-joaquin","player-chesani-luciano","player-memler-sebastian"],"teamB":["player-perez-lezcano-francisco","player-schneider-agustin","player-cardozo-manuel","player-zapana-daniel"],"scoreA":1,"scoreB":0,"scorers":["player-panozzo-emiliano","player-perez-lezcano-francisco","player-chino","player-chino","player-cortez-joaquin","player-cortez-joaquin","player-cortez-joaquin","player-cortez-joaquin"],"assisters":[],"mvp":"player-cortez-joaquin","comment":""},
  {"id":"match-2025-10-12","date":"2025-10-12","venue":"Brown","teamA":["player-cardozo-manuel","player-perez-lezcano-francisco","player-conil-nahuel","player-romero-lucas","player-bustos-franco","player-chesani-luciano","player-memler-sebastian"],"teamB":["player-schneider-agustin","player-chino","player-pereyra-gabriel","player-cortez-joaquin","player-zapana-daniel"],"scoreA":1,"scoreB":0,"scorers":["player-memler-sebastian","player-memler-sebastian","player-bustos-franco","player-romero-lucas","player-romero-lucas","player-perez-lezcano-francisco","player-perez-lezcano-francisco","player-chino","player-cortez-joaquin","player-cortez-joaquin","player-chesani-luciano","player-chesani-luciano","player-pereyra-gabriel"],"assisters":[],"mvp":"player-chesani-luciano","comment":""},
  {"id":"match-2025-10-19","date":"2025-10-19","venue":"Brown","teamA":["player-zapana-daniel","player-panozzo-emiliano","player-yavorski-javier","player-schneider-agustin","player-bustos-franco","player-chesani-luciano","player-memler-sebastian"],"teamB":["player-geslao-gaston","player-romero-lucas","player-perez-lezcano-francisco","player-pereyra-gabriel","player-cortez-joaquin"],"scoreA":1,"scoreB":0,"scorers":["player-memler-sebastian","player-memler-sebastian","player-bustos-franco","player-romero-lucas","player-romero-lucas","player-perez-lezcano-francisco","player-perez-lezcano-francisco","player-chino","player-cortez-joaquin","player-cortez-joaquin","player-chesani-luciano","player-chesani-luciano","player-pereyra-gabriel"],"assisters":[],"mvp":"player-perez-lezcano-francisco","comment":""},
  {"id":"match-2025-11-02","date":"2025-11-02","venue":"Brown","teamA":[],"teamB":["player-cardozo-manuel","player-perez-lezcano-francisco","player-chino","player-zapana-daniel","player-pereyra-gabriel","player-panozzo-emiliano","player-martinez-alejandro","player-yavorski-javier","player-conil-nahuel","player-boichuk-franco","player-cortez-joaquin","player-chesani-luciano","player-memler-sebastian"],"scoreA":0,"scoreB":0,"scorers":["player-martinez-alejandro","player-boichuk-franco","player-cardozo-manuel","player-panozzo-emiliano","player-panozzo-emiliano","player-panozzo-emiliano","player-panozzo-emiliano","player-memler-sebastian","player-perez-lezcano-francisco","player-perez-lezcano-francisco","player-chino","player-chino","player-pereyra-gabriel","player-pereyra-gabriel","player-pereyra-gabriel","player-yavorski-javier","player-yavorski-javier","player-yavorski-javier","player-yavorski-javier"],"assisters":[],"mvp":"player-panozzo-emiliano","comment":""},
  {"id":"match-2025-11-23","date":"2025-11-23","venue":"Brown","teamA":["player-sena-ian","player-zapana-daniel","player-pereyra-gabriel","player-yavorski-javier","player-bustos-franco","player-chesani-luciano"],"teamB":["player-perez-lezcano-francisco","player-panozzo-emiliano","player-cardozo-manuel","player-boichuk-franco","player-cortez-joaquin","player-memler-sebastian"],"scoreA":1,"scoreB":0,"scorers":["player-sena-ian","player-sena-ian","player-boichuk-franco","player-bustos-franco","player-cortez-joaquin","player-chesani-luciano","player-chesani-luciano","player-pereyra-gabriel","player-pereyra-gabriel","player-pereyra-gabriel","player-pereyra-gabriel"],"assisters":[],"mvp":"player-chesani-luciano","comment":""},
  {"id":"match-2025-11-30","date":"2025-11-30","venue":"Brown","teamA":[],"teamB":["player-cabrera-gonzalo","player-chemes-tomas","player-cardozo-manuel","player-chino","player-zapana-daniel","player-pereyra-gabriel","player-panozzo-emiliano","player-yavorski-javier","player-romero-lucas","player-boichuk-franco","player-cortez-joaquin","player-bustos-franco","player-chesani-luciano"],"scoreA":0,"scoreB":0,"scorers":["player-cabrera-gonzalo","player-cabrera-gonzalo","player-boichuk-franco","player-boichuk-franco","player-cardozo-manuel","player-cardozo-manuel","player-cardozo-manuel","player-bustos-franco","player-romero-lucas","player-romero-lucas","player-romero-lucas","player-chino","player-chino","player-chesani-luciano","player-chesani-luciano","player-chesani-luciano","player-pereyra-gabriel","player-pereyra-gabriel","player-yavorski-javier","player-yavorski-javier","player-yavorski-javier"],"assisters":[],"mvp":"player-chesani-luciano","comment":""}
];
const importedMatches = [
  ...importedMatches2025,
  ...importedMatches2025Clausura,
  {"id":"match-2026-03-01","date":"2026-03-01","venue":"Brown","teamA":["player-cardozo-manuel","player-chesani-luciano","player-geslao-gaston","player-jp","player-memler-sebastian","player-pereyra-gabriel","player-romero-lucas"],"teamB":["player-bustos-franco","player-conil-nahuel","player-cortez-joaquin","player-delpiano-carlos","player-duarte-lucas","player-panozzo-emiliano"],"scoreA":7,"scoreB":5,"scorers":["player-bustos-franco","player-cardozo-manuel","player-chesani-luciano","player-chesani-luciano","player-cortez-joaquin","player-cortez-joaquin","player-duarte-lucas","player-duarte-lucas","player-jp","player-jp","player-jp","player-memler-sebastian"],"assisters":[],"mvp":"player-jp","comment":""},
  {"id":"match-2026-03-08","date":"2026-03-08","venue":"Brown","teamA":["player-conil-nahuel","player-cortez-joaquin","player-delpiano-carlos","player-jp","player-panozzo-emiliano"],"teamB":["player-cardozo-manuel","player-martinez-alejandro","player-memler-sebastian","player-pereyra-gabriel","player-perez-lezcano-francisco"],"scoreA":6,"scoreB":1,"scorers":["player-cortez-joaquin","player-cortez-joaquin","player-delpiano-carlos","player-jp","player-jp","player-jp","player-perez-lezcano-francisco"],"assisters":[],"mvp":"player-panozzo-emiliano","comment":""},
  {"id":"match-2026-03-15","date":"2026-03-15","venue":"Brown","teamA":["player-bustos-franco","player-cardozo-manuel","player-chemes-tomas","player-chesani-luciano","player-geslao-gaston","player-memler-sebastian","player-romero-lucas"],"teamB":["player-chino","player-cortez-joaquin","player-delpiano-carlos","player-jp","player-panozzo-emiliano"],"scoreA":7,"scoreB":4,"scorers":["player-bustos-franco","player-chemes-tomas","player-chesani-luciano","player-chino","player-jp","player-jp","player-memler-sebastian","player-memler-sebastian","player-memler-sebastian","player-panozzo-emiliano","player-romero-lucas"],"assisters":[],"mvp":"player-chemes-tomas","comment":""},
  {"id":"match-2026-03-22","date":"2026-03-22","venue":"Brown","teamA":["player-chesani-luciano","player-cortez-joaquin","player-geslao-gaston","player-memler-sebastian","player-rodri","player-romero-lucas","player-yavorski-javier"],"teamB":["player-cardozo-manuel","player-chino","player-conil-nahuel","player-jp","player-martinez-alejandro","player-panozzo-emiliano","player-schneider-agustin"],"scoreA":8,"scoreB":7,"scorers":["player-chino","player-chino","player-chino","player-chino","player-cortez-joaquin","player-jp","player-martinez-alejandro","player-memler-sebastian","player-memler-sebastian","player-panozzo-emiliano","player-romero-lucas","player-romero-lucas","player-romero-lucas","player-yavorski-javier","player-yavorski-javier"],"assisters":[],"mvp":"player-yavorski-javier","comment":""},
  {"id":"match-2026-03-29","date":"2026-03-29","venue":"Brown","teamA":["player-bustos-franco","player-chesani-luciano","player-conil-nahuel","player-memler-sebastian","player-pereyra-gabriel","player-rodri","player-schneider-agustin"],"teamB":["player-cardozo-manuel","player-chino","player-cortez-joaquin","player-delpiano-carlos","player-geslao-gaston","player-martinez-alejandro","player-yavorski-javier"],"scoreA":9,"scoreB":6,"scorers":["player-chesani-luciano","player-chino","player-chino","player-chino","player-cortez-joaquin","player-memler-sebastian","player-memler-sebastian","player-memler-sebastian","player-pereyra-gabriel","player-pereyra-gabriel","player-schneider-agustin","player-schneider-agustin","player-schneider-agustin","player-yavorski-javier","player-yavorski-javier"],"assisters":[],"mvp":"player-conil-nahuel","comment":""},
  {"id":"match-2026-04-05","date":"2026-04-05","venue":"Brown","teamA":["player-cardozo-manuel","player-panozzo-emiliano","player-pereyra-gabriel","player-schneider-agustin"],"teamB":["player-chino","player-cortez-joaquin","player-rodri"],"scoreA":6,"scoreB":2,"scorers":["player-cardozo-manuel","player-chino","player-cortez-joaquin","player-pereyra-gabriel","player-pereyra-gabriel","player-schneider-agustin","player-schneider-agustin","player-schneider-agustin"],"assisters":[],"mvp":"","comment":""},
  {"id":"match-2026-04-19","date":"2026-04-19","venue":"Brown","teamA":["player-bustos-franco","player-cardozo-manuel","player-chesani-luciano","player-chino","player-conil-nahuel","player-cortez-joaquin","player-memler-sebastian"],"teamB":["player-fernandez-harry-guillermo","player-martinez-alejandro","player-panozzo-emiliano","player-pereyra-gabriel","player-rodri","player-romero-lucas","player-yavorski-javier"],"scoreA":8,"scoreB":7,"scorers":["player-bustos-franco","player-bustos-franco","player-cardozo-manuel","player-chesani-luciano","player-chino","player-chino","player-chino","player-memler-sebastian","player-panozzo-emiliano","player-panozzo-emiliano","player-pereyra-gabriel","player-pereyra-gabriel","player-yavorski-javier","player-yavorski-javier","player-yavorski-javier"],"assisters":[],"mvp":"player-chino","comment":""},
  {"id":"match-2026-04-26","date":"2026-04-26","venue":"Brown","teamA":["player-bustos-franco","player-cardozo-manuel","player-cortez-joaquin","player-fernandez-harry-guillermo","player-geslao-gaston","player-pereyra-gabriel","player-perez-lezcano-francisco","player-romero-lucas","player-yavorski-javier"],"teamB":["player-boichuk-franco","player-cabrera-gabriel","player-chesani-luciano","player-chino","player-conil-nahuel","player-martinez-alejandro","player-memler-sebastian","player-panozzo-emiliano","player-schneider-agustin"],"scoreA":5,"scoreB":4,"scorers":["player-bustos-franco","player-cabrera-gabriel","player-panozzo-emiliano","player-perez-lezcano-francisco","player-schneider-agustin","player-schneider-agustin","player-yavorski-javier","player-yavorski-javier","player-yavorski-javier"],"assisters":[],"mvp":"player-yavorski-javier","comment":""},
  {"id":"match-2026-05-03","date":"2026-05-03","venue":"Brown","teamA":[],"teamB":["player-boichuk-franco","player-bustos-franco","player-cardozo-manuel","player-chino","player-conil-nahuel","player-fernandez-harry-guillermo","player-geslao-gaston","player-jp","player-memler-sebastian","player-panozzo-emiliano","player-pereyra-gabriel","player-perez-lezcano-francisco","player-schneider-agustin","player-yavorski-javier"],"scoreA":6,"scoreB":6,"scorers":["player-chino","player-jp","player-memler-sebastian","player-pereyra-gabriel","player-perez-lezcano-francisco","player-perez-lezcano-francisco","player-schneider-agustin","player-schneider-agustin","player-schneider-agustin","player-schneider-agustin","player-yavorski-javier","player-yavorski-javier"],"assisters":[],"mvp":"player-schneider-agustin","comment":""},
  {"id":"match-2026-05-17","date":"2026-05-17","venue":"Brown","teamA":["player-cabrera-gabriel","player-cardozo-manuel","player-chesani-luciano","player-memler-sebastian","player-romero-lucas","player-schneider-agustin"],"teamB":["player-boichuk-franco","player-chino","player-geslao-gaston","player-martinez-alejandro","player-pereyra-gabriel"],"scoreA":8,"scoreB":2,"scorers":["player-cabrera-gabriel","player-cardozo-manuel","player-cardozo-manuel","player-chino","player-memler-sebastian","player-pereyra-gabriel","player-romero-lucas","player-romero-lucas","player-schneider-agustin","player-schneider-agustin"],"assisters":[],"mvp":"player-memler-sebastian","comment":""},
  {"id":"match-2026-05-24","date":"2026-05-24","venue":"Brown","teamA":["player-bustos-franco","player-chesani-luciano","player-delpiano-carlos","player-martinez-alejandro","player-memler-sebastian","player-pereyra-gabriel"],"teamB":["player-cardozo-manuel","player-fernandez-harry-guillermo","player-yavorski-javier"],"scoreA":10,"scoreB":3,"scorers":["player-bustos-franco","player-bustos-franco","player-bustos-franco","player-bustos-franco","player-chesani-luciano","player-chesani-luciano","player-chesani-luciano","player-delpiano-carlos","player-martinez-alejandro","player-martinez-alejandro","player-yavorski-javier","player-yavorski-javier","player-yavorski-javier"],"assisters":[],"mvp":"player-chesani-luciano","comment":""}
];

const positionRatings = {
  goalkeeper: {
    label: "Arquero",
    legacy: "Arquero",
    statLabels: { pace: "Estirada", shooting: "Reflejos", passing: "Saque", dribbling: "Mano", defense: "Posicionamiento", physical: "Achique" },
    weights: { pace: 0.15, shooting: 0.30, passing: 0.05, dribbling: 0.13, defense: 0.20, physical: 0.18 }
  },
  defense: {
    label: "Defensa",
    legacy: "Defensor",
    statLabels: { pace: "Ritmo", shooting: "Tiro", passing: "Pase", dribbling: "Regate", defense: "Defensa", physical: "Fisico" },
    weights: { pace: 0.10, shooting: 0.03, passing: 0.10, dribbling: 0.07, defense: 0.45, physical: 0.25 }
  },
  fullback: {
    label: "Defensa / lateral",
    legacy: "Defensor",
    statLabels: { pace: "Ritmo", shooting: "Tiro", passing: "Pase", dribbling: "Regate", defense: "Defensa", physical: "Fisico" },
    weights: { pace: 0.25, shooting: 0.03, passing: 0.15, dribbling: 0.12, defense: 0.30, physical: 0.15 }
  },
  midfielder: {
    label: "Mediocampista",
    legacy: "Mediocampista",
    statLabels: { pace: "Ritmo", shooting: "Tiro", passing: "Pase", dribbling: "Regate", defense: "Defensa", physical: "Fisico" },
    weights: { pace: 0.12, shooting: 0.12, passing: 0.32, dribbling: 0.22, defense: 0.10, physical: 0.12 }
  },
  forward: {
    label: "Delantero",
    legacy: "Delantero",
    statLabels: { pace: "Ritmo", shooting: "Tiro", passing: "Pase", dribbling: "Regate", defense: "Defensa", physical: "Fisico" },
    weights: { pace: 0.18, shooting: 0.38, passing: 0.10, dribbling: 0.17, defense: 0.02, physical: 0.15 }
  },
  winger: {
    label: "Delantero / extremo",
    legacy: "Delantero",
    statLabels: { pace: "Ritmo", shooting: "Tiro", passing: "Pase", dribbling: "Regate", defense: "Defensa", physical: "Fisico" },
    weights: { pace: 0.30, shooting: 0.22, passing: 0.12, dribbling: 0.28, defense: 0.02, physical: 0.06 }
  }
};

let state = loadState();
let pendingDraw = null;
let calendarYear = new Date().getFullYear();
let selectedCalendarDate = null;
let selectedRankingYear = String(new Date().getFullYear());
let selectedPairsSeason = String(new Date().getFullYear());
let selectedPlayerPairSeason = String(new Date().getFullYear());
let selectedRivalrySeason = String(new Date().getFullYear());
let selectedAwardsSeason = String(new Date().getFullYear());
let playerGalleryTimer = null;
let playerGalleryIndex = 0;
let pendingGalleryPlayerId = "";
const surveyStats = [
  ["overall", "Media"],
  ["pace", "Ritmo"],
  ["shooting", "Tiro"],
  ["passing", "Pase"],
  ["dribbling", "Regate"],
  ["defense", "Defensa"],
  ["physical", "Fisico"]
];

const $ = (id) => document.getElementById(id);
const avg = (nums) => Math.round(nums.reduce((a, b) => a + Number(b), 0) / nums.length);
const pct = (wins, played) => played ? Math.round((wins / played) * 100) : 0;
const byId = (id) => state.players.find((p) => p.id === id);
const today = () => new Date().toISOString().slice(0, 10);

function loadState() {
  const saved = localStorage.getItem(storageKey);
  const loaded = saved ? JSON.parse(saved) : { players: [], matches: [] };
  if (!loaded.players.length) loaded.players = defaultRoster();
  return withImportedData(loaded);
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function setupSupabase() {
  if (!window.supabase) {
    updateCloudStatus("Sin conexión Supabase");
    return;
  }
  supabaseClient = window.supabase.createClient(supabaseConfig.url, supabaseConfig.key);
  supabaseClient.auth.getSession().then(({ data }) => {
    currentUser = data.session?.user || null;
    updateCloudStatus();
  });
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user || null;
    updateCloudStatus();
  });
}

function updateCloudStatus(message) {
  if (message) {
    $("auth-status").textContent = message;
    updateAdminVisibility();
    return;
  }
  $("auth-status").textContent = currentUser ? `Admin: ${currentUser.email}` : "Modo público";
  $("login-open").classList.toggle("hidden", Boolean(currentUser));
  $("logout-button").classList.toggle("hidden", !currentUser);
  $("cloud-save").disabled = !currentUser;
  updateAdminVisibility();
}

function isAdmin() {
  return Boolean(currentUser);
}

function updateAdminVisibility() {
  document.querySelectorAll("[data-admin-only]").forEach((element) => {
    element.toggleAttribute("hidden", !isAdmin());
  });
  if (!isAdmin()) {
    $("player-form")?.classList.add("hidden");
    $("match-form")?.classList.add("hidden");
    $("save-draw")?.classList.add("hidden");
  }
}

function requireAdmin() {
  if (isAdmin()) return true;
  alert("Tenes que ingresar como admin para editar datos.");
  return false;
}

async function loadFromCloud({ quiet = false } = {}) {
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient
    .from("app_state")
    .select("data")
    .eq("id", "main")
    .maybeSingle();
  if (error) {
    if (!quiet) alert("No pude cargar datos desde Supabase. Revisá que hayas creado la tabla app_state.");
    return;
  }
  if (!data?.data?.players || !data?.data?.matches) return;
  try {
    state = withImportedData(data.data);
    renderAll();
  } catch (e) {
    console.error("Error procesando datos de la nube:", e);
    if (!quiet) alert("Error al procesar datos de la nube. Usando datos locales.");
    return;
  }
  if (!quiet) alert("Datos cargados desde la nube.");
}

async function saveToCloud({ quiet = false } = {}) {
  if (!supabaseClient || !currentUser) {
    if (!quiet) alert("Primero tenés que ingresar como admin.");
    return;
  }
  const { error } = await supabaseClient
    .from("app_state")
    .upsert({ id: "main", data: state, updated_at: new Date().toISOString() });
  if (error) {
    if (!quiet) alert("No pude guardar en Supabase. Revisá permisos/RLS de app_state.");
    else updateCloudStatus("No pude autoguardar en la nube");
    return;
  }
  if (!quiet) alert("Datos guardados en la nube.");
  else updateCloudStatus("Cambios guardados en la nube");
}

async function loginAdmin(email, password) {
  if (!supabaseClient) {
    $("login-message").textContent = "Supabase no está disponible.";
    return;
  }
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    $("login-message").textContent = "No pude ingresar. Revisá email y contraseña.";
    return;
  }
  $("login-message").textContent = "";
  closeLoginModal();
}

async function logoutAdmin() {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
}

function exportData() {
  const payload = {
    app: "Movimiento Balon",
    version: dataVersion,
    exportedAt: new Date().toISOString(),
    state
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `movimiento-balon-backup-${today()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const importedState = parsed.state || parsed;
      if (!Array.isArray(importedState.players) || !Array.isArray(importedState.matches)) {
        throw new Error("Formato invalido");
      }
      state = withImportedData(importedState);
      renderAll();
      alert("Datos importados correctamente.");
    } catch (error) {
      alert("No pude importar ese archivo. Revisá que sea un backup JSON de Movimiento Balon.");
    }
  };
  reader.readAsText(file);
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function rosterId(name) {
  return `player-${name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

function displayPlayerName(name) {
  return name.replace(/,\s*/g, " ").replace(/\s+/g, " ").trim();
}

function normalizePlayerId(id) {
  return playerIdAliases[id] || id;
}

function cleanPlayerIds(ids) {
  return ids.map(normalizePlayerId).filter((id) => !removedPlayerIds.has(id));
}

function normalizeGalleryList(value) {
  if (Array.isArray(value)) return value.map((src) => String(src).trim()).filter(Boolean);
  if (typeof value === "string") return value.split(/\n|;/).map((src) => src.trim()).filter(Boolean);
  return [];
}

function normalizePlayerPosition(value, fallback = "midfielder") {
  if (positionRatings[value]) return value;
  if (!value) return positionRatings[fallback] ? fallback : "";
  const normalized = String(value || "").toLowerCase();
  if (normalized.includes("arquero")) return "goalkeeper";
  if (normalized.includes("lateral")) return "fullback";
  if (normalized.includes("def")) return "defense";
  if (normalized.includes("medio") || normalized.includes("volante")) return "midfielder";
  if (normalized.includes("extremo")) return "winger";
  if (normalized.includes("del")) return "forward";
  if (positionRatings[fallback]) return fallback;
  return "midfielder";
}

function playerPositions(player) {
  if (goalkeeperIds.includes(player.id) || player.position === "Arquero") return ["goalkeeper"];
  const primary = normalizePlayerPosition(player.positionPrimary || player.position, "midfielder");
  if (primary === "goalkeeper") return ["goalkeeper"];
  const secondary = normalizePlayerPosition(player.positionSecondary || "", "");
  return [primary, secondary].filter((position, index, positions) => position && position !== "goalkeeper" && positions.indexOf(position) === index).slice(0, 2);
}

function positionLabel(value) {
  return positionRatings[value]?.label || "Mediocampista";
}

function primaryLegacyPosition(player) {
  if (goalkeeperIds.includes(player.id) || player.position === "Arquero") return "Arquero";
  const primary = playerPositions(player)[0];
  return positionRatings[primary]?.legacy || "Mediocampista";
}

function suggestedRatingForPosition(player, position) {
  const weights = positionRatings[position]?.weights;
  if (!weights) return rating(player);
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0) || 1;
  return Math.round((
    Number(player.pace || 0) * weights.pace +
    Number(player.shooting || 0) * weights.shooting +
    Number(player.passing || 0) * weights.passing +
    Number(player.dribbling || 0) * weights.dribbling +
    Number(player.defense || 0) * weights.defense +
    Number(player.physical || 0) * weights.physical
  ) / totalWeight);
}

function suggestedPlayerRating(player) {
  const positions = playerPositions(player);
  if (!positions.length) return rating(player);
  return Math.max(...positions.map((position) => suggestedRatingForPosition(player, position)));
}

function playerPositionSummary(player) {
  return playerPositions(player).map(positionLabel).join(" | ");
}

function defaultRoster() {
  return rosterNames.map((name) => {
    const id = rosterId(name);
    return {
    id,
    nickname: playerNameOverrides[id] || displayPlayerName(name),
    position: goalkeeperIds.includes(id) ? "Arquero" : "Jugador",
    positionPrimary: goalkeeperIds.includes(id) ? "goalkeeper" : "midfielder",
    positionSecondary: "",
    foot: "Derecha",
    photo: playerPhotoMap[id] || "",
    gallery: [],
    cardStyle: "normal",
    pace: 70,
    shooting: 70,
    passing: 70,
    dribbling: 70,
    defense: 70,
    physical: 70,
    ...(playerAttributeOverrides[id] || {})
  };
  });
}

function restoreRoster() {
  const existing = new Set(state.players.map((p) => p.nickname.toLowerCase()));
  const missing = defaultRoster().filter((p) => !existing.has(p.nickname.toLowerCase()));
  state.players.push(...missing);
  renderAll();
}

function withImportedData(loaded) {
  const normalizedPlayers = new Map();
  loaded.players.forEach((player) => {
    player.id = normalizePlayerId(player.id);
    if (!removedPlayerIds.has(player.id) && !normalizedPlayers.has(player.id)) normalizedPlayers.set(player.id, player);
  });
  loaded.players = [...normalizedPlayers.values()];
  const existingPlayers = new Set(loaded.players.map((p) => p.id));
  const basePlayers = Object.fromEntries(defaultRoster().map((player) => [player.id, player]));
  defaultRoster().forEach((player) => {
    if (!existingPlayers.has(player.id)) loaded.players.push(player);
  });
  loaded.players.forEach((player) => {
    const basePlayer = basePlayers[player.id];
    player.nickname = displayPlayerName(player.nickname);
    if (playerNameOverrides[player.id]) player.nickname = playerNameOverrides[player.id];
    if (playerPhotoMap[player.id] || (!player.photo && basePlayer?.photo)) player.photo = playerPhotoMap[player.id] || basePlayer.photo;
    if (playerPhotoFocusMap[player.id]) player.photoFocus = playerPhotoFocusMap[player.id];
    if (!["normal", "legend"].includes(player.cardStyle)) player.cardStyle = "normal";
    player.gallery = normalizeGalleryList(player.gallery);
    if (player.position === "Comodin") player.position = "Jugador";
    if (goalkeeperIds.includes(player.id)) {
      player.position = "Arquero";
      player.positionPrimary = "goalkeeper";
      player.positionSecondary = "";
    } else {
      player.positionPrimary = normalizePlayerPosition(player.positionPrimary || player.position, basePlayer?.positionPrimary || "midfielder");
      player.positionSecondary = player.positionSecondary ? normalizePlayerPosition(player.positionSecondary, "") : "";
      player.position = primaryLegacyPosition(player);
    }
    ["overall", "pace", "shooting", "passing", "dribbling", "defense", "physical"].forEach((key) => {
      if ((player[key] === undefined || player[key] === "") && basePlayer?.[key] !== undefined) player[key] = basePlayer[key];
    });
  });
  if (!loaded.galleryUploads) loaded.galleryUploads = [];
  const existingMatches = new Set(loaded.matches.map((match) => match.id));
  importedMatches.forEach((match) => {
    if (!existingMatches.has(match.id)) loaded.matches.push({ ...match, comment: "", assisters: [] });
  });
  loaded.matches.forEach((match) => {
    if (match.comment && match.comment.startsWith("Migrado desde")) match.comment = "";
    match.teamA = cleanPlayerIds(match.teamA || []);
    match.teamB = cleanPlayerIds(match.teamB || []);
    match.scorers = cleanPlayerIds(match.scorers || []);
    match.mvp = removedPlayerIds.has(normalizePlayerId(match.mvp)) ? "" : normalizePlayerId(match.mvp || "");
    match.goalOfMatch = removedPlayerIds.has(normalizePlayerId(match.goalOfMatch)) ? "" : normalizePlayerId(match.goalOfMatch || "");
    match.assisters = [];
  });
  return loaded;
}

function initials(name) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function rating(player) {
  if (player.overall) return player.overall;
  return avg([player.pace, player.shooting, player.passing, player.dribbling, player.defense, player.physical]);
}

function playerStats(matches = state.matches) {
  const stats = Object.fromEntries(state.players.map((p) => [p.id, {
    played: 0, wins: 0, draws: 0, losses: 0, goals: 0, mvp: 0, golDelPartido: 0, points: 0,
    streak: "Sin partidos", last: []
  }]));

  [...matches].sort((a, b) => a.date.localeCompare(b.date)).forEach((match) => {
    const aWon = match.scoreA > match.scoreB;
    const bWon = match.scoreB > match.scoreA;
    const draw = match.scoreA === match.scoreB;
    const apply = (id, team) => {
      if (!stats[id]) return;
      const won = draw ? false : (team === "A" ? aWon : bWon);
      const lost = draw ? false : !won;
      stats[id].played += 1;
      stats[id].wins += won ? 1 : 0;
      stats[id].draws += draw ? 1 : 0;
      stats[id].losses += lost ? 1 : 0;
      stats[id].points += won ? 3 : draw ? 1 : 0;
      stats[id].last.push(won ? "V" : draw ? "E" : "D");
    };
    match.teamA.forEach((id) => apply(id, "A"));
    match.teamB.forEach((id) => apply(id, "B"));
    match.scorers.forEach((id) => stats[id] && (stats[id].goals += 1));
    if (stats[match.mvp]) stats[match.mvp].mvp += 1;
    if (stats[match.goalOfMatch]) stats[match.goalOfMatch].golDelPartido += 1;
  });

  Object.values(stats).forEach((s) => {
    const recent = s.last.slice(-5);
    s.streak = currentStreak(recent);
    s.winRate = pct(s.wins, s.played);
    s.goalAvg = s.played ? (s.goals / s.played).toFixed(2) : "0.00";
    s.pointsAvg = s.played ? (s.points / s.played).toFixed(2) : "0.00";
  });
  return stats;
}

function currentStreak(results) {
  if (!results.length) return "Sin partidos";
  const last = results[results.length - 1];
  let count = 0;
  for (let i = results.length - 1; i >= 0 && results[i] === last; i--) count += 1;
  return `${count}${last}`;
}

// ===== SEASON PROGRESS =====
function renderSeasonProgress(stats) {
  const el = document.getElementById("season-progress");
  if (!el) return;
  const year = new Date().getFullYear();
  const yearMatches = state.matches.filter((m) => m.date.startsWith(`${year}-`));
  const totalSundays = sundaysOfYear(year).length;
  const playedSundays = new Set(yearMatches.map((m) => m.date)).size;
  const pct = totalSundays ? Math.round((playedSundays / totalSundays) * 100) : 0;
  const yearStats = playerStats(yearMatches);
  const topGoals = state.players.slice().sort((a, b) => (yearStats[b.id]?.goals || 0) - (yearStats[a.id]?.goals || 0))[0];
  const topMvp = state.players.slice().sort((a, b) => (yearStats[b.id]?.mvp || 0) - (yearStats[a.id]?.mvp || 0))[0];
  el.innerHTML = `
    <div class="season-progress">
      <div class="season-progress-top">
        <span class="season-progress-title">⚽ Temporada ${year}</span>
        <span class="season-progress-count">${playedSundays} domingos jugados de ${totalSundays} · ${yearMatches.length} partido${yearMatches.length !== 1 ? "s" : ""}</span>
      </div>
      <div class="season-progress-bar-track">
        <div class="season-progress-bar-fill" style="width:${pct}%"></div>
      </div>
      <div class="season-progress-leaders">
        <div class="season-leader">
          <span class="season-leader-icon">⚽</span>
          <div>
            <div class="season-leader-name">${topGoals ? topGoals.nickname : "—"}</div>
            <div class="season-leader-label">Goleador ${year} · ${topGoals ? yearStats[topGoals.id]?.goals : 0} goles</div>
          </div>
        </div>
        <div class="season-leader">
          <span class="season-leader-icon">🌟</span>
          <div>
            <div class="season-leader-name">${topMvp ? topMvp.nickname : "—"}</div>
            <div class="season-leader-label">MVP ${year} · ${topMvp ? yearStats[topMvp.id]?.mvp : 0} premios</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ===== TABLA DE TEMPORADA =====
let selectedTablaYear = String(new Date().getFullYear());

function renderTablaYearOptions() {
  const select = document.getElementById("tabla-year");
  if (!select) return;
  const years = rankingYears();
  if (!years.includes(selectedTablaYear) && selectedTablaYear !== "all") selectedTablaYear = years[0] || "all";
  select.innerHTML = [
    `<option value="all"${selectedTablaYear === "all" ? " selected" : ""}>Todas</option>`,
    ...years.map((y) => `<option value="${y}"${selectedTablaYear === y ? " selected" : ""}>${y}</option>`)
  ].join("");
}

function renderTabla() {
  const el = document.getElementById("tabla-content");
  if (!el) return;
  renderTablaYearOptions();
  const matches = selectedTablaYear === "all" ? state.matches : state.matches.filter((m) => m.date.startsWith(`${selectedTablaYear}-`));
  const stats = playerStats(matches);
  const rows = state.players
    .filter((p) => stats[p.id]?.played > 0)
    .map((p) => ({ p, s: stats[p.id] }))
    .sort((a, b) => b.s.points - a.s.points || b.s.wins - a.s.wins || b.s.goals - a.s.goals);

  if (!rows.length) { el.innerHTML = `<p class="muted">No hay datos para esta temporada.</p>`; return; }

  el.innerHTML = `
    <table class="standings-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Jugador</th>
          <th>PJ</th>
          <th>PG</th>
          <th>PE</th>
          <th>PP</th>
          <th>Goles</th>
          <th>Forma</th>
          <th>Pts</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(({ p, s }, i) => {
          const form = s.last.slice(-5).map((r) => `<span class="form-pill ${r}">${r}</span>`).join("");
          return `
            <tr>
              <td><span class="standings-pos ${i < 3 ? "top3" : ""}">${i + 1}</span></td>
              <td><strong>${p.nickname}</strong></td>
              <td>${s.played}</td>
              <td>${s.wins}</td>
              <td>${s.draws}</td>
              <td>${s.losses}</td>
              <td>${s.goals}</td>
              <td><div class="standings-form">${form}</div></td>
              <td><strong class="standings-pts">${s.points}</strong></td>
            </tr>`;
        }).join("")}
      </tbody>
    </table>
  `;
}

// ===== RADAR CHART SVG =====
function radarChart(player) {
  const attrs = [
    { key: "pace", label: "VEL" },
    { key: "shooting", label: "TIR" },
    { key: "passing", label: "PAS" },
    { key: "dribbling", label: "REG" },
    { key: "defense", label: "DEF" },
    { key: "physical", label: "FIS" }
  ];
  const size = 160;
  const cx = size / 2, cy = size / 2, r = 60;
  const n = attrs.length;
  const angles = attrs.map((_, i) => (Math.PI * 2 * i) / n - Math.PI / 2);
  const maxVal = 99;

  const pts = (vals, scale = 1) => vals.map((v, i) => {
    const angle = angles[i];
    const len = r * scale * (v / maxVal);
    return [cx + len * Math.cos(angle), cy + len * Math.sin(angle)];
  });

  const bgLevels = [0.25, 0.5, 0.75, 1].map((scale) => {
    const polygon = angles.map((a) => `${cx + r * scale * Math.cos(a)},${cy + r * scale * Math.sin(a)}`).join(" ");
    return `<polygon class="radar-bg-poly" points="${polygon}" fill="none"/>`;
  });

  const axisLines = angles.map((a) =>
    `<line class="radar-axis" x1="${cx}" y1="${cy}" x2="${cx + r * Math.cos(a)}" y2="${cy + r * Math.sin(a)}"/>`
  );

  const values = attrs.map((a) => Number(player[a.key]) || 70);
  const fillPoints = pts(values);
  const fillPoly = fillPoints.map(([x, y]) => `${x},${y}`).join(" ");
  const dots = fillPoints.map(([x, y]) => `<circle class="radar-dot" cx="${x}" cy="${y}" r="3"/>`).join("");

  const labelPad = 18;
  const labels = attrs.map((a, i) => {
    const angle = angles[i];
    const lx = cx + (r + labelPad) * Math.cos(angle);
    const ly = cy + (r + labelPad) * Math.sin(angle);
    const val = values[i];
    return `<text class="radar-label" x="${lx}" y="${ly - 6}">${a.label}</text>
            <text class="radar-val" x="${lx}" y="${ly + 7}">${val}</text>`;
  }).join("");

  return `
    <div class="radar-wrapper">
      <span class="radar-title">Atributos</span>
      <svg class="radar-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        ${bgLevels.join("")}
        ${axisLines.join("")}
        <polygon class="radar-fill-poly" points="${fillPoly}"/>
        ${dots}
        ${labels}
      </svg>
    </div>
  `;
}

// ===== SALÓN DE LA FAMA =====
function renderHallOfFame() {
  const el = document.getElementById("leyendas-content");
  if (!el) return;
  const stats = playerStats();

  const topMvps = state.players.slice()
    .sort((a, b) => (stats[b.id]?.mvp || 0) - (stats[a.id]?.mvp || 0))
    .filter((p) => stats[p.id]?.mvp > 0)
    .slice(0, 3);

  const topScorers = state.players.slice()
    .sort((a, b) => (stats[b.id]?.goals || 0) - (stats[a.id]?.goals || 0))
    .filter((p) => stats[p.id]?.goals > 0)
    .slice(0, 3);

  const topWinRate = state.players.slice()
    .filter((p) => stats[p.id]?.played >= 10)
    .sort((a, b) => (stats[b.id]?.winRate || 0) - (stats[a.id]?.winRate || 0))
    .slice(0, 3);

  const trophies = ["🥇", "🥈", "🥉"];

  const hofCards = (players, key, suffix, icon) => players.map((p, i) => `
    <div class="hof-card" data-open-player="${p.id}">
      <span class="hof-card-trophy">${trophies[i]}</span>
      <div class="hof-card-value">${stats[p.id][key]}${suffix}</div>
      <div class="hof-card-name">${p.nickname}</div>
      <div class="hof-card-label">${icon}</div>
      <span class="hof-card-rank">${i + 1}</span>
    </div>
  `).join("");

  // Records section
  const mostGoalsMatch = (() => {
    let best = null;
    state.matches.forEach((m) => {
      const counts = m.scorers.reduce((acc, id) => { acc[id] = (acc[id] || 0) + 1; return acc; }, {});
      Object.entries(counts).forEach(([id, g]) => {
        if (!best || g > best.goals) best = { id, goals: g, date: m.date };
      });
    });
    return best;
  })();

  const longestStreak = state.players.slice().map((p) => {
    const results = [...state.matches]
      .sort((a, b) => a.date.localeCompare(b.date))
      .filter((m) => m.teamA.includes(p.id) || m.teamB.includes(p.id))
      .map((m) => {
        const aWon = m.scoreA > m.scoreB;
        const bWon = m.scoreB > m.scoreA;
        const onA = m.teamA.includes(p.id);
        return (m.scoreA === m.scoreB) ? "E" : ((onA && aWon) || (!onA && bWon)) ? "V" : "D";
      });
    let maxW = 0, cur = 0;
    results.forEach((r) => { cur = r === "V" ? cur + 1 : 0; if (cur > maxW) maxW = cur; });
    return { p, streak: maxW };
  }).sort((a, b) => b.streak - a.streak)[0];

  const mostPlayed = state.players.slice()
    .sort((a, b) => (stats[b.id]?.played || 0) - (stats[a.id]?.played || 0))[0];

  el.innerHTML = `
    <div class="hof-section">
      <div class="hof-section-title">🌟 Reyes del MVP</div>
      <div class="hof-grid">
        ${topMvps.length ? hofCards(topMvps, "mvp", "", "premios MVP") : "<p class='muted'>Sin datos</p>"}
      </div>
    </div>
    <div class="hof-section">
      <div class="hof-section-title">⚽ Máximos goleadores</div>
      <div class="hof-grid">
        ${topScorers.length ? hofCards(topScorers, "goals", "", "goles totales") : "<p class='muted'>Sin datos</p>"}
      </div>
    </div>
    <div class="hof-section">
      <div class="hof-section-title">🏆 Mejores win rates (mín. 10 PJ)</div>
      <div class="hof-grid">
        ${topWinRate.length ? hofCards(topWinRate, "winRate", "%", "win rate") : "<p class='muted'>Sin datos</p>"}
      </div>
    </div>
    <div class="hof-section">
      <div class="hof-section-title">📜 Records históricos</div>
      <div class="hof-record-grid">
        ${mostGoalsMatch ? `<div class="hof-record"><span class="hof-record-icon">🔥</span><div><div class="hof-record-value">${mostGoalsMatch.goals}</div><div class="hof-record-name">${byId(mostGoalsMatch.id)?.nickname || "—"}</div><div class="hof-record-label">Máx. goles en un partido (${mostGoalsMatch.date})</div></div></div>` : ""}
        ${longestStreak ? `<div class="hof-record"><span class="hof-record-icon">📈</span><div><div class="hof-record-value">${longestStreak.streak}V</div><div class="hof-record-name">${longestStreak.p.nickname}</div><div class="hof-record-label">Racha ganadora más larga</div></div></div>` : ""}
        ${mostPlayed ? `<div class="hof-record"><span class="hof-record-icon">💪</span><div><div class="hof-record-value">${stats[mostPlayed.id]?.played}</div><div class="hof-record-name">${mostPlayed.nickname}</div><div class="hof-record-label">Más partidos jugados</div></div></div>` : ""}
      </div>
    </div>
  `;
}

function renderAll() {
  saveState();
  renderSelects();
  renderDashboard();
  renderPlayers();
  renderMatches();
  renderCalendar();
  renderRankings();
  renderDraw();
  renderPairs();
  renderRivalries();
  renderAwards();
  renderGallery();
  renderTabla();
  renderHallOfFame();
  updateAdminVisibility();
}

function renderDashboard() {
  const year = String(new Date().getFullYear());
  const seasonMatches = state.matches.filter(m => m.date.startsWith(year));
  const stats = playerStats(seasonMatches);
  const totalGoals = state.matches.reduce((sum, m) => sum + m.scorers.length, 0);
  $("dashboard-stats").innerHTML = [
    ["Jugadores", state.players.length],
    ["Partidos", state.matches.length],
    ["Goles", totalGoals],
    ["Promedio gol/partido", state.matches.length ? (totalGoals / state.matches.length).toFixed(1) : "0.0"]
  ].map(([label, value]) => `<article class="stat"><strong>${value}</strong><span>${label}</span></article>`).join("");

  // Hero stats bar
  const hParts = document.getElementById("hstat-partidos");
  const hGoles = document.getElementById("hstat-goles");
  const hJug = document.getElementById("hstat-jugadores");
  if (hParts) hParts.textContent = state.matches.length;
  if (hGoles) hGoles.textContent = totalGoals;
  if (hJug) hJug.textContent = state.players.length;

  renderSeasonProgress(stats);

  renderTopScorer();

  $("featured-players").innerHTML = state.players
    .slice()
    .sort((a, b) => (stats[b.id]?.points || 0) - (stats[a.id]?.points || 0))
    .slice(0, 5)
    .map((p) => `<div class="mini-row"><strong>${p.nickname}</strong><span>${stats[p.id].points} pts | ${stats[p.id].goals} goles</span></div>`)
    .join("") || empty("Cargá jugadores para ver destacados.");
  renderHomeNews();
  renderHomeGallery();
}

function renderTopScorer() {
  const el = document.getElementById("home-scorer");
  if (!el) return;

  const year = String(new Date().getFullYear());
  const seasonMatches = state.matches.filter(m => m.date.startsWith(year));
  const goals = {};
  seasonMatches.forEach(m => m.scorers.forEach(id => { goals[id] = (goals[id] || 0) + 1; }));
  const ranked = Object.entries(goals)
    .sort((a, b) => b[1] - a[1])
    .filter(([id]) => byId(id));

  if (!ranked.length) { el.innerHTML = ""; return; }

  const [playerId, goalCount] = ranked[0];
  const player = byId(playerId);

  const photo = player.featurePhoto || playerPhotoMap[playerId];
  const adminBtn = `<button class="photo-upload-btn" data-upload-scorer-photo="${playerId}" data-admin-only title="Cambiar foto">📷</button>`;

  const maxGoals = ranked[0][1];
  const listRows = ranked.slice(0, 8).map(([id, g], i) => {
    const p = byId(id);
    if (!p) return "";
    const barPct = Math.round((g / maxGoals) * 100);
    const medals = ["🥇","🥈","🥉"];
    const pos = i < 3 ? `<span class="scorer-medal">${medals[i]}</span>` : `<span class="scorer-pos">${i + 1}</span>`;
    return `
      <div class="scorer-row">
        ${pos}
        <span class="scorer-name">${p.nickname}</span>
        <div class="scorer-bar-wrap">
          <div class="scorer-bar" style="width:${barPct}%"></div>
        </div>
        <span class="scorer-goals">${g}</span>
      </div>`;
  }).join("");

  el.innerHTML = `
    <div class="home-news-card home-scorer-card">
      ${photo ? `<img class="home-news-photo" src="${photo}" alt="${player.nickname}" style="object-fit:contain;object-position:center center">` : `<div class="home-news-photo-placeholder">⚽</div>`}
      <div class="home-news-gradient"></div>
      ${adminBtn}
      <div class="home-news-body">
        <div class="home-news-badge home-scorer-badge">Goleador ${year}</div>
        <div class="home-news-mvp-name">${player.nickname}</div>
        <p class="home-scorer-stat">${goalCount} goles en la temporada</p>
      </div>
    </div>
    <div class="scorer-list">
      <p class="scorer-list-title">Tabla de goleadores ${year}</p>
      ${listRows}
    </div>`;
}

function renderHomeNews() {
  const el = document.getElementById("home-news");
  if (!el) return;

  const sorted = state.matches.slice().sort((a, b) => b.date.localeCompare(a.date));
  const featured = sorted.find(m => m.newsText && m.newsText.trim())
    || sorted.find(m => m.mvp);

  if (!featured) { el.innerHTML = ""; return; }

  const photo = featured.newsPhoto || (featured.mvp ? (mvpNewsPhotoMap[featured.mvp] || playerPhotoMap[featured.mvp]) : null);
  const player = featured.mvp ? byId(featured.mvp) : null;
  const newsText = featured.newsText || (featured.mvp ? mvpDefaultNewsText[featured.mvp] : null) || "";
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const [y, mo, day] = featured.date.split("-");
  const dateLabel = `${day} ${meses[Number(mo)-1]} ${y}`;
  const adminBtn = `<button class="photo-upload-btn" data-upload-news-photo="${featured.id}" data-admin-only title="Cambiar foto">📷</button>`;

  el.innerHTML = `
    <div class="home-news-card">
      ${photo
        ? `<img class="home-news-photo" src="${photo}" alt="${player?.nickname || 'MVP'}">`
        : `<div class="home-news-photo-placeholder">⚽</div>`
      }
      <div class="home-news-gradient"></div>
      ${adminBtn}
      <div class="home-news-body">
        <div class="home-news-badge">MVP · ${dateLabel}</div>
        <p class="home-news-text">${newsText}</p>
        ${player ? `<div class="home-news-mvp-name">${player.nickname}</div>` : ""}
      </div>
    </div>`;
}

function renderHomeGallery() {
  const selected = galleryImages.slice(0, 5);
  $("home-gallery-carousel").innerHTML = selected.map((src, index) => `
    <figure class="gallery-slide ${index === gallerySlideIndex % selected.length ? "active" : ""}">
      <img src="${src}" alt="Foto de Movimiento Balon ${index + 1}">
    </figure>
  `).join("");
  startGalleryTimer();
}

function startGalleryTimer() {
  if (galleryTimer) return;
  galleryTimer = setInterval(() => {
    gallerySlideIndex += 1;
    renderHomeGallery();
  }, 10000);
}

function renderPlayers() {
  $("player-cards").innerHTML = state.players.map((p) => `
    <article class="player-card ${cardVisualClass(p)}" data-open-player="${p.id}">
      <span class="card-watermark">MB</span>
      <div class="card-top">
        <div><div class="rating">${rating(p)}</div><strong>${cardRoleLabel(p)}</strong></div>
        <div class="avatar">${p.photo ? `<img src="${p.photo}" alt="${p.nickname}" style="--photo-focus: ${p.photoFocus || "center 22%"}">` : initials(p.nickname)}</div>
      </div>
      <h3>${p.nickname}</h3>
      ${attributeGrid(p)}
      <div class="card-actions" data-admin-only>
        <button class="text-btn" type="button" data-edit-player="${p.id}">Editar</button>
        <button class="text-btn danger" type="button" data-delete-player="${p.id}">Eliminar</button>
      </div>
    </article>
  `).join("") || empty("No hay jugadores. Empeza cargando el plantel.");
}

function cardVisualClass(player) {
  return player.cardStyle === "legend" ? "legend" : cardTier(player);
}

function cardRoleLabel(player) {
  return player.cardStyle === "legend" ? "Leyenda" : playerPositionSummary(player);
}

function cardTier(player) {
  const value = rating(player);
  if (value < 79) return "silver";
  if (value >= 88) return "elite";
  return "gold";
}

function attributeGrid(player) {
  const labels = player.position === "Arquero"
    ? [["EST", player.pace], ["REF", player.shooting], ["SAQ", player.passing], ["MAN", player.dribbling], ["POS", player.defense], ["FIS", player.physical]]
    : [["RIT", player.pace], ["TIR", player.shooting], ["PAS", player.passing], ["REG", player.dribbling], ["DEF", player.defense], ["FIS", player.physical]];
  return `<div class="attrs">${labels.map(([label, value]) => `<span>${label} ${value}</span>`).join("")}</div>`;
}

function renderMatches() {
  $("match-list").innerHTML = state.matches.slice().sort((a, b) => b.date.localeCompare(a.date)).map(matchRow).join("") || empty("No hay partidos cargados.");
}

function matchRow(m) {
  const names = (ids) => ids.map((id) => byId(id)?.nickname || "Jugador eliminado").join(" | ");
  return `
    <article class="match-card" data-open-match="${m.id}">
      <div class="match-card-head">
        <div>
          <p class="eyebrow">${m.date}</p>
          <h3>${m.venue || "Sin sede"}</h3>
        </div>
        <span class="winner-badge ${matchOutcome(m) === "Empate" ? "draw" : ""}">${matchOutcome(m)}</span>
      </div>
      <div class="match-teams">
        <div class="match-team-card white"><h4>Equipo Blanco</h4><p>${names(m.teamA) || "-"}</p></div>
        <div class="match-team-card black"><h4>Equipo Negro</h4><p>${names(m.teamB) || "-"}</p></div>
      </div>
      <div class="match-highlights">
        <span class="modal-pill">Goleadores: ${scorerSummaryText(m.scorers)}</span>
        <span class="modal-pill">MVP: ${byId(m.mvp)?.nickname || "-"}</span>
        ${m.goalOfMatch ? `<span class="modal-pill">⭐ ${byId(m.goalOfMatch)?.nickname || "—"}</span>` : ""}
      </div>
      ${m.comment ? `<p>${m.comment}</p>` : ""}
      <div class="match-actions" data-admin-only>
        <button class="text-btn" onclick="event.stopPropagation(); editMatch('${m.id}')">Editar</button>
        <button class="text-btn danger" onclick="event.stopPropagation(); deleteMatch('${m.id}')">Eliminar</button>
      </div>
    </article>
  `;
}

function matchOutcome(match) {
  if (match.scoreA > match.scoreB) return "Gano Equipo Blanco";
  if (match.scoreB > match.scoreA) return "Gano Equipo Negro";
  return "Empate";
}

function outcomeToScore(outcome) {
  if (outcome === "A") return { scoreA: 1, scoreB: 0 };
  if (outcome === "B") return { scoreA: 0, scoreB: 1 };
  return { scoreA: 0, scoreB: 0 };
}

function scorerSummaryText(ids) {
  if (!ids.length) return "-";
  const counts = ids.reduce((map, id) => {
    const name = byId(id)?.nickname || "Jugador eliminado";
    map[name] = (map[name] || 0) + 1;
    return map;
  }, {});
  return Object.entries(counts).map(([name, count]) => `${name}${count > 1 ? ` x${count}` : ""}`).join(" | ");
}

function renderRankings() {
  renderRankingYearOptions();
  const matches = rankingMatches();
  const stats = playerStats(matches);
  const rows = state.players.map((p) => ({ p, s: stats[p.id], rating: rating(p), streakScore: streakScore(stats[p.id].streak) }));
  const boards = [
    ["Goleadores", "goals"], ["MVP", "mvp"], ["Gol del partido", "golDelPartido"], ["Victorias", "wins"],
    ["Win rate", "winRate", "%", "winRate"], ["Puntos", "points", "", "points"], ["Puntos por partido", "pointsAvg"],
    ["Partidos jugados", "played"], ["Rachas", "streak", "", "streakScore"], ["Promedio goles", "goalAvg"], ["Media", "rating"]
  ];
  $("ranking-grid").innerHTML = boards.map(([title, key, suffix = "", sortKey = key]) => rankCard(title, rows, key, suffix, sortKey)).join("");
}

function rankingYears() {
  return [...new Set(state.matches.map((match) => match.date.slice(0, 4)))].sort((a, b) => b.localeCompare(a));
}

function latestSeason() {
  return rankingYears()[0] || String(new Date().getFullYear());
}

function normalizeSeason(value) {
  if (value === "all") return "all";
  const latest = latestSeason();
  return value === latest ? value : latest;
}

function seasonMatches(value) {
  const season = normalizeSeason(value);
  if (season === "all") return state.matches;
  return state.matches.filter((match) => match.date.startsWith(`${season}-`));
}

function seasonLabel(value) {
  const season = normalizeSeason(value);
  return season === "all" ? "Todas" : season;
}

function renderSeasonOptions(id, selected) {
  const select = $(id);
  if (!select) return normalizeSeason(selected);
  const season = normalizeSeason(selected);
  const latest = latestSeason();
  select.innerHTML = [
    `<option value="${latest}"${season === latest ? " selected" : ""}>${latest}</option>`,
    `<option value="all"${season === "all" ? " selected" : ""}>Todas</option>`
  ].join("");
  return season;
}

function renderPairsSeasonOptions() {
  const select = $("pairs-season");
  const years = rankingYears();
  if (!years.includes(selectedPairsSeason) && selectedPairsSeason !== "all") selectedPairsSeason = years[0] || "all";
  select.innerHTML = [
    ...years.map((year) => `<option value="${year}"${selectedPairsSeason === year ? " selected" : ""}>${year}</option>`),
    `<option value="all"${selectedPairsSeason === "all" ? " selected" : ""}>Todas</option>`
  ].join("");
}

function pairsSeasonMatches() {
  if (selectedPairsSeason === "all") return state.matches;
  return state.matches.filter((match) => match.date.startsWith(`${selectedPairsSeason}-`));
}

function pairsMinimumPlayed() {
  return selectedPairsSeason === "all" ? 8 : 3;
}

function renderRankingYearOptions() {
  const years = rankingYears();
  if (!years.includes(selectedRankingYear) && selectedRankingYear !== "all") selectedRankingYear = years[0] || "all";
  $("ranking-year").innerHTML = [
    `<option value="all"${selectedRankingYear === "all" ? " selected" : ""}>Todos</option>`,
    ...years.map((year) => `<option value="${year}"${selectedRankingYear === year ? " selected" : ""}>${year}</option>`)
  ].join("");
}

function rankingMatches() {
  if (selectedRankingYear === "all") return state.matches;
  return state.matches.filter((match) => match.date.startsWith(`${selectedRankingYear}-`));
}

function renderCalendar() {
  $("calendar-year").textContent = calendarYear;
  const sundays = sundaysOfYear(calendarYear);
  const matchesByDate = state.matches.reduce((map, match) => {
    map[match.date] = map[match.date] || [];
    map[match.date].push(match);
    return map;
  }, {});
  if (!selectedCalendarDate && sundays.length) {
    selectedCalendarDate = nextSundayWithMatch(matchesByDate) || sundays[0].iso;
  }
  $("calendar-grid").innerHTML = sundays.map((day) => {
    const matches = matchesByDate[day.iso] || [];
    return `
      <button class="sunday-card ${matches.length ? "has-match" : ""} ${selectedCalendarDate === day.iso ? "active" : ""}" type="button" data-calendar-date="${day.iso}">
        <span>${day.month}</span>
        <strong>${day.day}</strong>
        <small>${matches.length ? `${matches.length} partido${matches.length > 1 ? "s" : ""}` : "Domingo"}</small>
      </button>
    `;
  }).join("");
  renderCalendarDetail(matchesByDate[selectedCalendarDate] || [], selectedCalendarDate);
}

function sundaysOfYear(year) {
  const date = new Date(year, 0, 1);
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  while (date.getDay() !== 0) date.setDate(date.getDate() + 1);
  const sundays = [];
  while (date.getFullYear() === year) {
    sundays.push({
      iso: localIsoDate(date),
      day: date.getDate(),
      month: monthNames[date.getMonth()]
    });
    date.setDate(date.getDate() + 7);
  }
  return sundays;
}

function localIsoDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function nextSundayWithMatch(matchesByDate) {
  const dates = Object.keys(matchesByDate).filter((date) => date.startsWith(String(calendarYear))).sort();
  return dates[0] || null;
}

function renderCalendarDetail(matches, date) {
  if (!date) {
    $("calendar-detail").innerHTML = empty("Selecciona un domingo.");
    return;
  }
  if (!matches.length) {
    $("calendar-detail").innerHTML = `<h3>${date}</h3>${empty("Domingo sin partido cargado.")}`;
    return;
  }
  $("calendar-detail").innerHTML = `
    <h3>${date}</h3>
    <p class="muted">${matches.length} partido${matches.length > 1 ? "s" : ""} cargado${matches.length > 1 ? "s" : ""}. Tocá el domingo resaltado para abrir la vista del partido.</p>
  `;
}

function openMatchModal(match) {
  $("match-modal-content").innerHTML = calendarMatchDetail(match);
  $("match-modal").classList.remove("hidden");
}

function closeMatchModal() {
  $("match-modal").classList.add("hidden");
  clearInterval(playerGalleryTimer);
}

function playerNamesList(ids) {
  return ids.map((id) => byId(id)?.nickname || "Jugador eliminado");
}

function calendarMatchDetail(match) {
  const teamList = (ids) => playerNamesList(ids).map((name) => `<li>${name}</li>`).join("") || "<li>Sin jugadores cargados</li>";
  return `
    <section>
      <div class="match-modal-head">
        <p class="eyebrow">${match.date} | ${match.venue || "Sin sede"}</p>
        <h2 id="modal-title">Equipo Blanco vs Equipo Negro</h2>
        <div class="match-score"><strong>${matchOutcome(match)}</strong></div>
      </div>
      <div class="pitch-layout">
        <aside class="modal-team">
          <h3>Equipo Blanco</h3>
          <ul>${teamList(match.teamA)}</ul>
        </aside>
        <div class="football-pitch" aria-label="Campo de futbol">
          <span class="pitch-label">Movimiento Balon</span>
        </div>
        <aside class="modal-team">
          <h3>Equipo Negro</h3>
          <ul>${teamList(match.teamB)}</ul>
        </aside>
      </div>
      <div class="modal-stats">
        <h3>Estadisticas del partido</h3>
        <p><strong>Goleadores</strong></p>
        <div class="modal-stat-line">${scorerPills(match.scorers)}</div>
        <p><strong>MVP</strong></p>
        <div class="modal-stat-line"><span class="modal-pill">${byId(match.mvp)?.nickname || "Sin MVP"}</span></div>
        ${match.goalOfMatch ? `<p><strong>⭐ Gol del partido</strong></p><div class="modal-stat-line"><span class="modal-pill">${byId(match.goalOfMatch)?.nickname || "—"}</span></div>` : ""}
      </div>
    </section>
  `;
}

function scorerPills(ids) {
  if (!ids.length) return `<span class="modal-pill">Sin goles cargados</span>`;
  const counts = ids.reduce((map, id) => {
    const name = byId(id)?.nickname || "Jugador eliminado";
    map[name] = (map[name] || 0) + 1;
    return map;
  }, {});
  return Object.entries(counts)
    .map(([name, count]) => `<span class="modal-pill">${name}${count > 1 ? ` x${count}` : ""}</span>`)
    .join("");
}

function rankCard(title, rows, key, suffix = "", sortKey = key) {
  const sorted = rows.slice().sort((a, b) => Number(b.s[sortKey] ?? b[sortKey] ?? 0) - Number(a.s[sortKey] ?? a[sortKey] ?? 0));
  return `<article class="rank-card"><h3>${title}</h3>${sorted.slice(0, 8).map((row, i) => {
    const value = row.s[key] ?? row[key];
    const playedInfo = (key === "winRate" || key === "points") ? ` <small>(${row.s.played} PJ)</small>` : "";
    return `<div class="rank-line"><span>${i + 1}. ${row.p.nickname}</span><strong>${value}${suffix}${playedInfo}</strong></div>`;
  }).join("") || empty("Sin datos")}</article>`;
}

function streakScore(streak) {
  if (!streak || streak === "Sin partidos") return 0;
  const result = streak.slice(-1);
  const count = Number(streak.slice(0, -1)) || 0;
  return result === "V" ? count : result === "E" ? -count : -count * 2;
}

function renderDraw() {
  $("confirmed-list").innerHTML = state.players.map((p) => `
    <label class="check-tile"><input type="checkbox" value="${p.id}"> ${p.nickname} <span class="muted">${rating(p)} ${playerPositionSummary(p)}</span></label>
  `).join("") || empty("Primero carga jugadores.");
  updateDrawCounter();
}

function generateTeams() {
  const selected = [...document.querySelectorAll("#confirmed-list input:checked")].map((i) => byId(i.value)).filter(Boolean);
  if (selected.length > 14) return alert("El maximo para sortear es de 14 jugadores.");
  if (selected.length < 2) return alert("Necesitas al menos 2 jugadores confirmados.");
  const keeperTotal = selected.filter((p) => p.position === "Arquero").length;
  const { teamA, teamB } = bestTeamSplit(selected);
  pendingDraw = { teamA: teamA.map((p) => p.id), teamB: teamB.map((p) => p.id) };
  $("draw-result").innerHTML = [teamBox("Equipo Blanco", teamA, keeperTotal), teamBox("Equipo Negro", teamB, keeperTotal)].join("");
  $("save-draw").classList.remove("hidden");
}

function updateDrawCounter() {
  if (!$("draw-counter")) return;
  const selectedCount = document.querySelectorAll("#confirmed-list input:checked").length;
  $("draw-counter").textContent = `${selectedCount}/14 seleccionados`;
  $("draw-counter").classList.toggle("limit", selectedCount >= 14);
}

function enforceDrawLimit(changedInput) {
  const selectedCount = document.querySelectorAll("#confirmed-list input:checked").length;
  if (selectedCount > 14) {
    changedInput.checked = false;
    alert("Podés elegir como máximo 14 jugadores.");
  }
  updateDrawCounter();
}

function bestTeamSplit(players) {
  const stats = playerStats();
  const targetA = Math.ceil(players.length / 2);
  const targetB = Math.floor(players.length / 2);
  const keepers = players.filter((p) => p.position === "Arquero");
  let best = null;

  for (let mask = 1; mask < (1 << players.length) - 1; mask += 1) {
    const teamA = [];
    const teamB = [];
    players.forEach((player, index) => ((mask >> index) & 1 ? teamA : teamB).push(player));
    if (![targetA, targetB].includes(teamA.length)) continue;
    if (keepers.length === 2 && Math.abs(keeperCount(teamA) - keeperCount(teamB)) !== 0) continue;
    const score = splitScore(teamA, teamB, stats, keepers.length);
    if (!best || score < best.score) best = { teamA, teamB, score };
  }

  return best || fallbackTeamSplit(players);
}

function splitScore(teamA, teamB, stats, keeperTotal) {
  const ratingA = adjustedTeamDrawMedia(teamA, keeperTotal);
  const ratingB = adjustedTeamDrawMedia(teamB, keeperTotal);
  const ratingDiff = Math.abs(ratingA - ratingB);
  const goalsA = teamGoalPower(teamA, stats);
  const goalsB = teamGoalPower(teamB, stats);
  const goalDiff = Math.abs(goalsA - goalsB);
  const keeperPenalty = keeperTotal >= 2 ? Math.abs(keeperCount(teamA) - keeperCount(teamB)) * 500 : 0;
  const positionPenalty = positionBalancePenalty(teamA, teamB);
  const elitePenalty = eliteBalancePenalty(teamA, teamB);
  const lowRatingPenalty = lowRatingBalancePenalty(teamA, teamB);
  const tierPenalty = ratingTierBalancePenalty(teamA, teamB);
  const neighborPenalty = ratingNeighborPenalty(teamA, teamB);
  const spreadPenalty = drawSpreadPenalty(teamA, teamB);
  const separatePairPenalty = drawSeparatePairPenalty(teamA, teamB);
  return ratingDiff * 25 + goalDiff * 30 + keeperPenalty + positionPenalty + elitePenalty + lowRatingPenalty + tierPenalty + neighborPenalty + spreadPenalty + separatePairPenalty;
}

function adjustedTeamMedia(team, keeperTotal) {
  const media = team.length ? avg(team.map(rating)) : 0;
  const oneKeeperBonus = keeperTotal === 1 && keeperCount(team) === 1 ? 2 : 0;
  return media + oneKeeperBonus;
}

function drawRating(player) {
  return rating(player);
}

function adjustedTeamDrawMedia(team, keeperTotal) {
  const media = team.length ? avg(team.map(drawRating)) : 0;
  const oneKeeperBonus = keeperTotal === 1 && keeperCount(team) === 1 ? 2 : 0;
  return media + oneKeeperBonus;
}

function teamGoalPower(team, stats) {
  return team.reduce((sum, p) => sum + Number(stats[p.id]?.goalAvg || 0), 0);
}

function keeperCount(team) {
  return team.filter((p) => p.position === "Arquero").length;
}

function eliteCount(team) {
  return team.filter((p) => rating(p) >= 88).length;
}

function eliteBalancePenalty(teamA, teamB) {
  const total = eliteCount(teamA) + eliteCount(teamB);
  if (total <= 1) return 0;
  const allowedDiff = total % 2;
  const diff = Math.abs(eliteCount(teamA) - eliteCount(teamB));
  return Math.max(0, diff - allowedDiff) * 420;
}

function lowRatingCount(team) {
  return team.filter((p) => rating(p) < 81).length;
}

function lowRatingBalancePenalty(teamA, teamB) {
  const total = lowRatingCount(teamA) + lowRatingCount(teamB);
  if (total <= 1) return 0;
  const allowedDiff = total % 2;
  const diff = Math.abs(lowRatingCount(teamA) - lowRatingCount(teamB));
  return Math.max(0, diff - allowedDiff) * 360;
}

function ratingTier(player) {
  const value = rating(player);
  if (value < 79) return "low";
  if (value < 83) return "midLow";
  if (value < 88) return "midHigh";
  return "elite";
}

function ratingTierBalancePenalty(teamA, teamB) {
  const tiers = ["low", "midLow", "midHigh", "elite"];
  return tiers.reduce((sum, tier) => {
    const a = teamA.filter((p) => ratingTier(p) === tier).length;
    const b = teamB.filter((p) => ratingTier(p) === tier).length;
    const total = a + b;
    if (total <= 1) return sum;
    const allowedDiff = total % 2;
    return sum + Math.max(0, Math.abs(a - b) - allowedDiff) * 260;
  }, 0);
}

function ratingNeighborPenalty(teamA, teamB) {
  const players = [...teamA, ...teamB].slice().sort((a, b) => rating(a) - rating(b));
  const teamAIds = new Set(teamA.map((p) => p.id));
  return players.slice(0, -1).reduce((sum, player, index) => {
    const next = players[index + 1];
    const closeRating = Math.abs(rating(player) - rating(next)) <= 3;
    const sameTeam = teamAIds.has(player.id) === teamAIds.has(next.id);
    return sum + (closeRating && sameTeam ? 90 : 0);
  }, 0);
}

function spreadGroupCount(team) {
  return team.filter((p) => drawSpreadIds.has(p.id)).length;
}

function drawSpreadPenalty(teamA, teamB) {
  const sameTeamPairs = (count) => (count * (count - 1)) / 2;
  return (sameTeamPairs(spreadGroupCount(teamA)) + sameTeamPairs(spreadGroupCount(teamB))) * 320;
}

function drawSeparatePairPenalty(teamA, teamB) {
  const sameA = [...drawSeparatePairIds].every((id) => teamA.some((p) => p.id === id));
  const sameB = [...drawSeparatePairIds].every((id) => teamB.some((p) => p.id === id));
  return sameA || sameB ? 260 : 0;
}

function positionBalancePenalty(teamA, teamB) {
  const positions = ["Arquero", "Defensor", "Mediocampista", "Delantero"];
  return positions.reduce((sum, position) => {
    const a = teamA.filter((p) => primaryLegacyPosition(p) === position).length;
    const b = teamB.filter((p) => primaryLegacyPosition(p) === position).length;
    return sum + Math.abs(a - b) * (position === "Arquero" ? 60 : 3);
  }, 0);
}

function fallbackTeamSplit(players) {
  const sorted = players.slice().sort((a, b) => drawRating(b) - drawRating(a));
  const teamA = [];
  const teamB = [];
  sorted.forEach((player) => {
    (adjustedTeamDrawMedia(teamA, 0) <= adjustedTeamDrawMedia(teamB, 0) ? teamA : teamB).push(player);
  });
  return { teamA, teamB };
}

function teamBox(title, team, keeperTotal = 0) {
  const media = team.length ? avg(team.map(rating)) : 0;
  const adjusted = adjustedTeamMedia(team, keeperTotal);
  const stats = playerStats();
  const goals = teamGoalPower(team, stats).toFixed(2);
  const adjustedText = adjusted !== media ? ` | Media ajustada ${adjusted}` : "";
  return `<article class="team-box"><h3>${title} | Media ${media}${adjustedText} | G/P ${goals}</h3>${team.map((p) => `<div class="rank-line"><span>${p.nickname}</span><strong>${rating(p)} ${playerPositionSummary(p)}</strong></div>`).join("")}</article>`;
}

function renderPairs() {
  renderPairsSeasonOptions();
  const minimum = pairsMinimumPlayed();
  const pairs = pairStats(pairsSeasonMatches()).filter((pair) => pair.played >= minimum);
  $("pairs-grid").innerHTML = [
    pairCard(`Mejores duplas | Min. ${minimum} PJ`, pairs.slice().sort((a, b) => b.winRate - a.winRate || b.played - a.played)),
    pairCard(`Peores duplas | Min. ${minimum} PJ`, pairs.slice().sort((a, b) => a.winRate - b.winRate || b.played - a.played)),
    pairCard(`Goles combinados | Min. ${minimum} PJ`, pairs.slice().sort((a, b) => b.goals - a.goals))
  ].join("");
}

function pairStats(matches = state.matches) {
  const map = new Map();
  const add = (ids, match, won) => {
    for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
      const key = [ids[i], ids[j]].sort().join("|");
      const item = map.get(key) || { ids: key.split("|"), played: 0, wins: 0, goals: 0, matches: [] };
      const pairGoals = item.ids.map((id) => ({
        id,
        goals: match.scorers.filter((scorerId) => scorerId === id).length
      }));
      item.played += 1;
      item.wins += won ? 1 : 0;
      item.goals += pairGoals.reduce((sum, row) => sum + row.goals, 0);
      item.matches.push({
        id: match.id,
        date: match.date,
        venue: match.venue,
        won,
        scoreA: match.scoreA,
        scoreB: match.scoreB,
        side: ids === match.teamA ? "A" : "B",
        goals: pairGoals
      });
      map.set(key, item);
    }
  };
  matches.forEach((m) => {
    add(m.teamA, m, m.scoreA > m.scoreB);
    add(m.teamB, m, m.scoreB > m.scoreA);
  });
  return [...map.values()].map((p) => ({ ...p, winRate: pct(p.wins, p.played) })).filter((p) => p.played);
}

function pairCard(title, pairs) {
  return `<article class="pair-board"><h3>${title}</h3><div class="pair-list">${pairs.slice(0, 8).map((pair) => {
    const names = pair.ids.map((id) => byId(id)?.nickname || "Jugador");
    return `
      <button class="pair-card" type="button" data-pair-key="${pair.ids.join("|")}">
        <span class="pair-rate">${pair.winRate}%</span>
        <span>
          <span class="pair-names">
            <span>${names[0]}</span>
            <small>con</small>
            <span>${names[1]}</span>
          </span>
          <span class="pair-metrics">
            <span class="pair-chip">${pair.wins}/${pair.played} ganados</span>
            <span class="pair-chip">${pair.goals} goles juntos</span>
          </span>
        </span>
      </button>
    `;
  }).join("") || empty("Sin duplas todavia.")}</div></article>`;
}

function openPairModal(pairKey) {
  const pair = pairStats(pairsSeasonMatches()).find((item) => item.ids.join("|") === pairKey);
  if (!pair) return;
  $("match-modal-content").innerHTML = pairDetail(pair);
  $("match-modal").classList.remove("hidden");
}

function pairDetail(pair) {
  const names = pair.ids.map((id) => byId(id)?.nickname || "Jugador");
  return `
    <section>
      <div class="pair-detail-head">
        <p class="eyebrow">Desglose de dupla</p>
        <h2 id="modal-title">${names[0]} + ${names[1]}</h2>
        <div class="pair-summary">
          <span class="modal-pill">${pair.winRate}% win rate</span>
          <span class="modal-pill">${pair.wins}/${pair.played} partidos ganados</span>
          <span class="modal-pill">${pair.goals} goles combinados</span>
        </div>
      </div>
      <div class="pair-breakdown">
        ${pair.matches.slice().sort((a, b) => a.date.localeCompare(b.date)).map((match) => pairMatchDetail(match, pair.ids)).join("")}
      </div>
    </section>
  `;
}

function pairMatchDetail(match, ids) {
  const split = match.goals.map((row) => {
    const name = byId(row.id)?.nickname || "Jugador";
    return `<span class="modal-pill">${name}: ${row.goals}</span>`;
  }).join("");
  const total = match.goals.reduce((sum, row) => sum + row.goals, 0);
  return `
    <article class="pair-match-card">
      <strong>${match.date}</strong>
      <div>
        <p><strong>${match.won ? "Victoria" : "Sin victoria"}</strong> | ${match.venue || "Sin sede"} | Equipo ${match.side}</p>
        <div class="pair-goal-split">${split}</div>
      </div>
      <span class="pair-rate">${total}</span>
    </article>
  `;
}

function openPlayerModal(playerId) {
  const player = byId(playerId);
  if (!player) return;
  $("match-modal-content").innerHTML = playerDetail(player);
  $("match-modal").classList.remove("hidden");
  updateAdminVisibility();
  startPlayerGalleryCarousel(player.id);
}

function playerDetail(player) {
  const season = normalizeSeason(selectedPlayerPairSeason);
  const matches = seasonMatches(season);
  const stats = playerStats(matches)[player.id];
  const positionRows = positionSuggestionRows(player);
  return `
    <section class="player-profile" data-player-profile="${player.id}">
      <div class="player-profile-hero ${cardVisualClass(player)}">
        <div class="player-profile-photo">
          ${player.photo ? `<img src="${player.photo}" alt="${player.nickname}" style="--photo-focus: ${player.photoFocus || "center 22%"}">` : initials(player.nickname)}
        </div>
        <div>
          <p class="eyebrow">Ficha ampliada</p>
          <h2 id="modal-title">${player.nickname}</h2>
          <div class="player-profile-meta">
            <span class="profile-rating">${rating(player)}</span>
            <span>${playerPositionSummary(player)}</span>
            <span>${player.foot}</span>
            <label class="profile-season-filter">Stats
              <select id="profile-pair-season">
                <option value="${latestSeason()}"${season === latestSeason() ? " selected" : ""}>${latestSeason()}</option>
                <option value="all"${season === "all" ? " selected" : ""}>Todas</option>
              </select>
            </label>
          </div>
          <button class="secondary" type="button" data-edit-player-modal="${player.id}" data-admin-only>Editar jugador</button>
        </div>
      </div>
      ${radarChart(player)}
      <div class="player-profile-stats">
        <article><span>Goles</span><strong>${stats.goals}</strong></article>
        <article><span>Partidos</span><strong>${stats.played}</strong></article>
        <article><span>Win rate</span><strong>${stats.winRate}%</strong></article>
        <article><span>Puntos</span><strong>${stats.points}</strong></article>
        ${stats.golDelPartido ? `<article><span>⭐ Gol del partido</span><strong>${stats.golDelPartido}</strong></article>` : ""}
      </div>
      ${positionRows.length ? `
        <div class="position-rating-grid">
          ${positionRows.map((row) => `
            <article>
              <span>${row.label}</span>
              <strong>${row.value}</strong>
              <small>media sugerida</small>
            </article>
          `).join("")}
        </div>
      ` : ""}
      <div class="player-detail-grid">
        ${playerPairPanel(player.id, matches, season)}
        <div class="player-side-stack">
          ${playerLastMatchesPanel(player.id, matches)}
          ${playerGalleryPanel(player)}
        </div>
      </div>
    </section>
  `;
}

function playerGalleryImages(player) {
  return normalizeGalleryList(player.gallery);
}

function playerGalleryPanel(player) {
  const images = playerGalleryImages(player);
  return `
    <article class="player-gallery-card">
      <div class="detail-card-head">
        <p class="eyebrow">Galeria personal</p>
        <h3>Fotos de ${player.nickname}</h3>
      </div>
      <div class="player-gallery-preview">
        ${images.length
          ? `
            <button class="gallery-nav prev" type="button" data-gallery-step="-1" aria-label="Foto anterior">&lsaquo;</button>
            <img id="player-gallery-image" src="${images[0]}" alt="Foto de ${player.nickname}" data-lightbox-src="${images[0]}">
            <button class="gallery-nav next" type="button" data-gallery-step="1" aria-label="Foto siguiente">&rsaquo;</button>
          `
          : `<div class="player-gallery-empty">Todavia no hay fotos cargadas para este jugador.</div>`}
      </div>
      <div class="player-gallery-actions">
        <span>${images.length} foto${images.length === 1 ? "" : "s"}</span>
        <div class="player-gallery-buttons">
          <button class="secondary" type="button" data-open-player-gallery="${player.id}">Ver galeria completa</button>
          <button class="primary" type="button" data-upload-player-gallery="${player.id}" data-admin-only>Subir fotos</button>
        </div>
      </div>
    </article>
  `;
}

function startPlayerGalleryCarousel(playerId, resetIndex = true) {
  clearInterval(playerGalleryTimer);
  if (resetIndex) playerGalleryIndex = 0;
  const player = byId(playerId);
  const images = player ? playerGalleryImages(player) : [];
  if (images.length <= 1) return;
  playerGalleryTimer = setInterval(() => {
    showPlayerGalleryImage(playerId, 1);
  }, 4000);
}

function showPlayerGalleryImage(playerId, step) {
  const player = byId(playerId);
  const images = player ? playerGalleryImages(player) : [];
  const image = $("player-gallery-image");
  if (!image || !images.length) return;
  playerGalleryIndex = (playerGalleryIndex + step + images.length) % images.length;
  image.src = images[playerGalleryIndex];
  image.dataset.lightboxSrc = images[playerGalleryIndex];
}

function stepPlayerGallery(playerId, step) {
  showPlayerGalleryImage(playerId, step);
  startPlayerGalleryCarousel(playerId, false);
}

function openPlayerGallery(playerId) {
  clearInterval(playerGalleryTimer);
  const player = byId(playerId);
  if (!player) return;
  const images = playerGalleryImages(player);
  $("match-modal-content").innerHTML = `
    <section class="player-gallery-detail">
      <div class="match-modal-head">
        <p class="eyebrow">Galeria personal</p>
        <h2 id="modal-title">${player.nickname}</h2>
        <button class="ghost dark" type="button" data-back-player="${player.id}">Volver a ficha</button>
      </div>
      <div class="player-gallery-grid">
        ${images.map((src, index) => `
          <figure>
            <img src="${src}" alt="${player.nickname} foto ${index + 1}" data-lightbox-src="${src}">
          </figure>
        `).join("") || empty("Todavia no hay fotos cargadas para este jugador.")}
      </div>
    </section>
  `;
  updateAdminVisibility();
}

function uploadPlayerGallery(playerId) {
  if (!requireAdmin()) return;
  pendingGalleryPlayerId = playerId;
  $("player-gallery-file").click();
}

function readGalleryFiles(files) {
  return Promise.all([...files].map((file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  })));
}

function compressImage(file, maxWidth = 800, quality = 0.82) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

async function addPlayerGalleryFiles(files) {
  if (!pendingGalleryPlayerId || !files?.length) return;
  const player = byId(pendingGalleryPlayerId);
  if (!player) return;
  const images = await readGalleryFiles(files);
  player.gallery = normalizeGalleryList(player.gallery).concat(images);
  saveState();
  openPlayerModal(player.id);
}

function openImageLightbox(src, alt = "Imagen ampliada") {
  $("image-lightbox-img").src = src;
  $("image-lightbox-img").alt = alt;
  $("image-lightbox").classList.remove("hidden");
}

function closeImageLightbox() {
  $("image-lightbox").classList.add("hidden");
  $("image-lightbox-img").removeAttribute("src");
}

function playerPairPanel(playerId, matches, season) {
  const pairs = pairStats(matches)
    .filter((pair) => pair.ids.includes(playerId) && pair.ids.some((id) => id !== playerId && byId(id)))
    .map((pair) => ({ ...pair, teammateId: pair.ids.find((id) => id !== playerId) }));
  const best = pairs.slice().sort((a, b) => b.winRate - a.winRate || b.wins - a.wins || b.played - a.played).slice(0, 5);
  const hard = pairs.filter((pair) => pair.winRate < 50).sort((a, b) => a.winRate - b.winRate || b.played - a.played).slice(0, 4);
  return `
    <article class="player-detail-card">
      <div class="detail-card-head">
        <p class="eyebrow">Duplas</p>
        <h3>Socios que mejor le funcionan | ${seasonLabel(season)}</h3>
      </div>
      <div class="profile-list">
        ${best.map(playerPairRow).join("") || empty("Todavia no tiene duplas cargadas.")}
      </div>
      <div class="detail-card-head compact">
        <p class="eyebrow">A mejorar</p>
        <h3>Duplas dificiles</h3>
      </div>
      <div class="profile-list">
        ${hard.map(playerPairRow).join("") || empty("No tiene duplas complicadas cargadas.")}
      </div>
    </article>
  `;
}

function playerPairRow(pair) {
  const teammate = byId(pair.teammateId)?.nickname || "Jugador";
  return `
    <div class="player-pair-row">
      <div>
        <strong>${teammate}</strong>
        <small>${pair.wins}/${pair.played} ganados | ${pair.goals} goles juntos</small>
      </div>
      <span>${pair.winRate}%</span>
    </div>
  `;
}

function playerLastMatchesPanel(playerId, matches) {
  const rows = matches
    .filter((match) => match.teamA.includes(playerId) || match.teamB.includes(playerId))
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);
  return `
    <article class="player-detail-card">
      <div class="detail-card-head">
        <p class="eyebrow">Forma reciente</p>
        <h3>Ultimos 4 partidos</h3>
      </div>
      <div class="profile-list">
        ${rows.map((match) => playerLastMatchRow(match, playerId)).join("") || empty("Todavia no jugo partidos.")}
      </div>
    </article>
  `;
}

function playerLastMatchRow(match, playerId) {
  const result = playerResult(match, playerId);
  const goals = playerGoalsInMatch(match, playerId);
  const side = match.teamA.includes(playerId) ? "Blanco" : "Negro";
  return `
    <div class="player-last-match ${result.className}">
      <div>
        <strong>${match.date}</strong>
        <small>Equipo ${side} | ${match.venue || "Sin sede"}</small>
      </div>
      <span>${result.label}</span>
      <b>${goals} gol${goals === 1 ? "" : "es"}</b>
    </div>
  `;
}

function playerResult(match, playerId) {
  const draw = match.scoreA === match.scoreB;
  const whiteWin = match.scoreA > match.scoreB;
  const blackWin = match.scoreB > match.scoreA;
  if (draw) return { label: "Empate", className: "result-draw" };
  const won = match.teamA.includes(playerId) ? whiteWin : blackWin;
  return won ? { label: "Victoria", className: "result-win" } : { label: "Derrota", className: "result-loss" };
}

function playerGoalsInMatch(match, playerId) {
  return match.scorers.filter((id) => id === playerId).length;
}

function renderRivalries() {
  selectedRivalrySeason = renderSeasonOptions("rivalry-season", selectedRivalrySeason);
  const matches = seasonMatches(selectedRivalrySeason);
  const data = rivalryStats(matches);
  $("rivalry-grid").innerHTML = [
    rivalryCard(`Historial jugador contra jugador | ${seasonLabel(selectedRivalrySeason)}`, data.slice().sort((a, b) => b.played - a.played)),
    rivalryCard(`Lo tiene en el bolsillo | ${seasonLabel(selectedRivalrySeason)}`, data.slice().sort((a, b) => b.gap - a.gap)),
    keeperSlayerCard(matches)
  ].join("");
}

function rivalryStats(matches = state.matches) {
  const map = new Map();
  matches.forEach((m) => {
    m.teamA.forEach((a) => m.teamB.forEach((b) => touchRival(map, a, b, m, "A")));
    m.teamB.forEach((b) => m.teamA.forEach((a) => touchRival(map, b, a, m, "B")));
  });
  return [...map.values()].map((r) => ({ ...r, gap: r.wins - r.losses })).filter((r) => r.played);
}

function touchRival(map, player, rival, match, side) {
  const key = `${player}|${rival}`;
  const won = side === "A" ? match.scoreA > match.scoreB : match.scoreB > match.scoreA;
  const lost = side === "A" ? match.scoreA < match.scoreB : match.scoreB < match.scoreA;
  const item = map.get(key) || { player, rival, played: 0, wins: 0, losses: 0, goals: 0 };
  item.played += 1;
  item.wins += won ? 1 : 0;
  item.losses += lost ? 1 : 0;
  item.goals += match.scorers.filter((id) => id === player || id === rival).length;
  map.set(key, item);
}

function rivalryCard(title, rows) {
  return `<article class="rank-card"><h3>${title}</h3>${rows.slice(0, 8).map((r) => `
    <div class="rank-line"><span>${shortPlayerName(r.player)} vs ${shortPlayerName(r.rival)}<br><small>${r.played} PJ | ${r.goals} goles</small></span><strong>${r.wins}-${r.losses}</strong></div>
  `).join("") || empty("Sin enfrentamientos.")}</article>`;
}

function shortPlayerName(id) {
  const name = byId(id)?.nickname || "Jugador";
  if (!name.includes(",")) return name.replace(/"/g, "");
  return name.split(",")[0].trim();
}

function keeperSlayerCard(matches = state.matches) {
  const rows = goalkeeperIds.map((keeperId) => {
    const totals = {};
    matches.forEach((match) => {
      const keeperSide = match.teamA.includes(keeperId) ? "A" : match.teamB.includes(keeperId) ? "B" : null;
      if (!keeperSide) return;
      const rivalTeam = keeperSide === "A" ? match.teamB : match.teamA;
      match.scorers.forEach((scorerId) => {
        if (!rivalTeam.includes(scorerId)) return;
        totals[scorerId] = (totals[scorerId] || 0) + 1;
      });
    });
    const best = Object.entries(totals).sort((a, b) => b[1] - a[1])[0];
    return {
      keeperId,
      scorerId: best?.[0] || "",
      goals: best ? best[1] : 0
    };
  });
  return `<article class="rank-card"><h3>Verdugo del arquero | ${seasonLabel(selectedRivalrySeason)}</h3>${rows.map((row) => `
    <div class="rank-line"><span>${shortPlayerName(row.keeperId)}<br><small>${keeperSlayerText(row)}</small></span><strong>${row.goals ? `${row.goals} goles` : "-"}</strong></div>
  `).join("")}</article>`;
}

function keeperSlayerText(row) {
  if (!keeperHasMatches(row.keeperId, seasonMatches(selectedRivalrySeason))) return "aun no ha atajado";
  if (!row.scorerId) return "todavia no recibio goles";
  return `${shortPlayerName(row.scorerId)} lo tiene de hijo`;
}

function keeperHasMatches(keeperId, matches = state.matches) {
  return matches.some((match) => match.teamA.includes(keeperId) || match.teamB.includes(keeperId));
}

function renderAwards() {
  selectedAwardsSeason = renderSeasonOptions("awards-season", selectedAwardsSeason);
  const matches = seasonMatches(selectedAwardsSeason).slice().filter((m) => m.mvp).sort((a, b) => b.date.localeCompare(a.date));
  if (!matches.length) {
    $("awards-list").innerHTML = empty(`Todavia no hay MVP cargados para ${seasonLabel(selectedAwardsSeason)}.`);
    return;
  }
  $("awards-list").innerHTML = `<div class="mvp-grid">${matches.map((m) => `
    <article class="mvp-card">
      <div class="mvp-card-top">
        <span class="mvp-date">${m.date}</span>
        <span class="modal-pill">${m.venue || "Sin sede"}</span>
      </div>
      <div>
        <p class="eyebrow">MVP</p>
        <div class="mvp-name">${byId(m.mvp)?.nickname || "Jugador eliminado"}</div>
      </div>
      <span class="winner-badge ${matchOutcome(m) === "Empate" ? "draw" : ""}">${matchOutcome(m)}</span>
    </article>
  `).join("")}</div>`;
}

function renderGallery() {
  const allImages = [...(state.galleryUploads || []), ...galleryImages];
  $("gallery-grid").innerHTML = allImages.map((src, index) => `
    <figure class="gallery-item">
      <img src="${src}" alt="Foto de Movimiento Balon ${index + 1}" loading="lazy" data-lightbox-src="${src}">
    </figure>
  `).join("");
}

function renderSurvey() {
  const grid = $("survey-player-cards");
  if (!grid) return;
  grid.innerHTML = state.players
    .slice()
    .sort((a, b) => a.nickname.localeCompare(b.nickname))
    .map((player) => surveyPlayerCard(player))
    .join("") || empty("No hay jugadores activos para votar.");
  if (isAdmin()) loadSurveyResponses();
}

function surveyPlayerCard(player) {
  return `
    <button class="player-card survey-pick-card ${cardVisualClass(player)}" type="button" data-survey-player="${player.id}">
      <span class="card-watermark">MB</span>
      <div class="card-top">
        <div><div class="rating">${rating(player)}</div><strong>${cardRoleLabel(player)}</strong></div>
        <div class="avatar">${player.photo ? `<img src="${player.photo}" alt="${player.nickname}" style="--photo-focus: ${player.photoFocus || "center 22%"}">` : initials(player.nickname)}</div>
      </div>
      <h3>${player.nickname}</h3>
      ${attributeGrid(player)}
      <span class="survey-vote-cta">Votar stats</span>
    </button>
  `;
}

function openSurveyModal(playerId) {
  $("survey-player").value = playerId;
  $("survey-message").textContent = "";
  renderSurveyPlayerPreview();
  renderSurveySliders();
  $("survey-modal").classList.remove("hidden");
}

function closeSurveyModal() {
  $("survey-modal").classList.add("hidden");
}

function renderSurveyPlayerPreview() {
  const player = byId($("survey-player")?.value);
  if (!player) {
    $("survey-player-preview").innerHTML = empty("Elegí un jugador activo.");
    return;
  }
  $("survey-player-preview").innerHTML = `
    <article class="survey-player-preview ${cardVisualClass(player)}">
      <div class="avatar">${player.photo ? `<img src="${player.photo}" alt="${player.nickname}" style="--photo-focus: ${player.photoFocus || "center 22%"}">` : initials(player.nickname)}</div>
      <div>
        <strong>${player.nickname}</strong>
        <span>${rating(player)} media actual | ${cardRoleLabel(player)}</span>
      </div>
    </article>
  `;
}

function renderSurveySliders() {
  const player = byId($("survey-player")?.value);
  $("survey-sliders").innerHTML = surveyStats.map(([key, label]) => {
    const value = player ? Number(key === "overall" ? rating(player) : player[key]) || 70 : 70;
    return `
      <label class="survey-slider">
        <span>${label}</span>
        <input type="range" min="1" max="99" value="${value}" data-survey-stat="${key}">
        <strong data-survey-value="${key}">${value}</strong>
      </label>
    `;
  }).join("");
}

function updateSurveySliderValue(input) {
  const value = document.querySelector(`[data-survey-value="${input.dataset.surveyStat}"]`);
  if (value) value.textContent = input.value;
}

function surveyPayload() {
  const player = byId($("survey-player").value);
  const scores = Object.fromEntries([...document.querySelectorAll("[data-survey-stat]")].map((input) => [input.dataset.surveyStat, Number(input.value)]));
  return {
    email: $("survey-email").value.trim(),
    player_id: player.id,
    player_name: player.nickname,
    overall: scores.overall,
    pace: scores.pace,
    shooting: scores.shooting,
    passing: scores.passing,
    dribbling: scores.dribbling,
    defense: scores.defense,
    physical: scores.physical
  };
}

async function submitSurvey() {
  if (!supabaseClient) {
    $("survey-message").textContent = "Para guardar respuestas online falta Supabase.";
    return;
  }
  const { error } = await supabaseClient.from("player_surveys").insert(surveyPayload());
  if (error) {
    $("survey-message").textContent = "No pude guardar. Revisá que hayas creado la tabla player_surveys.";
    return;
  }
  $("survey-message").textContent = "Encuesta enviada. Gracias por votar.";
  $("survey-form").reset();
  closeSurveyModal();
  if (isAdmin()) loadSurveyResponses();
}

async function loadSurveyResponses() {
  if (!supabaseClient || !isAdmin() || !$("survey-results")) return;
  const { data, error } = await supabaseClient
    .from("player_surveys")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) {
    $("survey-results").innerHTML = empty("No pude cargar respuestas. Revisá la tabla player_surveys.");
    return;
  }
  window.currentSurveyRows = data || [];
  renderSurveyResults(data || []);
}

function renderSurveyResults(rows) {
  if (!rows.length) {
    $("survey-results").innerHTML = empty("Todavía no hay respuestas.");
    return;
  }
  const groups = surveyGroups(rows);
  $("survey-results").innerHTML = `
    <div class="survey-player-group-grid">
      ${groups.map((group) => `
        <button class="survey-player-group-card" type="button" data-survey-group="${group.playerId}">
          <div>
            <strong>${group.playerName}</strong>
            <span>${group.count} voto${group.count === 1 ? "" : "s"}</span>
          </div>
          <b>${group.overall}</b>
          <small>Media sugerida</small>
        </button>
      `).join("")}
    </div>
    <div id="survey-group-detail" class="survey-group-detail">
      ${surveyGroupDetail(groups[0])}
    </div>
  `;
}

function surveyGroupDetail(group) {
  if (!group) return empty("Elegí un jugador para ver el detalle.");
  return `
    <div class="survey-group-head">
      <div>
        <p class="eyebrow">Detalle de votos</p>
        <h3>${group.playerName}</h3>
      </div>
      <span class="modal-pill">${group.count} voto${group.count === 1 ? "" : "s"}</span>
    </div>
    <div class="survey-response-list">
      ${group.rows.map((row) => `
        <article class="survey-response">
          <div class="survey-response-head">
            <div>
              <span>${row.email}</span>
              <small>${String(row.created_at || "").slice(0, 10)}</small>
            </div>
            <button class="text-btn danger" type="button" data-delete-survey="${row.id}">Borrar voto</button>
          </div>
          <div class="survey-response-stats">
            ${surveyStats.map(([key, label]) => surveyDiffPill(row, key, label)).join("")}
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function surveyDiffPill(row, key, label) {
  const player = byId(row.player_id);
  const current = player ? Number(key === "overall" ? rating(player) : player[key]) : null;
  const voted = Number(row[key]);
  const diffClass = current === null || voted === current ? "same" : voted > current ? "up" : "down";
  const text = current === null ? voted : `${current} -> ${voted}`;
  return `<span class="survey-diff ${diffClass}">${label} ${text}</span>`;
}

async function deleteSurveyVote(id) {
  if (!requireAdmin()) return;
  if (!confirm("Borrar este voto?")) return;
  const { data, error } = await supabaseClient
    .from("player_surveys")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) {
    alert("No pude borrar el voto. Revisá la política DELETE de player_surveys.");
    return;
  }
  if (!data?.length) {
    alert("Supabase no borró el voto. Ejecutá de nuevo el SQL de player_surveys para habilitar la política DELETE.");
    return;
  }
  loadSurveyResponses();
}

function surveyGroups(rows) {
  const map = new Map();
  rows.forEach((row) => {
    const item = map.get(row.player_id) || { playerId: row.player_id, playerName: row.player_name, count: 0, overall: 0, rows: [] };
    item.count += 1;
    item.overall += Number(row.overall || 0);
    item.rows.push(row);
    map.set(row.player_id, item);
  });
  return [...map.values()]
    .map((row) => ({ ...row, overall: Math.round(row.overall / row.count) }))
    .sort((a, b) => b.overall - a.overall || b.count - a.count);
}

function renderSelects() {
  const options = state.players.map((p) => `<option value="${p.id}">${p.nickname} (${playerPositionSummary(p)})</option>`).join("");
  ["team-a", "team-b"].forEach((id) => $(id).innerHTML = options);
  $("mvp").innerHTML = `<option value="">Sin MVP</option>${options}`;
  $("goal-of-match").innerHTML = `<option value="">Sin gol del partido</option>${options}`;
  renderMatchPlayerPicker();
  renderGoalPlayerPicker();
}

function empty(text) {
  return `<p class="muted">${text}</p>`;
}

function readMulti(id) {
  return [...$(id).selectedOptions].map((o) => o.value);
}

function setMulti(id, values) {
  [...$(id).options].forEach((o) => o.selected = values.includes(o.value));
}

function selectedTeamForPlayer(id) {
  if (readMulti("team-a").includes(id)) return "white";
  if (readMulti("team-b").includes(id)) return "black";
  return "";
}

function renderMatchPlayerPicker() {
  if (!$("match-player-picker")) return;
  $("match-player-picker").innerHTML = state.players.map((p) => {
    const team = selectedTeamForPlayer(p.id);
    const label = team === "white" ? "Blanco" : team === "black" ? "Negro" : "Libre";
    return `
      <button class="match-pick-card ${team}" type="button" data-match-player="${p.id}">
        <span class="pick-avatar">${p.photo ? `<img src="${p.photo}" alt="${p.nickname}" style="--photo-focus: ${p.photoFocus || "center 22%"}">` : initials(p.nickname)}</span>
        <strong>${p.nickname}</strong>
        <small>${rating(p)} | ${playerPositionSummary(p)}</small>
        <em>${label}</em>
      </button>
    `;
  }).join("");
}

function setPlayerTeam(id, team) {
  const teamA = $("team-a").querySelector(`option[value="${id}"]`);
  const teamB = $("team-b").querySelector(`option[value="${id}"]`);
  if (!teamA || !teamB) return;
  teamA.selected = team === "white";
  teamB.selected = team === "black";
  const activePlayers = new Set(matchPlayerIds());
  const counts = scorerCountMap();
  Object.keys(counts).forEach((playerId) => {
    if (!activePlayers.has(playerId)) delete counts[playerId];
  });
  writeScorersFromCounts(counts);
  renderMatchPlayerPicker();
  renderGoalPlayerPicker();
}

function nextPlayerTeam(id) {
  const current = selectedTeamForPlayer(id);
  if (!current) return "white";
  if (current === "white") return "black";
  return "";
}

function scorerIdsFromField() {
  return parsePlayerList($("scorers").value);
}

function scorerCountMap() {
  return scorerIdsFromField().reduce((map, id) => {
    map[id] = (map[id] || 0) + 1;
    return map;
  }, {});
}

function writeScorersFromCounts(counts) {
  const ids = Object.entries(counts).flatMap(([id, count]) => Array.from({ length: Number(count) || 0 }, () => id));
  $("scorers").value = namesFromIds(ids);
}

function matchPlayerIds() {
  return [...new Set([...readMulti("team-a"), ...readMulti("team-b")])];
}

function renderGoalPlayerPicker() {
  if (!$("goal-player-picker")) return;
  const counts = scorerCountMap();
  const ids = matchPlayerIds();
  const players = ids.length ? ids.map(byId).filter(Boolean) : state.players;
  $("goal-player-picker").innerHTML = players.map((p) => `
    <button class="goal-pick-card" type="button" data-goal-player="${p.id}">
      <span>${p.nickname}</span>
      <strong>${counts[p.id] || 0}</strong>
    </button>
  `).join("") || empty("Primero seleccioná jugadores para los equipos.");
}

function openGoalModal(id) {
  const player = byId(id);
  if (!player) return;
  $("goal-player-id").value = id;
  $("goal-player-name").textContent = player.nickname;
  $("goal-count").value = scorerCountMap()[id] || 0;
  $("goal-modal").classList.remove("hidden");
}

function closeGoalModal() {
  $("goal-modal").classList.add("hidden");
}

function saveGoalCount(count) {
  const id = $("goal-player-id").value;
  const counts = scorerCountMap();
  counts[id] = Math.max(0, Number(count) || 0);
  writeScorersFromCounts(counts);
  renderGoalPlayerPicker();
  closeGoalModal();
}

function parsePlayerList(text) {
  return text.split(/\n|;/)
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => findPlayerByInput(name)?.id)
    .filter(Boolean);
}

function normalizeName(name) {
  return name.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/["']/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function findPlayerByInput(input) {
  const normalized = normalizeName(input);
  const exact = state.players.find((p) => normalizeName(p.nickname) === normalized);
  if (exact) return exact;
  const partial = state.players.filter((p) => normalizeName(p.nickname).includes(normalized));
  return partial.length === 1 ? partial[0] : null;
}

function namesFromIds(ids) {
  return ids.map((id) => byId(id)?.nickname).filter(Boolean).join("\n");
}

function playerFromFormPreview() {
  const id = $("player-id").value || "preview";
  const isKeeper = goalkeeperIds.includes(id) || $("positionPrimary").value === "goalkeeper";
  return {
    id,
    position: isKeeper ? "Arquero" : primaryLegacyPosition({
      id,
      positionPrimary: $("positionPrimary").value,
      positionSecondary: $("positionSecondary").value
    }),
    positionPrimary: isKeeper ? "goalkeeper" : $("positionPrimary").value,
    positionSecondary: isKeeper ? "" : $("positionSecondary").value,
    overall: Number($("overall").value) || 0,
    pace: Number($("pace").value) || 0,
    shooting: Number($("shooting").value) || 0,
    passing: Number($("passing").value) || 0,
    dribbling: Number($("dribbling").value) || 0,
    defense: Number($("defense").value) || 0,
    physical: Number($("physical").value) || 0
  };
}

function positionSuggestionRows(player) {
  const positions = playerPositions(player);
  if (!positions.length) return [];
  return positions.map((position) => ({
    position,
    label: positionLabel(position),
    value: suggestedRatingForPosition(player, position)
  }));
}

function updatePositionRatingSummary() {
  const summary = $("position-rating-summary");
  if (!summary) return;
  const player = playerFromFormPreview();
  updateFormStatLabels(player);
  const rows = positionSuggestionRows(player);
  if (!rows.length) {
    summary.textContent = "Elegí una posición para ver la media sugerida.";
    return;
  }
  const best = Math.max(...rows.map((row) => row.value));
  summary.innerHTML = `${rows.map((row) => `${row.label}: <strong>${row.value}</strong>`).join(" | ")} <span class="muted">Mejor sugerida: ${best}</span>`;
}

function applySuggestedRatingToForm() {
  const player = playerFromFormPreview();
  const rows = positionSuggestionRows(player);
  if (!rows.length) return;
  $("overall").value = Math.max(...rows.map((row) => row.value));
  updatePositionRatingSummary();
}

function updateFormStatLabels(player) {
  const primary = playerPositions(player)[0] || "midfielder";
  const labels = positionRatings[primary]?.statLabels || positionRatings.midfielder.statLabels;
  Object.entries(labels).forEach(([key, label]) => {
    const target = $(`${key}-label`);
    if (target) target.textContent = label;
  });
  const secondary = $("positionSecondary");
  if (secondary) {
    secondary.disabled = primary === "goalkeeper";
    if (primary === "goalkeeper") secondary.value = "";
  }
}

function revealPlayerForm() {
  const form = $("player-form");
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === "players"));
  document.querySelectorAll(".panel").forEach((p) => p.classList.toggle("active", p.id === "players"));
  form.classList.remove("hidden");
  form.removeAttribute("hidden");
  requestAnimationFrame(() => {
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    $("nickname").focus({ preventScroll: true });
  });
}

window.editPlayer = (id) => {
  if (!requireAdmin()) return;
  const p = byId(id);
  $("player-id").value = p.id;
  ["nickname", "foot", "photo", "cardStyle", "overall", "pace", "shooting", "passing", "dribbling", "defense", "physical"].forEach((key) => {
    $(key).value = key === "overall" ? rating(p) : p[key];
  });
  $("positionPrimary").value = playerPositions(p)[0] || "midfielder";
  $("positionSecondary").value = playerPositions(p)[1] || "";
  $("applySuggestedRating").checked = false;
  $("playerGallery").value = normalizeGalleryList(p.gallery).join("\n");
  updatePositionRatingSummary();
  revealPlayerForm();
};

window.deletePlayer = (id) => {
  if (!requireAdmin()) return;
  if (!confirm("Eliminar este jugador tambien lo quita de futuros calculos visibles.")) return;
  state.players = state.players.filter((p) => p.id !== id);
  renderAll();
};

window.editMatch = (id) => {
  if (!requireAdmin()) return;
  const m = state.matches.find((match) => match.id === id);
  $("match-id").value = m.id;
  $("match-date").value = m.date;
  $("venue").value = m.venue;
  $("match-outcome").value = m.scoreA > m.scoreB ? "A" : m.scoreB > m.scoreA ? "B" : "draw";
  $("mvp").value = m.mvp;
  $("goal-of-match").value = m.goalOfMatch || "";
  $("newsText").value = m.newsText || "";
  $("comment").value = m.comment;
  setMulti("team-a", m.teamA);
  setMulti("team-b", m.teamB);
  $("scorers").value = namesFromIds(m.scorers);
  renderMatchPlayerPicker();
  renderGoalPlayerPicker();
  $("match-form").classList.remove("hidden");
};

window.deleteMatch = (id) => {
  if (!requireAdmin()) return;
  if (!confirm("Eliminar este partido?")) return;
  state.matches = state.matches.filter((m) => m.id !== id);
  renderAll();
};

document.querySelectorAll(".tab, [data-tab-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.tab || button.dataset.tabJump;
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === id));
    document.querySelectorAll(".panel").forEach((p) => p.classList.toggle("active", p.id === id));
    document.querySelector(".app-shell").scrollIntoView({ behavior: "smooth" });
  });
});

$("calendar-grid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-calendar-date]");
  if (!button) return;
  selectedCalendarDate = button.dataset.calendarDate;
  const matches = state.matches.filter((match) => match.date === selectedCalendarDate);
  renderCalendar();
  if (matches.length) openMatchModal(matches[0]);
});

$("pairs-grid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-pair-key]");
  if (!button) return;
  openPairModal(button.dataset.pairKey);
});

$("player-cards").addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-player]");
  if (editButton) {
    event.preventDefault();
    event.stopPropagation();
    window.editPlayer(editButton.dataset.editPlayer);
    return;
  }
  const deleteButton = event.target.closest("[data-delete-player]");
  if (deleteButton) {
    event.preventDefault();
    event.stopPropagation();
    window.deletePlayer(deleteButton.dataset.deletePlayer);
    return;
  }
  if (event.target.closest("button")) return;
  const card = event.target.closest("[data-open-player]");
  if (!card) return;
  openPlayerModal(card.dataset.openPlayer);
});

$("close-match-modal").addEventListener("click", closeMatchModal);
$("match-modal").addEventListener("click", (event) => {
  if (event.target.id === "match-modal") closeMatchModal();
  const galleryButton = event.target.closest("[data-open-player-gallery]");
  if (galleryButton) openPlayerGallery(galleryButton.dataset.openPlayerGallery);
  const backButton = event.target.closest("[data-back-player]");
  if (backButton) openPlayerModal(backButton.dataset.backPlayer);
  const uploadButton = event.target.closest("[data-upload-player-gallery]");
  if (uploadButton) uploadPlayerGallery(uploadButton.dataset.uploadPlayerGallery);
  const editPlayerButton = event.target.closest("[data-edit-player-modal]");
  if (editPlayerButton) {
    closeMatchModal();
    window.editPlayer(editPlayerButton.dataset.editPlayerModal);
    return;
  }
  const stepButton = event.target.closest("[data-gallery-step]");
  if (stepButton) {
    const profile = event.target.closest("[data-player-profile]");
    if (profile) stepPlayerGallery(profile.dataset.playerProfile, Number(stepButton.dataset.galleryStep));
  }
});
$("match-modal").addEventListener("change", (event) => {
  if (event.target.id !== "profile-pair-season") return;
  selectedPlayerPairSeason = event.target.value;
  const profile = event.target.closest("[data-player-profile]");
  if (profile) openPlayerModal(profile.dataset.playerProfile);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !$("image-lightbox").classList.contains("hidden")) {
    closeImageLightbox();
    return;
  }
  if (event.key === "Escape") closeMatchModal();
});

$("prev-year").addEventListener("click", () => {
  calendarYear -= 1;
  selectedCalendarDate = null;
  renderCalendar();
});

$("next-year").addEventListener("click", () => {
  calendarYear += 1;
  selectedCalendarDate = null;
  renderCalendar();
});

$("new-player").addEventListener("click", () => {
  if (!requireAdmin()) return;
  $("player-form").reset();
  $("player-id").value = "";
  $("positionPrimary").value = "midfielder";
  $("positionSecondary").value = "";
  $("cardStyle").value = "normal";
  $("applySuggestedRating").checked = false;
  $("playerGallery").value = "";
  updatePositionRatingSummary();
  revealPlayerForm();
});
$("cancel-player").addEventListener("click", () => $("player-form").classList.add("hidden"));
["positionPrimary", "positionSecondary", "pace", "shooting", "passing", "dribbling", "defense", "physical"].forEach((id) => {
  $(id).addEventListener("input", updatePositionRatingSummary);
  $(id).addEventListener("change", updatePositionRatingSummary);
});
$("apply-suggested-rating").addEventListener("click", applySuggestedRatingToForm);
$("player-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requireAdmin()) return;
  const id = $("player-id").value || uid("player");
  const previous = byId(id) || {};
  if ($("applySuggestedRating").checked) applySuggestedRatingToForm();
  const isKeeper = goalkeeperIds.includes(id) || previous.position === "Arquero" || $("positionPrimary").value === "goalkeeper";
  const primary = isKeeper ? "goalkeeper" : $("positionPrimary").value;
  const secondary = isKeeper ? "" : $("positionSecondary").value;
  const player = {
    ...previous,
    id,
    nickname: $("nickname").value.trim(),
    position: isKeeper ? "Arquero" : positionRatings[primary]?.legacy || "Mediocampista",
    positionPrimary: primary,
    positionSecondary: secondary,
    foot: $("foot").value,
    photo: $("photo").value.trim(),
    gallery: normalizeGalleryList($("playerGallery").value),
    cardStyle: $("cardStyle").value,
    overall: Number($("overall").value),
    pace: Number($("pace").value),
    shooting: Number($("shooting").value),
    passing: Number($("passing").value),
    dribbling: Number($("dribbling").value),
    defense: Number($("defense").value),
    physical: Number($("physical").value)
  };
  const index = state.players.findIndex((p) => p.id === id);
  if (index >= 0) state.players[index] = player;
  else state.players.push(player);
  $("player-form").classList.add("hidden");
  renderAll();
  saveToCloud({ quiet: true });
});

$("new-match").addEventListener("click", () => {
  if (!requireAdmin()) return;
  $("match-form").reset();
  $("match-id").value = "";
  $("match-date").value = today();
  $("goal-of-match").value = "";
  setMulti("team-a", []);
  setMulti("team-b", []);
  $("scorers").value = "";
  renderMatchPlayerPicker();
  renderGoalPlayerPicker();
  $("match-form").classList.remove("hidden");
});
$("cancel-match").addEventListener("click", () => $("match-form").classList.add("hidden"));
$("match-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requireAdmin()) return;
  const id = $("match-id").value || uid("match");
  const score = outcomeToScore($("match-outcome").value);
  const match = {
    id,
    date: $("match-date").value,
    venue: $("venue").value.trim(),
    teamA: readMulti("team-a"),
    teamB: readMulti("team-b"),
    scoreA: score.scoreA,
    scoreB: score.scoreB,
    scorers: parsePlayerList($("scorers").value),
    assisters: [],
    mvp: $("mvp").value,
    goalOfMatch: $("goal-of-match").value,
    newsText: $("newsText").value.trim(),
    comment: $("comment").value.trim()
  };
  state.matches = state.matches.filter((m) => m.id !== id).concat(match);
  $("match-form").classList.add("hidden");
  renderAll();
  saveToCloud({ quiet: true });
});

$("match-player-picker").addEventListener("click", (event) => {
  const button = event.target.closest("[data-match-player]");
  if (!button) return;
  setPlayerTeam(button.dataset.matchPlayer, nextPlayerTeam(button.dataset.matchPlayer));
});

$("goal-player-picker").addEventListener("click", (event) => {
  const button = event.target.closest("[data-goal-player]");
  if (!button) return;
  openGoalModal(button.dataset.goalPlayer);
});

$("match-list").addEventListener("click", (event) => {
  const card = event.target.closest("[data-open-match]");
  if (!card) return;
  const match = state.matches.find((item) => item.id === card.dataset.openMatch);
  if (match) openMatchModal(match);
});

$("goal-close").addEventListener("click", closeGoalModal);
$("goal-modal").addEventListener("click", (event) => {
  if (event.target.id === "goal-modal") closeGoalModal();
});
$("goal-save").addEventListener("click", () => saveGoalCount($("goal-count").value));
$("goal-remove").addEventListener("click", () => saveGoalCount(0));
$("goal-minus").addEventListener("click", () => {
  $("goal-count").value = Math.max(0, Number($("goal-count").value) - 1);
});
$("goal-plus").addEventListener("click", () => {
  $("goal-count").value = Math.min(30, Number($("goal-count").value) + 1);
});

$("generate-teams").addEventListener("click", generateTeams);
$("confirmed-list").addEventListener("change", (event) => {
  if (event.target.matches("input[type='checkbox']")) enforceDrawLimit(event.target);
});
$("ranking-year").addEventListener("change", (event) => {
  selectedRankingYear = event.target.value;
  renderRankings();
});
$("pairs-season").addEventListener("change", (event) => {
  selectedPairsSeason = event.target.value;
  renderPairs();
});
$("rivalry-season").addEventListener("change", (event) => {
  selectedRivalrySeason = event.target.value;
  renderRivalries();
});
$("awards-season").addEventListener("change", (event) => {
  selectedAwardsSeason = event.target.value;
  renderAwards();
});
$("save-draw").addEventListener("click", () => {
  if (!requireAdmin()) return;
  if (!pendingDraw) return;
  const id = uid("match");
  state.matches.push({ id, date: today(), venue: "Partido sorteado", teamA: pendingDraw.teamA, teamB: pendingDraw.teamB, scoreA: 0, scoreB: 0, scorers: [], assisters: [], mvp: "", comment: "Partido generado desde el sorteador. Editar resultado al terminar." });
  pendingDraw = null;
  $("save-draw").classList.add("hidden");
  renderAll();
  document.querySelector('[data-tab="matches"]').click();
});

$("restore-roster").addEventListener("click", () => {
  if (!requireAdmin()) return;
  restoreRoster();
});
$("export-data").addEventListener("click", () => {
  if (!requireAdmin()) return;
  exportData();
});
$("import-data").addEventListener("click", () => {
  if (!requireAdmin()) return;
  $("import-file").click();
});
$("import-file").addEventListener("change", (event) => {
  if (!requireAdmin()) return;
  const file = event.target.files?.[0];
  if (!file) return;
  importData(file);
  event.target.value = "";
});
$("cloud-load").addEventListener("click", () => {
  if (!requireAdmin()) return;
  loadFromCloud();
});
$("cloud-save").addEventListener("click", saveToCloud);
// ===== PASTE LIST FEATURE =====

function normalizeForMatch(str) {
  return str.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

function fuzzyFindPlayer(name) {
  const norm = normalizeForMatch(name);
  if (!norm) return null;
  const matches = state.players.filter((p) => {
    const nickNorm = normalizeForMatch(p.nickname);
    if (nickNorm === norm) return true;
    const nickWords = nickNorm.split(/\s+/);
    const searchWords = norm.split(/\s+/);
    return searchWords.some((sw) =>
      nickWords.some((nw) => nw === sw || (sw.length >= 3 && (nw.startsWith(sw) || sw.startsWith(nw))))
    );
  });
  if (matches.length === 1) return { player: matches[0], ambiguous: false };
  if (matches.length > 1) return { player: matches[0], ambiguous: true, candidates: matches };
  return null;
}

function parsePasteList(text) {
  const lines = text.split(/\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  let currentTeam = null;
  const teams = { A: [], B: [] };
  for (const line of lines) {
    const norm = normalizeForMatch(line);
    if (norm.includes("blanco") || norm.includes("white") || norm === "a") {
      currentTeam = "A";
    } else if (norm.includes("negro") || norm.includes("black") || norm === "b") {
      currentTeam = "B";
    } else if (currentTeam) {
      teams[currentTeam].push(line);
    }
  }
  return teams;
}

function applyResolvedPlayers(resolved) {
  resolved.forEach(({ playerId, team }) => {
    if (playerId) setPlayerTeam(playerId, team === "A" ? "white" : "black");
  });
}

let pasteResolverCallback = null;

function openPasteResolver(unresolvedItems) {
  const rows = document.getElementById("paste-resolver-rows");
  rows.innerHTML = unresolvedItems.map((item, i) => `
    <div class="paste-resolve-row">
      <span class="paste-resolve-name">"${item.name}"</span>
      <span class="paste-resolve-team ${item.team === "A" ? "white" : "black"}">${item.team === "A" ? "Blanco" : "Negro"}</span>
      <select class="paste-resolve-select" data-resolve-index="${i}" data-resolve-team="${item.team}">
        <option value="">Ningún jugador</option>
        ${state.players.map((p) => {
          const pre = item.candidates && item.candidates.some((c) => c.id === p.id) ? "⬤ " : "";
          return `<option value="${p.id}"${item.candidates && item.candidates[0]?.id === p.id ? " selected" : ""}>${pre}${p.nickname}</option>`;
        }).join("")}
      </select>
    </div>
  `).join("");
  document.getElementById("paste-resolver-modal").classList.remove("hidden");
}

function closePasteResolver() {
  document.getElementById("paste-resolver-modal").classList.add("hidden");
  pasteResolverCallback = null;
}

function processPastedList() {
  const text = document.getElementById("paste-list-input").value;
  if (!text.trim()) return;
  const { A: namesA, B: namesB } = parsePasteList(text);
  if (!namesA.length && !namesB.length) {
    alert('No se encontraron equipos. Asegurate de incluir "Equipo blanco" y "Equipo negro" como encabezados.');
    return;
  }
  const resolved = [];
  const unresolved = [];
  const processTeam = (names, team) => {
    names.forEach((name) => {
      const result = fuzzyFindPlayer(name);
      if (result && !result.ambiguous) {
        resolved.push({ playerId: result.player.id, team });
      } else if (result && result.ambiguous) {
        unresolved.push({ name, team, candidates: result.candidates });
      } else {
        unresolved.push({ name, team, candidates: [] });
      }
    });
  };
  processTeam(namesA, "A");
  processTeam(namesB, "B");

  // First apply clearly resolved players
  applyResolvedPlayers(resolved);

  if (unresolved.length > 0) {
    openPasteResolver(unresolved);
  }
}

function bindIfExists(id, event, handler) {
  const el = document.getElementById(id);
  if (el) el.addEventListener(event, handler);
}

bindIfExists("paste-list-toggle", "click", () => {
  const box = document.getElementById("paste-list-box");
  if (box) box.classList.toggle("hidden");
});
bindIfExists("paste-list-apply", "click", processPastedList);
bindIfExists("paste-list-clear", "click", () => {
  state.players.forEach((p) => setPlayerTeam(p.id, ""));
  const input = document.getElementById("paste-list-input");
  if (input) input.value = "";
});
bindIfExists("paste-resolver-apply", "click", () => {
  const selects = document.querySelectorAll(".paste-resolve-select");
  selects.forEach((sel) => {
    const team = sel.dataset.resolveTeam;
    const playerId = sel.value;
    if (playerId) applyResolvedPlayers([{ playerId, team }]);
  });
  closePasteResolver();
});
bindIfExists("paste-resolver-close", "click", closePasteResolver);
bindIfExists("paste-resolver-skip", "click", closePasteResolver);
bindIfExists("paste-resolver-modal", "click", (e) => {
  if (e.target.id === "paste-resolver-modal") closePasteResolver();
});
$("player-gallery-file").addEventListener("change", async (event) => {
  await addPlayerGalleryFiles(event.target.files);
  event.target.value = "";
});

// News photo upload
let pendingNewsPhotoMatchId = "";
document.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-upload-news-photo]");
  if (!btn || !isAdmin()) return;
  pendingNewsPhotoMatchId = btn.dataset.uploadNewsPhoto;
  $("news-photo-file")?.click();
});
bindIfExists("news-photo-file", "change", async (event) => {
  const file = event.target.files[0];
  if (!file || !pendingNewsPhotoMatchId) return;
  try {
    const base64 = await compressImage(file);
    const match = state.matches.find(m => m.id === pendingNewsPhotoMatchId);
    if (match) { match.newsPhoto = base64; saveState(); renderDashboard(); }
  } catch(e) { console.error("Error subiendo foto de noticia:", e); }
  event.target.value = "";
});

// Scorer photo upload
let pendingScorerPhotoId = "";
document.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-upload-scorer-photo]");
  if (!btn || !isAdmin()) return;
  pendingScorerPhotoId = btn.dataset.uploadScorerPhoto;
  $("scorer-photo-file")?.click();
});
bindIfExists("scorer-photo-file", "change", async (event) => {
  const file = event.target.files[0];
  if (!file || !pendingScorerPhotoId) return;
  try {
    const base64 = await compressImage(file);
    const player = byId(pendingScorerPhotoId);
    if (player) { player.featurePhoto = base64; saveState(); renderTopScorer(); }
  } catch(e) { console.error("Error subiendo foto del goleador:", e); }
  event.target.value = "";
});

// Gallery upload
bindIfExists("gallery-upload-btn", "click", () => {
  if (!requireAdmin()) return;
  $("gallery-upload-file")?.click();
});
bindIfExists("gallery-upload-file", "change", async (event) => {
  const files = event.target.files;
  if (!files?.length) return;
  const images = await readGalleryFiles(files);
  if (!state.galleryUploads) state.galleryUploads = [];
  state.galleryUploads.unshift(...images);
  saveState();
  renderGallery();
  event.target.value = "";
});
document.addEventListener("click", (event) => {
  const image = event.target.closest("[data-lightbox-src]");
  if (!image) return;
  openImageLightbox(image.dataset.lightboxSrc, image.alt || "Imagen ampliada");
});
$("image-lightbox-close").addEventListener("click", closeImageLightbox);
$("image-lightbox").addEventListener("click", (event) => {
  if (event.target.id === "image-lightbox") closeImageLightbox();
});
// Dark mode
const savedTheme = localStorage.getItem("mb-theme") || "light";
if (savedTheme === "dark") document.body.dataset.theme = "dark";
document.getElementById("theme-toggle").textContent = savedTheme === "dark" ? "☀️" : "🌙";
document.getElementById("theme-toggle").addEventListener("click", () => {
  const isDark = document.body.dataset.theme === "dark";
  document.body.dataset.theme = isDark ? "light" : "dark";
  document.getElementById("theme-toggle").textContent = isDark ? "🌙" : "☀️";
  localStorage.setItem("mb-theme", isDark ? "light" : "dark");
});

// Tabla year selector
document.addEventListener("change", (event) => {
  if (event.target.id === "tabla-year") {
    selectedTablaYear = event.target.value;
    renderTabla();
  }
});

$("login-open").addEventListener("click", () => $("login-modal").classList.remove("hidden"));
$("login-close").addEventListener("click", closeLoginModal);
$("login-modal").addEventListener("click", (event) => {
  if (event.target.id === "login-modal") closeLoginModal();
});
$("login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  loginAdmin($("login-email").value.trim(), $("login-password").value);
});
$("logout-button").addEventListener("click", logoutAdmin);

renderAll();
setupSupabase();
loadFromCloud({ quiet: true });

function closeLoginModal() {
  $("login-modal").classList.add("hidden");
}
