const nock = require('nock')
const sinon = require('sinon')
const log = require('../../util/logger')({
  debugLoggingEnabled: false
})
const fetch = require('../../util/fetch')({ log })
const newTypeformStore = require('../../store/typeform')
const { expect } = require('chai')

const typeformBase = "https://api.typeform.com"
const responsesPath = "/forms/MYFORM/responses"
const formPath = "/forms/MYFORM"
const webhookPath = "/forms/MYFORM/webhooks/trm"

describe('store', () => {
  describe('typeform', () => {
    describe('getFormResponsesPaginated', () => {
      before((done) => {
        nock.disableNetConnect()
        nock(typeformBase)
          .get(`${responsesPath}?page_size=100`)
          .reply(200, {
            total_items: 3,
            page_count: 2,
            items: [
              { token: 'B' },
              { token: 'A' }
            ]
          })
        nock(typeformBase)
          .get(`${responsesPath}?page_size=100&before=A`)
          .reply(200, {
            total_items: 3,
            page_count: 2,
            items: [
              { token: 'C' },
              { token: 'D' }
            ]
          })
        nock(typeformBase)
          .get(`${responsesPath}?page_size=100&before=D`)
          .reply(200, {
            total_items: 3,
            page_count: 2,
            items: []
          })
        done()
      })

      after(() => {
        expect(nock.isDone()).to.be.true
        nock.cleanAll()
        nock.enableNetConnect()
      })

      it('returns paginated form responses', async () => {
        const typeform = newTypeformStore({
          fetch,
          log
        })
        const callback = sinon.spy()
        await typeform.getFormResponsesPaginated({
          id: 'MYFORM',
          token: 'TOKEN',
          callback
        })
        expect(callback.callCount).to.equal(2)
        expect(callback.getCall(0).calledWithExactly([
          { token: 'B' },
          { token: 'A' }
        ])).to.be.true
        expect(callback.getCall(1).calledWithExactly([
          { token: 'C' },
          { token: 'D' }
        ])).to.be.true
      })
    })
    describe('checkWebhook', () => {
      describe('when already installed', () => {
        before((done) => {
          nock.disableNetConnect()
          nock(typeformBase)
            .get(webhookPath)
            .reply(200, {
              "id": "01EJ6CRNNEJFX0FTXSN7WFY5V5",
              "form_id": "HFPjx8K0",
              "tag": "trm",
              "url": "https://example.invalid/tf-import-response-staging?op=one&formID=FORM_ID",
              "enabled": true,
              "verify_ssl": true,
              "secret": "SECRET",
              "created_at": "2020-09-14T13:27:15.887774Z",
              "updated_at": "2020-09-15T13:55:15.079961Z"
            })
          done()
        })

        after(() => {
          expect(nock.isDone()).to.be.true
          nock.cleanAll()
          nock.enableNetConnect()
        })

        it('returns true', async () => {
          const typeform = newTypeformStore({
            fetch,
            log
          })
          const result = await typeform.checkWebhook({
            id: 'MYFORM',
            token: 'TOKEN',
          })
          expect(result).to.deep.equal({installed: true, url: 'https://example.invalid/tf-import-response-staging?op=one&formID=FORM_ID'})
        })
      })
      describe('when not installed', () => {
        before((done) => {
          nock.disableNetConnect()
          nock(typeformBase)
            .get(webhookPath)
            .reply(404)
          done()
        })

        after(() => {
          expect(nock.isDone()).to.be.true
          nock.cleanAll()
          nock.enableNetConnect()
        })

        it('returns false', async () => {
          const typeform = newTypeformStore({
            fetch,
            log
          })
          const result = await typeform.checkWebhook({
            id: 'MYFORM',
            token: 'TOKEN',
          })
          expect(result).to.deep.equal({installed: false})
        })
      })
    })
    describe('getForm', () => {
      before((done) => {
        nock.disableNetConnect()
        nock(typeformBase)
          .get(formPath)
          .reply(200, {
            "id": "id",
            "title": "title",
            "language": "en",
            "fields": [
              {
                "id": "yt6gk3s1",
                "ref": "ref",
                "title": "title",
                "type": "type",
                "properties": {
                  "description": "description",
                  "choices": [
                    {
                      "ref": "ref",
                      "label": "label",
                      "attachment": {
                        "type": "type",
                        "href": "href",
                        "properties": {
                          "description": "description"
                        }
                      }
                    }
                  ],
                  "fields": [
                    null
                  ],
                  "allow_multiple_selection": true,
                  "randomize": true,
                  "allow_other_choice": true,
                  "vertical_alignment": true,
                  "supersized": true,
                  "show_labels": true,
                  "alphabetical_order": true,
                  "hide_marks": true,
                  "button_text": "Continue",
                  "steps": 0,
                  "shape": "star",
                  "labels": {
                    "left": "left",
                    "right": "right",
                    "center": "center"
                  },
                  "start_at_one": true,
                  "structure": "DDMMYYYY",
                  "separator": "/",
                  "currency": "EUR",
                  "price": {
                    "type": "type",
                    "value": "value"
                  },
                  "show_button": true,
                  "default_country_code": "us"
                },
                "validations": {
                  "required": true,
                  "max_length": 0,
                  "min_value": 0,
                  "max_value": 0,
                  "min_selection": 0,
                  "max_selection": 0
                },
                "attachment": {
                  "type": "image",
                  "href": {
                    "image": {
                      "value": "https://images.typeform.com/images/4bcd3"
                    },
                    "Pexels": {
                      "value": "https://www.pexels.com/video/people-traveling-in-the-desert-1739011"
                    },
                    "Vimeo": {
                      "value": "https://vimeo.com/245714980"
                    },
                    "YouTube": {
                      "value": "https://www.youtube.com/watch?v=cGk3tZIIpXE"
                    }
                  },
                  "scale": 0,
                  "properties": {
                    "description": "description"
                  }
                },
                "layout": {
                  "type": "float",
                  "attachment": {
                    "type": "image",
                    "href": {
                      "image": {
                        "value": "https://images.typeform.com/images/4bcd3"
                      },
                      "Pexels": {
                        "value": "https://www.pexels.com/video/people-traveling-in-the-desert-1739011"
                      },
                      "Vimeo": {
                        "value": "https://vimeo.com/245714980"
                      },
                      "YouTube": {
                        "value": "https://www.youtube.com/watch?v=cGk3tZIIpXE"
                      }
                    },
                    "scale": 0,
                    "properties": {
                      "brightness": 0,
                      "description": "description",
                      "focal_point": {
                        "x": 0,
                        "y": 0
                      }
                    }
                  }
                }
              }
            ],
            "hidden": [
              "string"
            ],
            "welcome_screens": [
              {
                "ref": "nice-readable-welcome-ref",
                "title": "Welcome Title",
                "properties": {
                  "description": "Cool description for the welcome",
                  "show_button": true,
                  "button_text": "start"
                },
                "attachment": {
                  "type": "image",
                  "href": {
                    "image": {
                      "value": "https://images.typeform.com/images/4bcd3"
                    },
                    "Pexels": {
                      "value": "https://www.pexels.com/video/people-traveling-in-the-desert-1739011"
                    },
                    "Vimeo": {
                      "value": "https://vimeo.com/245714980"
                    },
                    "YouTube": {
                      "value": "https://www.youtube.com/watch?v=cGk3tZIIpXE"
                    }
                  },
                  "scale": 0,
                  "properties": {
                    "description": "description"
                  }
                }
              }
            ],
            "thankyou_screens": [
              {
                "ref": "nice-readable-thank-you-ref",
                "title": "Thank you Title",
                "properties": {
                  "show_button": true,
                  "button_text": "start",
                  "button_mode": "redirect",
                  "redirect_url": "https://www.typeform.com",
                  "share_icons": true
                },
                "attachment": {
                  "type": "image",
                  "href": {
                    "image": {
                      "value": "https://images.typeform.com/images/4bcd3"
                    },
                    "Pexels": {
                      "value": "https://www.pexels.com/video/people-traveling-in-the-desert-1739011"
                    },
                    "Vimeo": {
                      "value": "https://vimeo.com/245714980"
                    },
                    "YouTube": {
                      "value": "https://www.youtube.com/watch?v=cGk3tZIIpXE"
                    }
                  },
                  "scale": 0,
                  "properties": {
                    "description": "description"
                  }
                }
              }
            ],
            "logic": [
              {
                "type": "type",
                "ref": "ref",
                "actions": [
                  {
                    "action": "action",
                    "details": {
                      "to": {
                        "type": "type",
                        "value": "value"
                      },
                      "target": {
                        "type": "type",
                        "value": "value"
                      },
                      "value": {
                        "type": "type",
                        "value": 0
                      }
                    },
                    "condition": {
                      "op": "op",
                      "vars": [
                        {
                          "type": "type",
                          "value": {}
                        }
                      ]
                    }
                  }
                ]
              }
            ],
            "theme": {
              "href": "https://api.typeform.com/themes/Fs24as"
            },
            "workspace": {
              "href": "https://api.typeform.com/workspaces/Aw33bz"
            },
            "_links": {
              "display": "https://subdomain.typeform.com/to/abc123"
            },
            "settings": {
              "language": "language",
              "is_public": true,
              "progress_bar": "proportion",
              "show_progress_bar": true,
              "show_typeform_branding": true,
              "meta": {
                "allow_indexing": true,
                "description": "description",
                "image": {
                  "href": "href"
                }
              },
              "redirect_after_submit_url": "redirect_after_submit_url",
              "google_analytics": "google_analytics",
              "facebook_pixel": "facebook_pixel",
              "google_tag_manager": "google_tag_manager",
              "notifications": {
                "self": {
                  "enabled": true,
                  "recipients": [
                    "string"
                  ],
                  "reply_to": "reply_to",
                  "subject": "You received a response to your typeform {{form:title}}!",
                  "message": "message"
                },
                "respondent": {
                  "enabled": true,
                  "recipient": "recipient",
                  "reply_to": [
                    "string"
                  ],
                  "subject": "Thank you for completing the typeform {{form:title}}!",
                  "message": "message"
                }
              }
            }
          })
        done()
      })

      after(() => {
        expect(nock.isDone()).to.be.true
        nock.cleanAll()
        nock.enableNetConnect()
      })

      it('works', () => {
        const typeform = newTypeformStore({
          fetch,
          log
        })
        return typeform.getForm({
          id: 'MYFORM',
          token: 'TOKEN',
        })
      })
    })
    describe('updateWebhook', () => {
      before((done) => {
        nock.disableNetConnect()
        nock(typeformBase)
          .put(webhookPath)
          .reply(200, {
            "id": "01EJ6CRNNEJFX0FTXSN7WFY5V5",
            "form_id": "HFPjx8K0",
            "tag": "trm",
            "url": "https://example.invalid",
            "enabled": true,
            "verify_ssl": true,
            "secret": "SECRET",
            "created_at": "2020-09-14T13:27:15.887774Z",
            "updated_at": "2020-09-15T14:18:19.278405Z"
          })
        done()
      })

      after(() => {
        expect(nock.isDone()).to.be.true
        nock.cleanAll()
        nock.enableNetConnect()
      })

      it('works', () => {
        const typeform = newTypeformStore({
          fetch,
          log
        })
        return typeform.updateWebhook({
          id: 'MYFORM',
          callbackURL: 'https://example.invalid',
          secret: 'SECRET',
          token: 'TOKEN',
        })
      })
    })
  })
})
