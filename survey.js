import comments from './comments.json'

console.log('haha')
console.log(comments)

$.getJSON('comments.json',function(data){console.log(data[0])})