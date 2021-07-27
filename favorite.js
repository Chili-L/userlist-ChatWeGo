//宣告網址常數
const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
//宣告API常數
const INDEX_URL = BASE_URL + "/api/v1/users/";
//宣告資料庫
const friendList = JSON.parse(localStorage.getItem('favoriteFriends')) || [];

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function renderFriends(data) {
  let rawMaterial = "";
  data.forEach((item) => {
    rawMaterial += `
      <div class="col-sm-3">
        <div class="card mb-4" style="width: 15rem;">
          <img src="${item.avatar}" class="card-img-top" alt="friend-photo">
          <div class="card-body">
            <h5 class="card-name">${item.name} ${item.surname}</h5>
            <div class="card-btn">
              <button type="button" class="btn btn-secondary btn-sm btn-show-info" data-bs-toggle="modal" data-bs-target="#info-modal" data-id=${item.id}>More</button>
              <button type="button" class="btn btn-danger btn-sm btn-remove-favorite" data-id=${item.id}>X</button>
            </div>
          </div>
        </div>
      </div>
  `;
  });
  dataPanel.innerHTML = rawMaterial;
}

function showFriendModal(id) {
  const friendName = document.querySelector("#friend-modal-name");
  const friendImage = document.querySelector("#friend-modal-image");
  const friendDescription = document.querySelector("#friend-modal-description");

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data;
    friendName.innerText = `${data.name} ${data.surname}`;
    friendImage.src = data.avatar;
    friendDescription.innerHTML = `
    <ul>
      <li>Gender: ${data.gender}</li>
      <li>Birthday: ${data.birthday}</li>
      <li>Age: ${data.age}</li>
      <li>Email: ${data.email}</li>
      <li>Region: ${data.region}</li>
    </ul>
    `;
    //console.log(data);
  });
}

function removeFromFavorite(id) {
  if(!friendList) return
  const friendIndex = friendList.findIndex((friend) => friend.id === id)
  if(friendIndex === -1) return
  //return console.log(friendIndex)
  friendList.splice(friendIndex, 1)
  localStorage.setItem('favoriteFriends', JSON.stringify(friendList))
  renderFriends(friendList)
}

dataPanel.addEventListener("click", function showModal(event) {
  if (event.target.matches(".btn-show-info")) {
    //console.log(event.target.dataset.id) ->檢查是否有抓取到id
    //console.log(event.target.dataset);
    showFriendModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
});

renderFriends(friendList)