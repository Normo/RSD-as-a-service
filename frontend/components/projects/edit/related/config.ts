
export const cfgRelatedItems = {
  relatedProject: {
    title: 'Related projects',
    subtitle: 'This project is related to these projects registered in RSD',
    label: 'Find related projects',
    help: 'Start typing for suggestions',
    validation: {
      //custom validation rule, not in used by react-hook-form
      minLength: 1,
    }
  },
  relatedSoftware: {
    title: 'Related software',
    subtitle: 'This project uses the following software registered in RSD',
    label: 'Find related software',
    help: 'Start typing for suggestions',
    validation: {
      //custom validation rule, not in used by react-hook-form
      minLength: 1,
    }
  }
}