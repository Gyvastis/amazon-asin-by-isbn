# amazon-asin-by-isbn
Find Amazon e-book `ASIN` metadata code by `ISBN` code.

Most of downloaded books don't have the right metadata in place for full *Kindle* - *Goodreads* support (currently reading syncing, etc.).

1. Use [Calibre](https://github.com/kovidgoyal/calibre) to manage your side-loaded Kindle books.
2. Convert the book to `.mobi` & download metadata for the selected book.
3. Edit updated metadata & copy ISBN code from metadata (`isbn:000000...`) to this API.
4. If the e-book is found in Amazon, ASIN code will be returned, for eg. `ABC123AB12`. 
5. Add it as an extra metadata ID named `mobi-asin` (`isbn:000000..., mobi-asin:ABC123AB12`).
6. Upload it to your Kindle and enjoy.
