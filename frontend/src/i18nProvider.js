import englishMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';

let messages = {
  trm: {
    menu: {
      techies: 'Techies',
      applications: 'Applications',
      academy: 'Academy',
      ds: 'Data Science',
      ai: 'Artificial Intelligence',
      webdev: 'Web Development',
      ux: 'UX Design',
      dropped: 'Dropped',
      alumni: 'Alumni',
      reports: 'Reports',
      techieActivity: 'Techie Activity',
      csvImport: 'CSV Import',
      settings: 'Settings'
    }
  },
  resources: {
    techies: {
      name: 'Techie |||| Techies',
      fields: {
        id: 'ID',
        first_name: 'First Name',
        last_name: 'Last Name',
        techie_key: 'Techie Key',
        application_track_choice: 'Application Track Choice',
        google_account: 'Google Account',
        github_handle: 'GitHub Handle',
        edyoucated_handle: 'edyoucated Handle',
        linkedin_profile_url: 'LinkedIn Profile URL',
        slack_member_id: 'Slack Member ID',
        receives_certificate: 'Receives Certificate',
        edyoucated_imported_at: 'Imported edyoucated activity at',
        edyoucated_next_import_after: 'Will import edyoucated activity after',
        edyoucated_user_id: 'edyoucated User ID'
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
        'techie_id': 'Techie ID',
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
    },
    techie_activity: {
      fields: {
        type_values: {
          edyoucated: 'hours learned',
          slack_activity: 'read Slack',
          slack_participation: 'been active on Slack'
        }
      }
    }
  },
  ...englishMessages
};

export default polyglotI18nProvider(() => messages)
