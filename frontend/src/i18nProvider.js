import englishMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';

let messages = {
  trm: {
    menu: {
      techies: 'Techies',
      applications: 'Applications',
      academy: 'Academy',
      csvImport: 'CSV Import',
      settings: 'Settings'
    }
  },
  resources: {
    techies: {
      name: 'Techie |||| Techies',
      fields: {
        first_name: 'First Name',
        last_name: 'Last Name',
        techie_key: 'Techie Key',
        application_track_choice: 'Application Track Choice',
        google_account: 'Google Account',
        github_handle: 'GitHub Handle',
        edyoucated_handle: 'edyoucated Handle',
        linkedin_profile_url: 'LinkedIn Profile URL'
      }
    },
    forms: {
      name: 'Form |||| Forms',
      fields: {
        form_id: 'Typeform Form ID',
        imports_techies: 'Imports Techies?'
      }
    },
    form_responses: {
      name: 'Form Response |||| Form Responses',
      fields: {
        'form.description': 'Form',
        'techie.first_name': 'First Name',
        'techie.last_name': 'Last Name'
      }
    },
    team_members: {
      name: 'Team Member |||| Team Members',
      fields: {
        first_name: 'First Name',
        last_name: 'Last Name',
      }
    },
    semesters: {
      name: 'Semester |||| Semesters'
    }
  },
  ...englishMessages
};

export default polyglotI18nProvider(() => messages)
