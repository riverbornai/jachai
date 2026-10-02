// The core engine has no auth/account system. Quizzes and results still need
// an opaque "creator" id to group things like "my quizzes" — this composable
// generates and persists a random id in localStorage so that flow keeps
// working end to end without wiring up a real identity provider.
//
// A product built on top of this engine (with real accounts) should replace
// this with its own authenticated user id.
export default function useLocalCreator() {
  const STORAGE_KEY = "core-engine-creator-id";

  function getCreatorId() {
    if (typeof window === "undefined") return null;
    let id = window.localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = "local-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      window.localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  }

  return { getCreatorId };
}
