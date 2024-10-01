export function formatPhoneNumber(value) {
  if (!value) return value;
  value = value.replace(/\D/g, ''); // Удаляем все нецифровые символы
  let formattedValue = '';
  if (value.length > 0) {
    formattedValue += '+7 ';
  }
  if (value.length > 1) {
    formattedValue += `(${value.substring(1, 4)}`;
  }
  if (value.length > 4) {
    formattedValue += `) ${value.substring(4, 7)}`;
  }
  if (value.length > 7) {
    formattedValue += `-${value.substring(7, 9)}`;
  }
  if (value.length > 9) {
    formattedValue += `-${value.substring(9, 11)}`;
  }
  return formattedValue;
}

export function handleInput(event, mask, formattedValue, emit) {
  let value = event.target.value.replace(/\D/g, ''); // Удаляем все нецифровые символы
  if (mask) {
    if (value.length > 11) {
      value = value.slice(0, 11); // Ограничиваем длину до 11 цифр
    }
    formattedValue.value = formatPhoneNumber(value);
    emit('input', value);
  } else {
    formattedValue.value = value;
    emit('input', value);
  }
}

export function handleKeydown(event, mask) {
  if (mask) {
    // Разрешаем только цифры и некоторые специальные клавиши
    if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      event.preventDefault();
    }
  }
}