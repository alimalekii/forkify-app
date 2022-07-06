import View from './View.js';
import icons from 'url:../../img/icons.svg';

class addRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  _errorMessage = '';
  _message = 'Recipe was sucessfully uploaded :)';

  // we want to 'addHnadlerShowWindow()' method to be runned just after page gets loaded. and since we don't need the control to tell us anything, we can use cosntructor function for execution.
  // why we don't need controller to tell us anything?! Simply, because there is nothing special going on here. so this is handled here.

  constructor() {
    super(); // this is a child class, so after running super() we only have acceess to this keyword.
    this._addHnadlerShowWindow(); // now we have acess to this
    this._addHnadlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  _addHnadlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHnadlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; // to get all the valuse from this form we can select them one by one, then getting their values. BUT there is an actually easier way to do that. we can use an borwser API ==> new FormData() and by passing the form into this constructor we are able to get all the data ==> new FormData() and this will returna a weird object that we can not use. but we can do is to spread this object [...new FormData(this)]

      const data = Object.fromEntries(dataArr); // Object.fromEntries is opposite of entries method on arrays

      handler(data);
    });
  }
  _generateMarkup() {
    // return '';
  }
}

// still controller needs to do one thing, importing this object. because otherwise our main script will never execute this file and this object will never be created and the eventListener will never be added and so on ...

export default new addRecipeView();
