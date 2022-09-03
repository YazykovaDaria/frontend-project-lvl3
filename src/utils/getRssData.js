import * as axios from 'axios';

const getRssData = (link) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`).then((response) => response.data);

export default getRssData;
