import { getDocs, collection } from "firebase/firestore";
import { getDb } from "./db";

const collection_name = "columns";

export const findAllColumns = async () => {
  const snapshot = await getDocs(collection(getDb(), collection_name));

  const res = [];

  snapshot.forEach((column) => {
    res.push({
      id: column.id,
      ...column.data(),
    });
  });

  return res;
};
