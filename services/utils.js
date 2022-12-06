function formatDateToSql(date) {
    return new Date(date).toISOString().substr(0,19).replace('T',' ')
} 

module.exports = {
    formatDateToSql
}