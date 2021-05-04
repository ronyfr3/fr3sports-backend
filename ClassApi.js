//Advanced filtering sorting pagination
//http://localhost:5000/api/players?page=1&limit=4&sort=-acutionPrice&acutionPrice[gte]=10
class APIfeatures {
  constructor(query, queryString) {
    this.query = query; //allplayers
    this.queryString = queryString; //queryString
  }
  //http://localhost:5000/api/players?acutionPrice[gte]=10
  filtering() {
    const queryobj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit"];
    excludeFields.forEach((el) => delete queryobj[el]); //search queryString without page,limit,sort only name[gte|gt|lt|lte]=value
    let querystr = JSON.stringify(queryobj); //convert queryString to string
    //The replace() method searches a string for a specified value, or a regular expression, and returns a new string where the specified values are replaced. To replace all occurrences of a specified value, use the global (g) modifier
    console.log(querystr); //{"acutionPrice":{"gte":"10"}}
    //replace(regexp, replacerFunction)
    querystr = querystr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => "$" + match);
    //without querystr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => "$" + match) -->{"acutionPrice":{"undefined":"10"}
    //without "$"+match throws an error
    // "message": "Cast to Number failed for value \"{ gte: '10' }\" at path \"acutionPrice\" for model \"players\""
    console.log(querystr); //{"acutionPrice":{"$gte":"10"}}
    this.query.find(JSON.parse(querystr));
    console.log(querystr); //{"acutionPrice":{"$gte":"10"}}
    return this; //players
  }
  //http://localhost:5000/api/players?sort=-acutionPrice
  sorting() {
    if (this.queryString.sort) {
      // var names = [
      //   "Foo",
      //   "Bar",
      //   "Morse",
      //   "Foo",
      //   "Bar",
      //   "Luke",
      //   "Lea",
      //   "Han Solo",
      // ];

      // var str = names.join(":");
      // console.log(str); // Foo:Bar:Morse:Foo:Bar:Luke:Lea:Han Solo

      // var n = str.split(":");
      // console.log(n);
      // [ 'Foo', 'Bar', 'Morse', 'Foo', 'Bar', 'Luke', 'Lea', 'Han Solo' ]
      const sortby = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortby);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  //http://localhost:5000/api/players?page=1&limit=4
  paginating() {
    const page = this.queryString.page * 1 || 1; //initially its first page
    const limit = this.queryString.limit * 1 || 4; //first page with 4 data
    const skip = (page - 1) * limit; //1st page skip 0 data ,2nd page skip first 4 data
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIfeatures;
