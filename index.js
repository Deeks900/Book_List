//Book Class
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;

    }
}

//storage class
class Store {
    //get books from local storage
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    //add books to local localStorage
    static addBooks(book) {
        const list = Store.getBooks();
        list.push(book);
        localStorage.setItem('books', JSON.stringify(list));
    }

    //remove books from localStorage
    static removeBook(isbn){
        const list = Store.getBooks();
        list.forEach((book, index)=>{
            if(book.isbn === isbn){
                list.splice(index, 1);
            }
        })

        localStorage.setItem('books', JSON.stringify(list));

        }
    }

//UI class: Handle UI tasks
class UI {
    static displayBooks() {
        
        const books = Store.getBooks();
        books.forEach((book)=>{
            UI.addBookToList(book);
        })
    }

    static addBookToList(book) {
        const list = document.getElementById("book-list");
        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBookFromList(el) {
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
            
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const form = document.querySelector('#book-form');
        const container = form.parentElement;
       
        container.insertBefore(div, form);
        //Now remove alert after 2 sec
        setTimeout(()=>{document.querySelector('.alert').remove()}
          , 3000);
  }  
}

//Event display Book
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event addBookToList
document.querySelector('#book-form').addEventListener('submit', (e)=>{
    //Prevent actual submit
    e.preventDefault();

    //get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //validate the values of the form fields
    if(title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger');
      }
    else{
         //Instantiate a book
    const book = new Book(title, author, isbn);

    //add book to the ui
    UI.addBookToList(book);

     //Add books to local storage
     Store.addBooks(book);

    //show success message
    UI.showAlert('Book Added', 'success');

    //clear the values of the form fields
    document.getElementById('book-form').reset();
    }
});

//Event remove a book
document.querySelector('#book-list').addEventListener('click', (e)=>{
    //Remove book from UI
    UI.deleteBookFromList(e.target);
    
    //Remove Book form stored
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //show success messsage
    UI.showAlert('Book Removed', 'success');
})

