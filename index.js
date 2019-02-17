var fs = require('fs');
var AWS = require('aws-sdk');
var pdf = require('html-pdf');
var juice = require('juice');
var ejs = require('ejs');


const s3 = new AWS.S3({
  accessKeyId: "AKIAJEQM7KQ5W5MBBWXA",
  secretAccessKey: "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",
});

let html ='';
let fileName ='';
let people = ['geddy', 'neil', 'alex'];
ejs.renderFile('./views/myPdf.ejs', {people}, function(err, result) {
  // render on success
  if (result) {
    html = juice(result);
  }
  // render or error
  else {
    res.end('An error occurred');
    console.log(err);
  }
});
var options = { format: 'Letter', timeout: '100000' };
let rand = Math.floor(Math.random() * 1000000);
pdf.create(html, options).toFile(`./${rand}-dispatch.pdf`, function(err, res) {
  if (err) return console.log(err);
  //console.log(res); // { filename: '/app/businesscard.pdf' }
  fileName = `${rand}-dispatch.pdf`
  console.log(fileName)
  // upload he freaking file

  var myBucket = 'td-central';
  var myKey = 'AKIAJWG22KNKKUSALBCA';
  fs.readFile(`./${fileName}`, function (err, data) {
    if (err) { throw err; }
    params = {Bucket: myBucket, Key: fileName, Body: data };

    s3.upload(params, function(err, data) {
      if (err) {
        console.log("the error", err)
        fs.unlink(`./${fileName}`, function (err) {
          if (err) {
            console.error(err);
          }
        })

      } else {
        console.log(`Successfully uploaded ${data.Location} to myBucket/myKey`);

        fs.unlink(`./${fileName}`, function (err) {
          if (err) {
            console.error(err);
          }
        })
      }
    });
  });



  //delete file from our repository

});











