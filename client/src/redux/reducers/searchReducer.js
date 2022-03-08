import axios from 'axios'
const apiKey = "de796f2239c841b099773f5034406613";
const defaultState = {
  form: {
    cuisine: '',
    diet: '',
    mealType: '',
    allergies: [],
    resultsNumber: "",
    cookTime: ""
  },
  results: [],
  loading: false
}

const SEARCH_SET_FORM = 'SEARCH_SET_FORM'
const SEARCH_SET_RESULTS = 'SEARCH_SET_RESULTS'
const SEARCH_SET_LOADING = 'SEARCH_SET_LOADING'

export function search(dispatch, getState) {
  dispatch({ type: 'SEARCH_SET_LOADING' })
  const { cuisine, diet, mealType, allergies, resultsNumber, cookTime } = getState().search.form

  let tags = []
  if (cuisine.length) tags.push(cuisine);
  if (diet.length) tags.push(diet);
  if (mealType) tags.push(mealType);

  let url = `https://api.spoonacular.com/recipes/random?apiKey=${process.env.REACT_APP_API_KEY}`
  if (tags.length) {
    url += '&tags=' + encodeURIComponent(tags.join(','))
  }

  if (resultsNumber) {
    url += `&number=${resultsNumber}`
  }

  if (cookTime) {
    url += `&maxReadyTime=${cookTime}`
  }

  if (allergies.length) {
    url += `&intolerances=${encodeURIComponent(allergies)}`
  }

  axios.get(url)
    .then((res) => {
      dispatch(setResults(res.data.recipes))
    })
    .catch("There are no results, Please try again!")
};

export function setSearch(field, value) {
  return {
    type: SEARCH_SET_FORM,
    field,
    value
  }
}

export function setResults(results) {
  return {
    type: SEARCH_SET_RESULTS,
    results
  }
}

export function searchReducer(state = defaultState, action) {
  switch (action.type) {
    case SEARCH_SET_FORM:
      return {
        ...state,
        form: {
          ...state.form,
          [action.field]: action.value

        }
      }
    case SEARCH_SET_RESULTS:
      return {
        ...state,
        results: action.results,
        loading: false
      }
    case SEARCH_SET_LOADING:
      return {
        ...state,
        loading: true
      }
    default:
      return state
  }
}