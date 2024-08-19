"use client";

const initialState = {
  user: {} as any,
  language: 'English',
};

const reducer = (state = initialState, action: any) => {
  switch (action?.type) {
    case "SetUser":
      return { ...state, user: action?.payload };
    case "UpdateUserContainer":
      return {
        ...state,
        user: {
          ...state?.user,
          container: {
            ...state?.user?.container,
            ...action?.payload,
          },
        },
      };
    case "ClearUser":
      return { ...state, user: {} };
    case "SetLanguage":
      return { ...state, language: action?.payload }
    default:
      return state;
  }
};

export default reducer;
