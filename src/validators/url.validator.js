const yup = require('yup');

const urlSchema = yup.object({
  url: yup.string()
    .required('URL is required')
    .url('Invalid URL format')
});

module.exports = {
  urlSchema
};
