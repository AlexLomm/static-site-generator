import './home.scss';

const generateColor = (() => {
  const colors      = ['#ff5cb7', '#4fd9b6', '#98df72', '#dd3b3b', '#6e90ff'];
  let previousColor = null;

  return () => {
    const newColors = colors.filter(color => color !== previousColor);
    const index     = Math.floor(Math.random() * newColors.length);

    previousColor = newColors[index];

    return newColors[index];
  };
})();

const cube = document.querySelector('#cube');

cube.addEventListener('click', () => {
  cube.style.backgroundColor = generateColor();
});
