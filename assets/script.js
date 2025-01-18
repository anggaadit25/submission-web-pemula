const storageKey = "ANGGA_STORAGE_KEY";

const formbookFrom = document.getElementById("bookFrom");
const formSearchBook = document.getElementById("searchBook");

function checkStorage() {
  return typeof Storage !== "undefined";
}

formbookFrom.addEventListener("submit", function (event) {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = parseInt(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const idTemp = document.getElementById("bookFormTitle").name;
  if (idTemp !== "") {
    const bookData = getListBook();
    for (let index = 0; index < bookData.length; index++) {
      if (bookData[index].id == idTemp) {
        bookData[index].title = title;
        bookData[index].author = author;
        bookData[index].year = year;
        bookData[index].isComplete = isComplete;
      }
    }
    localStorage.setItem(storageKey, JSON.stringify(bookData));
    resetForms();
    renderBooks(bookData);
    return;
  }

  const id = JSON.parse(localStorage.getItem(storageKey)) === null ? 0 + Date.now() : JSON.parse(localStorage.getItem(storageKey)).length + Date.now();
  const newBook = {
    id: id,
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };

  putBooks(newBook);

  const bookData = getListBook();
  renderBooks(bookData);
});

function putBooks(data) {
  if (checkStorage()) {
    let bookData = [];

    if (localStorage.getItem(storageKey) !== null) {
      bookData = JSON.parse(localStorage.getItem(storageKey));
    }

    bookData.push(data);
    localStorage.setItem(storageKey, JSON.stringify(bookData));
  }
}

function createDeleteButton(eventListener) {
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("red");
  deleteButton.innerText = "Hapus buku";
  deleteButton.addEventListener("click", function (event) {
    eventListener(event);
  });
  return deleteButton;
}

function createisReadCompleteButton(book, eventListener) {
  const isSelesai = book.isComplete ? "Belum selesai" : "Selesai";

  const isReadCompleteButton = document.createElement("button");
  isReadCompleteButton.classList.add("green");
  isReadCompleteButton.innerText = isSelesai + " di Baca";
  isReadCompleteButton.addEventListener("click", function (event) {
    eventListener(event);
  });
  return isReadCompleteButton;
}

function renderBooks(bookData) {
  if (bookData === null) {
    return;
  }

  const containerIncomplete = document.getElementById("incompleteBookList");
  const containerComplete = document.getElementById("completeBookList");

  containerIncomplete.innerHTML = "";
  containerComplete.innerHTML = "";
  for (let book of bookData) {
    const id = book.id;
    const title = book.title;
    const author = book.author;
    const year = book.year;
    const isComplete = book.isComplete;

    let bookItem = document.createElement("article");
    bookItem.classList.add("d_book_item", "select_item");
    bookItem.innerHTML = "<h3 name = " + id + ">" + title + "</h3>";
    bookItem.innerHTML += "<p>Penulis: " + author + "</p>";
    bookItem.innerHTML += "<p>Tahun: " + year + "</p>";

    let containerActionItem = document.createElement("div");
    containerActionItem.classList.add("action");

    const isReadCompleteButton = createisReadCompleteButton(book, function (event) {
      isCompleteBookHandler(event.target.parentElement.parentElement);

      const bookData = getListBook();
      resetForms();
      renderBooks(bookData);
    });

    const deleteButton = createDeleteButton(function (event) {
      deleteItem(event.target.parentElement.parentElement);

      const bookData = getListBook();
      resetForms();
      renderBooks(bookData);
    });

    containerActionItem.append(isReadCompleteButton, deleteButton);

    bookItem.append(containerActionItem);

    if (isComplete === false) {
      containerIncomplete.append(bookItem);
      bookItem.getRootNode().addEventListener("click", function (event) {
        updateItem(event.target.parentElement);
      });

      continue;
    }

    containerComplete.append(bookItem);

    bookItem.getRootNode().addEventListener("click", function (event) {
      updateItem(event.target.parentElement);
    });
  }
}

function isCompleteBookHandler(itemElement) {
  const bookData = getListBook();
  if (bookData.length === 0) {
    return;
  }

  const title = itemElement.childNodes[0].innerText;
  const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].title === title && bookData[index].id == titleNameAttribut) {
      bookData[index].isComplete = !bookData[index].isComplete;
      break;
    }
  }
  localStorage.setItem(storageKey, JSON.stringify(bookData));
}

function searchBooks(title) {
  const bookData = getListBook();
  if (bookData.length === 0) {
    return;
  }

  const bookList = [];

  for (let index = 0; index < bookData.length; index++) {
    const tempTitle = bookData[index].title.toLowerCase();
    const tempTitleTarget = title.toLowerCase();
    if (bookData[index].title.includes(title) || tempTitle.includes(tempTitleTarget)) {
      bookList.push(bookData[index]);
    }
  }
  return bookList;
}

function isReadCompleteButtonHandler(parentElement) {
  let book = isCompleteBookHandler(parentElement);
  book.isComplete = !book.isComplete;
}

function getListBook() {
  if (checkStorage) {
    return JSON.parse(localStorage.getItem(storageKey));
  }
  return [];
}

function deleteItem(itemElement) {
  const bookData = getListBook();
  if (bookData.length === 0) {
    return;
  }

  const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].id == titleNameAttribut) {
      bookData.splice(index, 1);
      break;
    }
  }

  localStorage.setItem(storageKey, JSON.stringify(bookData));
}

function updateItem(itemElement) {
  if (itemElement.id === "incompleteBookList" || itemElement.id === "completeBookList") {
    return;
  }

  const bookData = getListBook();
  if (bookData.length === 0) {
    return;
  }

  const title = itemElement.childNodes[0].innerText;
  const author = itemElement.childNodes[1].innerText.slice(9, itemElement.childNodes[1].innerText.length);
  const getYear = itemElement.childNodes[2].innerText.slice(7, itemElement.childNodes[2].innerText.length);
  const year = parseInt(getYear);

  const isComplete = itemElement.childNodes[3].childNodes[0].innerText.length === "Selesai di baca".length ? false : true;

  const id = itemElement.childNodes[0].getAttribute("name");
  document.getElementById("bookFormTitle").value = title;
  document.getElementById("bookFormTitle").name = id;
  document.getElementById("bookFormAuthor").value = author;
  document.getElementById("bookFormYear").value = year;
  document.getElementById("bookFormIsComplete").checked = isComplete;
  document.getElementById("bookFormSubmit").innerText = "Update Buku ke Rak";

  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].id == id) {
      bookData[index].id = id;
      bookData[index].title = title;
      bookData[index].author = author;
      bookData[index].year = year;
      bookData[index].isComplete = isComplete;
    }
  }
  localStorage.setItem(storageKey, JSON.stringify(bookData));
}

searchBook.addEventListener("submit", function (event) {
  event.preventDefault();
  const bookData = getListBook();
  if (bookData.length === 0) {
    return;
  }

  const title = document.getElementById("searchBookTitle").value;
  if (title === null) {
    renderBooks(bookData);
    return;
  }
  const bookList = searchBooks(title);
  renderBooks(bookList);
});

function resetForms() {
  document.getElementById("bookFormTitle").value = "";
  document.getElementById("bookFormAuthor").value = "";
  document.getElementById("bookFormYear").value = "";
  document.getElementById("bookFormIsComplete").checked = false;

  document.getElementById("searchBookTitle").value = "";
}

window.addEventListener("load", function () {
  if (checkStorage) {
    if (localStorage.getItem(storageKey) !== null) {
      const bookData = getListBook();
      renderBooks(bookData);
    }
  } else {
    alert("Web Storage tidak bisa digunakan");
  }
});
