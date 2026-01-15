let N = 4;
let step = 1;
const MAX_STEP = 10;

const examplesEl = document.getElementById('examples');
const button = document.getElementById('submitBtn');
const multiplierSelect = document.getElementById('multiplierSelect');

let currentInput = null;

multiplierSelect.addEventListener('change', () => {
  N = Number(multiplierSelect.value);
  resetGame();
});

createExample(step);

function resetGame() {
  step = 1;
  examplesEl.innerHTML = '';
  button.disabled = true;
  button.className = 'controls__button';
  button.textContent = 'Done';
  currentInput = null;

  createExample(step);
}

function createExample(step) {
  if (step > MAX_STEP) {
    finishGame();
    return;
  }

  const row = document.createElement('div');
  row.className = 'example-row';

  const left = document.createElement('div');
  left.className = 'example-left';
  left.innerHTML = `${N} × ${step} = `;

  const input = document.createElement('input');
  input.type = 'number';
  input.className = 'example__input';

  left.appendChild(input);
  row.appendChild(left);

  const right = document.createElement('div');
  right.className = 'example-right';
  row.appendChild(right);

  examplesEl.appendChild(row);
  currentInput = input;
  input.focus();

  button.disabled = true;
  button.className = 'controls__button';

  input.addEventListener('input', () => {
    if (input.value !== '') {
      button.disabled = false;
      button.classList.add('active');
    } else {
      button.disabled = true;
      button.classList.remove('active');
    }
  });

  animateCubes(right, N);
}

function animateCubes(container, count) {
  document.body.classList.add('no-scroll');

  let finished = 0;

  for (let i = 0; i < count; i++) {
    const cube = document.createElement('div');
    cube.className = 'cube';
    container.appendChild(cube);

    const rect = cube.getBoundingClientRect();
    const offsetY = window.innerHeight - rect.top;

    cube.style.transition = 'none';
    cube.style.transform = `translateY(${offsetY}px)`;
    cube.style.opacity = '0';

    requestAnimationFrame(() => {
      cube.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
      cube.style.transform = 'translateY(0)';
      cube.style.opacity = '1';
    });

    cube.addEventListener(
      'transitionend',
      () => {
        finished++;
        if (finished === count) {
          document.body.classList.remove('no-scroll');
        }
      },
      { once: true }
    );
  }
}

button.addEventListener('click', () => {
  if (!currentInput) return;

  const answer = Number(currentInput.value);
  const correct = N * step;

  button.className = 'controls__button';

  if (answer === correct) {
    button.classList.add('right');

    currentInput.classList.add('answered');
    currentInput.disabled = true;

    button.disabled = true;

    setTimeout(() => {
      step++;
      createExample(step);
    }, 400);
  }else {
    button.classList.add('wrong');
    currentInput.classList.add('wrong-input');

    setTimeout(() => {
      button.className = 'controls__button';
      currentInput.classList.remove('wrong-input');
      currentInput.focus();

      if (currentInput.value !== '') {
        button.disabled = false;
        button.classList.add('active');
      }
    }, 1000);
  }
});

function finishGame() {
  button.disabled = true;
  button.className = 'controls__button';
  button.textContent = '✔';

  if (currentInput) {
    currentInput.blur();
  }
}
