export function formatUsdt(number){
    var newNumber = parseFloat(number)
    let newdata = newNumber.toLocaleString('en-US', { currency: 'USD'});
    return newdata;
}
export function formatVnd(number){
    var newNumber = parseInt(number)
    let newdata = newNumber.toLocaleString('vi-VN', {style: 'currency', currency: 'VND',currencyDisplay: 'code'});
    return newdata;
}
export async function usdToVnd(number){
    var reponse = await fetch('https://api.exchangerate-api.com/v4/latest/USDT');
    var data =await reponse.json();
    const usdToVndRate = data.rates.VND;
    // Thực hiện chuyển đổi từ USDT sang VND
    const usdtAmount = number; // Số tiền USDT cần chuyển đổi
    const vndAmount = usdtAmount * usdToVndRate;
    return vndAmount;
}
export async function vndToUsd(number){
    var reponse = await fetch('https://api.exchangerate-api.com/v4/latest/USDT');
    var data =await reponse.json();
    const usdToVndRate = data.rates.VND;
    // Thực hiện chuyển đổi từ USDT sang VND
    const usdtAmount = number; // Số tiền USDT cần chuyển đổi
    const vndAmount = usdtAmount / usdToVndRate;
    return vndAmount;
}
