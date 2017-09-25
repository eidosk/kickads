function ArrayUtils() {};
ArrayUtils.clone = function(myArray){
    return myArray.slice(0);
}

ArrayUtils.getRandomItem = function(myArray){
    return myArray[Math.floor(Math.random() * myArray.length)];
}

ArrayUtils.removeItem = function(myArray, index){
    myArray.splice(index, 1);
}