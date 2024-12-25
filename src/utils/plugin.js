export function OpenPopup(){
    iframe = document.getElementById("meiqia_custorm")
    iframe.querySelectorAll('span')[0].click()
}
let iframe = ""
function checkPopupCshk(){
    var idInterval = setInterval(()=>{
        iframe = document.getElementById("meiqia_custorm")
        if(iframe != null){
            clearInterval(idInterval)
        }
    },500)
    return true;
}
checkPopupCshk()