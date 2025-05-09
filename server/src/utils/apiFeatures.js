

export class ApiFeatures {
    constructor(mongooseQuery, searchQuery) {
        this.mongooseQuery = mongooseQuery
        this.searchQuery = searchQuery
    }


    paginate(countDocuments) {
        const page = this.searchQuery.page * 1 || 1;
        const limit = this.searchQuery.limit * 1 || 50;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;

        const pagination = {};
        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(countDocuments / limit);

        if (endIndex < countDocuments) {
            pagination.next = page + 1;
        }
        if (skip > 0) {
            pagination.prev = page - 1;
        }
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

        this.paginationResult = pagination;
        return this;
    }

    filter() {
        let filterObj = structuredClone(this.searchQuery)
        filterObj = JSON.stringify(filterObj)
        filterObj = filterObj.replace(/(gt|gte|lt|lte)/g, value => `$${value}`)
        filterObj = JSON.parse(filterObj)
        let excludedFields = ['page', 'sort', 'fields', 'search']
        excludedFields.forEach(val => {
            delete filterObj[val]
        });

        this.mongooseQuery.find(filterObj)
        return this


    }


    sort() {
        if (this.searchQuery.sort) {
            let sortedBy = this.searchQuery.sort.split(',').join(' ')
            this.mongooseQuery.sort(sortedBy)
        }
        return this

    }


    fields() {
        if (this.searchQuery.fields) {
            let selectedFields = this.searchQuery.fields.split(',').join(' ')
            this.mongooseQuery.select(selectedFields)
        }

        return this
    }


    search() {
        if (this.searchQuery.search) {
            this.mongooseQuery.find(
                {
                    $or: [
                        { title: { $regex: this.searchQuery.search, $options: 'i' } },
                        { description: { $regex: this.searchQuery.search, $options: 'i' } }
                    ]
                }
            )
        }
        return this
    }

}