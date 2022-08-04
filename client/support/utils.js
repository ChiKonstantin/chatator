import { languages } from './langList';

const getLangName = function (langCode) {
  const [langName] = languages.filter((lang) => lang.code === langCode);
  return langName;
};
