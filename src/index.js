DESTINATIONS_URL = "http://localhost:3000/destinations";

DESTINATIONS = [];
// when you click on a button ... you delete the child nodes and replace it with the new ones to display a new html
function main(){
    fetchDestinations();
    document.addEventListener('DOMContentLoaded', () => { 
        homePage(); 
    })
}

main(); 

// ----------------------------

// BACKGROUND - DISPLAY
function background(){
    const head = document.querySelector('head'); 
    const style = document.createElement('link'); 
    style.rel = 'stylesheet'; 
    style.type = 'text/css'; 
    style.href = 'styles.css'; 
    head.appendChild(style); 
}

// NAVBAR - DISPLAY
// might have to add an event listener to each button
function navBar(){
    const body = document.querySelector('body'); 

    const form = document.createElement('form'); 
    form.id = 'navbar'; 

    const div = document.createElement('div'); 
    div.className = "ui massive secondary menu"; 

    const account = document.createElement('a'); 
    account.className = 'toc item'; 
    const account_icon = document.createElement('i'); 
    account_icon.className = 'user icon'; 
    account.appendChild(account_icon); 
    
    const home = document.createElement('a'); 
    home.className = 'item'; 
    home.innerText = 'Home'; 

    const itins = document.createElement('a'); 
    itins.className = 'item'; 
    itins.innerText = 'Itineraries'; 

    const favorites = document.createElement('a'); 
    favorites.className = 'item'; 
    favorites.innerText = 'Favorites'

    const log_out = document.createElement('a'); 
    log_out.className = 'right item'; 
    log_out.innerText = 'Log Out';
    
    div.appendChild(account); 
    div.appendChild(home); 
    div.appendChild(itins); 
    div.appendChild(favorites); 
    div.appendChild(log_out); 
    form.appendChild(div); 
    body.appendChild(form); 
}

// SEARCHBAR - DISPLAY
function searchBar(){
    const body = document.querySelector('body'); 

    const form = document.createElement('form'); 
    form.id = 'search_form';
    // or keydown
    form.addEventListener('submit', event => {
        search(event);
    });  

    const div = document.createElement('div'); 
    div.className = 'ui center aligned text container'; 
    div.id = 'search_bar'; 

    const h1 = document.createElement('h1'); 
    h1.className = 'ui huge inverted header'; 

    const div2 = document.createElement('div'); 
    div2.className = 'ui transparent icon input'; 

    const input = document.createElement('input'); 
    input.id = 'search_input'; 
    input.type = 'text'; 

    input.placeholder = 'Your Adventure Begins...'; 

    div2.appendChild(input);
    h1.appendChild(div2); 
    div.appendChild(h1); 
    form.appendChild(div); 
    body.appendChild(form); 
}

function homePage(){
    background(); 
    navBar(); 
    searchBar(); 
}

// --------------------------REMOVE SEARCH BAR

function removeSearchBar(){
    // delete child nodes in body 
    const form = document.querySelector('#search_form'); 
    const body = document.querySelector('body'); 
    body.removeChild(form); 
}

// --------------------------

// SEARCHING
function fetchDestinations(){
    fetch(DESTINATIONS_URL)
    .then(response => response.json())
    .then(data => {
        data.forEach(destination => {
            DESTINATIONS.push(destination); 
        })
    })
}

function search(event){
    event.preventDefault();
    const location = document.querySelector('#search_input').value; 
    removeSearchBar();

    findDestination(location); 
}



function findDestination(location){
    DESTINATIONS.forEach(destination => {
        if(destination.location === location){
            fetch(DESTINATIONS_URL + `/${destination.id}`)
            .then(response => response.json())
            .then(data => renderSearchedItineraries(data, location))
        }
    })   
}   

function renderSearchedItineraries(data, location){
    console.log(location);
    const body = document.querySelector('body'); 

    // use Object.keys
    const itineraries = []; 
    data.one_days.forEach(x => {
        itineraries.push(x); 
    })

    data.two_days.forEach(x => {
        itineraries.push(x); 
    })

    console.log(itineraries);

    const h2  = document.createElement('h2'); 
    h2.className = 'ui header';
    h2.id = 'destination_show'; 
    h2.innerText = location; 
    body.appendChild(h2);

    const container = document.createElement('div'); 
    container.className = 'ui centered container'; 

    const segment = document.createElement('div'); 
    segment.className = 'ui segment'; 

    const div = document.createElement('div'); 
    div.className = 'ui divided items';
    
    const item = document.createElement('item'); 
    item.className = 'item'; 

    itineraries.forEach(i => {
         item.innerHTML =  `<div class="image">
                                    <img src=${i.images[0].picture}>
                                </div>
                                <div class="content">
                                    <a class="header">${i.title}</a>
                                    <div class="meta">
                                        <span class="cinema">${i.genre.name}</span>
                                        <span class="right floated cinema">${i.created_at}</span>
                                    </div>
                                    <div class="description">
                                        <p>${i.summary}</p>
                                    </div>
                                    <div class="extra">
                                        <div class="ui label"><i class="comment icon"></i>3 comments</div>
                                        <div class="ui label"><i class="heart outline like icon"></i>17 likes</div>
                                        <span class="right floated author">
                                            <img class="ui avatar image" src=${i.user.profile_pic}>${i.user.username}
                                        </span>
                                    </div>
                            </div>`;
        div.appendChild(item);     
    })


    segment.appendChild(div); 
    container.appendChild(segment);  
    body.appendChild(container); 
}


// ------------------------
