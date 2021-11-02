export const getTime = async (todayDate: any) => {
  let today = new Date();
  const curTime = today.getHours();
  if (curTime < 12) {
    today = new Date(today.setDate(today.getDate() - 1));
  }
  const year = today.getFullYear();
  const month = ("0" + (today.getMonth() + 1)).slice(-2);
  const day = ("0" + today.getDate()).slice(-2);
  todayDate = year + "-" + month + "-" + day;
};
