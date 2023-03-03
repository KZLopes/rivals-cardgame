// Check if the player has a deck before asking for one
if(!localStorage.getItem('p1Deck')) { fetchDeck('p1Deck') }
if(!localStorage.getItem('p2Deck')) { fetchDeck('p2Deck') }
//not waiting for the request to return
// const p1Deck = localStorage.getItem('p1Deck')
// const p2Deck = localStorage.getItem('p2Deck')
let decks = [localStorage.getItem('p1Deck'), localStorage.getItem('p2Deck')];
let numOfDraws = 1;

restart(decks);

document.querySelector('.draw').addEventListener('click', () => drawCard(decks, numOfDraws));
document.querySelector('[name="restart"]').addEventListener('click', () => restart(decks));

// Grab a new deck to the player
async function fetchDeck(storageKey){  
    await fetch(`https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`)
    .then(res => res.json())
    .then(data => {
      localStorage.setItem(`${storageKey}`, data.deck_id);
    })
    .catch(err => {
      console.log(`Error while fetching deck. error ${err}`)
    });
};
// Draw cards from each deck and calls the resolution function
function drawCard(decksArr, num=1) {
  let cardsInPlay = [];
  let remainingCards;
  decksArr.forEach((id, index) => {
    fetch(`https://www.deckofcardsapi.com/api/deck/${id}/draw/?count=${num}`)
    .then(res => res.json())
    .then(data => {
      let currentCard = data.cards[num-1];
      
      remainingCards = data.remaining;
      cardsInPlay[index] = (currentCard);

      document.querySelector(`#p${index+1} img`).src = currentCard.image;    
      document.querySelector(`#p${index+1} span`).textContent = `Remaining Cards ${remainingCards}`;

    })
    .then(() => {
      resolution(cardsInPlay, remainingCards);      
    })
    .catch(err => {
      console.log(`error while drawing from ${id}.\n${err}`);
    });     
  }); 
};
// Evaluates which player wins the round
function resolution(cardsArr, remaining) {
  let p1Card = setCardValue(cardsArr[0]);
  let p2Card = setCardValue(cardsArr[1]);
  
  if (p1Card>p2Card){
    document.querySelector('.outcome').textContent = 'Player 1 Wins';
    // Update scoreboard
    // document.querySelector(`.scoreboard .p1`).textContent = `{p1Score++}`
    numOfDraws = 1;
  }else if (p2Card>p1Card){
    document.querySelector('.outcome').textContent = 'Player 2 Wins';
    // Update scoreboard 
    // document.querySelector(`.scoreboard .p2`).textContent = `{p2Score++}`
    numOfDraws = 1;
  }else {
    document.querySelector('.outcome').textContent = 'RUMBLE!';
    if (remaining < 4){
      numOfDraws = remaining;
    }else {
      numOfDraws = 4;
    }
  }
};
// Shuffle all the cards back to their respective decks
function restart(decksArr) {
  decksArr.forEach ((id, index) => {
    fetch(`https://www.deckofcardsapi.com/api/deck/${id}/shuffle/`)
    .then(res => res.json())
    .then(data => {
      document.querySelector(`#p${index+1} img`).src = './media/img/cardback.png';
      document.querySelector(`#p${index+1} span`).textContent = `Remaining Cards ${data.remaining}`;
      document.querySelector('.outcome').textContent = '';
    })
    .catch(err => {
      console.log(`Error in restart method. error ${err}`)
    });
  })
  // reset scoreboard and numOfDraws variable
  // p1Score = 0;
  // document.querySelector(`.scoreboard .p1`).textContent = `{p1Score}`
  // p2Score = 0;
  // document.querySelector(`.scoreboard .p2`).textContent = `{p2Score}`
  numOfDraws = 1;

};
// Converts card values to be numeric
function setCardValue (card) {
  let val = card.value;
  switch (val) {
    case 'ACE':
      val = 1;
      return Number(val)
      break;
    case 'JACK':
      val = 11;
      return Number(val)
      break;
    case 'QUEEN':
      val = 12;
      return Number(val)
      break;
    case 'KING':
      val = 13;
      return Number(val)
      break;
    default:
      return Number(val)
      break;
  }
};