const { json } = require("body-parser");

/*Advanced filtering sorting pagination
http://localhost:5000/api/players?page=1&limit=4&sort=-auctionPrice&auctionPrice[gte]=10
console.log(req.query);
  {
  page: '1',
  limit: '4',
  sort: '-auctionPrice',
  auctionPrice: { gte: '10' }
}
here how this works with mongodb:::___
req.query for above long url if we can get
{price: { $gte: 1000 } this is the way mongodb understand or works
generally we get all items like this const playes=await players.find({price:{$gte:1000}}) or
const playes=await players.find().sort(-auctionPrice)
but we need these together with one url/parameter
*/
class APIfeatures {
  constructor(query, queryString) {
    this.query = query; //allplayers
    this.queryString = queryString; //queryString
  }
  //http://localhost:5000/api/players?auctionPrice[gte]=10
  //http://localhost:5000/api/players?auctionPrice[gt]=5&auctionPrice[lte]=10
  filtering() {
    const queryobj = { ...this.queryString }; //copying queryString like ...{price:{$gte:10}}
    /*we works with pagination sort filter,for filtering we need to remove page sort limit fields
    {price:{$gte:10}, sort:'-auctionPrice'} we need remove sort:'-auctionPrice'
    after removing we get {price:{$gte:10} } delete method delete item but contain empty space for removed items
    thats why there is empty space {price:{$gte:10}emptyspace}
    josn.stringify does {price:{gte:10}} --> {"price":{"$gte":"10"}}
    json.stringify & queryStre.replace() helps to add dollar sign before gte or before key string {"price":{"$gte":"10"}}
    replace(/\b(gte|gt|lt|lte)\b/g,replacerFunction)
    replcaerFunction-->(match) => "$" + match) runs whenever anything match to /\b(gte|gt|lt|lte)\b/g
    querystr = querystr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => "$" + match);
    */
    const excludeFields = ["page", "sort", "limit"];
    excludeFields.forEach((el) => delete queryobj[el]);
    let querystr = JSON.stringify(queryobj);
    //added regex for search capability
    //http://localhost:5000/api/players?auctionPrice[gt]=5&name[regex]=hafiz
    querystr = querystr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );
    /*{"price":{"$gte":"10"}}-->after json.parse-->{price:{$gte:10}} mongodb understand this not {"price":{"$gte":"10"}}
    thats why we do json.parse*/
    this.query.find(JSON.parse(querystr));
    // console.log(querystr);
    return this;
  }
  //http://localhost:5000/api/players?sort=-auctionPrice
  sorting() {
    /*
      this.queryString.sort we can get this from req.query
      this.queryString.sort.split(",")--> seperate query into comma {price:{gte:10 }[comma]sort:'-price'}-->{price:{gte:10 },sort:'-price'}
      this.queryString.sort.split(",").join(" ")-->
      {price:{gte:10 },["space"]sort:'-price'}-->{price:{gte:10 }, sort:'-price'}
      */
    if (this.queryString.sort) {
      //check if sort exists on req.query
      const sortby = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortby); //simple sort array function
    } else {
      //if no sort we sort it by date you can do it by this.query.sort("-price")
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  //http://localhost:5000/api/players?page=1&limit=4
  paginating() {
    const page = this.queryString.page * 1 || 1; //initially its first page
    const limit = this.queryString.limit * 1 || 5; //first page with 4 data
    const skip = (page - 1) * limit; //1st page skip 0 data ,2nd page skip first 4 data
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIfeatures;
