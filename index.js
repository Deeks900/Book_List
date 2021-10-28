//https://deeks900.github.io/Book_List/#
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

    //check if isbn already exist
    static checkISBN(isbn) {
        const list = Store.getBooks();
        for(let i=0; i<list.length; i++){
           let ISBN = list[i].isbn;
           if(ISBN === isbn){
               return true;
           } 
        }
        return false;
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
  
  static searchBookList(el){

    //grab the value entered in serach box and convert it in upper case
    var input = el.value.toUpperCase();
    //grab the book list displayed in UI
    const listBooks = document.getElementById('book-list');
    //get number of rows of the table
    let n = listBooks.rows.length;
    //get number of columne in a row
    let m = listBooks.rows[0].cells.length;
    //iterate through the rows
    for(let i=0; i<n; i++){
        //grab the data from cell of current row
        let data = listBooks.rows[i].cells[0].innerHTML.toUpperCase();
        if(data.indexOf(input) != -1){
            listBooks.rows[i].style.display = '';
        }
        else{
            listBooks.rows[i].style.display = 'none';
        }
    }
    
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
    //always check that list has unique isbn
    else if(Store.checkISBN(isbn) == true){
        UI.showAlert('Book of this isbn already present', 'danger');
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

//Event search a book 
document.querySelector('.search').addEventListener('keyup', (e)=>{

    //function in UI class to search book
    UI.searchBookList(e.target);
    
})
