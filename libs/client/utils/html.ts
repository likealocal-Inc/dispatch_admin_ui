export const getHTMLElementByID = <T = HTMLElement>(id: string): T => {
  return <T>document.getElementById(id);
};

export const getSelctOptionValue = (id: string) => {
  const obj = getHTMLElementByID<HTMLSelectElement>(id);
  const value = obj.options[obj.selectedIndex].value;
  return value;
};
