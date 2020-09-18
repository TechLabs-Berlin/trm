import englishMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';

let messages = {
  resources: {
    techies: {
      fields: {
        first_name: 'First Name',
        last_name: 'Last Name',
        techie_key: 'Techie Key'
      }
    },
    forms: {
      fields: {
        form_id: 'Typeform Form ID',
        imports_techies: 'Imports Techies?'
      }
    },
    form_submissions: {
      name: 'Form Submission |||| Form Submissions',
      fields: {
        'form.description': 'Form',
        'techie.first_name': 'First Name',
        'techie.last_name': 'Last Name'
      }
    }
  },
  ...englishMessages
};

export default polyglotI18nProvider(() => messages)
