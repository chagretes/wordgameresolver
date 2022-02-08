// Importing module
const date = require('date-and-time')
  
// Creating object of current date and time 
// by using Date() 
const now  =  new Date();
  
// Formatting the date and time
// by using date.format() method
const value = date.format(now,'YYYY/MM/DD HH:mm:ss');
  
// Display the result
console.log("current date and time : " + value)