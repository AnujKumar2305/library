const pdf = require('pdf-creator-node');
const fs = require('fs');
const path = require('path');
const dirname = path.join(__dirname+'/tree-736885_960_720.webp')
console.log(dirname);
var html = fs.readFileSync("pdf.html", "utf8");
pdfGenerator =(invoicedata)=>{
var options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    header: {
        height: "45mm",
        contents: '<div style="text-align: center;">Invoice</div>'
    },
    footer: {
        height: "28mm",
        contents: {
            first: 'Library Invoice',
            2: 'Second page', // Any page number is working. 1-based index
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            last: 'Last Page'
        }
    }
};
console.log(invoicedata);
var users = {
    name:invoicedata.name,
    address : invoicedata.address,
    email : invoicedata.userid.email,
    products : invoicedata.cartdata,
    subtotal :invoicedata.Price,
    date : invoicedata.date,
    id :invoicedata._id,
    image :dirname
};

var document = {
    html: html,
    data: {
      data: users,
    },
    path: "./output.pdf",
    type: "",
  };


  pdf
  .create(document, options)
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.error(error);
  });
}

module.exports = pdfGenerator;