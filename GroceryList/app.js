const form = document.querySelector('.grocery-form');
const input = document.querySelector('.g-input');
const  submitBtn = document.querySelector('.g-submit');
const messageBox = document.querySelector('.error-message');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

function displayMessage(message){
  if(message === 'invalid'){
    messageBox.classList.add('error-red');
    messageBox.innerHTML = 'Please enter valid item!';
  }else if(message === 'success'){
    messageBox.classList.remove('error-red');
    messageBox.innerHTML = 'Item added to the list!';
  }else if(message === 'change'){
    messageBox.classList.remove('error-red');
    messageBox.innerHTML = 'Item changed!';
  }else if(message === 'delete'){
    messageBox.classList.add('error-red');
    messageBox.innerHTML = 'Item removed!';
  }else if(message === 'clear'){
    messageBox.classList.add('error-red');
    messageBox.innerHTML = 'Items Cleared!';
  }



  messageBox.style.visibility = 'visible';
  setTimeout(()=>{
    messageBox.style.visibility = 'hidden';
    messageBox.innerHTML = '';
  },1000)
}

function setDefault(){
 input.value = "";
 submitBtn.innerHTML = "Submit";
}

function deleteItem(element){
    list.removeChild(element)
    displayMessage('delete')
}

function editItem(e,val){
  submitBtn.innerHTML = 'Edit';
  input.value = val.toLowerCase();
  input.focus();
  editFlag = true;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  
}

function getLocalStorage(){
  return localStorage.getItem("lists")
  ? JSON.parse(localStorage.getItem("lists")) : [];
}

function addToLocalStorage(id, value){
   let items = getLocalStorage();
   items.push({id , value});
   localStorage.setItem("lists", JSON.stringify(items));
}

function removeFromLocalStorage(id){
  let items = getLocalStorage();
  items = items.filter(item => item.id !== id)
  localStorage.setItem('lists',JSON.stringify(items));
}

function editLocalStorage(id ,value){
  let items = getLocalStorage();
  items = items.map(item =>{
    if(item.id === id){
      item.value = value;
    }

     return item;
  })
  localStorage.setItem('lists',JSON.stringify(items));

}

function setupItems() {
  let items = getLocalStorage();
  items.forEach(item => {createItem(item.id, item.value)})
}

window.addEventListener('DOMContentLoaded', setupItems);

let editFlag = false;
let counterId = 0;
let editElement;

form.addEventListener('submit',(e)=>{
      e.preventDefault();
      let value = input.value;

      if(value === ''){
            displayMessage('invalid');
      }else if(!editFlag){

        const element = document.createElement('li');
        const attr = document.createAttribute('data-id');
        attr.value = counterId;
        element.setAttributeNode(attr);
        element.innerHTML = `
        <span class="item">${value.toUpperCase()}</span>
        <div class="tools">
        <i class="fa-solid fa-pen-to-square edit"></i>
        <i class="fa-solid fa-trash del"></i>
        </div>
        `
        list.appendChild(element);
        addToLocalStorage(element.dataset.id, value);
        setDefault();
        displayMessage('success')
      //Adding event listeners to delete and edit icons.
       const delItem = element.querySelector('.del');
       const edit = element.querySelector('.edit');
       const val = element.firstElementChild.innerHTML;
       delItem.addEventListener('click',()=>{
        deleteItem(element);
        removeFromLocalStorage(element.dataset.id);
      })
       edit.addEventListener('click',(e)=>{editItem(e,val);})

      }else if(editFlag){

        editElement.innerHTML = value.toUpperCase();
         let editId = editElement.parentElement.dataset.id;
        editLocalStorage(editId, value);
        setDefault();
        displayMessage('change')
      }
})

clearBtn.addEventListener('click',()=>{
    list.innerHTML = '';
    localStorage.setItem('lists',[]);
    displayMessage('clear');
})


function createItem(id, value){

  const element = document.createElement('li');
        const attr = document.createAttribute('data-id');
        attr.value = id;
        element.setAttributeNode(attr);
        element.innerHTML = `
        <span class="item">${value.toUpperCase()}</span>
        <div class="tools">
        <i class="fa-solid fa-pen-to-square edit"></i>
        <i class="fa-solid fa-trash del"></i>
        </div>
        `
        list.appendChild(element);

       const delItem = element.querySelector('.del');
       const edit = element.querySelector('.edit');
       const val = element.firstElementChild.innerHTML;

       delItem.addEventListener('click',()=>{
        deleteItem(element);
        removeFromLocalStorage(element.dataset.id);
      })
       edit.addEventListener('click',(e)=>{editItem(e,val);})

      }
