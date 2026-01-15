const config = {
  multiplier: 4,
  maxStep: 10,
  wrongTimeout: 1000,
  nextDelay: 400
};

const examplesEl = document.getElementById('examples');
const button = document.getElementById('submitBtn');
const multiplierSelect = document.getElementById('multiplierSelect');

let step = 1;
let currentInput = null;
let gameFinished = false;

function setButtonState(state) {
  button.className = 'controls__button';
  button.classList.remove('active', 'right', 'wrong');

  if (gameFinished && state === 'active') return;

  switch (state) {
    case 'active':
      button.classList.add('active');
      button.disabled = false;
      break;
    case 'right':
      button.classList.add('right');
      button.disabled = false;
      break;
    case 'wrong':
      button.classList.add('wrong');
      button.disabled = false;
      break;
    case 'disabled':
    default:
      button.disabled = true;
      break;
  }
}

function resetGame() {
  step = 1;
  examplesEl.innerHTML = '';
  currentInput = null;
  gameFinished = false;
  button.textContent = 'Done';
  setButtonState('disabled');

  createExample(step);
}

function updateButtonState() {
  if (gameFinished) return;

  if (
    currentInput &&
    currentInput.value !== '' &&
    !currentInput.classList.contains('answered') &&
    !currentInput.classList.contains('wrong-input')
  ) {
    setButtonState('active');
  } else {
    setButtonState('disabled');
  }
}

function createExample(step) {
  if (step > config.maxStep) {
    finishGame();
    return;
  }

  setButtonState('disabled');

  const row = document.createElement('div');
  row.className = 'example-row';

  const left = document.createElement('div');
  left.className = 'example-left';
  left.innerHTML = `${config.multiplier} × ${step} = `;

  const input = document.createElement('input');
  input.type = 'number';
  input.className = 'example__input';
  left.appendChild(input);
  row.appendChild(left);

  const right = document.createElement('div');
  right.className = 'example-right';
  row.appendChild(right);

  examplesEl.appendChild(row);

  requestAnimationFrame(() => {
    row.classList.add('visible');
  });

  currentInput = input;
  input.focus();

  input.addEventListener('input', updateButtonState);

  animateCubes(right, config.multiplier);
}

function animateCubes(container, count) {
  document.body.classList.add('no-scroll');
  let finished = 0;

  for (let i = 0; i < count; i++) {
    const cube = document.createElement('div');
    cube.className = 'cube cube--hidden';
    container.appendChild(cube);

    requestAnimationFrame(() => cube.classList.remove('cube--hidden'));

    cube.addEventListener(
      'transitionend',
      () => {
        finished++;
        if (finished === count) document.body.classList.remove('no-scroll');
      },
      { once: true }
    );
  }
}

examplesEl.addEventListener('input', (e) => {
  if (e.target.tagName === 'INPUT') {
    currentInput = e.target;
    updateButtonState();
  }
});

button.addEventListener('click', () => {
  if (gameFinished) {
    resetGame();
    return;
  }

  if (!currentInput) return;

  const answer = Number(currentInput.value);
  const correct = config.multiplier * step;

  if (answer === correct) {
    currentInput.classList.add('answered');
    currentInput.disabled = true;

    setButtonState('right');
    button.disabled = true;

    setTimeout(() => {
      step++;
      createExample(step);
    }, config.nextDelay);
  } else {
    currentInput.classList.add('wrong-input');
    setButtonState('wrong');

    setTimeout(() => {
      currentInput.classList.remove('wrong-input');
      currentInput.focus();
      updateButtonState();
    }, config.wrongTimeout);
  }
});

function finishGame() {
  gameFinished = true;
  button.textContent = '✔';
  setButtonState('right');
  button.disabled = false;

  if (currentInput) currentInput.blur();
}

multiplierSelect.addEventListener('change', () => {
  config.multiplier = Number(multiplierSelect.value);
  resetGame();
});

createExample(step);
