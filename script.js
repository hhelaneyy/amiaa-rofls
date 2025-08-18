const logo = document.querySelector('.logo');
const overlay = document.getElementById('logoOverlay');

logo.addEventListener('click', () => {
  overlay.classList.add('active');
});

overlay.addEventListener('click', () => {
  overlay.classList.remove('active');
});

// ---------- Funfact functionality ----------
const facts = [
  "im very eepy today pls forgib me",
  "mepphy is evil",
  "LA LA LA LAVA CHI CHI CHI CHICKEN",
  "my favourite horse is a white horse cuz in german they're called Schimmel wich means mold",
  "I'VE BEEN WAITING A WHOLE YEAR FOR THIS",
  "I GOT SICK I SORRY I SORRY I SORRY I SORRY",
  "this is the last time you're seeing this model",
  "IM SCARED IM SCARED IM SCARED IM SCARED IM SCARED",
  "happy ptide month i like women",
  "I HAVENT SUNG IN WEEKS",
  "guess whos back back again ami's back tell a friend",
  "the amis yearn for the mines",
  "i stream on wifi again",
  "uhm uhm uhm uh uh uhm uh hm",
  "the female lombax (lorax) is BACK BABYYY",
  "luigi."
];

const funfactBtn = document.getElementById('funfact-btn');
const funfactText = document.getElementById('funfact-text');

funfactBtn.addEventListener('click', () => {
  const randomIndex = Math.floor(Math.random() * facts.length);
  funfactText.textContent = facts[randomIndex];
});
