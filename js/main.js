if(!localStorage.getItem('p1Deck')) { fetchDeck('p1Deck') }
if(!localStorage.getItem('p2Deck')) { fetchDeck('p2Deck') }
//not waiting for the request to return
const p1Deck = localStorage.getItem('p1Deck')
const p2Deck = localStorage.getItem('p2Deck')
let decks = [p1Deck, p2Deck];

restart(decks);

document.querySelector('.draw').addEventListener('click', () => drawCard(decks));
document.querySelector('[name="restart"]').addEventListener('click', () => restart(decks));

async function fetchDeck(storageKey){  
    await fetch(`https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`)
    .then(res => res.json())
    .then(data => {
      localStorage.setItem(`${storageKey}`, data.deck_id);
    })
    .catch(err => {
      console.log(`Error while P1 fetching deck. error ${err}`)
    });
  };

function drawCard(decksArr, num=1) {
  let cardsInPlay = [];
  decksArr.forEach((id, index) => {
    fetch(`https://www.deckofcardsapi.com/api/deck/${id}/draw/?count=${num}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      document.querySelector(`#p${index+1} img`).src = data.cards[num-1].image;    
      document.querySelector(`#p${index+1} span`).textContent = `Remaining Cards ${data.remaining}`;
      cardsInPlay[index] = (data.cards[num-1]);
    })
    .then(() => {
      resolution(cardsInPlay);
    })
    .catch(err => {
      console.log(`error while drawing from ${id}.\n${err}`);
    });     
  }); 
}

// Evaluates which player wins the round
function resolution(cardsArr) {
  let p1Card = setCardValue(cardsArr[0]);
  let p2Card = setCardValue(cardsArr[1]);

  console.log('p1 ->' + p1Card);
  console.log('p2 ->' + p2Card);
  
  if (p1Card>p2Card){
    document.querySelector('.outcome').textContent = 'Player 1 Wins';
    // Update scoreboard 
  }else if (p2Card>p1Card){
    document.querySelector('.outcome').textContent = 'Player 2 Wins';
    // Update scoreboard 
  }else {
    document.querySelector('.outcome').textContent = 'RUMBLE!';
    // rumble();
  }
  
}

function rumble() {
  // Bet the top 3 cards of players deck, use the fourth to resolve the conflict;
}

function restart(decksArr) {
  decksArr.forEach ((id, index) => {
    fetch(`https://www.deckofcardsapi.com/api/deck/${id}/shuffle/`)
    .then(res => res.json())
    .then(data => {
      document.querySelector(`#p${index+1} img`).src = './media/img/cardback.png';
      document.querySelector(`#p${index+1} span`).textContent = `Remaining Cards ${data.remaining}`;
      // document.querySelector('outcome').textContent = '';
    })
    .catch(err => {
      console.log(`Error in restart method. error ${err}`)
    });
  })
}

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
}