import { string, setLocale } from 'yup';

const validateUrl = (url, validatedValues, i18n) => {
  setLocale({
    string: {
      url: i18n.t('rssForm.invalidUrl'),
    },
    mixed: {
      notOneOf: i18n.t('rssForm.repeatUrl'),
    },
  });

  const urlScheema = string().url().notOneOf(validatedValues);
  return urlScheema.validate(url, { abortEarly: false });
};

export default validateUrl;
