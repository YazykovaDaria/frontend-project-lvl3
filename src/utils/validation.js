import { string } from 'yup';

const validateUrl = (url, validatedValues) => {
  const urlScheema = string().url('Ссылка должна быть валидным URL').notOneOf(validatedValues, 'RSS уже существует');
  return urlScheema.validate(url, { abortEarly: false });
};

export default validateUrl;
