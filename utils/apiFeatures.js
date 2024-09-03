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

        // Remove fields that are not related to filtering
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(key => delete queryCopy[key]);

        // Handling the 'skills' parameter
        if (queryCopy.skills) {
            const skillsArray = queryCopy.skills.split(',');
            queryCopy.skillsRequired = { $all: skillsArray };
            delete queryCopy.skills;
        }

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
