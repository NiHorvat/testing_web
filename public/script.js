let currentCardIndex = 0;
let cards = [];
let likesCount = 0;
let nopesCount = 0;
let isAnimating = false;

// Create and add counters first
const countersDiv = document.createElement('div');
countersDiv.className = 'counters';
countersDiv.innerHTML = `
    <div class="counter likes-counter">
        <span class="counter-label">LIKES</span>
        <span class="counter-value" id="likesCount">0</span>
    </div>
    <div class="counter nopes-counter">
        <span class="counter-label">NOPES</span>
        <span class="counter-value" id="nopesCount">0</span>
    </div>
`;
document.body.appendChild(countersDiv);

// Fetch data from your API endpoint
fetch('/api/entries')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('entriesContainer');
        
        // Add buttons container
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'action-buttons';
        buttonsDiv.innerHTML = `
            <button class="reject-button">✕</button>
            <button class="accept-button">♥</button>
        `;
        container.appendChild(buttonsDiv);

        // Add end message div
        const endMessageDiv = document.createElement('div');
        endMessageDiv.className = 'end-message';
        endMessageDiv.style.display = 'none';
        endMessageDiv.innerHTML = `
            <div class="end-emoji">🎉</div>
            <h2>No More Cards!</h2>
            <p>You've liked ${likesCount} 💚 and rejected ${nopesCount} ❌ cards</p>
            <div class="final-emoji">${likesCount > nopesCount ? '🥳' : '😎'}</div>
        `;
        container.appendChild(endMessageDiv);

        // Create and append all cards
        data.forEach((entry, index) => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'entry-card';
            entryDiv.style.visibility = index === 0 ? 'visible' : 'hidden';
            entryDiv.style.pointerEvents = index === 0 ? 'auto' : 'none';
            entryDiv.innerHTML = `
                <div class="swipe-indicator like-indicator">LIKE</div>
                <div class="swipe-indicator nope-indicator">NOPE</div>
                <h3>${entry.name} ${entry.surname}</h3>
                <p>Age: ${entry.age}</p>
                <span class="timestamp">${new Date(entry.created_at).toLocaleDateString()}</span>
            `;
            container.appendChild(entryDiv);
            cards.push(entryDiv);
        });

        // Add button click handlers
        const acceptButton = document.querySelector('.accept-button');
        const rejectButton = document.querySelector('.reject-button');

        acceptButton.addEventListener('click', () => swipeCard('right'));
        rejectButton.addEventListener('click', () => swipeCard('left'));
    })
    .catch(error => console.error('Error:', error));

function updateCounters() {
    document.getElementById('likesCount').textContent = likesCount;
    document.getElementById('nopesCount').textContent = nopesCount;
}

function showEndMessage() {
    const endMessage = document.querySelector('.end-message');
    const buttons = document.querySelector('.action-buttons');
    
    endMessage.querySelector('p').textContent = 
        `You've liked ${likesCount} 💚 and rejected ${nopesCount} ❌ cards`;
    endMessage.querySelector('.final-emoji').textContent = 
        likesCount > nopesCount ? '🥳' : '😎';
    
    endMessage.style.display = 'block';
    buttons.style.display = 'none';
}

function swipeCard(direction) {
    if (isAnimating || cards.length === 0) return;
    
    isAnimating = true;
    const currentCard = cards[0];
    const moveOutWidth = document.body.clientWidth * 1.5;
    const rotation = direction === 'right' ? 30 : -30;

    // Update counters
    if (direction === 'right') {
        likesCount++;
    } else {
        nopesCount++;
    }
    updateCounters();

    // Animate current card out
    currentCard.style.transition = 'transform 0.3s ease';
    currentCard.style.transform = `translate(${direction === 'right' ? moveOutWidth : -moveOutWidth}px, 0) rotate(${rotation}deg)`;

    setTimeout(() => {
        currentCard.classList.add('removed');
        currentCard.remove();
        cards.shift();
        
        if (cards.length === 0) {
            showEndMessage();
        } else {
            // Show next card
            cards[0].style.visibility = 'visible';
            cards[0].style.pointerEvents = 'auto';
        }
        isAnimating = false;
    }, 300);
}