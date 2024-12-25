const theme = localStorage.getItem('theme') || 'dark';

export function onLoadIcon() {
    try{
      var btns = document.getElementsByClassName('ft');
      for(let i = 0; i < btns.length; i++){
        btns[i].classList.remove('show');
        if(theme == 'light') {
          btns[i].style.color = '#676769'
        } else {
          btns[i].style.color = '#fff'
        }
      }
      let urlArr = window.location.href;
      if(urlArr.includes('buy')){
        try {
          document.getElementsByClassName('buy')[0].classList.add('show')
        } catch (error) {}
      }
      else if(urlArr.includes('market')){
        try {
          document.getElementsByClassName('market')[0].classList.add('show')
        } catch (error) { }
      }
      else if(urlArr.includes('invest')){
        try {
          document.getElementsByClassName('invest')[0].classList.add('show')
        } catch (error) { }
      }
      else if(urlArr.includes('history')){
        try {
          document.getElementsByClassName('history')[0].classList.add('show')
        } catch (error) { }
      }
      else if(urlArr.includes('person')){
        try {
          document.getElementsByClassName('person')[0].classList.add('show')
        } catch (error) {}
      }
      else{
        try {
          document.getElementsByClassName('home')[0].classList.add('show')
        } catch (error) {}
      }
      document.getElementsByClassName('show')[0].style.color = '#faa600'
      return;
    }catch(err){
      console.log(err)
    }
  }