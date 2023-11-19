const generateRandomColor = (opacity = 1) => {
  const letters = "0123456789ABCDEF";
  let color = "rgba(";
  for (let i = 0; i < 3; i++) {
    color += Math.floor(Math.random() * 256) + ",";
  }
  color += `${opacity})`;
  return color;
};

export default generateRandomColor;
