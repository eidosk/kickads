ArrayUtils = {
    clone: function(myArray){
        return myArray.slice(0);
    },
    clone2d: function(arr) {  
      var clone = [];
      for (i=0; i<arr.length; i++) {
        clone.push( arr[i].slice(0) )
      }
      return clone;
    },
    getRandomItem: function(myArray){
        return myArray[Math.floor(Math.random() * myArray.length)];
    },
    removeItem: function(myArray, index){
        myArray.splice(index, 1);
    }
};
