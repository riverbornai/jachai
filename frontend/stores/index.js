import { defineStore } from "pinia";

// The core engine ships without an account system. This store just holds a
// locally-generated "creator id" (see composables/useLocalCreator.js) that
// stands in for a real authenticated user id, so the quiz-management flow
// (create / list / view results) keeps working end to end. A product with
// real accounts should swap this out for its own auth state.
export const useMainStore = defineStore("main", () => {
  const { getCreatorId } = useLocalCreator();
  const creatorId = ref(getCreatorId());

  return {
    creatorId,
  };
});
