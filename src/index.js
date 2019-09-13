DESTINATIONS_URL = "http://localhost:3000/destinations";

DESTINATIONS = [];
// when you click on a button ... you delete the child nodes and replace it with the new ones to display a new html
function main(){
    fetchDestinations();
    document.addEventListener('DOMContentLoaded', () => { 
        destroyUser(); 
        homePage(); 
        logIn(); 
        navBarListeners(); 
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

// SEARCHBAR - DISPLAY
function searchBar(){
    const body = document.querySelector('#js'); 

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
    searchBar(); 
}

// --------------------------REMOVE SEARCH BAR

function clear(){
    const body = document.querySelector('#js');    
    while(body.firstChild){
        body.removeChild(body.firstChild); 
    }
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
    clear(); 
    findDestination(location); 
}



function findDestination(location){
    const body = document.querySelector('#js'); 
    DESTINATIONS.forEach(destination => {
        if(destination.location === location){
            const h2  = document.createElement('h2'); 
            h2.className = 'ui header';
            h2.id = 'destination_show'; 
            h2.innerText = location;
            body.append(h2); 

            fetch(DESTINATIONS_URL + `/${destination.id}`)
            .then(response => response.json())
            .then(data => renderSearchedItineraries(data))
        }
    })   
}   


// --------RENDER SEARCHED ITINS---------------

function renderSearchedItineraries(data){
    const body = document.querySelector('#js'); 

    const itineraries = []; 
    data.one_days.forEach(x => {
        itineraries.push(x); 
    })

    data.two_days.forEach(x => {
        itineraries.push(x); 
    })


    if(itineraries.length > 0){
        const container = document.createElement('div'); 
        container.className = 'ui centered container'; 

        const segment = document.createElement('div'); 
        segment.className = 'ui segment'; 

        const div = document.createElement('div'); 
        div.className = 'ui divided items';

        renderItem(div, itineraries); 

        segment.appendChild(div); 
        container.appendChild(segment);
 
        body.appendChild(container); 
    };  
}


function renderItem(node, array){
    array.forEach(i => {
        const item = document.createElement('div'); 
        item.className = 'item'; 
        // --------image_div
        const div_image = document.createElement('div'); 
        div_image.className = 'image'; 

        const itin_img = document.createElement('img'); 
        itin_img.className = 'ui rounded image'
        itin_img.src = i.images[0].picture; 

        div_image.appendChild(itin_img); 
        // -----------------------------
        // content_div
        const content = document.createElement('div'); 
        content.className = 'content'; 

        const header = document.createElement('a'); 
        header.className = 'header'; 
        header.dataset.id = i.id; 
        header.innerText = i.title; 
        header.addEventListener('click', (event) => {
            fetchItin(event, i); 
        })

        const meta_data = document.createElement('div'); 
        meta_data.className = 'meta'; 

        const genre = document.createElement('span'); 
        genre.className = 'cinema'; 
        genre.innerText = i.genre.name; 

        const date = document.createElement('span'); 
        date.className = 'right floated cinema'; 
        date.innerText = i.created_at; 

        meta_data.appendChild(genre); 
        meta_data.appendChild(date); 

        const desc = document.createElement('div'); 
        desc.className = 'description'; 

        const summary = document.createElement('p'); 
        summary.innerText = i.summary; 

        desc.appendChild(summary); 

        const br = document.createElement('br');

        const extra_content = document.createElement('div'); 
        extra_content.className = 'extra';
        extra_content.id = 'extra_content' 

        const comment_label = document.createElement('div'); 
        comment_label.className = 'ui label';
        comment_label.dataset.id = i.id;  

        const comment_icon = document.createElement('i'); 
        comment_icon.className = 'comment icon'; 
  
        comment_label.appendChild(comment_icon);
        comment_label.insertAdjacentText('beforeend', `${i.comments.length} comments`); 

        extra_content.appendChild(comment_label); 

        const like_label = document.createElement('div'); 
        like_label.className = 'ui label'; 
        like_label.dataset.id = i.id; 

        const heart = document.createElement('i'); 
        heart.className = 'heart outline icon'; 

        like_label.appendChild(heart); 
        like_label.insertAdjacentText('beforeend', `${i.likes.length} likes`); 

        extra_content.appendChild(like_label); 

        const author = document.createElement('span'); 
        author.className = 'right floated author'; 

        const author_img = document.createElement('img'); 
        author_img.className = 'ui avatar image'; 
        author_img.src = i.user.profile_pic; 

        author.appendChild(author_img); 
        author.innerText = i.user.username; 

        extra_content.appendChild(author); 

        item.appendChild(div_image); 

        content.appendChild(header);
        content.appendChild(meta_data); 
        content.appendChild(desc); 
        content.appendChild(br); 
        content.appendChild(extra_content); 

        item.appendChild(content); 
        node.appendChild(item);     
    })
}


// -----------NAVBAR LISTENERS-------------
function navBarListeners(){
    homeListener(); 
    itinListener(); 
    favListener();
    accountListener(); 
}

function homeListener(){
    const home = document.querySelector('#home-btn'); 
    home.addEventListener('click', () => {
        clear(); 
        searchBar(); 
    })
}

function itinListener(){
    const itin = document.querySelector('#itin-btn'); 
    itin.addEventListener('click', () => {
        fetchYourItins(); 
    })
}

function favListener(){
    const fav = document.querySelector('#fav-btn'); 
    fav.addEventListener('click', () => {
        fetchFavItins(); 
    })
}

function accountListener(){
    const account = document.querySelector('#account-btn'); 
    account.addEventListener('click', () => {
        fetchAccount(); 
    })
}

// ----------FetchAccount-----------

function fetchAccount(){
    const user_id = localStorage.getItem('user_id'); 
    fetch(`http://localhost:3000/users/${user_id}`)
    .then(response => response.json())
    .then(data => {
        renderAccount(data); 
    })
}

function renderAccount(data){
    clear(); 
    const body = document.querySelector('#js'); 

    const h2 = document.createElement('h2'); 
    h2.innerText = 'Account'; 

    const ul = document.createElement('ul'); 

    const first_name = document.createElement('p'); 
    first_name.innerText = data.first_name; 

    const last_name = document.createElement('p'); 
    last_name.innerText = data.last_name; 

    const username = document.createElement('p'); 
    username.innerText = data.username; 

    const bio = document.createElement('p'); 
    bio.innerText = data.bio; 

    const location = document.createElement('p'); 
    location.innerText = data.location; 

    const gender = document.createElement('p'); 
    gender.innerText = data.gender; 

    const destroy = document.createElement('button'); 
    destroy.className = 'ui red button'; 
    destroy.innerText = 'Delete'; 
    destroy.addEventListener('click', () => {
        destroyUser(); 
    })


    ul.appendChild(first_name); 
    ul.appendChild(last_name); 
    ul.appendChild(username); 
    ul.appendChild(bio); 
    ul.appendChild(location); 
    ul.appendChild(gender); 
    ul.appendChild(destroy); 
    body.appendChild(h2);
    body.appendChild(ul); 
}

// --------FetchItinShit-----------
function fetchItin(event, object){
    let itin_type = whichItin(object);
    if(itin_type === 'day_one'){
        fetch(`http://localhost:3000/one_days/${event.target.dataset.id}`)
        .then(response => response.json())
        .then(data => renderOneDay(data)); 
    } else if(itin_type === 'day_two'){
        fetch(`http://localhost:3000/two_days/${event.target.dataset.id}`)
        .then(response => response.json())
        .then(data => renderTwoDay(data)); 
    } else if(itin_type === 'day_three'){
        // fetch request
    } else if(itin_type === 'day_four'){
        // fetch request
    } else if(itin_type === 'day_five'){
        // fetch request
    } else if(itin_type === 'day_six'){
        // fetch request
    } else if(itin_type === 'day_seven'){
        // fetch request
    }

}

// -------RenderItinShit-------
function renderOneDay(itin){
    clear(); 
    const body = document.querySelector('#js'); 
    const ul = document.createElement('ul'); 
        const header = document.createElement('h2'); 
        header.innerText = 'Title: ' + itin.title; 

        const summary = document.createElement('li'); 
        summary.innerText = 'Summary: ' + itin.summary; 

        const day_one = document.createElement('li'); 
        day_one.innerText = 'Day One: ' + itin.day_one; 

        const genre = document.createElement('li'); 
        genre.innerText = 'Genre: ' + itin.genre.name; 

        const destination = document.createElement('li'); 
        destination.innerText = 'Destination ' + itin.destination.location; 

        const likes_li = document.createElement('li'); 
        const likes = document.createElement('div');
        likes.className = 'ui button'; 
        likes.id = 'one_day_likes'; 
        likes.dataset.id = itin.id; 
        likes.addEventListener('click', event => {
            OneDayLikes(event); 
        })
        likes.innerText = itin.likes.length;
        likes_li.insertAdjacentText('beforeend', ' likes'); 
        likes_li.appendChild(likes); 
        
        const comments_li = document.createElement('li'); 

        const add_comments = document.createElement('ul'); 
        add_comments.id = 'one_day_comments_list'
        renderOneDayComments(itin.id); 

        const comment_form= document.createElement('form');

        comment_form.className = 'ui form'; 
        comment_form.id = 'one_day_comments_form';
        comment_form.dataset.id = itin.id;  
        comment_form.addEventListener('submit', event => {
            OneDayComments(event); 
        })

        const comment_input = document.createElement('input'); 
        comment_input.type = 'text' 
        comment_input.placeholder = 'Add Comment'; 
        comment_input.id = 'one_day_comment_input'; 

        comment_form.appendChild(comment_input);
        comments_li.appendChild(comment_form); 
        comments_li.appendChild(add_comments); 
        
       


        // const img_li = document.createElement('li'); 
        // const img = document.createElement('img'); 
        // img.src = itin.images[0].picture; 
        // img_li.appendChild(img); 

        ul.appendChild(summary); 
        ul.appendChild(day_one);  
        ul.appendChild(genre); 
        ul.appendChild(destination); 
        ul.appendChild(likes_li); 
        ul.appendChild(comments_li); 
        // ul.appendChild(img_li);   
        body.appendChild(header); 
        body.appendChild(ul);
        
}   

function renderTwoDay(itin){
    clear(); 
    const body = document.querySelector('#js'); 
    const ul = document.createElement('ul'); 
        const header = document.createElement('h2'); 
        header.innerText = 'Title: ' + itin.title; 

        const summary = document.createElement('li'); 
        summary.innerText = 'Summary: ' + itin.summary; 

        const day_one = document.createElement('li'); 
        day_one.innerText = 'Day One: ' + itin.day_one; 

        const day_two = document.createElement('li'); 
        day_two.innerText = 'Day Two: ' + itin.day_two; 

        const genre = document.createElement('li'); 
        genre.innerText = 'Genre: ' + itin.genre.name; 

        const destination = document.createElement('li'); 
        destination.innerText = 'Destination ' + itin.destination.location; 

        const likes_li = document.createElement('li'); 
        const likes = document.createElement('div'); 
        likes.className = 'ui button'; 
        likes.dataset.id = itin.id; 
        likes.id = 'two_day_likes'; 
        likes.addEventListener('click', event => {
            TwoDayLikes(event); 
        })
        likes.innerText = itin.likes.length;
        likes_li.insertAdjacentText('beforeend', ' likes'); 
        likes_li.appendChild(likes); 
        
        const comments_li = document.createElement('li'); 

        const add_comments = document.createElement('ul'); 
        add_comments.id = 'two_day_comments_list'
        renderTwoDayComments(itin.id);

        const comment_form= document.createElement('form');

        comment_form.className = 'ui form'; 
        comment_form.id = 'two_day_comments_form';
        comment_form.dataset.id = itin.id;  
        comment_form.addEventListener('submit', event => {
            TwoDayComments(event); 
        })

        const comment_input = document.createElement('input'); 
        comment_input.type = 'text' 
        comment_input.placeholder = 'Add Comment'; 
        comment_input.id = 'two_day_comment_input'; 

        comment_form.appendChild(comment_input);
        comments_li.appendChild(comment_form);
        comments_li.appendChild(add_comments); 

        // const img_li = document.createElement('li'); 
        // const img = document.createElement('img'); 
        // img.src = itin.images[0].picture; 
        // img_li.appendChild(img); 

        ul.appendChild(summary); 
        ul.appendChild(day_one);  
        ul.appendChild(day_two); 
        ul.appendChild(genre); 
        ul.appendChild(destination); 
        ul.appendChild(likes_li); 
        ul.appendChild(comments_li); 
        // ul.appendChild(img_li);   
        body.appendChild(header); 
        body.appendChild(ul);   
}   
function renderThreeDay(data){
    
}   
function renderFourDay(data){
    
}   
function renderFiveDay(data){
    
}   
function renderSixDay(data){
    
}   
function renderSevenDay(data){
    
}   

function renderComments(){

}

function renderImages(){

}
// -------------WhichItinIsClicked--------------

function whichItin(object){
    if(!Object.keys(object).includes('day_two')){
        return 'day_one'; 
    } else if(!Object.keys(object).includes('day_three')) {
        return 'day_two'; 
    } else if(!Object.keys(object).includes('day_four')) {
        console.log('day_three'); 
    } else if(!Object.keys(object).includes('day_five')) {
        console.log('day_four'); 
    } else if(!Object.keys(object).includes('day_six')) {
        console.log('day_five'); 
    } else if(!Object.keys(object).includes('day_seven')) {
        console.log('day_six'); 
    } else {
        console.log('day_seven'); 
    }
}
// -------------------------

//---------USER SIGNUP/LOGIN--------
// store in local storage
// User types in their username ... we grab that and send a POST request to backend
// find_or_create_by that username .... render json: it back to frontend 
// grab the id of that username ... store it in navbar 
// then whenever an itinerary is created/updated/destroyed ...
// associate it's user_id with the id of the username stored in the navbar

function logIn(){
    const login = document.querySelector('#login-btn'); 
    login.addEventListener('click', () => {
        clear(); 
        renderLogIn(); 
    })
}

function renderLogIn(){
    const js = document.querySelector('#js'); 

    const c = document.createElement('div'); 
    c.className = 'ui centered grid container'; 

    const s = document.createElement('div'); 
    s.className = 'ui segment'; 
    s.id = "login-box"; 

    const form = document.createElement('form'); 
    form.className = 'ui form'; 
    form.addEventListener('submit', event => {
        saveUser(event); 
    })

    const h = document.createElement('h2'); 
    h.className = 'ui blue header'; 
    h.innerText = 'Welcome'; 

    const f = document.createElement('div'); 
    f.className = 'field'; 

    const input = document.createElement('div'); 
    input.className = 'ui left icon input'; 


    const i = document.createElement('i'); 
    i.className = 'user icon'; 

    const username = document.createElement('input'); 
    username.type = 'text'; 
    username.placeholder = 'username';
    username.id = 'username_input'; 
    
    const button = document.createElement('button')
    button.className = 'ui blue button';
    button.innerText = 'Log In'
    button.type = 'submit'; 

    input.appendChild(i); 
    input.appendChild(username); 
    f.appendChild(input); 
    s.appendChild(form); 
    form.appendChild(h);
    form.appendChild(f);
    form.appendChild(button);   
    c.appendChild(s); 
    js.appendChild(c); 
}

function saveUser(event){
    event.preventDefault(); 
    const username = document.querySelector('#username_input').value; 
    handleUser(username); 
}

function handleUser(username){
    clear(); 
    searchBar(); 
    localStorage.setItem('username', username); 

    const reqObj = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({username})
    }

    fetch("http://localhost:3000/users", reqObj)
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('user_id', data.id); 
    });  
}

// ---------Likes-------

function OneDayLikes(event){
    const user_id = localStorage.getItem('user_id'); 
    const itin_id = event.target.dataset.id; 

    const likes = document.querySelector('#one_day_likes');
    let x = parseInt(likes.innerText); 
    likes.innerText = x+1;

    const reqObj = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({user_id: user_id, one_day_id: itin_id })
    }

    fetch("http://localhost:3000/likes", reqObj); 
}


function TwoDayLikes(event){
    const user_id = localStorage.getItem('user_id'); 
    const itin_id = event.target.dataset.id; 

    const likes = document.querySelector('#two_day_likes');
    let x = parseInt(likes.innerText); 
    likes.innerText = x+1;

    const reqObj = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({user_id: user_id, two_day_id: itin_id })
    }

    fetch("http://localhost:3000/likes", reqObj); 
}

// ---------------------COMMENTS--------------
function renderOneDayComments(id){ 
    fetch(`http://localhost:3000/one_days/${id}`)
    .then(response => response.json())
    .then(data => {
        data.comments.forEach(comment => {
            const list = document.querySelector('#one_day_comments_list'); 

            const li = document.createElement('li'); 
            li.innerText = comment.comment; 
        
            list.appendChild(li);
        })

    })
}

function renderTwoDayComments(id){
    fetch(`http://localhost:3000/two_days/${id}`)
    .then(response => response.json())
    .then(data => {
        data.comments.forEach(comment => {
            const list = document.querySelector('#two_day_comments_list'); 

            const li = document.createElement('li'); 
            li.innerText = comment.comment; 
        
            list.appendChild(li);
        })

    })
}


function renderNewOneDayComments(comment){
    const list = document.querySelector('#one_day_comments_list'); 

    const li = document.createElement('li'); 
    li.innerText = comment; 

    list.appendChild(li);
}

function OneDayComments(event){
    event.preventDefault();
    const comment = document.querySelector('#one_day_comment_input').value; 

    const user_id = localStorage.getItem('user_id'); 
    const itin_id = event.target.dataset.id; 

    const reqObj = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }, 
        body: JSON.stringify({comment: comment, user_id: user_id, one_day_id: itin_id })
    }

    fetch("http://localhost:3000/comments", reqObj)
    .then(response => response.json())
    .then(data => { 
        renderNewOneDayComments(data.comment);
    })
}

function renderNewTwoDayComments(comment){
    const list = document.querySelector('#two_day_comments_list'); 

    const li = document.createElement('li'); 
    li.innerText = comment; 

    list.appendChild(li);
}

function TwoDayComments(event){
    event.preventDefault();

    const comment = document.querySelector('#two_day_comment_input').value; 
    const user_id = localStorage.getItem('user_id'); 
    const itin_id = event.target.dataset.id; 

    const reqObj = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }, 
        body: JSON.stringify({comment: comment, user_id: user_id, two_day_id: itin_id })
    }

    fetch("http://localhost:3000/comments", reqObj)
    .then(response => response.json())
    .then(data => {
        renderNewTwoDayComments(data.comment); 
    })
}

// ------------------------------

function fetchYourItins(){
    clear(); 
    const user_id = localStorage.getItem('user_id'); 

    fetch(`http://localhost:3000/users/${user_id}`)
    .then(response => response.json())
    .then(data => {
        renderYours(data); 
    })
}

function renderYours(data){
    const body = document.querySelector('#js'); 

    const itineraries = []; 
    data.one_days.forEach(x => {
        itineraries.push(x); 
    })

    data.two_days.forEach(x => {
        itineraries.push(x); 
    })


    if(itineraries.length > 0){
        const create = document.createElement('button'); 
        create.className = 'ui centered button'; 
        create.innerText = 'Create'; 
        create.addEventListener('click', () => {
            createItin(); 
        })

        const container = document.createElement('div'); 
        container.className = 'ui centered container'; 

        const segment = document.createElement('div'); 
        segment.className = 'ui segment'; 

        const div = document.createElement('div'); 
        div.className = 'ui divided items';
        div.id = "items_container";

        renderYourItems(div, itineraries); 

        segment.appendChild(div); 
        container.appendChild(segment);
        body.appendChild(create); 
        body.appendChild(container); 
    };  
}

function createItin(){
    clear();

    const body = document.querySelector('#js'); 

    const container = document.createElement('div'); 
    container.className = 'ui centered container'; 

    const segment = document.createElement('div'); 
    segment.className = 'ui segment'; 

    const form = document.createElement('form'); 
    form.className = 'ui form'; 

    const f1 = document.createElement('div');
    field.className = 'field';  

    const title = document.createElement('input'); 
    title.type = 'text';
    title.placeholder = 'Title'

    f1.appendChild(title); 
    form.appendChild(field); 
    segment.appendChild(form); 
    container.appendChild(segment); 
    body.appendChild(container); 

}

function renderYourItems(node, array){
    let x = 1; 
    array.forEach(i => {
        const item = document.createElement('div'); 
        item.className = 'item'; 
        item.id = x;  
        // --------image_div
        const div_image = document.createElement('div'); 
        div_image.className = 'image'; 

        const itin_img = document.createElement('img'); 
        itin_img.className = 'ui rounded image'
        itin_img.src = i.images[0].picture; 

        div_image.appendChild(itin_img); 
        // -----------------------------
        // content_div
        const content = document.createElement('div'); 
        content.className = 'content'; 

        const header = document.createElement('a'); 
        header.className = 'header'; 
        header.dataset.id = i.id; 
        header.innerText = i.title; 
        header.addEventListener('click', (event) => {
            fetchItin(event, i); 
        })

        const meta_data = document.createElement('div'); 
        meta_data.className = 'meta'; 

        const genre = document.createElement('span'); 
        genre.className = 'cinema'; 
        genre.innerText = i.genre.name; 

        const date = document.createElement('span'); 
        date.className = 'right floated cinema'; 
        date.innerText = i.created_at; 

        meta_data.appendChild(genre); 
        meta_data.appendChild(date); 

        const desc = document.createElement('div'); 
        desc.className = 'description'; 

        const summary = document.createElement('p'); 
        summary.innerText = i.summary; 

        desc.appendChild(summary); 

        const br = document.createElement('br');

        const extra_content = document.createElement('div'); 
        extra_content.className = 'extra';
        extra_content.id = 'extra_content' 

        const comment_label = document.createElement('div'); 
        comment_label.className = 'ui label';
        comment_label.dataset.id = i.id;  

        const comment_icon = document.createElement('i'); 
        comment_icon.className = 'comment icon'; 
  
        comment_label.appendChild(comment_icon);
        comment_label.insertAdjacentText('beforeend', `${i.comments.length} comments`); 

        extra_content.appendChild(comment_label); 

        const like_label = document.createElement('div'); 
        like_label.className = 'ui label'; 
        like_label.dataset.id = i.id; 

        const heart = document.createElement('i'); 
        heart.className = 'heart outline icon'; 

        like_label.appendChild(heart); 
        like_label.insertAdjacentText('beforeend', `${i.likes.length} likes`); 

        extra_content.appendChild(like_label); 

        const destroy = document.createElement('button'); 
        destroy.innerText = 'Delete'
        destroy.className = 'ui right floated red button';
        destroy.dataset.id = i.id
        destroy.addEventListener('click', event => {
            deleteItin(event, i); 
        }) 
        extra_content.appendChild(destroy); 

        const author = document.createElement('span'); 
        author.className = 'right floated author'; 

        const author_img = document.createElement('img'); 
        author_img.className = 'ui avatar image'; 
        author_img.src = i.user.profile_pic; 

        author.appendChild(author_img); 
        author.innerText = i.user.username; 

        extra_content.appendChild(author); 

        item.appendChild(div_image); 

        content.appendChild(header);
        content.appendChild(meta_data); 
        content.appendChild(desc); 
        content.appendChild(br); 
        content.appendChild(extra_content); 

        item.appendChild(content); 
        node.appendChild(item);
        x++;    
    })
}



function fetchFavItins(){
    clear(); 
    const user_id = localStorage.getItem('user_id');

    fetch(`http://localhost:3000/users/${user_id}`)
    .then(response => response.json())
    .then(data => {
        renderFavItins(data);  
    })
}

function renderFavItins(data){
    const fav_itins = []
    const body = document.querySelector('#js'); 
    data.likes.forEach(x => {
        if(Object.keys(x).includes('one_day')){
            fav_itins.push(x.one_day); 
        } else if (Object.keys(x).includes('two_day')){
            fav_itins.push(x.two_day); 
        } else {
            fav_itins.push(x.three_day); 
        }
    })

    if(fav_itins.length > 0){
        const container = document.createElement('div'); 
        container.className = 'ui centered container'; 

        const segment = document.createElement('div'); 
        segment.className = 'ui segment'; 

        const div = document.createElement('div'); 
        div.className = 'ui divided items';

        renderItem(div, fav_itins); 

        segment.appendChild(div); 
        container.appendChild(segment);
 
        body.appendChild(container); 
    }
}

// ----DELETE ITIN----

function deleteItin(event, object){
    clearItin(event); 
    if(whichItin(object) === 'day_one'){
        fetchDeleteOneDay(object); 
    } else if(whichItin(object) === 'day_two'){
        deleteTwoDay(object); 
    }
}

function clearItin(event){
    event.target.parentNode.parentNode.parentNode.remove(); 
}   

function fetchDeleteOneDay(object){
    const reqOBJ = {
        method: 'DELETE', 
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({id: object.id})
    }

    fetch(`http://localhost:3000/one_days/${object.id}`, reqOBJ); 
}

// ----------USER DELETE--------------


function destroyUser(){
    const user_id = localStorage.getItem('user_id'); 

    const reqObj = {
        method: 'DELETE'
    }

    fetch(`http://localhost:3000/users/${user_id}`, reqObj); 
}