const Gamedig = require('gamedig');

gamePromises = [];
servers = ['gravy.breakfastcraft.com', 'brunch.breakfastcraft.com'];

Gamedig.query({ type: 'minecraftping', host: 'gravy.breakfastcraft.com'}).then( (state) => {
console.log(state);
});
