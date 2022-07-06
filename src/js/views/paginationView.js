import icons from 'url:../../img/icons.svg';
import View from './View';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page1, there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupNextButton(curPage + 1);
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupPrevButton(curPage - 1);
    }

    // Other page
    if (curPage < numPages) {
      return (
        this._generateMarkupPrevButton(curPage - 1) +
        this._generateMarkupNextButton(curPage + 1)
      );
    }

    // Page1, there are no other pages
    return ``;
  }

  _generateMarkupPrevButton(numPage) {
    return `        
    <button data-goto="${numPage}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
            </svg>
        <span>Page ${numPage}</span>
    </button>`;
  }

  _generateMarkupNextButton(numPage) {
    return `      
    <button data-goto="${numPage}" class="btn--inline pagination__btn--next">
        <span>Page ${numPage}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>`;
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}

export default new PaginationView();
