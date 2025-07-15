# Bingo Sheet Generator

![signature](https://img.shields.io/badge/crane%20did%20this-926cd4?style=for-the-badge)

Quick and dirty interface for building bingo sheet PDFs. 

Built for my personal games with friends, to standardize and simplify my bingo sheeting process.


## Usage

The interface (see `index.html`) has the following parameters:
- Sheet title
- Prediction list input (minimum 24)
- Free space list input (minimum 1)
- Extra CSS
- Sheet count (randomizes between sheets)


## Technical Notes

There are two helper classes written to assist and organize this application: `ListInput` and `BingoSheet`.

### `ListInput` Class

This class manages the HTML input elements, the way the user interacts with them, and the way the script accesses their values.

### `BingoSheet` Class

This class manages the data on a single bingo sheet, randomizing the given input, and filling out the HTML template.

At a later date I will write a guide to the HTML elements and IDs that makes up this template, and provide a key for custom CSS styling.
