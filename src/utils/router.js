export const getRouter = ()=>{
  const router = localStorage.getItem("router")
  if(router == undefined){
    return "home"
  }
  return router;
}
export const setRouter = (status)=>{
    const router = localStorage.setItem("router",status)
    return true
}
//list route 
//home
//login
//register
//market
//login
//person
//buy