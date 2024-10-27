export function saveParseJSON(jsonString: string) {
  try {
    const data = JSON.parse(jsonString);
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

export const parseJsonAddress = (jsonString: string) => {
  const [data, error] = saveParseJSON(jsonString);
  if (data) {
    return data;
  } else {
    return {};
  }
};
