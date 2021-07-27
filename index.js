//////////////////////////////宣告變數
const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const friendList = [];
let filteredFriend = []
const FRIENDS_PER_PAGE = 12

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const genderGroup = document.querySelector('#gender-group')

///////////////////////////////事件綁定
//More、加入最愛button事件監聽器
dataPanel.addEventListener("click", function onCardButtonsClicked(event) {
  if (event.target.matches(".btn-show-info")) {
    showFriendModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id))
  }
});

//search事件監聽器-點擊submit送出
searchForm.addEventListener('submit', function onSearchInputSubmitted (event){
  event.preventDefault()
  onSearchInputAction()
})

//search事件監聽器-輸入即搜尋
searchForm.addEventListener('input', function onSearchInputInput (event){
  onSearchInputAction()
})

//性別篩選事件監聽器
genderGroup.addEventListener('click', function onGenderClicked(event){
  if (event.target.matches('.fa-mars')) {
    filteredFriend = friendList.filter((friend) => friend.gender === 'male')
  } else if (event.target.matches('.fa-venus')) {
    filteredFriend = friendList.filter((friend) => friend.gender === 'female')
  }
  renderPaginator(filteredFriend.length)
  renderFriends(getFriendsByPage(1))
})

//分頁事件監聽器
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderFriends(getFriendsByPage(page))
})

//////////////////////////////函式區

//搜尋功能函式
function onSearchInputAction() {
  const keyword = searchInput.value.toLowerCase().trim()
  if(!keyword.length) {
    return alert('Please enter a valid string.(example: first name, last name)')
  }
  filteredFriend = friendList.filter((friend) => 
  friend.name.toLowerCase().includes(keyword) || friend.surname.toLowerCase().includes(keyword))
  if (filteredFriend.length === 0) {
    return alert (`Sorry, we don't have ${keyword} here.`)
  }
  renderPaginator(filteredFriend.length)
  renderFriends(getFriendsByPage(1))
}

//輸出卡片函式
function renderFriends(data) {
  let rawMaterial = "";
  data.forEach((item) => {
    const information = item
    const {name, avatar, region, id} = information
    rawMaterial += `
      <div class="col-sm-2">
        <div class="card mb-4 shadow-sm p-1 mb-5 bg-body rounded" style="width: 10rem;" id="friend-list">
          <img src="${avatar}" class="card-img-top" alt="friend-photo">
          <div class="card-body">
            <h5 class="card-name">${name}, ${region}<h5>
            <div class="card-btn">
              <button type="button" class="btn btn-secondary btn-sm btn-show-info" data-bs-toggle="modal" data-bs-target="#info-modal" data-id=${id}>More</button>
              <button type="button" class="btn btn-danger btn-sm btn-add-favorite" data-id=${id}><i class="far fa-heart"></i></button>
            </div>
          </div>
        </div>
      </div>
  `;
  });
  dataPanel.innerHTML = rawMaterial;
}

//輸出分頁器函式
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / FRIENDS_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page < numberOfPages; page++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    `
  }
  paginator.innerHTML = rawHTML
}

//輸出每分頁資料函式
function getFriendsByPage(page) {
  const data = filteredFriend.length ? filteredFriend : friendList
  const startIndex = (page-1) * FRIENDS_PER_PAGE
  return data.slice(startIndex, startIndex + FRIENDS_PER_PAGE)
}

//輸出modal函式
function showFriendModal(id) {
  const friendName = document.querySelector("#friend-modal-name");
  const friendImage = document.querySelector("#friend-modal-image");
  const friendDescription = document.querySelector("#friend-modal-description");

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data;
    const {name, surname, avatar, email, gender, age, region, birthday} = data
    friendName.innerText = `${name} ${surname}`;
    friendImage.src = avatar;
    friendDescription.innerHTML = `
      <ul style="list-style-type:none">
        <li>Gender: ${gender}</li>
        <li>Birthday: ${birthday}</li>
        <li>Age: ${age}</li>
        <li>Email: ${email}</li>
        <li>Region: ${region}</li>
      </ul>
    `;
    console.log(data)
  });
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteFriends')) || []
  const friend = friendList.find((friend) => friend.id === id)
  if (list.some((friend) => friend.id === id)) {
    return alert('You are already friends!')
  }
  list.push(friend)
  localStorage.setItem('favoriteFriends', JSON.stringify(list))
}

function onInputSearch() {
  const keyword = searchInput.value.toLowerCase().trim()
  filteredFriend = friendList.filter((friend) => 
  friend.name.toLowerCase().includes(keyword) || friend.surname.toLowerCase().includes(keyword))
  renderPaginator(filteredFriend.length)
  renderFriends(getFriendsByPage(1))
}

axios.get(INDEX_URL).then((response) => {
  friendList.push(...response.data.results);
  renderPaginator(friendList.length)
  renderFriends(getFriendsByPage(1));
});
