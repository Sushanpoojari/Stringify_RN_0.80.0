
import moment from 'moment';
const formatDate=(date,format='DD MM YYYY')=>{
    const formattedData= moment(date).format(format);
    return formattedData;
}

export default formatDate;