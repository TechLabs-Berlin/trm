// From https://stackoverflow.com/a/30112523

/**
 * Convert a cell reference from A1Notation to 0-based indices (for arrays)
 * or 1-based indices (for Spreadsheet Service methods).
 *
 * @param {String}    cellA1   Cell reference to be converted.
 * @param {Number}    index    (optional, default 0) Indicate 0 or 1 indexing
 *
 * @return {object}            {row,col}, both 0-based array indices.
 *
 * @throws                     Error if invalid parameter
 */
function cellA1ToIndex( cellA1, index ) {
  // Ensure index is (default) 0 or 1, no other values accepted.
  index = index || 0;
  index = (index == 0) ? 0 : 1;

  // Use regex match to find column & row references.
  // Must start with letters, end with numbers.
  // This regex still allows induhviduals to provide illegal strings like "AB.#%123"
  var match = cellA1.match(/(^[A-Z]+)|([0-9]+$)/gm);

  if (match.length != 2) throw new Error( "Invalid cell reference" );

  var colA1 = match[0];
  var rowA1 = match[1];

  return { row: rowA1ToIndex( rowA1, index ),
           col: colA1ToIndex( colA1, index ) };
}

/**
 * Return a 0-based array index corresponding to a spreadsheet column
 * label, as in A1 notation.
 *
 * @param {String}    colA1    Column label to be converted.
 *
 * @return {Number}            0-based array index.
 * @param {Number}    index    (optional, default 0) Indicate 0 or 1 indexing
 *
 * @throws                     Error if invalid parameter
 */
function colA1ToIndex( colA1, index ) {
  if (typeof colA1 !== 'string' || colA1.length > 2)
    throw new Error( "Expected column label." );

  // Ensure index is (default) 0 or 1, no other values accepted.
  index = index || 0;
  index = (index == 0) ? 0 : 1;

  var A = "A".charCodeAt(0);

  var number = colA1.charCodeAt(colA1.length-1) - A;
  if (colA1.length == 2) {
    number += 26 * (colA1.charCodeAt(0) - A + 1);
  }
  return number + index;
}


/**
 * Return a 0-based array index corresponding to a spreadsheet row
 * number, as in A1 notation. Almost pointless, really, but maintains
 * symmetry with colA1ToIndex().
 *
 * @param {Number}    rowA1    Row number to be converted.
 * @param {Number}    index    (optional, default 0) Indicate 0 or 1 indexing
 *
 * @return {Number}            0-based array index.
 */
function rowA1ToIndex( rowA1, index ) {
  // Ensure index is (default) 0 or 1, no other values accepted.
  index = index || 0;
  index = (index == 0) ? 0 : 1;

  return rowA1 - 1 + index;
}

// From https://stackoverflow.com/a/21231012
function columnToLetter(column)
{
  var temp, letter = '';
  while (column > 0)
  {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

function letterToColumn(letter)
{
  var column = 0, length = letter.length;
  for (var i = 0; i < length; i++)
  {
    column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
  }
  return column;
}

module.exports = {
  cellA1ToIndex,
  colA1ToIndex,
  rowA1ToIndex,
  columnToLetter,
  letterToColumn
}
