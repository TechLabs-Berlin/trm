const expect = require('chai').expect

const techie = require('../../util/techie')

describe('techie utils', () => {
  describe('processTechieMasterData', () => {
    it('throws away extra attributes', () => {
      const result = techie.processTechieMasterData({
        attributes: {
          id: 'ID',
          email: 'EMAIL',
          first_name: 'FIRST_NAME',
          last_name: null,
          state: 'APPLICANT',
          techie_key: 'Techie123',
          extra: 'EXTRA'
        },
        formAnswers: {}
      })
      expect(result).to.deep.equal({
        id: 'ID',
        email: 'EMAIL',
        first_name: 'FIRST_NAME',
        last_name: null,
        state: 'APPLICANT',
        techie_key: 'Techie123'
      })
    })
    it('adds non-existing source attributes', () => {
      expect(techie.processTechieMasterData({
        attributes: {
          first_name: 'Felix'
        },
        formAnswers: {
          email: {
            type: 'email',
            value: 'NEW'
          }
        }
      })).to.deep.equal({
        email: 'NEW',
        first_name: 'Felix'
      })
    })
    it('updates existing email', () => {
      expect(techie.processTechieMasterData({
        attributes: {
          email: 'OLD',
          first_name: 'Felix'
        },
        formAnswers: {
          email: {
            type: 'email',
            value: 'NEW'
          }
        }
      })).to.deep.equal({
        email: 'NEW',
        first_name: 'Felix'
      })
    })
    it('extracts firstName', () => {
      expect(techie.processTechieMasterData({
        attributes: {},
        formAnswers: {
          first_name: {
            type: 'text',
            value: 'NEW'
          }
        }
      })).to.deep.equal({
        first_name: 'NEW'
      })
    })
    it('extracts lastName', () => {
      expect(techie.processTechieMasterData({
        attributes: {},
        formAnswers: {
          last_name: {
            type: 'text',
            value: 'NEW'
          }
        }
      })).to.deep.equal({
        last_name: 'NEW'
      })
    })
    it('extracts application_track_choice', () => {
      expect(techie.processTechieMasterData({
        attributes: {},
        formAnswers: {
          application_track_choice: {
            type: 'choice',
            value: 'Data Science'
          }
        }
      })).to.deep.equal({
        application_track_choice: 'DS'
      })

      expect(techie.processTechieMasterData({
        attributes: {},
        formAnswers: {
          application_track_choice: {
            type: 'choice',
            value: 'Artificial Intelligence'
          }
        }
      })).to.deep.equal({
        application_track_choice: 'AI'
      })

      expect(techie.processTechieMasterData({
        attributes: {},
        formAnswers: {
          application_track_choice: {
            type: 'choice',
            value: 'Web Development'
          }
        }
      })).to.deep.equal({
        application_track_choice: 'WEBDEV'
      })

      expect(techie.processTechieMasterData({
        attributes: {},
        formAnswers: {
          application_track_choice: {
            type: 'choice',
            value: 'User Experience (UX) Design'
          }
        }
      })).to.deep.equal({
        application_track_choice: 'UX'
      })
    })
    it('extracts gender', () => {
      expect(techie.processTechieMasterData({
        attributes: {},
        formAnswers: {
          gender: {
            type: 'choice',
            value: 'Male'
          }
        }
      })).to.deep.equal({
        gender: 'male'
      })

      expect(techie.processTechieMasterData({
        attributes: {},
        formAnswers: {
          gender: {
            type: 'choice',
            value: 'FemaLe'
          }
        }
      })).to.deep.equal({
        gender: 'female'
      })

      expect(techie.processTechieMasterData({
        attributes: {},
        formAnswers: {
          gender: {
            type: 'choice',
            value: 'Other'
          }
        }
      })).to.deep.equal({})
    })
    it('extracts age', () => {
      expect(techie.processTechieMasterData({
        attributes: {},
        formAnswers: {
          age: {
            type: 'number',
            value: 22
          }
        }
      })).to.deep.equal({
        age: 22
      })
    })
    it('extracts google_account', () => {
      expect(techie.processTechieMasterData({
        attributes: {},
        formAnswers: {
          google_account: {
            type: 'email',
            value: 'abc@def.com'
          }
        }
      })).to.deep.equal({
        google_account: 'abc@def.com'
      })
    })
    it('extracts github_handle', () => {
      expect(techie.processTechieMasterData({
        attributes: {},
        formAnswers: {
          github_handle: {
            type: 'text',
            value: 'Kathie23'
          }
        }
      })).to.deep.equal({
        github_handle: 'Kathie23'
      })
    })
    it('extracts edyoucated_handle', () => {
      expect(techie.processTechieMasterData({
        attributes: {},
        formAnswers: {
          edyoucated_handle: {
            type: 'text',
            value: 'XXKathie23'
          }
        }
      })).to.deep.equal({
        edyoucated_handle: 'XXKathie23'
      })
    })
    it('extracts linkedin_profile_url', () => {
      expect(techie.processTechieMasterData({
        attributes: {},
        formAnswers: {
          linkedin_profile_url: {
            type: 'url',
            value: 'https://linkedin.com/someprofile'
          }
        }
      })).to.deep.equal({
        linkedin_profile_url: 'https://linkedin.com/someprofile'
      })
    })
  })
})
