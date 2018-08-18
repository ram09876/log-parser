var swap = function(array, firstIndex, secondIndex) {
    var temp = array[firstIndex];
    array[firstIndex] = array[secondIndex];
    array[secondIndex] = temp;
};

var indexofMaximum = function(array, startIndex) {

    var minValue = Object.values(array[startIndex])[0];
    var minIndex = startIndex;

    for(var i = minIndex + 1; i < array.length; i++) {
        var currentValue = Object.values(array[i])[0];
        if(currentValue > minValue) {
            minIndex = i;
            minValue = currentValue;
        }
    } 
    return minIndex;
}; 

var selectionSort = function(array) {
    var i;
    for(i = 0;i< array.length; i++){
      var minIndex = indexofMaximum(array,i);
      swap(array, minIndex,i);
      
    }
  return array;
};

var array = [ { '200': 34972 },
{ '206': 10 },
{ '207': 5695 },
{ '301': 3473 },
{ '302': 1387 },
{ '304': 810 },
{ '400': 1 },
{ '403': 2 },
{ '404': 5764 },
{ '405': 3 },
{ '500': 3 },
{ '-': 161 } ];
array = selectionSort(array);
console.log("Array after sorting:  " + JSON.stringify(array));

// Program.assertEqual(array, [7, 9, 11, 22, 42, 88, 99]);