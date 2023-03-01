document.querySelector('[name="newDeck"]').addEventListener('click', fetchDeck);
document.querySelector('[name="start"]').addEventListener('click', fetchDeck)
// document.querySelector('button').addEventListener('click', getFetch)
// document.querySelector('button').addEventListener('click', getFetch)

function fetchDeck(){
  fetch(`https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      let deck = data.deck_id;

      document.querySelector('#playmat>h2').textContent = 'Consider our fight... Begun';
      document.querySelector('section>span').textContent = `Remaining Cards ${data.remaining}`;

      drawCard(deck)    
      
      
    })
    .catch(err => {
      console.log(`error ${err}`)
    });
  }
  
  function drawCard(deck) {
    fetch(`https://www.deckofcardsapi.com/api/deck/${deck}/draw/?count=1`)
    .then(res => res.json())
    .then(data => {
      document.querySelector('#p1 img').src = data.cards[0].image;

      resolution();      
  })
  .catch(err => {
    console.log(`error ${err}`)
  });

}

function clash() {
  // bet the top 3 cards of players deck, use the fourth to resolve the conflict;
}

function resolution(card1, card2) {
  //evaluates which player wins the round
}


// function (){
//    fetch(url)
//       .then(res => res.json()) // parse response as JSON
//       .then(data => {
       
//       })
//       .catch(err => {
//           console.log(`error ${err}`)
//       });
// }