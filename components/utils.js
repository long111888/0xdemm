
export function formatAmount(amount) {
    if (amount === undefined || amount === null) {
        return '--'
    }
    if (typeof amount === 'string') {
        if (amount.indexOf(",") != -1) {
            amount = amount.replaceAll(",", "")
        }
        amount = parseFloat(amount);
    } else if (typeof amount === 'bigint') {
        amount = Number(amount)
    } else if (typeof amount == 'number'){
       
    } else {
        console.log(`${amount} ${typeof amount}`);
    }

    let formattedNumber = amount.toFixed(2);
    const parts = formattedNumber.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
}

export function isDictEmpty(obj) {
  return Object.keys(obj).length === 0;
}