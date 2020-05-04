import moment from 'moment'

export const config = {
    fields: [{
            key: 'from',
            label: 'From',
            sortable: true,
            sortDirection: 'desc'
        },
        {
            key: 'to',
            label: 'To',
            sortable: true,
        },
        {
            key: 'subject',
            label: 'Subject',
            sortable: true,
            sortByFormatted: true,
            filterByFormatted: true
        },
        {
            key: 'date',
            label: 'Date',
            sortable: true,
            sortByFormatted: false,
            filterByFormatted: true,
            formatter: (value, key, item) => {
                let dateNow = moment();
                let date = moment.unix(value);
                let diff = dateNow.isSame(date, 'days');
                let diffYear = dateNow.isSame(date, 'years');
                if (diff) {
                    return date.format("h:mm");
                } else if (!diff && diffYear) {
                    return date.format("MMM D");
                } else {
                    return date.format("YYYY/MM/DD");
                }
            }
        }
    ],
    currentPage: 1,
    perPage: 10,
    filter: null,
    filterOn: [],
    sortBy: '',
    sortDesc: false,
    sortDirection: 'asc',
    selectMode: 'multi',
    selected: [],
    totalRows: 1,
    pagetotalRowsOptions: [5, 10, 15],
    headerClass: 'header',
    variant: 'light',
    headVariant: 'light',
    small: true,
    hover: true,
    selectable: true,
    stacked: 'md',
    responsive: 'md',
    theadClass: '',
    isBusy: false,
    showEmpty: true
}