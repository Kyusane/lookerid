const dateOptions = {
     year: 'numeric',
     month: 'long',
     day: 'numeric'
 };
 
 const timeOptions = {
     hour: '2-digit',
     minute: '2-digit',
     second: '2-digit',
     hour12: false
 };
 
 const getTimeStamps = () => {
     const ts = new Date();
     const datePart = ts.toLocaleDateString('id-ID', dateOptions);
     const timePart = ts.toLocaleTimeString('id-ID', timeOptions).replace(/\./g, ':');
     return `${datePart}, ${timePart}`;
 }

module.exports = { getTimeStamps }