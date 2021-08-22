class APIFeatures {
    constructor(query, querystring) {
        this.query = query;
        this.querystring = querystring;
    }
    filter() {
        const queryObj = { ...this.querystring };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.querystring.sort) {
            this.query = this.query.sort(req.query.sort.split(",").join(" "));
        }
        return this;
    }

    limitFields() {
        if (this.querystring.fields) {
            this.query = this.query.select(this.querystring.fields.split(",").join(" "));
        }

        return this;
    }
    paginate() {
        const page = this.querystring.page * 1 || 1;
        const limit = this.querystring.limit * 1 || 100;
        let skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures;
