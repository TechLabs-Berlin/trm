const pick = (o, ...fields) => {
  return fields.reduce((a, x) => {
      if(o.hasOwnProperty(x)) a[x] = o[x];
      return a;
  }, {});
}

const answerExtractors = ({trmAPI}) => ({
  email({answer, attributes}) {
    if(answer.type !== 'email') {
      return {}
    }
    return { email: answer.value }
  },
  first_name({answer, attributes}) {
    if(answer.type !== 'text') {
      return {}
    }
    return { first_name: answer.value }
  },
  last_name({answer, attributes}) {
    if(answer.type !== 'text') {
      return {}
    }
    return { last_name: answer.value }
  },
  application_track_choice({answer, attributes}) {
    if(answer.type !== 'choice') {
      return {}
    }
    switch(answer.value.toLowerCase()) {
      case 'data science':
        return { application_track_choice: 'DS' }
      case 'artificial intelligence':
        return { application_track_choice: 'AI' }
      case 'web development':
        return { application_track_choice: 'WEBDEV' }
      case 'user experience (ux) design':
      case 'ux design':
        return { application_track_choice: 'UX' }
      default:
        return {}
    }
  },
  track({answer, attributes}) {
    if(answer.type !== 'choice') {
      return {}
    }
    switch(answer.value.toLowerCase()) {
      case 'data science':
        return { track: 'DS' }
      case 'artificial intelligence':
        return { track: 'AI' }
      case 'web development':
        return { track: 'WEBDEV' }
      case 'user experience (ux) design':
      case 'ux design':
        return { track: 'UX' }
      default:
        return {}
    }
  },
  gender({answer, attributes}) {
    if(answer.type !== 'choice') {
      return {}
    }
    switch(answer.value.toLowerCase()) {
      case 'male':
        return { gender: 'male' }
      case 'female':
        return { gender: 'female' }
      default:
        return {}
    }
  },
  age({answer, attributes}) {
    if(answer.type !== 'number') {
      return {}
    }
    if(typeof answer.value !== 'number') {
      return {}
    }
    return { age: answer.value }
  },
  google_account({answer, attributes}) {
    if(answer.type !== 'email') {
      return {}
    }
    return { google_account: answer.value }
  },
  github_handle({answer, attributes}) {
    if(answer.type !== 'text') {
      return {}
    }
    return { github_handle: answer.value }
  },
  linkedin_profile_url({answer, attributes}) {
    if(answer.type !== 'url') {
      return {}
    }
    return { linkedin_profile_url: answer.value }
  },
  slack_member_id({answer, attributes}) {
    if(answer.type !== 'text') {
      return {}
    }
    return { slack_member_id: answer.value }
  },
  async project_name({answer, attributes}) {
    if(!['text', 'choice'].includes(answer.type)) {
      return {}
    }
    const result = await trmAPI.getProjectByNameAndSemester({
      name: answer.value,
      semesterID: attributes.semester_id,
    })
    if(!result.found) {
      return {}
    }
    return { project_id: result.project.id }
  },
  drop_out_reason({ answer, attributes }) {
		if (answer.type !== "choice") {
			return {};
		}
		switch (answer.value.toLowerCase()) {
			case 'didn’t submit registration form':
				return { drop_out_reason: 'REGISTRATION_FORM' }
			case 'didn’t submit personalization form':
				return { drop_out_reason: 'PERSONALIZATION_FORM' }
			case 'didn’t submit project preference form':
				return { drop_out_reason: 'PROJECT_FORM'}
			case 'didn’t pass the hatching phase':
				return { drop_out_reason: 'HATCHING_FAIL' }
			case 'dropped during academy phase':
				return { drop_out_reason: 'DROPPED_ACADEMY' }
			case 'dropped during project phase':
				return { drop_out_reason: 'DROPPED_PROJECT'}
			default:
				return {};
		}
}}
)

module.exports = {
  processTechieMasterData: async ({attributes, formAnswers, trmAPI}) => {
    const thisExtractors = answerExtractors({trmAPI})
    const attributesAfterExtractors = Object.assign({}, attributes)
    for(const [field, answer] of Object.entries(formAnswers)) {
      if(!(field in thisExtractors)) {
        continue
      }
      const result = await thisExtractors[field]({answer, attributes})
      Object.assign(attributesAfterExtractors, result)
    }

    // selects the given keys from attributesWithExtractors
    const selectedAttributes = pick(
      attributesAfterExtractors,
      'id',
      'email',
      'first_name',
      'last_name',
      'state',
      'techie_key',
      'application_track_choice',
      'track',
      'gender',
      'age',
      'google_account',
      'github_handle',
      'linkedin_profile_url',
      'slack_member_id',
      'project_id',
      'drop_out_reason'
    )

    return selectedAttributes
  },
  answerExtractors
}
