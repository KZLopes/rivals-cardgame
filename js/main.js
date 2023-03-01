if (!localStorage.getItem('personalDeck')) {fetchDeck()};
const myDeck = localStorage.getItem('personalDeck');
  
document.querySelector('.draw').addEventListener('click', () => drawCard(myDeck));
document.querySelector('[name="restart"]').addEventListener('click', () => restart(myDeck));

function fetchDeck(){  
  fetch(`https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`)
  .then(res => res.json())
  .then(data => {
    localStorage.setItem('personalDeck', data.deck_id);
  })
  .catch(err => {
    console.log(`Error while fetching deck. error ${err}`)
  });
}

function drawCard(deckId, num=1) {
  fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=${num}`)
  .then(res => res.json())
  .then(data => {
    // Create a specific function to update text??
    document.querySelector('#p1 img').src = data.cards[num-1].image;    
    document.querySelector('section>span').textContent = `Remaining Cards ${data.remaining}`; 
    resolution(data.cards[num-1], data.cards[num-1]);      

  })
  .catch(err => {
    console.log(`error ${err}`);
  })
}

function resolution(card1, card2) {
  card1 = setCardValue(card1);
  card2 = setCardValue(card2);
  // Evaluates which player wins the round
  if (card1>card2){
    document.querySelector('.outcome').textContent = 'Player 1 Wins';
    // Update scoreboard when implemented
    // Add BOTH cards to P1 pile
  }else if (card2>card1){
    document.querySelector('.outcome').textContent = 'Player 2 Wins';
    // Update scoreboard when implemented
    // Add BOTH cards to P2 pile
  }else {
    document.querySelector('.outcome').textContent = 'RUMBLE!';
    rumble();
  }
}

function rumble() {
  drawCard(myDeck, 4)
  // Bet the top 3 cards of players deck, use the fourth to resolve the conflict;
}

function restart(deckId) {
  fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/shuffle/`)
  .then(res => res.json())
  .then(data => {
    document.querySelector('section>span').textContent = `Remaining Cards ${data.remaining}`;       
    
    document.querySelector('#p1 img').src = './media/img/cardback.png';
    // document.querySelector('outcome').textContent = '';
  })
  .catch(err => {
    console.log(`Error while shuffling deck. error ${err}`)
  });
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