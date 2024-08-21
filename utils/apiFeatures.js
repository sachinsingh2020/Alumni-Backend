class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword
            ? {
                $or: [
                    { firstName: { $regex: this.queryStr.keyword, $options: 'i' } },
                    { lastName: { $regex: this.queryStr.keyword, $options: 'i' } },
                    { jobTitle: { $regex: this.queryStr.keyword, $options: 'i' } },
                    { companyName: { $regex: this.queryStr.keyword, $options: 'i' } },
                    { jobLocation: { $regex: this.queryStr.keyword, $options: 'i' } },
                ]
            }
            : {};


        this.query = this.query.find(keyword);
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };

        // removing the fiels from the query 
        const removeFields = ['keyword', 'limit', 'page'];

        removeFields.forEach(key => delete queryCopy[key]);

        this.query = this.query.find(queryCopy);
        return this;
    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    }
}

export default ApiFeatures;