const yup = require('yup');

const HTTP_PROTOCOL_REGEX = /^https?:\/\//i;

const urlSchema = yup.object({
  url: yup.string()
    .required('URL is required')
    .transform((value) => {
      if (!value) return value;

      const trimmed = value.trim();

      // we want to prepend http:// if it is missing so that we can accept "reddit.com" for example
      return HTTP_PROTOCOL_REGEX.test(trimmed)
        ? trimmed
        : `http://${trimmed}`;
    })
    .test('is-valid-url', 'Invalid URL format', (value) => {
      if (!value) return false;

      try {
        const { protocol } = new URL(value);
        return protocol === 'http:' || protocol === 'https:';
      } catch {
        return false;
      }
    })
});

module.exports = { urlSchema };
