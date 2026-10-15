import { useParams } from "react-router-dom";

/** The `:id` route param as a positive integer, or null for anything else ("abc", "-1", "1.5"). */
export const useRouteId = (): number | null => {
  const raw = useParams().id;
  const id = Number(raw);
  return raw && Number.isInteger(id) && id > 0 ? id : null;
};
