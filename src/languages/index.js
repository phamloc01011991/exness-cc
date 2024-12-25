import vn from './vn';
import en from './en';

let languagePack = {};

export const getLanguagePack = async () => {
    let locations = JSON.parse(localStorage.getItem('locations')) || { language: 'VN' };

    if (locations.language === 'VN') {
      languagePack = vn;
    }
    if (locations.language === 'EN') {
      languagePack = en;
    }

  return languagePack;
};

export const setLanguage = (language) => {
  const locations = JSON.parse(localStorage.getItem('locations')) || { language: 'VN' };

  locations.language = language;
  localStorage.setItem('locations', JSON.stringify(locations));
  if (language === 'VN') languagePack = vn;
  else languagePack = en;
  window.location.reload();
};

export { languagePack};


getLanguagePack();
